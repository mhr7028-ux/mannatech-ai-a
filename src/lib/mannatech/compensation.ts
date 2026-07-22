export interface MannatechMember {
  id: string;
  name: string;
  role: 'admin' | 'partner';
  rank: 'Associate' | 'Manager' | 'Director' | 'Silver Director' | 'Executive Director' | 'Presidential Director';
  enrollerId?: string; // 추천인 ID
  enrollerName?: string; // 추천인 성함
  sponsorId?: string;  // 후원인 ID
  sponsorName?: string;  // 후원인 성함
  personalPV: number;   // 이번 달 개인 구매 PV
  groupGV: number;      // 이번 달 그룹 전제 GV
  downlinesCount: number; // 하부 파트너 수
}

// Mannatech Rank Requirements (GV thresholds)
export const RANK_REQUIREMENTS = {
  Associate: 100,
  Manager: 500,
  Director: 1500,
  'Silver Director': 2500,
  'Executive Director': 6000,
  'Presidential Director': 20000,
};

/**
 * Estimate Monthly Earnings (월급/수당 자동 환산 계산기)
 * Based on Mannatech Compensation Plan:
 * 1. Direct Bonus (직접 추천 수당): 10% of Personal PV
 * 2. Power Team & Team Development Bonus: Based on Group GV (1 PV ≈ 1,400 KRW exchange rate)
 */
export function calculateEstimatedBonus(personalPV: number, groupGV: number, rank: string): {
  totalEarnings: number;
  directBonus: number;
  teamBonus: number;
  nextRank: string;
  neededPVForNextRank: number;
  progressPercent: number;
} {
  // 1 PV = 1,400 KRW (환율 예시 기준)
  const PV_EXCHANGE_RATE = 1400;

  // Direct Bonus (10%)
  const directBonus = Math.floor(personalPV * 0.1 * PV_EXCHANGE_RATE);

  // Team Volume Bonus (Progressive tier based on GV)
  const teamBonusRate = groupGV >= 6000 ? 0.15 : groupGV >= 2500 ? 0.12 : groupGV >= 1500 ? 0.08 : 0.05;
  const teamBonus = Math.floor(groupGV * teamBonusRate * PV_EXCHANGE_RATE);

  const totalEarnings = directBonus + teamBonus;

  // Next rank calculation
  let nextRank = 'Executive Director';
  let targetGV = 6000;

  if (groupGV < 1500) {
    nextRank = 'Director';
    targetGV = 1500;
  } else if (groupGV < 2500) {
    nextRank = 'Silver Director';
    targetGV = 2500;
  } else if (groupGV < 6000) {
    nextRank = 'Executive Director (ED)';
    targetGV = 6000;
  } else {
    nextRank = 'Presidential Director (PD)';
    targetGV = 20000;
  }

  const neededPVForNextRank = Math.max(0, targetGV - groupGV);
  const progressPercent = Math.min(100, Math.floor((groupGV / targetGV) * 100));

  return {
    totalEarnings,
    directBonus,
    teamBonus,
    nextRank,
    neededPVForNextRank,
    progressPercent,
  };
}
