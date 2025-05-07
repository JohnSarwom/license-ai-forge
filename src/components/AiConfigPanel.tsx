
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AiConfig } from "@/lib/aiService";
import { toast } from "@/components/ui/use-toast";

interface AiConfigPanelProps {
  config: AiConfig;
  onConfigChange: (newConfig: AiConfig) => void;
  onTestConnection: () => Promise<boolean>;
}

export function AiConfigPanel({ config, onConfigChange, onTestConnection }: AiConfigPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localConfig, setLocalConfig] = useState<AiConfig>(config);
  
  const handleSave = () => {
    onConfigChange(localConfig);
    toast({
      title: "Configuration Saved",
      description: "AI configuration has been updated",
    });
  };
  
  const handleTest = async () => {
    setIsLoading(true);
    try {
      const success = await onTestConnection();
      if (success) {
        toast({
          title: "Connection Successful",
          description: "AI service connection test passed",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the AI service with the provided configuration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An error occurred testing the connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">AI Configuration</CardTitle>
        <CardDescription>Configure AI parameters for license generation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="provider">AI Provider</Label>
          <Select
            value={localConfig.provider}
            onValueChange={(value) => setLocalConfig({ ...localConfig, provider: value })}
          >
            <SelectTrigger id="provider">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="groq">Groq</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="model">Model</Label>
          <Select
            value={localConfig.model}
            onValueChange={(value) => setLocalConfig({ ...localConfig, model: value })}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="deepseek-r1-distill-llama-70b">deepseek-r1-distill-llama-70b</SelectItem>
                <SelectItem value="mixtral-8x7b-32768">mixtral-8x7b-32768</SelectItem>
                <SelectItem value="llama-3-70b-8192">llama-3-70b-8192</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={localConfig.apiKey}
            onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
            placeholder="Enter your API key"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature: {localConfig.temperature.toFixed(1)}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[localConfig.temperature]}
            onValueChange={(values) => setLocalConfig({ ...localConfig, temperature: values[0] })}
          />
          <p className="text-xs text-muted-foreground">
            Lower values produce more deterministic outputs, higher values more creative
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label htmlFor="max-tokens">Max Tokens: {localConfig.maxTokens}</Label>
          </div>
          <Slider
            id="max-tokens"
            min={1000}
            max={8192}
            step={100}
            value={[localConfig.maxTokens]}
            onValueChange={(values) => setLocalConfig({ ...localConfig, maxTokens: values[0] })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="streaming"
            checked={localConfig.streaming}
            onCheckedChange={(checked) => setLocalConfig({ ...localConfig, streaming: checked })}
          />
          <Label htmlFor="streaming">Enable streaming responses</Label>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleSave} className="flex-1">Save Configuration</Button>
          <Button onClick={handleTest} variant="outline" disabled={isLoading} className="flex-1">
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
