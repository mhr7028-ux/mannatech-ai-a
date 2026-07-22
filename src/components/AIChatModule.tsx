'use client';

import { useChat } from '@ai-sdk/react';
import { Bot, User, Send, BrainCircuit, Mic, MicOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIChatModuleProps {
  selectedModel: string;
}

export default function AIChatModule({ selectedModel }: AIChatModuleProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = (useChat as any)({
    api: '/api/chat',
    body: {
      model: selectedModel,
    },
  });

  // Speech to Text (STT) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  // Handle Speech Recognition Toggle
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('사용 중이신 브라우저가 음성 인식을 지원하지 않거나 권한이 없습니다.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-sky-500" size={20} />
          <h2 className="font-bold text-gray-800 text-base">
            AI 건강 코치 & 상담 비서 ({selectedModel})
          </h2>
        </div>
      </header>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-12">
            <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
              <BrainCircuit size={32} className="text-sky-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">무엇을 도와드릴까요?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              하단의 <b>[🎙️ 마이크 버튼]</b>을 누르시고 말씀하시면 자동으로 텍스트로 전환되어 질문하실 수 있습니다.
            </p>
            <div className="w-full space-y-2">
              <button
                onClick={() =>
                  handleInputChange({
                    target: { value: '오늘 만나는 장원술 고객님 간 해독 지수 3.42 나온 거 맞춤 상담 포인트 정리해줘.' },
                  } as any)
                }
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-sky-300 hover:bg-sky-50/50 transition-all shadow-2xs"
              >
                💬 "장원술 고객님 간 해독 지수 3.42 나온 거 맞춤 상담 포인트 정리해줘."
              </button>
              <button
                onClick={() =>
                  handleInputChange({
                    target: { value: '양자검사에서 간 기능 저하가 나왔을 때 추천할 메나테크 제품은?' },
                  } as any)
                }
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-sky-300 hover:bg-sky-50/50 transition-all shadow-2xs"
              >
                🌿 "양자검사에서 간 기능 저하가 나왔을 때 추천할 메나테크 제품은?"
              </button>
            </div>
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={16} className="text-white" />
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-sky-500 text-white rounded-tr-none shadow-xs font-medium'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-tl-none shadow-xs flex items-center gap-2">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Form with Voice STT Button */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-2">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="마이크로 음성 말하기 (STT)"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <div className="relative flex-1">
            <input
              value={input || ''}
              onChange={(e) => handleInputChange(e)}
              placeholder={isListening ? '말씀하시는 내용을 듣고 있습니다...' : '건강 상담 비서에게 질문을 입력하거나 마이크로 말씀하세요...'}
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm shadow-xs transition-colors ${
                isListening ? 'border-red-400 bg-red-50/30' : 'border-gray-300 focus:border-sky-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !(input || '').trim()}
              className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-40 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
