import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// System prompt that sets the persona for HBOS AI
const systemPrompt = `당신은 'MannaTech AI Business Assistant (HBOS)'입니다.
목회자이자 네트워크 마케팅(메나테크) 사업을 하는 대표님과 파트너들, 그리고 고객들을 위한 전문 AI 건강 코치 겸 비즈니스 비서입니다.
친절하고 전문적이며, 건강 데이터(양자검사, 식단, 운동 등)에 기반하여 과학적이고 이해하기 쉽게 답변해주세요.
특히 건강 이상이 있을 때 라이프스타일 개선과 함께 자연스럽게 영양의 중요성(글리코 영양소 등)을 안내하는 역할을 합니다.
만약 관상(Physiognomy)에 대한 질문이 들어오면, 유쾌하게 아이스브레이킹용으로 대답하며 건강 상담으로 자연스럽게 이어가세요.`;

export async function POST(req: Request) {
  try {
    const { messages, model, image } = await req.json();

    // 1. Direct Local Ollama Handling (tries 127.0.0.1 and localhost)
    if (model?.startsWith('ollama-') || model === 'llama3') {
      let targetModel = model.startsWith('ollama-') ? model.replace('ollama-', '') : 'qwen3.6';

      const endpoints = [
        'http://127.0.0.1:11434',
        'http://localhost:11434',
      ];

      let activeBaseUrl: string | null = null;
      let availableModels: string[] = [];

      // Step A: Find active Ollama base URL and installed model tags
      for (const base of endpoints) {
        try {
          const tagsRes = await fetch(`${base}/api/tags`);
          if (tagsRes.ok) {
            const data = await tagsRes.json();
            availableModels = (data.models || []).map((m: any) => m.name);
            activeBaseUrl = base;
            break;
          }
        } catch {}
      }

      // If exact model not matched, pick closest installed model
      if (availableModels.length > 0) {
        const exactMatch = availableModels.find(
          (m) => m === targetModel || m.startsWith(targetModel) || targetModel.startsWith(m.split(':')[0])
        );
        if (exactMatch) {
          targetModel = exactMatch;
        } else {
          targetModel = availableModels[0]; // fallback to first installed model
        }
      }

      if (!activeBaseUrl) {
        return new Response(
          `🔴 **올라마 AI 미실행 상태**:\n` +
          `대표님 컴퓨터에 윈도우 올라마 프로그램이 켜져 있는지 확인해 주세요!`,
          { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      }

      // Step B: Send chat/generate request to Ollama
      const ollamaRes = await fetch(`${activeBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({
              role: m.role,
              content: m.content,
              images: m.image ? [m.image.split(',')[1] || m.image] : undefined,
            })),
          ],
          stream: true,
        }),
      });

      if (!ollamaRes.ok) {
        return new Response(
          `🤖 **올라마 모델 [${targetModel}] 로딩 안내**:\n` +
          `윈도우 올라마 앱 창에서 해당 모델에 대화를 한 번 시도해 주시면 즉시 가동됩니다!`,
          { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      }

      // Stream response cleanly
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const reader = ollamaRes.body?.getReader();

      const customStream = new ReadableStream({
        async start(controller) {
          if (!reader) {
            controller.close();
            return;
          }
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line);
                  if (parsed.message?.content) {
                    controller.enqueue(encoder.encode(parsed.message.content));
                  }
                } catch {
                  // Ignore partial JSON chunks
                }
              }
            }
          }
          controller.close();
        },
      });

      return new Response(customStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // 2. Cloud AI Models (GPT-4o, Gemini, Claude)
    let aiModel: any;
    switch (model) {
      case 'gpt-4o':
        aiModel = openai('gpt-4o');
        break;
      case 'gemini-1.5-pro':
        aiModel = google('models/gemini-1.5-pro-latest');
        break;
      case 'claude-3-5-sonnet':
      default:
        aiModel = anthropic('claude-3-5-sonnet-20240620');
        break;
    }

    const result = await streamText({
      model: aiModel,
      messages: messages,
      system: systemPrompt,
    });

    return (result as any).toTextStreamResponse();
  } catch (error) {
    console.error('AI API Error:', error);
    return new Response('AI 서비스 연결 중 오류가 발생했습니다.', { status: 500 });
  }
}
