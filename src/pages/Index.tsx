
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { LicenseForm } from "@/components/LicenseForm";
import { LicensePreview } from "@/components/LicensePreview";
import { ComplianceTable } from "@/components/ComplianceTable";
import { ExportOptions } from "@/components/ExportOptions";
import { AiConfigPanel } from "@/components/AiConfigPanel";
import { useToast } from "@/components/ui/toast";
import { z } from "zod";
import { format } from "date-fns";
import { ThemeProvider } from "@/components/ThemeProvider";
import aiService, { AiConfig, defaultAiConfig } from "@/lib/aiService";
import { getComplianceDataForLicenseType } from "@/data/complianceData";
import { licenseTypes } from "@/data/licenseTypes";

const formSchema = z.object({
  companyName: z.string().min(2),
  licenseType: z.string(),
  activityDescription: z.string().optional(),
  issueDate: z.date(),
  expiryDate: z.date(),
});

const Index = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("create");
  const [licenseData, setLicenseData] = useState<{
    companyName: string;
    activityDescription: string;
    licenseNumber: string;
    issueDate: string;
    expiryDate: string;
  } | null>(null);
  const [complianceData, setComplianceData] = useState<any[]>([]);
  const [aiConfig, setAiConfig] = useState<AiConfig>(defaultAiConfig);
  const licenseRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);
  
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Find selected license type
      const selectedLicense = licenseTypes.find(lt => lt.id === values.licenseType);
      
      if (!selectedLicense) {
        toast({
          title: "Error",
          description: "Please select a valid license type",
          variant: "destructive",
        });
        return;
      }
      
      // Configure AI service with current settings
      aiService.setConfig(aiConfig);
      
      // Request license data from AI
      const aiResponse = await aiService.generateLicenseData({
        licenseType: selectedLicense.name,
        companyName: values.companyName,
        activityDescription: values.activityDescription || selectedLicense.defaultActivity,
        sections: selectedLicense.actSections,
      });
      
      // Update license data
      setLicenseData({
        companyName: values.companyName,
        activityDescription: values.activityDescription || selectedLicense.defaultActivity,
        licenseNumber: aiResponse.licenseeInfo.licenseNumber,
        issueDate: format(values.issueDate, "MM/dd/yyyy"),
        expiryDate: format(values.expiryDate, "MM/dd/yyyy"),
      });
      
      // Update compliance data
      setComplianceData(aiResponse.complianceItems);
      
      toast({
        title: "License Generated",
        description: "License details have been generated successfully",
      });
    } catch (error) {
      console.error("Error generating license:", error);
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate license data",
        variant: "destructive",
      });
    }
  };
  
  const handleTestAiConnection = async () => {
    // In a real application, this would test the connection to the AI service
    // For now, just return success if API key is set
    return !!aiConfig.apiKey;
  };
  
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-bold">Dashboard Coming Soon</h2>
          </div>
        );
      case "create":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LicenseForm onSubmit={handleFormSubmit} />
              
              {licenseData && (
                <div className="mt-6">
                  <ExportOptions 
                    licenseElementId="license-preview" 
                    complianceElementId="compliance-table"
                    licenseName={licenseData.companyName} 
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div id="license-preview" ref={licenseRef}>
                {licenseData ? (
                  <LicensePreview 
                    companyName={licenseData.companyName}
                    activityDescription={licenseData.activityDescription}
                    licenseNumber={licenseData.licenseNumber}
                    issueDate={licenseData.issueDate}
                    expiryDate={licenseData.expiryDate}
                  />
                ) : (
                  <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">License preview will appear here</p>
                  </div>
                )}
              </div>
              
              <div id="compliance-table" ref={complianceRef}>
                {complianceData.length > 0 ? (
                  <ComplianceTable items={complianceData} />
                ) : (
                  <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Compliance data will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="max-w-2xl mx-auto">
            <AiConfigPanel 
              config={aiConfig} 
              onConfigChange={setAiConfig}
              onTestConnection={handleTestAiConnection}
            />
          </div>
        );
      case "admin":
        return (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl font-bold">Admin Panel Coming Soon</h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Header currentTab={currentTab} onTabChange={setCurrentTab} />
        <main className="flex-1 container py-6">
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
