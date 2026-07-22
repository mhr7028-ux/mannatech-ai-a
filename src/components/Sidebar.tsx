'use client';

import { BrainCircuit, User, Activity, Stethoscope, Sparkles, BookOpen, Briefcase, CalendarDays, Network, Mic, LogIn, LogOut, ShieldCheck, UserCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  userRole?: 'admin' | 'member';
  setUserRole?: (role: 'admin' | 'member') => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  userRole = 'admin',
  setUserRole,
}: SidebarProps) {
  const { data: session } = useSession();
  const [internalRole, setInternalRole] = useState<'admin' | 'member'>('admin');

  const currentRole = userRole || (session?.user as any)?.role || internalRole;

  const handleToggleRole = () => {
    const nextRole = currentRole === 'admin' ? 'member' : 'admin';
    setInternalRole(nextRole);
    if (setUserRole) setUserRole(nextRole);
  };

  const navItems = [
    { id: 'chat', label: 'AI 건강 코치 & 비서', icon: BrainCircuit, adminOnly: false },
    { id: 'crm', label: '고객 관리 (CRM)', icon: User, adminOnly: false },
    { id: 'health', label: '건강 기록', icon: Activity, adminOnly: false },
    { id: 'quantum', label: '양자 검사 분석', icon: Stethoscope, adminOnly: false },
    { id: 'physiognomy', label: '관상 아이스브레이킹', icon: Sparkles, adminOnly: false },
    { id: 'knowledge', label: '지식 관리 창고', icon: BookOpen, adminOnly: false },
    { id: 'business', label: 'AI 마케팅 & 사업 비서', icon: Briefcase, adminOnly: false },
    { id: 'schedule', label: '스마트 일정 관리', icon: CalendarDays, adminOnly: false },
    { id: 'network', label: '조직도 & PV 수당 관리', icon: Network, adminOnly: false },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      {/* App Branding */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            H
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight text-lg">HBOS</h1>
            <p className="text-xs text-gray-500 font-medium">MannaTech AI System</p>
          </div>
        </div>

        {/* Role Badge */}
        <span
          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
            currentRole === 'admin'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-sky-100 text-sky-800 border border-sky-200'
          }`}
        >
          {currentRole === 'admin' ? <ShieldCheck size={11} /> : <UserCheck size={11} />}
          {currentRole === 'admin' ? '최고 관리자' : '파트너 회원'}
        </span>
      </div>

      {/* Role Switching Quick Bar (Dev & Testing Toggle) */}
      <div className="px-4 py-2 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-500">모드 스위처</span>
        <button
          onClick={handleToggleRole}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-2xs transition-all cursor-pointer"
        >
          {currentRole === 'admin' ? (
            <>
              <ToggleRight size={16} className="text-amber-500" />
              <span>👑 관리자 뷰</span>
            </>
          ) : (
            <>
              <ToggleLeft size={16} className="text-sky-500" />
              <span>👤 파트너 뷰</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-[11px] font-bold text-gray-400 mb-3 px-2 uppercase tracking-wider">
          주요 모듈
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-50 text-sky-600 font-semibold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-sky-600' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'network' && currentRole === 'admin' && (
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                    전체
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Model Selection Box */}
        <div className="mt-6 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
            🧠 AI 두뇌 선택
          </p>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 bg-white shadow-xs focus:outline-none focus:border-sky-500"
          >
            <option value="gpt-4o">OpenAI (GPT-4o)</option>
            <option value="gemini-1.5-pro">Google (Gemini 1.5 Pro)</option>
            <option value="claude-3-5-sonnet">Anthropic (Claude 3.5)</option>
            <option value="ollama-qwen2.5:0.5b">Ollama (🟢 초고속 Qwen 2.5)</option>
            <option value="ollama-qwen3.6">Ollama (무료 Qwen 3.6)</option>
            <option value="ollama-gemma4:12b">Ollama (무료 Gemma4 12B)</option>
            <option value="ollama-llama3">Ollama (무료 Llama 3)</option>
          </select>
          <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
            💡 토큰 절약을 위해 집에서는 <span className="font-semibold text-gray-600">Ollama</span>를 사용하세요.
          </p>
        </div>
      </div>

      {/* Sidebar Bottom Footer: Integrated STT Badge + Google Login Profile */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {/* STT Status Badge */}
        <div className="w-full py-2 px-3 bg-sky-50/80 border border-sky-100 rounded-xl flex items-center justify-center gap-2 text-sky-700 font-semibold text-[11px]">
          <Mic size={14} className="text-sky-500 animate-pulse shrink-0" />
          <span>실시간 무중단 음성(STT) 연동</span>
        </div>

        {/* Google Authentication & Profile Box */}
        {session?.user ? (
          <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 truncate">
              {session.user.image ? (
                <img src={session.user.image} alt="User" className="w-7 h-7 rounded-full border border-sky-300 shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {session.user.name?.[0] || '구글'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-gray-800 truncate">{session.user.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="로그아웃"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <LogIn size={15} />
            <span>Google 계정으로 로그인</span>
          </button>
        )}
      </div>
    </aside>
  );
}
