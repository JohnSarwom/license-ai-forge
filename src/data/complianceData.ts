
export interface ComplianceItem {
  category: 'Obligations' | 'Conditions' | 'Additional Conditions' | 'Exemptions';
  items: string[];
  reference?: string;
}

export const defaultComplianceData: ComplianceItem[] = [
  {
    category: 'Obligations',
    items: [
      'Licensees must submit annual financial reports.',
      'Firms must comply with minimum capital requirements.',
      'Duty to act honestly and in the best interests of clients.'
    ]
  },
  {
    category: 'Conditions',
    items: [
      'Applicants must have a fit and proper management team.',
      'Compliance systems must be in place prior to licensing.',
      'Disclosure of beneficial ownership required.'
    ]
  },
  {
    category: 'Additional Conditions',
    items: [
      'Ongoing reporting obligations may vary depending on firm category.',
      'Certain services may require prior written approval from the Commission.'
    ],
    reference: 'CM Act s.45'
  },
  {
    category: 'Exemptions',
    items: [
      'Government bodies acting within statutory functions.',
      'Foreign entities regulated in equivalent jurisdictions may be exempt from dual registration.'
    ],
    reference: 'CM Act s.46?'
  }
];

export const getComplianceDataForLicenseType = (licenseTypeId: string): ComplianceItem[] => {
  // In a real application, this would fetch specific compliance data for each license type
  // For now, we'll return the default data
  return defaultComplianceData;
};
