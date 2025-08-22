import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModelChat } from "./ModelChat";
import { ModelSelector } from "./ModelSelector";
import { ApiKeyConfig } from "./ApiKeyConfig";
import { Send, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/use-chat";
import { OPENROUTER_MODELS } from "@/lib/openrouter";
import OpenRouterService from "@/lib/openrouter";

const models = OPENROUTER_MODELS;

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

interface ModelResponse {
  modelName: string;
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export const AIModelComparison = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "meta-llama/llama-3.1-8b-instruct",
    "mistralai/mistral-7b-instruct",
    "anthropic/claude-3-haiku"
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [bestResponse, setBestResponse] = useState<string | null>(null);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { modelStates, sendMessageToModels, isApiKeyConfigured: chatApiKeyConfigured } = useChat();

  const handleModelSelection = (modelNames: string[]) => {
    setSelectedModels(modelNames);
  };

  const handleApiKeySet = (apiKey: string) => {
    const service = OpenRouterService.getInstance();
    service.setApiKey(apiKey);
    setIsApiKeyConfigured(true);
  };

  useEffect(() => {
    // Check if API key is configured on component mount
    const service = OpenRouterService.getInstance();
    setIsApiKeyConfigured(service.isApiKeyConfigured());
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || selectedModels.length === 0) return;

    const message = inputMessage.trim();
    setInputMessage("");

    await sendMessageToModels(selectedModels, message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectBestResponse = (modelName: string) => {
    setBestResponse(modelName);
    toast({
      title: "Best Response Selected",
      description: `Selected ${models.find(m => m.name === modelName)?.label} as the best response`
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Model Comparison </h1>
                <p className="text-sm text-muted-foreground">Compare responses across multiple AI models</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/30">
                {selectedModels.length} models active
              </Badge>
              <ModelSelector
                models={models}
                selectedModels={selectedModels}
                onModelSelection={handleModelSelection}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Models Grid */}
        <div className="flex-1 overflow-hidden">
          {!isApiKeyConfigured ? (
            <div className="h-full flex items-center justify-center p-6">
              <ApiKeyConfig 
                onApiKeySet={handleApiKeySet}
                isConfigured={isApiKeyConfigured}
              />
            </div>
          ) : selectedModels.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 text-center bg-gradient-card border-border/50">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select AI Models</h3>
                <p className="text-muted-foreground">Choose models to start comparing responses</p>
              </Card>
            </div>
          ) : (
            <div className={`grid h-full gap-4 p-6 ${
              selectedModels.length === 1 ? 'grid-cols-1' :
              selectedModels.length === 2 ? 'grid-cols-2' :
              selectedModels.length <= 4 ? 'grid-cols-2 lg:grid-cols-4' :
              'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {selectedModels.map((modelName) => {
                const model = models.find(m => m.name === modelName);
                const response = modelStates[modelName];
                return (
                  <ModelChat
                    key={modelName}
                    model={model!}
                    response={response}
                    onSelectBest={() => selectBestResponse(modelName)}
                    isBest={bestResponse === modelName}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Input Area */}
        {isApiKeyConfigured && (
          <div className="border-t border-border bg-card/30 backdrop-blur-sm p-6">
            <div className="container mx-auto max-w-4xl">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask all models a question..."
                  className="flex-1 bg-input border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  disabled={selectedModels.length === 0}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || selectedModels.length === 0}
                  className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {selectedModels.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send to all {selectedModels.length} selected models
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};