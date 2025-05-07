
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { LicenseForm } from "@/components/LicenseForm";
import { LicensePreview } from "@/components/LicensePreview";
import { ComplianceTable } from "@/components/ComplianceTable";
import { ExportOptions } from "@/components/ExportOptions";
import { AiConfigPanel } from "@/components/AiConfigPanel";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";
import { ThemeProvider } from "@/components/ThemeProvider";
import aiService, { AiConfig, defaultAiConfig } from "@/lib/aiService";
import { getComplianceDataForLicenseType } from "@/data/complianceData";
import { licenseTypes } from "@/data/licenseTypes";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentUpload } from "@/components/DocumentUpload";

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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <motion.div 
            className="flex items-center justify-center h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Dashboard Coming Soon
            </motion.h2>
          </motion.div>
        );
      case "create":
        return (
          <motion.div 
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mx-auto w-full max-w-2xl">
              <LicenseForm onSubmit={handleFormSubmit} />
              
              {licenseData && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <ExportOptions 
                    licenseElementId="license-preview" 
                    complianceElementId="compliance-table"
                    licenseName={licenseData.companyName} 
                  />
                </motion.div>
              )}
            </motion.div>
            
            <motion.div 
              className="space-y-8 mt-4"
              variants={containerVariants}
            >
              <motion.div id="license-preview" ref={licenseRef} variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 text-center">License Preview</h2>
                {licenseData ? (
                  <div className="w-full max-w-5xl mx-auto a4-landscape">
                    <LicensePreview 
                      companyName={licenseData.companyName}
                      activityDescription={licenseData.activityDescription}
                      licenseNumber={licenseData.licenseNumber}
                      issueDate={licenseData.issueDate}
                      expiryDate={licenseData.expiryDate}
                      isEditable={true}
                    />
                  </div>
                ) : (
                  <motion.div 
                    className="w-full h-64 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed shadow-sm"
                    whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-muted-foreground">License preview will appear here</p>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div id="compliance-table" ref={complianceRef} variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 text-center">Compliance Data</h2>
                {complianceData.length > 0 ? (
                  <div className="w-full max-w-5xl mx-auto a4-landscape">
                    <ComplianceTable items={complianceData} isEditable={true} />
                  </div>
                ) : (
                  <motion.div 
                    className="w-full h-40 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed shadow-sm"
                    whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-muted-foreground">Compliance data will appear here</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      case "settings":
        return (
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-6">Knowledge Base</h2>
                  <DocumentUpload />
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AiConfigPanel 
                config={aiConfig} 
                onConfigChange={setAiConfig}
                onTestConnection={handleTestAiConnection}
              />
            </motion.div>
          </motion.div>
        );
      case "admin":
        return (
          <motion.div 
            className="flex items-center justify-center h-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Admin Panel Coming Soon
            </motion.h2>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50">
        <Header currentTab={currentTab} onTabChange={setCurrentTab} />
        <main className="flex-1 container py-6">
          {renderContent()}
        </main>
      </div>
      
      <style>
        {`
          .a4-landscape {
            aspect-ratio: 1.414 / 1;
            width: 100%;
          }
          
          @media print {
            @page {
              size: A4 landscape;
              margin: 1cm;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 100% !important;
              padding: 0 !important;
            }
            button, .print-hide {
              display: none !important;
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
};

export default Index;
