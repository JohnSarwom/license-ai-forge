
# AI Processing Documentation for License Generation System

## Overview

This document outlines how the AI system processes input data to generate compliance requirements for licenses in the Securities Commission application. The AI component is designed to interpret license type, company information, and activity descriptions to produce relevant compliance items that align with regulatory requirements.

## Input Parameters

The AI system accepts the following parameters:

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| licenseType | string | The type of license being requested (e.g., "Investment Advisor", "Securities Broker") | Yes |
| companyName | string | The name of the company applying for the license | Yes |
| activityDescription | string | Description of business activities | Optional |
| sections | string[] | Specific act sections to include in the response | Optional |

## AI Request Structure

```typescript
export interface AIRequestParams {
  licenseType: string;
  companyName: string;
  activityDescription?: string;
  sections?: string[];
}
```

This structure is used when calling the `aiService.generateLicenseData()` method.

## Output Structure

The AI system returns data structured as follows:

```typescript
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
```

## Processing Flow

1. **Input Collection**: The system gathers inputs from the license application form.
2. **AI Model Selection**: Based on the configured AI provider and model, the system selects the appropriate model for processing.
3. **Context Enhancement**: Additional context from the knowledge base is added if available (uploaded documents).
4. **Request Formulation**: The system creates a structured prompt that includes:
   - License type requirements
   - Relevant legal references
   - Company-specific details
   - Instructions for formatting compliance items
5. **Response Generation**: The AI generates compliance items organized by category.
6. **Post-processing**: The system formats the response and links compliance items to specific sections of the Capital Market Act.

## Integration with the Compliance Table

The generated compliance data is automatically populated in the ComplianceTable component, where it's categorized into:
- Obligations
- Conditions
- Additional Conditions
- Exemptions

Each category contains specific items with references to relevant sections of the Capital Market Act.

## AI Configuration Options

Administrators can configure AI behavior through the AiConfigPanel:

- **Provider Selection**: Choose between Groq, OpenAI, Anthropic, or DeepSeek
- **Model Selection**: Select the specific model within the chosen provider
- **Temperature**: Adjust from 0.0 (deterministic) to 2.0 (creative)
- **Max Tokens**: Set the maximum length of generated content
- **Streaming**: Enable/disable streaming responses

## Knowledge Base Enhancement

The AI system can be enhanced with domain-specific knowledge by uploading:
- Legal documents
- Capital Market Act texts
- Previous license documents
- Regulatory guidelines

These documents are processed and used to improve the relevance and accuracy of the generated compliance data.

## Prompt Engineering Guidelines

When modifying the AI system behavior, consider the following prompt engineering guidelines:

1. **Be specific**: Clearly define the expected output format and categories
2. **Provide examples**: Include examples of well-formed compliance items
3. **Include legal references**: When possible, cite specific sections of relevant acts
4. **Include constraints**: Specify any regulatory limitations or requirements
5. **Structure output**: Request structured data for consistent processing

## Example Prompt Template

```
You are a capital market licensing specialist.

Generate compliance requirements for a {licenseType} license for {companyName},
which is engaged in {activityDescription}.

Structure the response as follows:
- Obligations (mandatory requirements)
- Conditions (prerequisites for approval)
- Additional Conditions (specific to this license type)
- Exemptions (if applicable)

Reference relevant sections of the Capital Market Act 2015 where appropriate.
```

## Implementation Details

The AI functionality is implemented in `src/lib/aiService.ts` with the following key functions:

- `setConfig()`: Updates AI model configuration
- `generateLicenseData()`: Processes inputs and returns compliance data
- `simulateResponse()`: Used for development/demonstration purposes

## Sample Usage

```typescript
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
const licenseData = await aiService.generateLicenseData({
  licenseType: "Investment Advisor",
  companyName: "Pacifund Financial Services",
  activityDescription: "Providing investment advice to retail clients",
});

// Use the response data
const { licenseeInfo, complianceItems } = licenseData;
```

## Extending AI Capabilities

The AI system can be extended in the following ways:

1. **Additional parameters**: Add new parameters to refine generated content
2. **Custom templates**: Create specialized templates for different license types
3. **Knowledge integration**: Continuously update the knowledge base with new regulations
4. **Feedback loop**: Implement user feedback to improve AI responses over time

## Security Considerations

- API keys are securely stored in the application or in Supabase secrets
- AI-generated content should be reviewed by qualified personnel before final license issuance
- All AI operations are logged for audit purposes
