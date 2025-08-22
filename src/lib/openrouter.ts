
import OpenAI from 'openai';

// OpenRouter API configuration
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Get API key from environment or localStorage
const getApiKey = (): string => {
  return import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || '';
};

// Initialize OpenAI client for OpenRouter
let openai: OpenAI;

const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey: apiKey,
    baseURL: OPENROUTER_BASE_URL,
    dangerouslyAllowBrowser: true, // Note: In production, you should proxy this through your backend
  });
};




// Available FREE models on OpenRouter
export const OPENROUTER_MODELS = [
  { 
    name: "meta-llama/llama-3.1-8b-instruct", 
    label: "Llama 3.1 8B Instruct",
    provider: "Meta",
    pricing: "Free"
  },
  { 
    name: "meta-llama/llama-3.1-70b-instruct", 
    label: "Llama 3.1 70B Instruct",
    provider: "Meta",
    pricing: "Free"
  },
  { 
    name: "mistralai/mistral-7b-instruct", 
    label: "Mistral 7B Instruct",
    provider: "Mistral AI",
    pricing: "Free"
  },
  { 
    name: "mistralai/mistral-7b-instruct:free", 
    label: "Mistral 7B Instruct (Free)",
    provider: "Mistral AI",
    pricing: "Free"
  },
  { 
    name: "perplexity/llama-3.1-8b-instruct", 
    label: "Perplexity Llama 3.1 8B",
    provider: "Perplexity",
    pricing: "Free"
  },
  { 
    name: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo", 
    label: "Nous Hermes 2 Mixtral",
    provider: "Nous Research",
    pricing: "Free"
  },
  { 
    name: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free", 
    label: "Nous Hermes 2 Mixtral (Free)",
    provider: "Nous Research",
    pricing: "Free"
  },
  { 
    name: "microsoft/phi-3-mini-4k-instruct", 
    label: "Phi-3 Mini 4K Instruct",
    provider: "Microsoft",
    pricing: "Free"
  },
  { 
    name: "microsoft/phi-3-mini-4k-instruct:free", 
    label: "Phi-3 Mini 4K Instruct (Free)",
    provider: "Microsoft",
    pricing: "Free"
  },
  { 
    name: "google/gemini-2.0-flash-exp", 
    label: "Gemini 2.0 Flash Exp",
    provider: "Google",
    pricing: "Free"
  },
  { 
    name: "google/gemini-2.0-flash-exp:free", 
    label: "Gemini 2.0 Flash Exp (Free)",
    provider: "Google",
    pricing: "Free"
  },
  { 
    name: "anthropic/claude-3-haiku", 
    label: "Claude 3 Haiku",
    provider: "Anthropic",
    pricing: "Free"
  },
  { 
    name: "anthropic/claude-3-haiku:free", 
    label: "Claude 3 Haiku (Free)",
    provider: "Anthropic",
    pricing: "Free"
  },
  { 
    name: "openai/gpt-4o-mini", 
    label: "GPT-4o Mini",
    provider: "OpenAI",
    pricing: "Free"
  },
  { 
    name: "openai/gpt-4o-mini:free", 
    label: "GPT-4o Mini (Free)",
    provider: "OpenAI",
    pricing: "Free"
  },
  { 
    name: "deepseek/deepseek-chat", 
    label: "DeepSeek Chat",
    provider: "DeepSeek",
    pricing: "Free"
  },
  { 
    name: "deepseek/deepseek-chat:free", 
    label: "DeepSeek Chat (Free)",
    provider: "DeepSeek",
    pricing: "Free"
  },
  { 
    name: "qwen/qwen2.5-7b-instruct", 
    label: "Qwen 2.5 7B Instruct",
    provider: "Qwen",
    pricing: "Free"
  },
  { 
    name: "qwen/qwen2.5-7b-instruct:free", 
    label: "Qwen 2.5 7B Instruct (Free)",
    provider: "Qwen",
    pricing: "Free"
  },
  { 
    name: "01-ai/yi-1.5-6b-chat", 
    label: "Yi 1.5 6B Chat",
    provider: "01.AI",
    pricing: "Free"
  },
  { 
    name: "01-ai/yi-1.5-6b-chat:free", 
    label: "Yi 1.5 6B Chat (Free)",
    provider: "01.AI",
    pricing: "Free"
  }
];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export class OpenRouterService {
  private static instance: OpenRouterService;
  private apiKey: string;

  private constructor() {
    this.apiKey = getApiKey();
    if (this.apiKey) {
      initializeOpenAI(this.apiKey);
    }
  }

  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }

  public async sendMessage(
    model: string, 
    messages: ChatMessage[], 
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<ModelResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    if (!openai) {
      initializeOpenAI(this.apiKey);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        headers: {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Model Comparison App',
        },
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response received from model');
      }

      return {
        content: response,
        model: model,
        usage: completion.usage ? {
          prompt_tokens: completion.usage.prompt_tokens,
          completion_tokens: completion.usage.completion_tokens,
          total_tokens: completion.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error(`Error calling OpenRouter API for model ${model}:`, error);
      return {
        content: '',
        model: model,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  public async sendMessageToMultipleModels(
    models: string[],
    messages: ChatMessage[],
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<Record<string, ModelResponse>> {
    const promises = models.map(model => 
      this.sendMessage(model, messages, temperature, maxTokens)
    );

    const responses = await Promise.allSettled(promises);
    const results: Record<string, ModelResponse> = {};

    models.forEach((model, index) => {
      const response = responses[index];
      if (response.status === 'fulfilled') {
        results[model] = response.value;
      } else {
        results[model] = {
          content: '',
          model: model,
          error: response.reason?.message || 'Request failed',
        };
      }
    });

    return results;
  }

  public getAvailableModels() {
    return OPENROUTER_MODELS;
  }

  public isApiKeyConfigured(): boolean {
    return !!this.apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }
}

export default OpenRouterService;
