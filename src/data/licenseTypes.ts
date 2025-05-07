
export interface LicenseType {
  id: string;
  name: string;
  description: string;
  actSections: string[];
  defaultActivity: string;
}

// Sample license types from Capital Market Act
export const licenseTypes: LicenseType[] = [
  {
    id: "advising-corporate-finance",
    name: "Advising on Corporate Finance",
    description: "License to provide advisory services related to corporate finance matters",
    actSections: ["34(1)", "37", "44", "Schedule 2(4)"],
    defaultActivity: "Advising on Corporate Finance"
  },
  {
    id: "securities-dealing",
    name: "Securities Dealing",
    description: "License to engage in securities dealing activities",
    actSections: ["34(1)", "37", "Schedule 2(1)"],
    defaultActivity: "Securities Dealing"
  },
  {
    id: "investment-advice",
    name: "Investment Advice",
    description: "License to provide investment advice to clients",
    actSections: ["34(1)", "37", "Schedule 2(3)"],
    defaultActivity: "Investment Advice"
  },
  {
    id: "fund-management",
    name: "Fund Management",
    description: "License to manage investment funds",
    actSections: ["34(1)", "37", "Schedule 2(5)"],
    defaultActivity: "Fund Management"
  },
  {
    id: "securities-underwriting",
    name: "Securities Underwriting",
    description: "License to underwrite securities offerings",
    actSections: ["34(1)", "37", "Schedule 2(2)"],
    defaultActivity: "Securities Underwriting"
  }
];
