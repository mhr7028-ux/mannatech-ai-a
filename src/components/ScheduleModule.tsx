'use client';

import { Calendar as CalendarIcon, Plus, Clock, User, PackageCheck, AlertCircle, X, Check, CalendarDays, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function ScheduleModule() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Schedules State
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      title: '장원술 고객님 1:1 건강 상담 & 양자 파동 리포트 브리핑',
      date: '2026-07-23',
      time: '14:00',
      type: 'consultation', // 'consultation' | 'reorder' | 'checkup'
      customer: '장원술',
      location: '서울 강남 센터 / 카페',
      notes: '간 해독 지수(3.42) 경고 수치 및 엠브로토스 라이프 섭취법 설명',
    },
    {
      id: '2',
      title: '김성실 고객님 엠브로토스 라이프 & 트루퓨어 재구매 알림',
      date: '2026-07-25',
      time: '10:30',
      type: 'reorder',
      customer: '김성실',
      location: '전화 / 카카오톡',
      notes: '2달 차 복용 완료 시점. 재구매 의사 확인 및 정기 배송 안내',
    },
    {
      id: '3',
      title: '박영희 고객님 종합 건강검진 결과 확인 연락',
      date: '2026-07-28',
      time: '11:00',
      type: 'checkup',
      customer: '박영희',
      location: '전화 상담',
      notes: '혈당 및 콜레스테롤 변화 수치 데이터 수집',
    },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '2026-07-24',
    time: '15:00',
    type: 'consultation',
    customer: '장원술',
    notes: '',
  });

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newSchedule = {
      id: String(Date.now()),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      customer: formData.customer,
      location: '고객 지정 장소 / 온라인',
      notes: formData.notes || '메나테크 비즈니스 케어 일정',
    };

    setSchedules((prev) => [newSchedule, ...prev]);
    setIsModalOpen(false);
    setFormData({ title: '', date: '2026-07-24', time: '15:00', type: 'consultation', customer: '장원술', notes: '' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8 relative">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">스마트 일정 관리 (Schedule)</h2>
          <p className="text-sm text-gray-500 mt-1">
            고객 상담 예약, 메나테크 제품 배송/재구매 알림, 건강검진 일정을 구글 캘린더와 통합 관리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('구글 캘린더(Google Calendar)와 동기화가 설정되었습니다!')}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs hover:bg-gray-50 text-sm transition-colors"
          >
            <RefreshCw size={16} className="text-sky-500" />
            Google 캘린더 동기화
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs text-sm transition-colors"
          >
            <Plus size={18} />
            새 일정 추가
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">이번 주 예정 상담</p>
            <h3 className="text-xl font-bold text-gray-900">4 건</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">재구매 알림 대기</p>
            <h3 className="text-xl font-bold text-gray-900">2 명 <span className="text-xs text-amber-600 font-normal">(이번 주 시급)</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">오늘의 첫 일정</p>
            <h3 className="text-base font-bold text-gray-900">14:00 장원술 고객님</h3>
          </div>
        </div>
      </div>

      {/* Schedule Agenda List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarIcon size={20} className="text-sky-500" />
          다오는 비즈니스 & 상담 일정표
        </h3>

        <div className="space-y-4">
          {schedules.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-sky-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-2xl text-center min-w-[70px] shrink-0">
                  <span className="block text-[10px] font-bold text-sky-600 uppercase">{s.date.split('-')[1]}월</span>
                  <span className="block text-xl font-extrabold text-gray-900">{s.date.split('-')[2]}일</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2.5 py-0.5 font-bold text-[10px] rounded-full border ${
                        s.type === 'consultation'
                          ? 'bg-sky-50 text-sky-600 border-sky-200'
                          : s.type === 'reorder'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {s.type === 'consultation' ? '1:1 건강 상담' : s.type === 'reorder' ? '제품 재구매 알림' : '건강검진 체크'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {s.time}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">{s.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">💡 {s.notes}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => alert(`${s.customer} 고객님에게 일정 확인 카톡이 발송되었습니다!`)}
                  className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl border border-sky-200 transition-colors"
                >
                  카톡 안내 발송
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">새 비즈니스/상담 일정 추가</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">일정 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 장원술 고객님 엠브로토스 재구매 안내"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">날짜</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">시간</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">일정 유형</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                >
                  <option value="consultation">1:1 건강 상담 / 양자 브리핑</option>
                  <option value="reorder">메나테크 제품 재구매 / 정기배송 알림</option>
                  <option value="checkup">건강검진 수치 체크</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">대상 고객</label>
                <input
                  type="text"
                  placeholder="예: 장원술, 김성실"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">메모 / 준비 사항</label>
                <textarea
                  rows={2}
                  placeholder="예: 간 해독 수치 변화 체크 리포트 준비..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Check size={16} />
                  일정 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
