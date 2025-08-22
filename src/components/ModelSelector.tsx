import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Model {
  name: string;
  label: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModels: string[];
  onModelSelection: (modelNames: string[]) => void;
}

export const ModelSelector = ({ models, selectedModels, onModelSelection }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModel = (modelName: string) => {
    const newSelection = selectedModels.includes(modelName)
      ? selectedModels.filter(name => name !== modelName)
      : [...selectedModels, modelName];
    
    onModelSelection(newSelection);
  };

  const selectAll = () => {
    onModelSelection(models.map(m => m.name));
  };

  const clearAll = () => {
    onModelSelection([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-border/50 hover:border-primary/30 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Select Models
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 bg-card border-border/50 shadow-elevated backdrop-blur-sm"
        align="end"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">AI Models</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="h-7 px-2 text-xs"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {models.map((model) => {
              const isSelected = selectedModels.includes(model.name);
              return (
                <div
                  key={model.name}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary/10 border-primary/30"
                      : "bg-secondary/30 border-border/30 hover:bg-secondary/50"
                  )}
                  onClick={() => toggleModel(model.name)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleModel(model.name)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {model.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {model.name}
                    </p>
                  </div>
                  {isSelected && (
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/20 text-primary border-primary/30"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Selected: {selectedModels.length} / {models.length} models
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};