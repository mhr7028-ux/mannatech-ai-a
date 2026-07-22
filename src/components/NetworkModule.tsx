'use client';

import { Users, TrendingUp, Award, DollarSign, Network, UserPlus, ShieldCheck, UserCheck, ArrowUpRight, ChevronRight, X, Check, Calculator, Sparkles, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { calculateEstimatedBonus, MannatechMember } from '@/lib/mannatech/compensation';

interface NetworkModuleProps {
  userRole?: 'admin' | 'member';
}

export default function NetworkModule({ userRole = 'admin' }: NetworkModuleProps) {
  // Mode State: 'admin' (전체 관리자 모드) | 'partner' (개별 파트너 마이 모드)
  const [viewMode, setViewMode] = useState<'admin' | 'partner'>(userRole === 'admin' ? 'admin' : 'partner');

  useEffect(() => {
    setViewMode(userRole === 'admin' ? 'admin' : 'partner');
  }, [userRole]);

  // Modal State for New Partner Registration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Edit Partner Modal State
  const [editingPartner, setEditingPartner] = useState<MannatechMember | null>(null);

  // Delete Partner Confirmation Modal State
  const [deletingPartner, setDeletingPartner] = useState<MannatechMember | null>(null);

  // Network Members Data (Sponsor & Enroller Genealogy Tree)
  const [members, setMembers] = useState<MannatechMember[]>([
    {
      id: 'M101',
      name: '대표님 (나)',
      role: 'admin',
      rank: 'Silver Director',
      enrollerName: '본사 (직속)',
      sponsorName: '본사 (직속)',
      personalPV: 500,
      groupGV: 4800,
      downlinesCount: 5,
    },
    {
      id: 'M102',
      name: '장원술 파트너',
      role: 'partner',
      rank: 'Director',
      enrollerName: '대표님',
      sponsorName: '대표님',
      personalPV: 350,
      groupGV: 2200,
      downlinesCount: 3,
    },
    {
      id: 'M103',
      name: '김성실 파트너',
      role: 'partner',
      rank: 'Manager',
      enrollerName: '대표님',
      sponsorName: '대표님',
      personalPV: 200,
      groupGV: 1100,
      downlinesCount: 2,
    },
    {
      id: 'M104',
      name: '박영희 파트너',
      role: 'partner',
      rank: 'Associate',
      enrollerName: '장원술 파트너',
      sponsorName: '장원술 파트너',
      personalPV: 150,
      groupGV: 450,
      downlinesCount: 0,
    },
    {
      id: 'M105',
      name: '이철수 파트너',
      role: 'partner',
      rank: 'Associate',
      enrollerName: '김성실 파트너',
      sponsorName: '김성실 파트너',
      personalPV: 100,
      groupGV: 250,
      downlinesCount: 0,
    },
  ]);

  // Form State for Adding/Editing Downline
  const [partnerFormData, setPartnerFormData] = useState({
    name: '',
    rank: 'Associate' as any,
    enrollerName: '대표님',
    sponsorName: '장원술 파트너',
    personalPV: 200,
    groupGV: 200,
  });

  // Calculate Bonus for Current Active Perspective
  const currentMember = viewMode === 'admin' ? members[0] : (members[1] || members[0]);
  const bonus = calculateEstimatedBonus(currentMember.personalPV, currentMember.groupGV, currentMember.rank);

  // Handle Adding New Downline
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormData.name.trim()) return;

    const newMem: MannatechMember = {
      id: `M${Date.now().toString().slice(-3)}`,
      name: partnerFormData.name,
      role: 'partner',
      rank: partnerFormData.rank,
      enrollerName: partnerFormData.enrollerName,
      sponsorName: partnerFormData.sponsorName,
      personalPV: Number(partnerFormData.personalPV),
      groupGV: Number(partnerFormData.groupGV || partnerFormData.personalPV),
      downlinesCount: 0,
    };

    setMembers((prev) => [...prev, newMem]);
    setIsModalOpen(false);
    setPartnerFormData({ name: '', rank: 'Associate', enrollerName: '대표님', sponsorName: '장원술 파트너', personalPV: 200, groupGV: 200 });
  };

  // Open Edit Modal
  const handleOpenEdit = (partner: MannatechMember) => {
    setEditingPartner(partner);
    setPartnerFormData({
      name: partner.name,
      rank: partner.rank,
      enrollerName: partner.enrollerName || '',
      sponsorName: partner.sponsorName || '',
      personalPV: partner.personalPV,
      groupGV: partner.groupGV,
    });
  };

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingPartner.id
          ? {
              ...m,
              name: partnerFormData.name,
              rank: partnerFormData.rank,
              enrollerName: partnerFormData.enrollerName,
              sponsorName: partnerFormData.sponsorName,
              personalPV: Number(partnerFormData.personalPV),
              groupGV: Number(partnerFormData.groupGV),
            }
          : m
      )
    );

    setEditingPartner(null);
  };

  // Handle Delete Partner
  const handleConfirmDelete = () => {
    if (!deletingPartner) return;
    setMembers((prev) => prev.filter((m) => m.id !== deletingPartner.id));
    setDeletingPartner(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8 relative">
      {/* Top Bar: Title & Mode Switcher (Admin vs Partner) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-sky-500 text-white font-bold text-[10px] rounded-full">
              메나테크 보상플랜 연동
            </span>
            <h2 className="text-2xl font-bold text-gray-900">네트워크 조직도 & PV 수당 관리</h2>
          </div>
          <p className="text-sm text-gray-500">
            추천인/후원인 계보 트리, 파트너 정보 수정/삭제, PV 점수, 이번 달 예상 수당을 정산합니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs flex gap-1">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck size={14} />
              전체 조직도 뷰 (Admin)
            </button>
            <button
              onClick={() => setViewMode('partner')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'partner'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserCheck size={14} />
              마이 비즈니스 뷰 (Member)
            </button>
          </div>

          <button
            onClick={() => {
              setPartnerFormData({ name: '', rank: 'Associate', enrollerName: '대표님', sponsorName: '장원술 파트너', personalPV: 200, groupGV: 200 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all text-sm cursor-pointer"
          >
            <UserPlus size={18} />
            신규 파트너 등록
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">현재 직급</span>
            <Award className="text-amber-500" size={20} />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{currentMember.rank}</p>
          <p className="text-xs text-sky-600 font-semibold mt-1 flex items-center gap-1">
            <ChevronRight size={12} /> 다음 목표: {bonus.nextRank}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">개인 구매 (PV)</span>
            <TrendingUp className="text-sky-500" size={20} />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{currentMember.personalPV.toLocaleString()} PV</p>
          <p className="text-xs text-gray-400 mt-1">자격 유지 (100 PV) 달성 완료</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">그룹 실적 (GV)</span>
            <Users className="text-indigo-500" size={20} />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{currentMember.groupGV.toLocaleString()} GV</p>
          <p className="text-xs text-indigo-600 font-semibold mt-1">하부 조직 {currentMember.downlinesCount}명 포함</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md">
          <div className="flex justify-between items-center text-emerald-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">이번 달 예상 수당 (원)</span>
            <DollarSign className="text-emerald-200" size={20} />
          </div>
          <p className="text-2xl font-black">{bonus.totalEarnings.toLocaleString()} 원</p>
          <p className="text-xs text-emerald-100 mt-1">추천 {bonus.directBonus.toLocaleString()}원 + 팀 {bonus.teamBonus.toLocaleString()}원</p>
        </div>
      </div>

      {/* Rank Progression Roadmap Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-500" size={18} />
            <h3 className="text-base font-bold text-gray-900">
              {currentMember.name} 님 직급 달성 로드맵 (다음 직급: {bonus.nextRank})
            </h3>
          </div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            달성률 {bonus.progressPercent}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${bonus.progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-right">
          💡 다음 직급까지 <span className="font-bold text-gray-800">{bonus.neededPVForNextRank.toLocaleString()} GV</span> 추가 실적 필요
        </p>
      </div>

      {/* Downline Genealogy Tree List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {viewMode === 'admin' ? '전체 네트워크 레그 조직도' : '내 다운라인 추천/후원 조직도'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">파트너별 개인 PV, 그룹 GV, 직급 수정 및 삭제 관리</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="p-3.5 rounded-l-xl">파트너 ID / 성함</th>
                <th className="p-3.5">직급 (Rank)</th>
                <th className="p-3.5">추천인</th>
                <th className="p-3.5">후원인</th>
                <th className="p-3.5">개인 PV</th>
                <th className="p-3.5">그룹 GV</th>
                <th className="p-3.5">하부 인원</th>
                <th className="p-3.5 rounded-r-xl text-center">관리 (수정/삭제)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-sky-50/30 transition-colors">
                  <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {m.name[0]}
                    </div>
                    <div>
                      <span>{m.name}</span>
                      <span className="block text-[10px] text-gray-400 font-mono">{m.id}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px]">
                      {m.rank}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600">{m.enrollerName || '-'}</td>
                  <td className="p-3.5 text-gray-600">{m.sponsorName || '-'}</td>
                  <td className="p-3.5 font-bold text-sky-600">{m.personalPV.toLocaleString()} PV</td>
                  <td className="p-3.5 font-bold text-indigo-600">{m.groupGV.toLocaleString()} GV</td>
                  <td className="p-3.5 font-semibold text-gray-700">{m.downlinesCount}명</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="파트너 수정"
                      >
                        <Edit2 size={15} />
                      </button>
                      {m.role !== 'admin' && (
                        <button
                          onClick={() => setDeletingPartner(m)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="파트너 삭제"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">신규 파트너 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">파트너 성함 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 최신중"
                  value={partnerFormData.name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">직급 (Rank)</label>
                <select
                  value={partnerFormData.rank}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, rank: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="Associate">Associate</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Silver Director">Silver Director</option>
                  <option value="Executive Director">Executive Director (ED)</option>
                  <option value="Presidential Director">Presidential Director (PD)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">추천인 (Enroller)</label>
                <input
                  type="text"
                  value={partnerFormData.enrollerName}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, enrollerName: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">후원인 (Sponsor Leg)</label>
                <input
                  type="text"
                  value={partnerFormData.sponsorName}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, sponsorName: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">개인 PV</label>
                <input
                  type="number"
                  value={partnerFormData.personalPV}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, personalPV: Number(e.target.value) })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check size={16} />
                  파트너 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Edit2 className="text-sky-500" size={20} />
                <h3 className="text-lg font-bold text-gray-900">{editingPartner.name} 파트너 정보 수정</h3>
              </div>
              <button onClick={() => setEditingPartner(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">파트너 성함 *</label>
                <input
                  type="text"
                  required
                  value={partnerFormData.name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">직급 (Rank)</label>
                <select
                  value={partnerFormData.rank}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, rank: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="Associate">Associate</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Silver Director">Silver Director</option>
                  <option value="Executive Director">Executive Director (ED)</option>
                  <option value="Presidential Director">Presidential Director (PD)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">개인 PV</label>
                  <input
                    type="number"
                    value={partnerFormData.personalPV}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, personalPV: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">그룹 GV</label>
                  <input
                    type="number"
                    value={partnerFormData.groupGV}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, groupGV: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check size={16} />
                  수정사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Partner Confirmation Modal */}
      {deletingPartner && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">파트너 삭제</h3>
            <p className="text-xs text-gray-500 mb-6">
              <span className="font-bold text-gray-800">{deletingPartner.name}</span> 파트너를 조직도 및 수당 대상에서 삭제하시겠습니까?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingPartner(null)}
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
    </div>
  );
}
