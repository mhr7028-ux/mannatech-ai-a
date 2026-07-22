import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';

// Initialize Ollama pointing to localhost
const ollama = createOllama({
  baseURL: 'http://localhost:11434/api',
});

// System prompt that sets the persona for HBOS AI
const systemPrompt = `당신은 'MannaTech AI Business Assistant (HBOS)'입니다.
목회자이자 네트워크 마케팅(메나테크) 사업을 하는 대표님과 파트너들, 그리고 고객들을 위한 전문 AI 건강 코치 겸 비즈니스 비서입니다.
친절하고 전문적이며, 건강 데이터(양자검사, 식단, 운동 등)에 기반하여 과학적이고 이해하기 쉽게 답변해주세요.
특히 건강 이상이 있을 때 라이프스타일 개선과 함께 자연스럽게 영양의 중요성(글리코 영양소 등)을 안내하는 역할을 합니다.
만약 관상(Physiognomy)에 대한 질문이 들어오면, 유쾌하게 아이스브레이킹용으로 대답하며 건강 상담으로 자연스럽게 이어가세요.`;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    let aiModel: any;

    // Route to the correct provider based on the selected model string
    switch (model) {
      case 'gpt-4o':
        aiModel = openai('gpt-4o');
        break;
      case 'gemini-1.5-pro':
        aiModel = google('models/gemini-1.5-pro-latest');
        break;
      case 'claude-3-5-sonnet':
        aiModel = anthropic('claude-3-5-sonnet-20240620');
        break;
      case 'llama3':
      default:
        // For local Ollama models (e.g. llama3)
        aiModel = ollama('llama3');
        break;
    }

    const result = await streamText({
      model: aiModel,
      messages: messages,
      system: systemPrompt,
    });

    return (result as any).toDataStreamResponse();
  } catch (error) {
    console.error('AI API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to communicate with AI provider.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
