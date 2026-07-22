'use client';

import { Bot, User, Send, BrainCircuit, Mic, MicOff, Image as ImageIcon, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AIChatModuleProps {
  selectedModel: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function AIChatModule({ selectedModel }: AIChatModuleProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Speech to Text (STT) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const accumulatedTextRef = useRef<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  // Handle Image File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Clipboard Paste (Ctrl + V for images)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setAttachedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  // Handle Form Submission
  const onCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = inputVal.trim();
    if ((!textToSend && !attachedImage) || isLoading) return;

    // Stop mic if listening when sending
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend || '(이미지 첨부 질문)',
      image: attachedImage || undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputVal('');
    const currentImg = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            image: m.image,
          })),
          model: selectedModel,
          image: currentImg,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('API Response Error');
      }

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: assistantText } : m))
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `⚠️ [${selectedModel}] AI 통신 중 일시적 지연이 발생했습니다.\n\n` +
          `💡 **도움말**:\n` +
          `1️⃣ **올라마 모델 선택 시**: 윈도우 올라마 앱 창에서 선택하신 모델이 활성화되어 있는지 확인해 주세요.\n` +
          `2️⃣ **이미지 분석 시**: 클라우드 모델(GPT-4o 또는 Gemini 1.5 Pro)을 선택하시면 이미지 인식 능력이 매우 뛰어납니다!`,
      };
      setMessages((prev) => [...prev.filter((m) => m.content.trim() !== ''), errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Robust Speech Recognition Toggle (uninterrupted continuous STT)
  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert('사용 중이신 브라우저가 음성 인식을 지원하지 않거나 마이크 권한이 차단되어 있습니다.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;
    accumulatedTextRef.current = inputVal;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentSessionText = '';
      for (let i = 0; i < event.results.length; i++) {
        currentSessionText += event.results[i][0].transcript;
      }
      const fullText = (accumulatedTextRef.current ? accumulatedTextRef.current + ' ' : '') + currentSessionText;
      setInputVal(fullText);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        alert('마이크 사용 권한을 브라우저 주소창 왼쪽에서 허용(Allow)해 주세요!');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto restart if user still wants to listen
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
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
              하단의 <b>[🎙️ 마이크 버튼]</b>을 눌러 음성으로 말하시거나, <b>[🖼️ 이미지 첨부 / Ctrl+V 붙여넣기]</b>로 건강 검사지나 사진을 분석할 수 있습니다.
            </p>
            <div className="w-full space-y-2">
              <button
                onClick={() =>
                  setInputVal('오늘 만나는 장원술 고객님 간 해독 지수 3.42 나온 거 맞춤 상담 포인트 정리해줘.')
                }
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-sky-300 hover:bg-sky-50/50 transition-all shadow-2xs"
              >
                💬 "장원술 고객님 간 해독 지수 3.42 나온 거 맞춤 상담 포인트 정리해줘."
              </button>
              <button
                onClick={() =>
                  setInputVal('양자검사에서 간 기능 저하가 나왔을 때 추천할 메나테크 제품은?')
                }
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-sky-300 hover:bg-sky-50/50 transition-all shadow-2xs"
              >
                🌿 "양자검사에서 간 기능 저하가 나왔을 때 추천할 메나테크 제품은?"
              </button>
            </div>
          </div>
        ) : (
          messages.map((m) => (
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
                {m.image && (
                  <img
                    src={m.image}
                    alt="Attached"
                    className="max-w-xs max-h-48 rounded-xl mb-2.5 border border-sky-300 shadow-2xs object-cover"
                  />
                )}
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

      {/* Input Form with Voice STT & Image Paste Support */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        {/* Image Preview Thumbnail Card if Image Attached */}
        {attachedImage && (
          <div className="max-w-4xl mx-auto mb-3 flex items-center gap-3 bg-sky-50/80 p-2.5 rounded-2xl border border-sky-200">
            <img src={attachedImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-sky-300" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-sky-900">🖼️ 이미지 첨부 완료 (Ctrl+V 붙여넣기됨)</p>
              <p className="text-sky-600 text-[10px]">AI에게 이미지와 함께 질문할 수 있습니다.</p>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="p-1 text-sky-400 hover:text-red-500 rounded-full"
              title="이미지 취소"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={onCustomSubmit} className="max-w-4xl mx-auto relative flex items-center gap-2">
          {/* Hidden File Input for Image Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-all shrink-0 border border-gray-200"
            title="이미지 첨부 (또는 입력창에 Ctrl+V 붙여넣기)"
          >
            <ImageIcon size={20} />
          </button>

          {/* Mic STT Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
            title={isListening ? '음성 인식 중 (클릭 시 중지)' : '마이크로 음성 말하기 (연속 STT)'}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Input Box with Ctrl+V Paste Handler */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onPaste={handlePaste}
              placeholder={
                isListening
                  ? '🎙️ 말씀하세요... 끊기지 않고 연속으로 듣고 있습니다.'
                  : '질문을 입력하거나, 이미지 붙여넣기(Ctrl+V), 마이크 말하기...'
              }
              className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm shadow-xs transition-colors ${
                isListening ? 'border-red-400 bg-red-50/30 font-medium text-red-900' : 'border-gray-300 focus:border-sky-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!inputVal.trim() && !attachedImage)}
              className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
