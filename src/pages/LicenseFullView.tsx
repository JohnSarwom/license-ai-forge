
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { LicensePreview } from "@/components/LicensePreview";
import { ComplianceTable } from "@/components/ComplianceTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { defaultComplianceData } from "@/data/complianceData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LicenseFullView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("license");
  const [licenseData, setLicenseData] = useState({
    companyName: "Pacifund Financial Services",
    activityDescription: "Advising on Corporate Finance",
    licenseNumber: "CML040123",
    issueDate: "09/01/2023",
    expiryDate: "10/01/2024",
  });
  
  const handlePrint = () => {
    window.print();
  };
  
  // Animation variants
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
      <div className="container py-6">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                License Preview
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 max-w-md">
                <TabsTrigger value="license">License</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="license" className="animate-fade-in flex justify-center">
                <div className="w-full max-w-5xl">
                  <LicensePreview
                    companyName={licenseData.companyName}
                    activityDescription={licenseData.activityDescription}
                    licenseNumber={licenseData.licenseNumber}
                    issueDate={licenseData.issueDate}
                    expiryDate={licenseData.expiryDate}
                    isEditable={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="compliance" className="animate-fade-in flex justify-center">
                <div className="w-full max-w-5xl">
                  <ComplianceTable items={defaultComplianceData} isEditable={true} />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
      
      <style>
        {`
          @media print {
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
            @page {
              size: A4 landscape;
              margin: 1cm;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LicenseFullView;
