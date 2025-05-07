
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AiConfig } from "@/lib/aiService";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AiConfigPanelProps {
  config: AiConfig;
  onConfigChange: (newConfig: AiConfig) => void;
  onTestConnection: () => Promise<boolean>;
}

export function AiConfigPanel({ config, onConfigChange, onTestConnection }: AiConfigPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localConfig, setLocalConfig] = useState<AiConfig>(config);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([]);
  
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
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setKnowledgeFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added to knowledge base`
      });
    }
  };
  
  const removeFile = (index: number) => {
    setKnowledgeFiles(prev => prev.filter((_, i) => i !== index));
  };

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
    >
      <Card className="w-full border-2 bg-white/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
          <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Configuration</CardTitle>
          <CardDescription>Configure AI parameters for license generation</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6 bg-muted/20 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Knowledge Base</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 animate-fade-in">
              <motion.div className="space-y-3" variants={itemAnimation}>
                <Label htmlFor="provider">AI Provider</Label>
                <Select
                  value={localConfig.provider}
                  onValueChange={(value) => setLocalConfig({ ...localConfig, provider: value })}
                >
                  <SelectTrigger id="provider" className="bg-white/80 backdrop-blur-sm border-2 h-11">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md">
                    <SelectGroup>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div className="space-y-3" variants={itemAnimation}>
                <Label htmlFor="model">Model</Label>
                <Select
                  value={localConfig.model}
                  onValueChange={(value) => setLocalConfig({ ...localConfig, model: value })}
                >
                  <SelectTrigger id="model" className="bg-white/80 backdrop-blur-sm border-2 h-11">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md">
                    <SelectGroup>
                      <SelectItem value="deepseek-r1-distill-llama-70b">deepseek-r1-distill-llama-70b</SelectItem>
                      <SelectItem value="mixtral-8x7b-32768">mixtral-8x7b-32768</SelectItem>
                      <SelectItem value="llama-3-70b-8192">llama-3-70b-8192</SelectItem>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="claude-3-opus">claude-3-opus</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div className="space-y-3" variants={itemAnimation}>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={localConfig.apiKey}
                  onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="bg-white/80 backdrop-blur-sm border-2 h-11"
                />
              </motion.div>

              <motion.div className="flex space-x-4" variants={itemAnimation}>
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all h-11">
                  Save Configuration
                </Button>
                <Button onClick={handleTest} variant="outline" disabled={isLoading} className="flex-1 border-2 h-11">
                  {isLoading ? "Testing..." : "Test Connection"}
                </Button>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="knowledge" className="space-y-6 animate-fade-in">
              <motion.div className="space-y-3" variants={itemAnimation}>
                <Label>Knowledge Base Documents</Label>
                <p className="text-sm text-muted-foreground">Upload documents that will be used as context for AI-generated licenses</p>
                
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-white/50 backdrop-blur-sm">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Upload documents</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, DOCX, TXT files accepted</p>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept=".pdf,.docx,.txt"
                    multiple
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-white border-2"
                  >
                    Choose Files
                  </Button>
                </div>
                
                {knowledgeFiles.length > 0 && (
                  <motion.div 
                    className="mt-6 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-medium">Uploaded Documents</h4>
                    <div className="space-y-2">
                      {knowledgeFiles.map((file, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/80 rounded-md shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="text-sm truncate max-w-[70%]">{file.name}</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        Process Documents
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6 animate-fade-in">
              <motion.div className="space-y-3" variants={itemAnimation}>
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
                  className="my-6"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values produce more deterministic outputs, higher values more creative
                </p>
              </motion.div>

              <motion.div className="space-y-3" variants={itemAnimation}>
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
                  className="my-6"
                />
              </motion.div>

              <motion.div className="flex items-center space-x-2" variants={itemAnimation}>
                <Switch
                  id="streaming"
                  checked={localConfig.streaming}
                  onCheckedChange={(checked) => setLocalConfig({ ...localConfig, streaming: checked })}
                />
                <Label htmlFor="streaming">Enable streaming responses</Label>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
