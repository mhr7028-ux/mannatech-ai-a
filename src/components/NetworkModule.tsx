'use client';

import { Users, TrendingUp, Award, DollarSign, Network, UserPlus, ShieldCheck, ArrowUpRight, ChevronRight, X, Check } from 'lucide-react';
import { useState } from 'react';
import { calculateEstimatedBonus, MannatechMember } from '@/lib/mannatech/compensation';

export default function NetworkModule() {
  // Mode State: 'admin' (전체 관리자 모드) | 'partner' (개별 파트너 마이 모드)
  const [viewMode, setViewMode] = useState<'admin' | 'partner'>('partner');

  // Modal State for New Partner Registration
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  // Form State for Adding Downline
  const [newPartner, setNewPartner] = useState({
    name: '',
    rank: 'Associate' as any,
    enrollerName: '대표님',
    sponsorName: '장원술 파트너',
    personalPV: 200,
  });

  // Calculate Bonus for Current Active Perspective (e.g. Representative or Jang Won-sul)
  const currentMember = viewMode === 'admin' ? members[0] : members[1];
  const bonus = calculateEstimatedBonus(currentMember.personalPV, currentMember.groupGV, currentMember.rank);

  // Handle Adding New Downline
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name.trim()) return;

    const newMem: MannatechMember = {
      id: `M${Date.now().toString().slice(-3)}`,
      name: newPartner.name,
      role: 'partner',
      rank: newPartner.rank,
      enrollerName: newPartner.enrollerName,
      sponsorName: newPartner.sponsorName,
      personalPV: Number(newPartner.personalPV),
      groupGV: Number(newPartner.personalPV),
      downlinesCount: 0,
    };

    setMembers((prev) => [...prev, newMem]);
    setIsModalOpen(false);
    setNewPartner({ name: '', rank: 'Associate', enrollerName: '대표님', sponsorName: '장원술 파트너', personalPV: 200 });
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
            추천인/후원인 계보 트리, 파트너별 PV 점수, 이번 달 예상 수당(월급)을 실시간 정산합니다.
          </p>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-1 shrink-0">
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'admin'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            👑 관리자 전체 모드
          </button>
          <button
            onClick={() => setViewMode('partner')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              viewMode === 'partner'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            👤 장원술 파트너 마이 모드
          </button>
        </div>
      </div>

      {/* Monthly Bonus Earnings Dashboard Card */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 rounded-3xl p-8 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-sky-700/60 pb-6 gap-4">
          <div>
            <p className="text-xs text-sky-200 font-semibold mb-1">
              {currentMember.name}님의 2026년 7월 예상 정산 수당 (월급)
            </p>
            <h3 className="text-4xl font-extrabold text-amber-300">
              ₩ {bonus.totalEarnings.toLocaleString()} 원
            </h3>
          </div>
          <div className="flex gap-4 bg-sky-950/40 p-4 rounded-2xl border border-sky-700/40 text-xs">
            <div>
              <p className="text-sky-300">개인 구매 (PV)</p>
              <p className="text-lg font-bold text-white">{currentMember.personalPV} PV</p>
            </div>
            <div className="border-r border-sky-700/50" />
            <div>
              <p className="text-sky-300">그룹 산하 (GV)</p>
              <p className="text-lg font-bold text-emerald-400">{currentMember.groupGV} GV</p>
            </div>
            <div className="border-r border-sky-700/50" />
            <div>
              <p className="text-sky-300">현재 직급</p>
              <p className="text-lg font-bold text-amber-300">{currentMember.rank}</p>
            </div>
          </div>
        </div>

        {/* Rank Progression Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span>다음 목표 직급: <b className="text-amber-300">{bonus.nextRank}</b></span>
            <span>달성률: <b>{bonus.progressPercent}%</b> ({bonus.neededPVForNextRank} GV 추가 달성 시 승급)</span>
          </div>
          <div className="w-full bg-sky-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-sky-700/40">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${bonus.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Network Genealogy Tree View Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Network className="text-sky-500" size={22} />
            <h3 className="text-lg font-bold text-gray-900">추천인 & 후원인 네트워크 시각적 계보도 (Tree)</h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
          >
            <UserPlus size={16} />
            하부 파트너 등록
          </button>
        </div>

        {/* Tree Structure */}
        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col items-center">
          {/* Top Parent Node */}
          <div className="p-4 bg-sky-600 text-white rounded-2xl shadow-sm text-center min-w-[200px] border-2 border-sky-400">
            <span className="px-2 py-0.5 bg-amber-400 text-gray-900 font-extrabold text-[10px] rounded-full mb-1 inline-block">
              최상위 본인
            </span>
            <h4 className="font-bold text-base">{members[0].name}</h4>
            <p className="text-xs text-sky-100 mt-1 font-mono">개인 {members[0].personalPV} PV | 그룹 {members[0].groupGV} GV</p>
          </div>

          <div className="w-0.5 h-8 bg-sky-300" />

          {/* Level 1 Downlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            {members.slice(1, 3).map((m) => (
              <div key={m.id} className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl border border-sky-200 shadow-2xs text-center w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-gray-400 font-mono">추천인: {m.enrollerName}</span>
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-600 font-bold text-[10px] rounded-md">
                      {m.rank}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-gray-900">{m.name}</h5>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    PV: <b className="text-sky-600">{m.personalPV}</b> | GV: <b className="text-indigo-600">{m.groupGV}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Downline Member Score Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-sky-500" />
          하부 파트너 PV 점수 및 후원 관계 대장
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
                <th className="py-3 px-4">파트너 성함</th>
                <th className="py-3 px-4">직급</th>
                <th className="py-3 px-4">추천인 (Enroller)</th>
                <th className="py-3 px-4">후원인 (Sponsor)</th>
                <th className="py-3 px-4">개인 PV</th>
                <th className="py-3 px-4">그룹 GV</th>
                <th className="py-3 px-4 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{m.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-600 font-bold rounded-lg border border-sky-100">
                      {m.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">{m.enrollerName || '-'}</td>
                  <td className="py-3.5 px-4 text-gray-600">{m.sponsorName || '-'}</td>
                  <td className="py-3.5 px-4 font-bold text-sky-600">{m.personalPV} PV</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">{m.groupGV} GV</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      활동 중
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Downline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">신규 하부 파트너 등록</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">파트너 성함 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 최동수 파트너"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">추천인 (Enroller)</label>
                  <input
                    type="text"
                    value={newPartner.enrollerName}
                    onChange={(e) => setNewPartner({ ...newPartner, enrollerName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">후원인 (Sponsor)</label>
                  <input
                    type="text"
                    value={newPartner.sponsorName}
                    onChange={(e) => setNewPartner({ ...newPartner, sponsorName: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">초기 구매 PV 점수</label>
                <input
                  type="number"
                  value={newPartner.personalPV}
                  onChange={(e) => setNewPartner({ ...newPartner, personalPV: Number(e.target.value) })}
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
                  파트너 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
