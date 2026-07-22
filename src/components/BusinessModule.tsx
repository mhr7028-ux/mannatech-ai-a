'use client';

import { Sparkles, MessageSquare, Newspaper, Copy, Check, RefreshCw, Send, BookOpenText } from 'lucide-react';
import { useState } from 'react';

export default function BusinessModule() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('장원술');
  const [generatedKakao, setGeneratedKakao] = useState<string>(
    `안녕하세요 장원술 선생님! 좋은 아침입니다. 😊\n\n최근 양자검사 결과에서 간 해독 지수가 조금 낮게 나오셔서 마음이 쓰이네요.\n\n날씨도 더워지는데 피로감이 더 심해지진 않으셨는지요? 맑은 안색과 체력 회복을 위해 추천해 드렸던 '메나테크 트루퓨어'와 '엠브로토스' 챙겨 드시는 거 잊지 마셔요!\n\n궁금하신 점은 언제든 편하게 물어보세요. 오늘도 건강하고 복된 하루 보내세요! 🙏`
  );
  const [isGeneratingKakao, setIsGeneratingKakao] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Blog / Seminar State
  const [topic, setTopic] = useState<string>('글리코 영양소와 세포 면역의 비밀');
  const [generatedArticle, setGeneratedArticle] = useState<string>(
    `[블로그/세미나 5분 원고]\n제목: 현대인의 만성 피로, 왜 영양제를 먹어도 안 나을까?\n\n많은 분들이 비타민을 열심히 챙겨 먹어도 피로가 안 풀린다고 호소합니다. 그 이유는 '세포의 문'이 닫혀있어 영양소가 흡수되지 못하기 때문입니다.\n\n메나테크의 8가지 글리코영양소(글리칸)는 세포 표면의 사슬을 복원하여 영양소 흡수와 면역 신호 전달을 돕는 필수 원천입니다...`
  );
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);

  // Generate KakaoTalk Script
  const handleGenerateKakao = () => {
    setIsGeneratingKakao(true);
    setTimeout(() => {
      setIsGeneratingKakao(false);
      setGeneratedKakao(
        `안녕하세요 ${selectedCustomer} 선생님! 기쁜 아침입니다. ☀️\n\n지난번 양자 파동 검사에서 확인되었던 간 해독 수치와 활성산소 케어를 위해 보내드렸던 메나테크 솔루션 리포트 잘 확인해보셨나요?\n\n${selectedCustomer} 선생님의 활력 넘치고 맑은 피부 톤을 위해 꼭 필요한 영양 라인업이니, 꼼꼼히 챙겨 드시면 큰 도움이 되실 겁니다.\n\n오늘도 기쁨 가득한 하루 되세요! 🌿`
      );
    }, 800);
  };

  // Copy Kakao Text to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKakao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Blog / Seminar Article
  const handleGenerateArticle = () => {
    setIsGeneratingArticle(true);
    setTimeout(() => {
      setIsGeneratingArticle(false);
      setGeneratedArticle(
        `[${topic} - AI 맞춤 원고]\n\n1. 도입: 현대 사회의 면역 결핍과 세포 수준의 영양 문제\n2. 본론: 8가지 글리코 영양소가 세포 면역막에 미치는 핵심 역할 (하퍼 생화학 기준)\n3. 결론: 메나테크 엠브로토스 라이프를 통한 라이프스타일 혁신\n\n"건강은 선택이 아니라 습관입니다. 세포가 웃어야 온몸이 살아납니다."`
      );
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI 사업 & 마케팅 비서</h2>
        <p className="text-sm text-gray-500 mt-1">
          고객의 양자 수치를 기반으로 맞춤 안부 카카오톡 문구를 자동 생성하고, 건강 세미나/블로그 원고를 3초 만에 작성합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: KakaoTalk Script Generator */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-amber-500" size={20} />
                <h3 className="font-bold text-gray-900 text-base">고객 맞춤 카카오톡 안부 문구 생성기</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                1:1 맞춤 코칭
              </span>
            </div>

            {/* Customer Select */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">대상 고객 선택</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800"
              >
                <option value="장원술">장원술 고객님 (양자검사: 간 해독 경고)</option>
                <option value="김성실">김성실 고객님 (양자검사: 당뇨/체중 관리)</option>
                <option value="박영희">박영희 고객님 (양자검사: 만성 피로)</option>
              </select>
            </div>

            {/* Output Box */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">AI가 생성한 카톡 문구</label>
              <textarea
                rows={8}
                value={generatedKakao}
                onChange={(e) => setGeneratedKakao(e.target.value)}
                className="w-full p-4 bg-amber-50/30 border border-amber-200 rounded-2xl text-xs text-gray-800 leading-relaxed font-medium focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerateKakao}
              disabled={isGeneratingKakao}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {isGeneratingKakao ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-amber-500" />}
              문구 새로 생성
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '클립보드 복사됨!' : '카톡 문구 복사하기'}
            </button>
          </div>
        </div>

        {/* Right Column: Blog & Seminar Script Generator */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpenText className="text-sky-500" size={20} />
                <h3 className="font-bold text-gray-900 text-base">건강 세미나 / 블로그 원고 집필기</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-sky-50 text-sky-700 rounded-full border border-sky-200">
                콘텐츠 생성
              </span>
            </div>

            {/* Topic Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">주제 / 키워드</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 글리코영양소와 세포 면역, 간 해독과 피로 극복..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
              />
            </div>

            {/* Article Output */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">AI 자동 작성 원고</label>
              <textarea
                rows={8}
                value={generatedArticle}
                onChange={(e) => setGeneratedArticle(e.target.value)}
                className="w-full p-4 bg-sky-50/30 border border-sky-200 rounded-2xl text-xs text-gray-800 leading-relaxed font-medium focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateArticle}
            disabled={isGeneratingArticle}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {isGeneratingArticle ? <RefreshCw className="animate-spin" size={16} /> : <Newspaper size={16} />}
            AI 원고 3초 만에 생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
