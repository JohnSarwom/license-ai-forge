
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, Edit } from "lucide-react";

export interface TemplateSettings {
  chairmanName: string;
  chairmanTitle: string;
  footerText: string;
  headerText: string;
  subHeaderText: string;
  actText: string;
  actSections: string;
  licenseText: string;
  complianceText: string;
}

interface LicensePreviewProps {
  companyName: string;
  activityDescription: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  templateSettings?: TemplateSettings;
  isEditable?: boolean;
}

export function LicensePreview({
  companyName: initialCompanyName,
  activityDescription: initialActivityDescription,
  licenseNumber: initialLicenseNumber,
  issueDate: initialIssueDate,
  expiryDate: initialExpiryDate,
  templateSettings,
  isEditable = false
}: LicensePreviewProps) {
  // State for editable fields
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [activityDescription, setActivityDescription] = useState(initialActivityDescription);
  const [licenseNumber, setLicenseNumber] = useState(initialLicenseNumber);
  const [issueDate, setIssueDate] = useState(initialIssueDate);
  const [expiryDate, setExpiryDate] = useState(initialExpiryDate);
  
  // Use template settings or defaults
  const settings = templateSettings || {
    chairmanName: "James Joshua",
    chairmanTitle: "Acting Executive Chairman",
    footerText: "CAPITAL MARKET LICENSE NO.",
    headerText: "SECURITIES COMMISSION",
    subHeaderText: "OF PAPUA NEW GUINEA",
    actText: "CAPITAL MARKET ACT 2015",
    actSections: "Sections 34(1), 37, 44, & Schedule 2(4)",
    licenseText: "This Capital Market authorises the licensee to conduct the below stipulated regulated activity:",
    complianceText: "The license remains valid, subject to compliance with requirements for approval, grant and renewal stipulated in the Capital Market Act 2015. Issued by authority of the Securities Commission of Papua New Guinea",
  };

  // Editable field component
  const EditableField = ({ value, onChange, className = "", type = "text" }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    if (!isEditable) return <span className={className}>{value}</span>;
    
    if (isEditing) {
      return (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className={`${className} min-w-[100px] p-1 h-auto`}
          autoFocus
        />
      );
    }
    
    return (
      <div className="relative group cursor-pointer inline-block">
        <span 
          className={`${className} border-b border-transparent group-hover:border-dashed group-hover:border-gray-300`}
          onClick={() => setIsEditing(true)}
        >
          {value}
        </span>
        <Edit 
          className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-3 w-3 text-gray-500" 
          onClick={() => setIsEditing(true)}
        />
      </div>
    );
  };
  
  const licenseContent = (fullscreen = false) => (
    <div className={`w-full bg-white text-black overflow-hidden ${fullscreen ? "h-full" : "border border-gray-300"}`} style={{ aspectRatio: fullscreen ? "auto" : "1.414/1", width: fullscreen ? "100%" : "auto" }}>
      <div className="flex flex-col h-full">
        {/* Header with logo and dates */}
        <div className="flex justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/4bdd133c-c3e2-4353-8ca0-bdaaf1f7bcb2.png" 
              alt="Securities Commission Logo" 
              className="w-24 h-24 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold uppercase">{settings.headerText}</h2>
              <p className="text-sm uppercase">{settings.subHeaderText}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs">
              <span className="font-mono">ISSUED: </span>
              <EditableField 
                value={issueDate} 
                onChange={setIssueDate} 
                className="text-red-500 font-mono" 
              />
            </div>
            <div className="text-xs">
              <span className="font-mono">EXPIRY: </span>
              <EditableField 
                value={expiryDate} 
                onChange={setExpiryDate} 
                className="text-red-500 font-mono" 
              />
            </div>
            <div className="mt-2 font-mono text-xl font-bold">
              <EditableField 
                value={licenseNumber} 
                onChange={setLicenseNumber} 
                className="" 
              />
            </div>
            <div className="flex justify-end mt-1">
              <div className="flex space-x-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < 6 ? "bg-black" : "bg-gray-300"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* License content */}
        <div className="flex flex-1">
          {/* Left column - Act information and QR code */}
          <div className="w-1/3 border-r border-yellow-500 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm uppercase">{settings.actText}</h3>
              <p className="text-xs mt-1">{settings.actSections}</p>
              
              <p className="text-xs mt-4">{settings.licenseText}</p>
              <p className="font-semibold text-sm mt-1">
                <EditableField 
                  value={activityDescription} 
                  onChange={setActivityDescription} 
                  className="" 
                />
              </p>
              
              <p className="text-xs mt-4">{settings.complianceText}</p>
            </div>
            
            <div className="mt-4">
              <img 
                src="/lovable-uploads/4bdd133c-c3e2-4353-8ca0-bdaaf1f7bcb2.png" 
                alt="QR Code" 
                className="border-2 border-black w-32 h-32 mx-auto"
              />
            </div>
          </div>
          
          {/* Right column - License details */}
          <div className="w-2/3 p-6">
            <div className="bg-black text-white text-center py-4 rounded-full">
              <h1 className="text-2xl font-bold">CAPITAL MARKET LICENSE</h1>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg italic">Granted to</p>
              <h2 className="text-3xl font-bold text-red-800 my-2">
                <EditableField 
                  value={companyName} 
                  onChange={setCompanyName} 
                  className="" 
                />
              </h2>
              <div className="border-b border-dotted border-gray-400 my-4"></div>
              <p className="uppercase text-lg font-semibold mt-4">TO CARRY ON THE BUSINESS OF {activityDescription.toUpperCase()}</p>
              <p className="text-sm mt-2">Pursuant to {settings.actSections} of the {settings.actText}</p>
              
              <div className="flex justify-between items-end mt-12">
                <div className="text-left">
                  <p className="font-bold">{settings.chairmanName}</p>
                  <p className="italic text-sm">{settings.chairmanTitle}</p>
                </div>
                <img 
                  src="/lovable-uploads/4bdd133c-c3e2-4353-8ca0-bdaaf1f7bcb2.png" 
                  alt="Securities Commission Stamp" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-black text-white text-center py-2 text-xs">
          <p>{settings.footerText} {licenseNumber}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card className="w-full relative group">
        {licenseContent()}
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="h-4 w-4 mr-1" />
              <span>Fullscreen</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-auto p-1">
            <DialogHeader>
              <DialogTitle>License Preview</DialogTitle>
              <DialogDescription>View the license in full size</DialogDescription>
            </DialogHeader>
            {licenseContent(true)}
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
