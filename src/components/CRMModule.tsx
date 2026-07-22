'use client';

import { UserPlus, Search, Phone, Calendar, Heart, X, Check, Loader2, ShieldCheck, UserCheck, MessageSquare, Clock, PlusCircle, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, CustomerData } from '@/lib/db/customers';

interface CRMModuleProps {
  userRole?: 'admin' | 'member';
}

export default function CRMModule({ userRole = 'admin' }: CRMModuleProps) {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State for New Customer Registration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);

  // Delete Customer Confirmation Modal State
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerData | null>(null);

  // Consultation Note Modal State
  const [activeConsultationCust, setActiveConsultationCust] = useState<CustomerData | null>(null);
  const [newConsultationText, setNewConsultationText] = useState<string>('');

  // Form Inputs (Add/Edit)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    goal: '',
    status: '신규 고객',
    notes: '',
  });

  // Load Customers on Mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Handle Form Submit (Add New)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const newCust = await addCustomer({
      name: formData.name,
      phone: formData.phone || '010-0000-0000',
      goal: formData.goal || '건강 증진 및 면역 케어',
      status: formData.status,
      notes: formData.notes,
    });

    setCustomers((prev) => [newCust, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', goal: '', status: '신규 고객', notes: '' });
  };

  // Open Edit Modal
  const handleOpenEdit = (customer: CustomerData) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      goal: customer.goal,
      status: customer.status,
      notes: customer.notes || '',
    });
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.id) return;

    setIsSubmitting(true);
    await updateCustomer(editingCustomer.id, {
      name: formData.name,
      phone: formData.phone,
      goal: formData.goal,
      status: formData.status,
      notes: formData.notes,
    });

    setCustomers((prev) =>
      prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...formData } : c))
    );

    setIsSubmitting(false);
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', goal: '', status: '신규 고객', notes: '' });
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCustomer || !deletingCustomer.id) return;

    await deleteCustomer(deletingCustomer.id);
    setCustomers((prev) => prev.filter((c) => c.id !== deletingCustomer.id));
    setDeletingCustomer(null);
  };

  // Add Consultation Note Handler
  const handleSaveConsultation = () => {
    if (!activeConsultationCust || !newConsultationText.trim()) return;
    const updatedNotes = (activeConsultationCust.notes ? activeConsultationCust.notes + '\n\n' : '') +
      `[${new Date().toLocaleDateString()}] ${newConsultationText}`;

    if (activeConsultationCust.id) {
      updateCustomer(activeConsultationCust.id, { notes: updatedNotes });
    }

    setCustomers((prev) =>
      prev.map((c) => (c.id === activeConsultationCust.id ? { ...c, notes: updatedNotes } : c))
    );
    setActiveConsultationCust(null);
    setNewConsultationText('');
  };

  // Filtered List based on Search
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.includes(searchTerm) ||
      c.phone.includes(searchTerm) ||
      c.goal.includes(searchTerm)
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8 relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">고객 관리 (CRM)</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                userRole === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-sky-100 text-sky-800 border border-sky-200'
              }`}
            >
              {userRole === 'admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
              {userRole === 'admin' ? '전체 고객 통합 뷰 (최고 관리자)' : '담당 고객 마이 뷰 (파트너)'}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            고객 정보 수정, 삭제, 건강 목표, 글리코영양소 추천 이력 및 상담 상태를 관리합니다.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', phone: '', goal: '', status: '신규 고객', notes: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all text-sm cursor-pointer"
        >
          <UserPlus size={18} />
          신규 고객 등록
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="고객 이름, 연락처, 건강 목표로 실시간 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Customer List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 className="animate-spin text-sky-500" size={32} />
          <p className="text-xs font-semibold">클라우드 DB에서 고객 데이터베이스를 불러오는 중...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500 my-auto">
          <p className="text-base font-bold text-gray-800 mb-1">검색 결과가 없거나 등록된 고객이 없습니다.</p>
          <p className="text-xs text-gray-400 mb-4">우측 상단의 [신규 고객 등록] 버튼을 눌러 첫 고객을 등록해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((c) => {
            const isVIP = c.status?.includes('VIP') || c.status?.includes('집중');
            const isReorder = c.status?.includes('재구매');
            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{c.name} 고객님</h3>
                      </div>
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 font-semibold text-xs rounded-full border ${
                          isVIP
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : isReorder
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-sky-50 text-sky-600 border-sky-100'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="고객 정보 수정"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingCustomer(c)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="고객 삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={14} className="text-red-400" />
                      <span className="font-semibold text-gray-800">목표: {c.goal}</span>
                    </div>
                    {c.notes && (
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-700 text-[11px] leading-relaxed border border-gray-100 whitespace-pre-wrap">
                        💡 {c.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => setActiveConsultationCust(c)}
                    className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>상담 기록 작성</span>
                  </button>
                  <button
                    onClick={() => alert(`${c.name} 고객님의 양자 리포트 및 건강 차트 보기`)}
                    className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    AI 분석 리포트
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Customer Registration Modal (Popup) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">신규 고객 등록</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">고객 성함 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">주요 건강 목표 / 고민</label>
                <input
                  type="text"
                  placeholder="예: 만성 피로 개선, 혈당 관리, 체중 감량"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상담 상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="신규 고객">신규 고객</option>
                  <option value="상담 진행 중">상담 진행 중</option>
                  <option value="재구매 예정">재구매 예정</option>
                  <option value="집중 케어 회원">집중 케어 회원 (VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">특이사항 / 메나테크 정보</label>
                <textarea
                  rows={3}
                  placeholder="예: 앰브로토스 복용 경험 있음, 혈압약 복용 중 등"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  고객 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Edit2 className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-gray-900">{editingCustomer.name} 고객 정보 수정</h3>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">고객 성함 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">주요 건강 목표 / 고민</label>
                <input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상담 상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="신규 고객">신규 고객</option>
                  <option value="상담 진행 중">상담 진행 중</option>
                  <option value="상담 완료">상담 완료</option>
                  <option value="재구매 예정">재구매 예정</option>
                  <option value="집중 케어 회원">집중 케어 회원 (VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">특이사항 / 메모</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  수정사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">고객 정보 삭제</h3>
            <p className="text-xs text-gray-500 mb-6">
              <span className="font-bold text-gray-800">{deletingCustomer.name}</span> 고객님의 정보 및 상담 기록을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 size={14} />
                네, 삭제합니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Log Popup */}
      {activeConsultationCust && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{activeConsultationCust.name} 고객님 상담 기록</h3>
                <p className="text-xs text-gray-500">신규 상담 내용 또는 제품 반응을 기록해 두세요.</p>
              </div>
              <button
                onClick={() => setActiveConsultationCust(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">상담 메모 추가</label>
                <textarea
                  rows={4}
                  value={newConsultationText}
                  onChange={(e) => setNewConsultationText(e.target.value)}
                  placeholder="예: 엠브로토스 라이프 2주 차 복용 후 피로감 개선됨. 트루퓨어 디톡스 추천함."
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveConsultationCust(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveConsultation}
                  disabled={!newConsultationText.trim()}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  <PlusCircle size={15} />
                  기록 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
