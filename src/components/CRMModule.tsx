'use client';

import { UserPlus, Search, Phone, Calendar, Heart, X, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCustomers, addCustomer, CustomerData } from '@/lib/db/customers';

export default function CRMModule() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State for New Customer Registration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Inputs
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

  // Handle Form Submit
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

  // Filtered List
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
          <h2 className="text-2xl font-bold text-gray-900">고객 관리 (CRM)</h2>
          <p className="text-sm text-gray-500 mt-1">
            고객의 정보, 건강 목표 및 상담 상태를 한곳에서 관리합니다. (클라우드 DB 연동)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all text-sm"
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
          <p className="text-xs font-semibold">클라우드 DB에서 고객 목록을 불러오는 중...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-500 my-auto">
          <p className="text-base font-bold text-gray-800 mb-1">검색 결과가 없거나 등록된 고객이 없습니다.</p>
          <p className="text-xs text-gray-400 mb-4">우측 상단의 [신규 고객 등록] 버튼을 눌러 첫 고객을 등록해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{c.name} 고객님</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-sky-50 text-sky-600 font-semibold text-xs rounded-full border border-sky-100">
                      {c.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">ID: {c.id?.slice(0, 6)}</span>
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
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 text-[11px] leading-relaxed border border-gray-100">
                      💡 {c.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-colors">
                  상담 기록 작성
                </button>
                <button className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl transition-colors">
                  AI 분석 리포트
                </button>
              </div>
            </div>
          ))}
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
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
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
                  <option value="집중 케어 회원">집중 케어 회원</option>
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
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  고객 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
