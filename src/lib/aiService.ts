
import { toast } from "@/components/ui/use-toast";

export interface AiConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
}

export interface AIRequestParams {
  licenseType: string;
  companyName: string;
  activityDescription?: string;
  sections?: string[];
}

export interface AIResponse {
  licenseeInfo: {
    companyName: string;
    activityDescription: string;
    licenseNumber: string;
    issueDate: string;
    expiryDate: string;
  };
  complianceItems: {
    category: string;
    items: string[];
    reference?: string;
  }[];
}

// Default AI configuration
export const defaultAiConfig: AiConfig = {
  provider: "groq",
  model: "deepseek-r1-distill-llama-70b",
  apiKey: "",
  temperature: 0.6,
  maxTokens: 4096,
  streaming: true,
};

class AIService {
  private config: AiConfig;

  constructor(config: AiConfig = defaultAiConfig) {
    this.config = config;
  }

  setConfig(newConfig: Partial<AiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  async generateLicenseData(params: AIRequestParams): Promise<AIResponse> {
    console.log("Generating license data with params:", params);
    
    try {
      if (!this.config.apiKey) {
        throw new Error("API key not configured");
      }
      
      // For now, we'll simulate a response rather than making a real API call
      // In a production app, this would make an actual call to the AI service
      return this.simulateResponse(params);
      
      // Real API call would look like this:
      /*
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: "system",
              content: "You are a capital market licensing specialist. Generate license information based on the provided details."
            },
            {
              role: "user",
              content: `Generate capital market license information for ${params.companyName} for license type: ${params.licenseType}`
            }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: this.config.streaming
        })
      });
      
      // Process the response based on whether streaming is enabled
      if (this.config.streaming) {
        // Handle streaming response
      } else {
        const data = await response.json();
        // Parse and return data
      }
      */
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "AI Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate license data",
        variant: "destructive"
      });
      throw error;
    }
  }

  private simulateResponse(params: AIRequestParams): AIResponse {
    // Generate a random license number
    const licenseNumber = "CML" + Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    
    // Generate dates
    const today = new Date();
    const issueDate = today.toLocaleDateString("en-US");
    const expiryDate = new Date(today.setFullYear(today.getFullYear() + 1)).toLocaleDateString("en-US");
    
    return {
      licenseeInfo: {
        companyName: params.companyName,
        activityDescription: params.activityDescription || params.licenseType,
        licenseNumber,
        issueDate,
        expiryDate
      },
      complianceItems: [
        {
          category: "Obligations",
          items: [
            "Licensees must submit annual financial reports.",
            "Firms must comply with minimum capital requirements.",
            "Duty to act honestly and in the best interests of clients."
          ]
        },
        {
          category: "Conditions",
          items: [
            "Applicants must have a fit and proper management team.",
            "Compliance systems must be in place prior to licensing.",
            "Disclosure of beneficial ownership required."
          ]
        },
        {
          category: "Additional Conditions",
          items: [
            "Ongoing reporting obligations may vary depending on firm category.",
            "Certain services may require prior written approval from the Commission."
          ],
          reference: "CM Act s.45"
        },
        {
          category: "Exemptions",
          items: [
            "Government bodies acting within statutory functions.",
            "Foreign entities regulated in equivalent jurisdictions may be exempt from dual registration."
          ],
          reference: "CM Act s.46?"
        }
      ]
    };
  }
}

const aiService = new AIService();
export default aiService;
