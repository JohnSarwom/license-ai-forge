
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AIProcessingGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="w-full border-2 bg-white/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Processing Documentation
            </CardTitle>
            <CardDescription>
              Technical guide for how the AI processes and generates compliance data
            </CardDescription>
          </div>
          <Badge variant="outline">Developer Documentation</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-6 bg-muted/20 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="prompt-templates">Prompt Templates</TabsTrigger>
            <TabsTrigger value="code-examples">Code Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How the AI System Works</h3>
              <p>
                The AI system processes inputs from the license application form and generates structured compliance requirements
                based on the license type, company information, and activity description. The output is automatically categorized
                and displayed in the ComplianceTable component.
              </p>
              
              <h4 className="text-md font-semibold mt-4">Input Parameters</h4>
              <div className="bg-slate-50 p-4 rounded-md border">
                <pre className="overflow-x-auto text-xs">
                  {`interface AIRequestParams {
  licenseType: string;      // Type of license being requested
  companyName: string;      // Name of the company applying
  activityDescription?: string;  // Description of business activities
  sections?: string[];      // Specific act sections to include
}`}
                </pre>
              </div>
              
              <h4 className="text-md font-semibold mt-4">Output Structure</h4>
              <div className="bg-slate-50 p-4 rounded-md border">
                <pre className="overflow-x-auto text-xs">
                  {`interface AIResponse {
  licenseeInfo: {
    companyName: string;      // Company name
    activityDescription: string;  // Activity description
    licenseNumber: string;    // Generated license number
    issueDate: string;        // Issue date
    expiryDate: string;       // Expiry date (usually 1 year)
  };
  complianceItems: {
    category: string;         // Category: Obligations, Conditions, etc.
    items: string[];          // List of compliance items
    reference?: string;       // Reference to act sections
  }[];
}`}
                </pre>
              </div>
              
              <h4 className="text-md font-semibold mt-4">Processing Flow</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>User inputs license application details</li>
                <li>AI service prepares request with templates</li>
                <li>AI generates structured compliance requirements</li>
                <li>Response is processed and linked to Act sections</li>
                <li>Data is presented in the ComplianceTable component</li>
                <li>Users can interact with items to view Act references</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="implementation" className="animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Implementation Details</h3>
              
              <div className="space-y-3">
                <h4 className="text-md font-semibold">Key Files</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>src/lib/aiService.ts</code> - Core AI service implementation</li>
                  <li><code>src/utils/aiPromptTemplates.ts</code> - Prompt templates</li>
                  <li><code>src/utils/aiHelpers.ts</code> - Helper functions</li>
                  <li><code>src/components/AiConfigPanel.tsx</code> - Configuration UI</li>
                  <li><code>src/components/ComplianceTable.tsx</code> - Displays results</li>
                </ul>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-md font-semibold">Core Functions</h4>
                <div className="bg-slate-50 p-4 rounded-md border">
                  <h5 className="font-medium text-sm mb-2">setConfig()</h5>
                  <p className="text-xs text-slate-600">Updates AI model configuration</p>
                  <pre className="overflow-x-auto text-xs mt-2">
                    {`aiService.setConfig({
  provider: "groq",
  model: "deepseek-r1-distill-llama-70b",
  apiKey: "YOUR_API_KEY",
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
});`}
                  </pre>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md border mt-4">
                  <h5 className="font-medium text-sm mb-2">generateLicenseData()</h5>
                  <p className="text-xs text-slate-600">Processes inputs and returns compliance data</p>
                  <pre className="overflow-x-auto text-xs mt-2">
                    {`const licenseData = await aiService.generateLicenseData({
  licenseType: "Investment Advisor",
  companyName: "Pacifund Financial Services", 
  activityDescription: "Providing investment advice"
});`}
                  </pre>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md border mt-4">
                  <h5 className="font-medium text-sm mb-2">createAIPrompt()</h5>
                  <p className="text-xs text-slate-600">Creates prompt from templates</p>
                  <pre className="overflow-x-auto text-xs mt-2">
                    {`const prompt = createAIPrompt({
  licenseType: "Investment Advisor",
  companyName: "Pacifund Financial Services",
  activityDescription: "Providing investment advice"
});`}
                  </pre>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-md font-semibold">Integration with Knowledge Base</h4>
                <p>
                  The AI system can be enhanced with domain-specific knowledge by uploading documents to the knowledge base.
                  These documents are processed and used to improve the relevance and accuracy of generated compliance data.
                </p>
                <p className="text-sm text-slate-600">
                  Supported document types: PDF, DOCX, TXT
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prompt-templates" className="animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prompt Templates</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => copyToClipboard(complianceDataTemplate)}
                >
                  <Code className="h-4 w-4" />
                  Copy Template
                </Button>
              </div>
              
              <div className="mt-4">
                <h4 className="text-md font-semibold">Compliance Data Template</h4>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-slate-50 mt-2">
                  <pre className="text-xs whitespace-pre-wrap">
                    {complianceDataTemplate}
                  </pre>
                </ScrollArea>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-semibold">License Info Template</h4>
                <ScrollArea className="h-[150px] w-full rounded-md border p-4 bg-slate-50 mt-2">
                  <pre className="text-xs whitespace-pre-wrap">
                    {licenseInfoTemplate}
                  </pre>
                </ScrollArea>
              </div>
              
              <div className="space-y-3 mt-6">
                <h4 className="text-md font-semibold">Prompt Engineering Guidelines</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><span className="font-medium">Be specific:</span> Clearly define expected output format</li>
                  <li><span className="font-medium">Provide examples:</span> Include examples of well-formed compliance items</li>
                  <li><span className="font-medium">Include legal references:</span> Cite specific sections when possible</li>
                  <li><span className="font-medium">Include constraints:</span> Specify regulatory limitations</li>
                  <li><span className="font-medium">Structure output:</span> Request data in a consistent format</li>
                </ol>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code-examples" className="animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Code Examples</h3>
              
              <div className="space-y-3">
                <h4 className="text-md font-semibold">Basic Usage</h4>
                <div className="relative bg-slate-50 p-4 rounded-md border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(basicUsageExample)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <pre className="overflow-x-auto text-xs">
                    {basicUsageExample}
                  </pre>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <h4 className="text-md font-semibold">Advanced Usage with Knowledge Base</h4>
                <div className="relative bg-slate-50 p-4 rounded-md border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(advancedUsageExample)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <pre className="overflow-x-auto text-xs">
                    {advancedUsageExample}
                  </pre>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <h4 className="text-md font-semibold">Integrating with React Components</h4>
                <div className="relative bg-slate-50 p-4 rounded-md border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(reactIntegrationExample)}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <pre className="overflow-x-auto text-xs">
                    {reactIntegrationExample}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Example code snippets
