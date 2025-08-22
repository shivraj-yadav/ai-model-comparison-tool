import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyConfigProps {
  onApiKeySet: (apiKey: string) => void;
  isConfigured: boolean;
}

export const ApiKeyConfig = ({ onApiKeySet, isConfigured }: ApiKeyConfigProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenRouter API key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Store API key in localStorage (in production, you might want to use a more secure method)
    try {
      localStorage.setItem('openrouter_api_key', apiKey);
      onApiKeySet(apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenRouter API key has been configured successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetApiKey = () => {
    window.open('https://openrouter.ai/keys', '_blank');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          OpenRouter API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <div className="text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-success mx-auto" />
            <div>
              <h3 className="font-semibold text-foreground">API Key Configured</h3>
              <p className="text-sm text-muted-foreground">
                Your OpenRouter API key is ready to use
              </p>
            </div>
            <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
              Ready to Chat
            </Badge>
          </div>
        ) : (
          <>
            <Alert>
              <AlertDescription className="text-sm">
                You need an OpenRouter API key to use this application. Get your free API key from OpenRouter.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="api-key">OpenRouter API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGetApiKey}
                variant="outline"
                className="flex-1 border-border/50 hover:border-primary/30"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim() || isLoading}
                className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-elevated"
              >
                {isLoading ? "Saving..." : "Save Key"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your API key is stored locally in your browser</p>
              <p>• OpenRouter offers free credits for new users</p>
              <p>• You can manage your usage at openrouter.ai</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
