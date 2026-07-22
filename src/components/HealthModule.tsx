'use client';

import { Scale, HeartPulse, Moon, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function HealthModule() {
  const [water, setWater] = useState<string>('2.0');
  const [steps, setSteps] = useState<string>('8500');
  const [meals, setMeals] = useState<string>('점심: 샐러드, 저녁: 메나테크 앰브로토스 & 팩');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">건강 기록 모듈</h2>
        <p className="text-sm text-gray-500 mt-1">
          체중, 수면, 혈당, 영양제 복용 등 생체 데이터를 측정/기록하고 데이터베이스에 보관합니다.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Scale size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">신체 측정 (BMI / 체지방)</p>
              <h3 className="text-xl font-bold text-gray-900">
                68.5 kg <span className="text-xs text-green-500 font-normal">(-1.2kg 감소)</span>
              </h3>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full w-[65%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Moon size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">수면 품질</p>
              <h3 className="text-xl font-bold text-gray-900">
                7시간 20분 <span className="text-xs text-sky-500 font-normal">(숙면 상태)</span>
              </h3>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[80%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <HeartPulse size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400">혈압 / 공복 혈당</p>
              <h3 className="text-xl font-bold text-gray-900">118 / 78 mmHg</h3>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full w-[90%]" />
          </div>
        </div>
      </div>

      {/* Record Input Section */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">오늘의 건강 데이터 직접 입력</h3>
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-in fade-in">
              <Check size={14} /> 데이터베이스 저장 완료!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">수분 섭취량 (L)</label>
            <input
              type="number"
              step="0.1"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">걸음 수 (만보기)</label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">식단 & 영양제 메모</label>
            <input
              type="text"
              value={meals}
              onChange={(e) => setMeals(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
              클라우드 DB 저장하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