const complianceDataTemplate = `
You are a capital market licensing specialist for the Securities Commission of Papua New Guinea.

TASK:
Generate compliance requirements for a {licenseType} license for {companyName}, 
which is engaged in {activityDescription}.

CONTEXT:
- The Capital Market Act 2015 governs securities licensing in Papua New Guinea
- Licensing requirements vary based on the type of financial service offered
- Compliance items must reference specific sections of the Act when possible
- All licensees must adhere to general obligations under Section 34

OUTPUT STRUCTURE:
Generate compliance requirements organized into the following categories:
1. Obligations: Ongoing requirements licensees must fulfill
2. Conditions: Prerequisites for license approval
3. Additional Conditions: Requirements specific to this license type
4. Exemptions: Any exemptions that may apply

For each item, when appropriate, provide a reference to the relevant section 
of the Capital Market Act 2015. Format references as "CM Act s.XX" where XX is the section number.

EXAMPLES OF WELL-FORMED COMPLIANCE ITEMS:
- "Licensees must submit annual financial reports."
- "Firms must comply with minimum capital requirements."
- "Applicants must have a fit and proper management team."
- "Foreign entities regulated in equivalent jurisdictions may be exempt from dual registration."

PREFERENCES:
- Be specific and clear in the requirements
- Focus on practical compliance measures
- Include approximately 3-5 items per category
- Reference specific act sections where applicable (34, 45, 46 are common)
`;

