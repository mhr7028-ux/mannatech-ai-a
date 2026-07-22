'use client';

import { Sparkles, Camera, MessageSquareHeart, ShieldCheck, Upload, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function PhysiognomyModule() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Handle Image File Selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysisResult(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Physiognomy Analysis Simulation
  const handleAnalyze = () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        impression: '이마가 넓고 눈빛이 맑으시며, 상대방에게 강한 신뢰와 따뜻함을 주는 복스러운 인상입니다. 귀인 운과 건강운이 매우 좋은 편입니다.',
        healthInsight: '안색(피부 톤)을 보았을 때 눈 밑과 뺨 주변에 약간의 피로 찰색이 엿보입니다. 간 해독 및 기력 회복, 항산화 케어가 필요한 시점입니다.',
        icebreakerScript: '"선생님! 관상을 보니 이마와 눈빛이 참 맑으시고 복이 많으신 인상입니다. 혹시 요즘 날씨 때문인지 살짝 피로감이 안색에 드러나시는데, 평소 수면이나 건강 관리는 어떻게 하고 계신가요?"',
        recommendedProducts: [
          { name: '메나테크 앰브로토스 라이프', reason: '세포 간 신호 전달 및 피부 톤/면역력 근본 케어' },
          { name: '메나테크 트루퓨어 (TruePure)', reason: '간 해독 및 맑은 안색 회복을 위한 듀얼 디톡스' },
        ],
      });
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">관상(Physiognomy) 아이스브레이킹 툴</h2>
        <p className="text-sm text-gray-500 mt-1">
          신규 고객의 얼굴 인상과 안색을 AI가 분석하여 따뜻한 덕담과 자연스러운 대화 유도 스크립트를 생성합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs flex flex-col items-center">
          <h3 className="text-base font-bold text-gray-900 mb-4 w-full text-left">
            📸 고객 얼굴 사진 업로드
          </h3>

          <div className="w-full aspect-square border-2 border-dashed border-purple-200 bg-purple-50/20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all">
            {imagePreview ? (
              <img src={imagePreview} alt="Customer Face" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Camera size={28} />
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">고객 사진을 선택하세요</p>
                <p className="text-xs text-gray-400">클릭하거나 사진 파일을 여기로 드래그</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <div className="mt-4 w-full flex gap-3">
            {imagePreview && (
              <button
                onClick={() => {
                  setImagePreview(null);
                  setAnalysisResult(null);
                }}
                className="py-2.5 px-4 border border-gray-200 text-gray-600 font-semibold text-xs rounded-xl hover:bg-gray-50 transition-colors"
              >
                사진 변경
              </button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={!imagePreview || isAnalyzing}
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> AI 관상 & 안색 분석 중...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> AI 관상 분석 시작하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Output */}
        <div className="lg:col-span-7 flex flex-col">
          {!analysisResult ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xs h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquareHeart size={32} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">분석 대기 중입니다</h4>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                좌측에 고객 사진을 업로드하고 [AI 관상 분석 시작하기]를 누르시면, 따뜻한 덕담과 첫 어프로치 대화 스크립트가 생성됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* 1. Impression Summary */}
              <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs">
                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
                  <Sparkles size={18} />
                  <span>1. 인상학적 관상 총평 (덕담)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                  {analysisResult.impression}
                </p>
              </div>

              {/* 2. Health Insight */}
              <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-2xs">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                  <ShieldCheck size={18} />
                  <span>2. 안색(혈색) 기반 건강 팁</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-medium bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                  {analysisResult.healthInsight}
                </p>
              </div>

              {/* 3. Icebreaker Conversation Script */}
              <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-2xs">
                <div className="flex items-center gap-2 text-sky-700 font-bold text-sm mb-2">
                  <MessageSquareHeart size={18} />
                  <span>3. 첫 어프로치 대화 스크립트 (아이스브레이킹)</span>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-bold bg-sky-50/60 p-4 rounded-xl border border-sky-100 text-sky-950">
                  {analysisResult.icebreakerScript}
                </p>
              </div>

              {/* 4. Recommended Products */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
                  <CheckCircle2 size={18} />
                  <span>4. 연계 추천 메나테크 솔루션</span>
                </div>
                <div className="space-y-2">
                  {analysisResult.recommendedProducts.map((p: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs">
                      <span className="font-bold text-emerald-950">{p.name}</span>
                      <span className="text-gray-600">{p.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
