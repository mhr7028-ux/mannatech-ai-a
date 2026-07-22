import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface CustomerData {
  id?: string;
  name: string;
  phone: string;
  goal: string;
  status: string;
  familyInfo?: string;
  address?: string;
  birthdate?: string;
  notes?: string;
  createdAt?: any;
}

// In-Memory Local Cache Fallback (for instant UI response and offline mode)
let localCustomersCache: CustomerData[] = [
  { id: '1', name: '김성실', phone: '010-1234-5678', goal: '당뇨 조절 및 체중 감량', status: '재구매 예정', notes: '글리코 영양소 섭취 중' },
  { id: '2', name: '박영희', phone: '010-9876-5432', goal: '만성 피로 및 면역력 강화', status: '상담 완료', notes: '앰브로토스 2달 차' },
  { id: '3', name: '이철수', phone: '010-5555-7777', goal: '관절 건강 및 수면 장애', status: '신규 고객', notes: '양자 검사 수치 주의' },
];

// Helper to create a timeout promise
const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));

/**
 * Add a new customer to Firestore (and local cache) with instant fallback
 */
export async function addCustomer(customer: Omit<CustomerData, 'id'>): Promise<CustomerData> {
  const newLocalCustomer = { id: String(Date.now()), ...customer };

  // Check if real Firebase keys are set up
  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-app';

  if (!isFirebaseConfigured) {
    // Instantly save to local memory if Firebase keys aren't added yet
    localCustomersCache.unshift(newLocalCustomer);
    return newLocalCustomer;
  }

  try {
    // Race Firestore addDoc against a 1.5s timeout to prevent hanging UI
    const docRef: any = await Promise.race([
      addDoc(collection(db, 'customers'), {
        ...customer,
        createdAt: serverTimestamp(),
      }),
      timeout(1500),
    ]);

    const firestoreCustomer = { id: docRef.id, ...customer };
    localCustomersCache.unshift(firestoreCustomer);
    return firestoreCustomer;
  } catch (error) {
    console.warn('Firestore write timed out or failed. Saved to local cache:', error);
    localCustomersCache.unshift(newLocalCustomer);
    return newLocalCustomer;
  }
}

/**
 * Get all customers from Firestore (or local cache)
 */
export async function getCustomers(): Promise<CustomerData[]> {
  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-app';

  if (!isFirebaseConfigured) {
    return localCustomersCache;
  }

  try {
    const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'));
    const querySnapshot: any = await Promise.race([
      getDocs(q),
      timeout(1500),
    ]);

    if (querySnapshot && !querySnapshot.empty) {
      const fetched: CustomerData[] = [];
      querySnapshot.forEach((doc: any) => {
        fetched.push({ id: doc.id, ...doc.data() } as CustomerData);
      });
      return fetched;
    }
  } catch (error) {
    console.warn('Firestore fetch fallback to local cache:', error);
  }
  return localCustomersCache;
}
