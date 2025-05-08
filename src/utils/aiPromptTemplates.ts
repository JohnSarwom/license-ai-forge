
/**
 * This file contains templates for prompts used in AI generation
 * of license compliance data.
 */

export const complianceDataTemplate = `
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

export const licenseInfoTemplate = `
Based on the provided information, generate license details for {companyName}
applying for a {licenseType} license.

Generate the following fields:
- License number (format: CMLXXXXX where X is a digit)
- Issue date (current date)
- Expiry date (one year from issue date)
- Standardized activity description (based on {activityDescription})

The license should comply with Securities Commission of Papua New Guinea standards.
`;

/**
 * Populates a template with values from the provided data object
 * 
 * @param template - Template string with {placeholders}
 * @param data - Object containing values to insert
 * @returns Populated template string
 */
export function populateTemplate(template: string, data: Record<string, string>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value || '');
  }
  
  return result;
}