const licenseInfoTemplate = `
Based on the provided information, generate license details for {companyName}
applying for a {licenseType} license.

Generate the following fields:
- License number (format: CMLXXXXX where X is a digit)
- Issue date (current date)
- Expiry date (one year from issue date)
- Standardized activity description (based on {activityDescription})

The license should comply with Securities Commission of Papua New Guinea standards.
`;

const basicUsageExample = `
import aiService from "@/lib/aiService";

// Configure the AI service
aiService.setConfig({
  provider: "groq",
  model: "deepseek-r1-distill-llama-70b",
  apiKey: "YOUR_API_KEY",
  temperature: 0.7,
  maxTokens: 4096,
  streaming: true,
});

// Generate license data
async function generateComplianceData() {
  try {
    const licenseData = await aiService.generateLicenseData({
      licenseType: "Investment Advisor",
      companyName: "Pacifund Financial Services",
      activityDescription: "Providing investment advice to retail clients",
    });
    
    // Use the response data
    const { licenseeInfo, complianceItems } = licenseData;
    console.log("Generated license number:", licenseeInfo.licenseNumber);
    console.log("Compliance items:", complianceItems);
    
    return licenseData;
  } catch (error) {
    console.error("Error generating license data:", error);
    throw error;
  }
}
`;

const advancedUsageExample = `
import aiService from "@/lib/aiService";
import { createAIPrompt, enhancePromptWithKnowledge } from "@/utils/aiHelpers";

// Process knowledge base documents
async function generateWithKnowledgeBase(params, knowledgeFiles) {
  try {
    // Process knowledge files
    const knowledgeContext = await processKnowledgeFiles(knowledgeFiles);
    
    // Create base prompt
    const basePrompt = createAIPrompt(params);
    
    // Enhance with knowledge
    const enhancedPrompt = enhancePromptWithKnowledge(basePrompt, knowledgeContext);
    
    // Configure AI with custom settings
    aiService.setConfig({
      provider: "groq",
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.5,  // Lower temperature for more consistent results
      maxTokens: 4096,
      streaming: true,
    });
    
    // Generate with custom prompt
    return await aiService.generateLicenseDataWithPrompt(enhancedPrompt, params);
  } catch (error) {
    console.error("Error generating with knowledge base:", error);
    throw error;
  }
}

// Helper to process knowledge files
async function processKnowledgeFiles(files) {
  // Implementation would extract text from PDFs, DOCXs, etc.
  // And prepare it for inclusion in the prompt
  return "Extracted knowledge context...";
}
`;

const reactIntegrationExample = `
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ComplianceTable } from "@/components/ComplianceTable";
import aiService from "@/lib/aiService";
import { mapAIResponseToComplianceItems } from "@/utils/aiHelpers";

export function LicenseGenerator({ licenseType, companyName, activityDescription }) {
  const [isLoading, setIsLoading] = useState(false);
  const [complianceItems, setComplianceItems] = useState([]);
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      // Generate compliance data
      const response = await aiService.generateLicenseData({
        licenseType,
        companyName,
        activityDescription
      });
      
      // Map AI response to UI component format
      const items = mapAIResponseToComplianceItems(response);
      setComplianceItems(items);
      
      toast({
        title: "Compliance Data Generated",
        description: "AI has successfully generated compliance requirements",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate compliance data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Button 
        onClick={handleGenerate} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate Compliance Data"}
      </Button>
      
      {complianceItems.length > 0 && (
        <ComplianceTable items={complianceItems} isEditable={true} />
      )}
    </div>
  );
}
`;
