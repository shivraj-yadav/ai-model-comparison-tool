import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import OpenRouterService, { ChatMessage, ModelResponse } from '@/lib/openrouter';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export interface ModelChatState {
  modelName: string;
  messages: Message[];
  isLoading: boolean;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const useChat = () => {
  const [modelStates, setModelStates] = useState<Record<string, ModelChatState>>({});
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);
  const { toast } = useToast();

  // Initialize API key status
  useEffect(() => {
    const service = OpenRouterService.getInstance();
    setIsApiKeyConfigured(service.isApiKeyConfigured());
  }, []);

  const initializeModel = useCallback((modelName: string) => {
    setModelStates(prev => ({
      ...prev,
      [modelName]: {
        modelName,
        messages: [],
        isLoading: false,
      }
    }));
  }, []);

  const addUserMessage = useCallback((modelName: string, content: string) => {
    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      content,
      timestamp: new Date(),
      isUser: true
    };

    setModelStates(prev => ({
      ...prev,
      [modelName]: {
        ...prev[modelName],
        messages: [...(prev[modelName]?.messages || []), userMessage],
        isLoading: true,
        error: undefined
      }
    }));

    return messageId;
  }, []);

  const addBotMessage = useCallback((modelName: string, content: string, usage?: ModelResponse['usage']) => {
    setModelStates(prev => ({
      ...prev,
      [modelName]: {
        ...prev[modelName],
        messages: [...(prev[modelName]?.messages || []), {
          id: `${Date.now()}-${modelName}`,
          content,
          timestamp: new Date(),
          isUser: false
        }],
        isLoading: false,
        usage
      }
    }));
  }, []);

  const setError = useCallback((modelName: string, error: string) => {
    setModelStates(prev => ({
      ...prev,
      [modelName]: {
        ...prev[modelName],
        isLoading: false,
        error
      }
    }));
  }, []);

  const sendMessageToModels = useCallback(async (
    selectedModels: string[],
    userMessage: string,
    temperature: number = 0.7,
    maxTokens: number = 1000
  ) => {
    const service = OpenRouterService.getInstance();
    
    if (!service.isApiKeyConfigured()) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenRouter API key to use this feature",
        variant: "destructive"
      });
      return;
    }

    // Initialize models if not already done
    selectedModels.forEach(model => {
      if (!modelStates[model]) {
        initializeModel(model);
      }
    });

    // Add user message to all selected models
    const messageIds = selectedModels.map(model => addUserMessage(model, userMessage));

    // Prepare messages for API call
    const chatMessages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide clear, accurate, and helpful responses.'
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      // Send message to all models simultaneously
      const responses = await service.sendMessageToMultipleModels(
        selectedModels,
        chatMessages,
        temperature,
        maxTokens
      );

      // Process responses
      Object.entries(responses).forEach(([modelName, response]) => {
        if (response.error) {
          setError(modelName, response.error);
          toast({
            title: `Error with ${modelName}`,
            description: response.error,
            variant: "destructive"
          });
        } else {
          addBotMessage(modelName, response.content, response.usage);
        }
      });

      toast({
        title: "Responses Received",
        description: `Received responses from ${Object.keys(responses).length} models`
      });

    } catch (error) {
      console.error('Error sending messages:', error);
      selectedModels.forEach(model => {
        setError(model, 'Failed to get response from model');
      });
      
      toast({
        title: "Error",
        description: "Failed to send messages to models",
        variant: "destructive"
      });
    }
  }, [modelStates, initializeModel, addUserMessage, addBotMessage, setError, toast]);

  const clearChat = useCallback((modelName?: string) => {
    if (modelName) {
      setModelStates(prev => ({
        ...prev,
        [modelName]: {
          ...prev[modelName],
          messages: [],
          error: undefined
        }
      }));
    } else {
      setModelStates({});
    }
  }, []);

  const getModelState = useCallback((modelName: string): ModelChatState | undefined => {
    return modelStates[modelName];
  }, [modelStates]);

  const getAllModelStates = useCallback(() => {
    return modelStates;
  }, [modelStates]);

  return {
    modelStates,
    isApiKeyConfigured,
    sendMessageToModels,
    clearChat,
    getModelState,
    getAllModelStates,
    initializeModel
  };
};
