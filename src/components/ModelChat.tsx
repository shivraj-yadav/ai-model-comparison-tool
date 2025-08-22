import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Crown, Loader2, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ModelChatState } from "@/hooks/use-chat";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

interface ModelChatProps {
  model: {
    name: string;
    label: string;
    provider?: string;
    pricing?: string;
  };
  response?: ModelChatState;
  onSelectBest: () => void;
  isBest: boolean;
}

export const ModelChat = ({ model, response, onSelectBest, isBest }: ModelChatProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const copyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Response copied successfully"
    });
  };

  const messages = response?.messages || [];
  const latestBotMessage = messages.filter(m => !m.isUser).pop();

  return (
    <Card 
      className={cn(
        "flex flex-col h-full bg-gradient-card border-border/50 transition-all duration-300",
        isBest && "ring-2 ring-accent shadow-elevated",
        isHovered && "border-primary/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {model.label}
              </h3>
              {model.provider && (
                <p className="text-xs text-muted-foreground truncate">
                  {model.provider} • {model.pricing}
                </p>
              )}
            </div>
            {isBest && <Crown className="w-4 h-4 text-accent flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1">
            {response?.isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            {response?.error && <AlertCircle className="w-4 h-4 text-destructive" />}
          </div>
        </div>
        {messages.length > 0 && (
          <Badge variant="secondary" className="text-xs w-fit">
            {messages.filter(m => !m.isUser).length} responses
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col pt-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg text-sm",
                message.isUser
                  ? "bg-primary/10 border border-primary/20 ml-auto max-w-[85%]"
                  : "bg-secondary/50 border border-border/30"
              )}
            >
              <p className="text-foreground whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {response?.isLoading && (
            <div className="bg-secondary/30 border border-border/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          
          {response?.error && (
            <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{response.error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {latestBotMessage && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyResponse(latestBotMessage.content)}
                className="flex-1 border-border/50 hover:border-primary/30"
              >
                <Copy className="w-3 h-3 mr-2" />
                Copy
              </Button>
              <Button
                variant={isBest ? "default" : "outline"}
                size="sm"
                onClick={onSelectBest}
                className={cn(
                  "flex-1",
                  isBest 
                    ? "bg-gradient-accent text-accent-foreground shadow-glow" 
                    : "border-border/50 hover:border-accent/30"
                )}
              >
                <Crown className="w-3 h-3 mr-2" />
                {isBest ? "Best" : "Pick"}
              </Button>
            </div>
            
            {/* Usage Info */}
            {response?.usage && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-2 rounded">
                <Info className="w-3 h-3" />
                <span>
                  {response.usage.total_tokens} tokens • 
                  {response.usage.prompt_tokens} prompt • 
                  {response.usage.completion_tokens} completion
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};