
import { AIResponse, AIRequestParams } from "@/lib/aiService";
import { populateTemplate, complianceDataTemplate, licenseInfoTemplate } from "./aiPromptTemplates";
import { ComplianceItem } from "@/data/complianceData";

/**
 * Prepares AI request parameters by adding default values and formatting
 * 
 * @param params Base parameters for AI request
 * @returns Enhanced parameters ready for AI processing
 */
export function prepareAIRequest(params: AIRequestParams): AIRequestParams {
  return {
    ...params,
    // Default activity description if not provided
    activityDescription: params.activityDescription || `${params.licenseType} services`,
  };
}

/**
 * Maps an AI response to the ComplianceItem format used by the UI
 * 
 * @param aiResponse Raw response from AI service
 * @returns Formatted compliance items ready for display
 */
export function mapAIResponseToComplianceItems(aiResponse: AIResponse): ComplianceItem[] {
  return aiResponse.complianceItems.map(item => ({
    category: item.category as 'Obligations' | 'Conditions' | 'Additional Conditions' | 'Exemptions',
    items: item.items,
    reference: item.reference,
    // Extract section numbers from references for linking
    actSections: item.reference 
      ? extractSectionNumbers(item.reference)
      : undefined
  }));
}

/**
 * Extract section numbers from reference strings like "CM Act s.45" or "CM Act s.34-36"
 * 
 * @param reference Reference string
 * @returns Array of section numbers
 */
function extractSectionNumbers(reference: string): string[] {
  const sections: string[] = [];
  
  // Match patterns like "s.45", "s.34-36", "s.45, 46"
  const matches = reference.match(/s\.(\d+(?:-\d+)?(?:,\s*\d+)*)/i);
  
  if (matches && matches[1]) {
    const sectionText = matches[1];
    
    // Handle ranges like "34-36"
    if (sectionText.includes('-')) {
      const [start, end] = sectionText.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        sections.push(i.toString());
      }
    } 
    // Handle comma-separated list like "45, 46"
    else if (sectionText.includes(',')) {
      const sectionList = sectionText.split(',').map(s => s.trim());
      sections.push(...sectionList);
    }
    // Single section number
    else {
      sections.push(sectionText);
    }
  }
  
  return sections;
}

/**
 * Creates a complete AI prompt by combining templates with request parameters
 * 
 * @param params Request parameters
 * @returns Formatted prompt ready for AI processing
 */
export function createAIPrompt(params: AIRequestParams): string {
  const compliancePrompt = populateTemplate(complianceDataTemplate, {
    licenseType: params.licenseType,
    companyName: params.companyName,
    activityDescription: params.activityDescription || "",
  });
  
  const licenseInfoPrompt = populateTemplate(licenseInfoTemplate, {
    companyName: params.companyName,
    licenseType: params.licenseType,
    activityDescription: params.activityDescription || "",
  });
  
  return `${compliancePrompt}\n\n${licenseInfoPrompt}`;
}

/**
 * Enhances AI context with knowledge base documents
 * 
 * @param prompt Base prompt
 * @param knowledgeContext Additional context from knowledge base
 * @returns Enhanced prompt with knowledge context
 */
export function enhancePromptWithKnowledge(prompt: string, knowledgeContext: string): string {
  if (!knowledgeContext) return prompt;
  
  return `
ADDITIONAL CONTEXT FROM KNOWLEDGE BASE:
${knowledgeContext}

${prompt}
`;
}
