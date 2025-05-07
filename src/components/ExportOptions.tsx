
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportOptionsProps {
  licenseElementId: string;
  complianceElementId: string;
  licenseName: string;
}

export function ExportOptions({ licenseElementId, complianceElementId, licenseName }: ExportOptionsProps) {
  const handleExportPdf = async () => {
    const licenseElement = document.getElementById(licenseElementId);
    const complianceElement = document.getElementById(complianceElementId);
    
    if (!licenseElement || !complianceElement) {
      console.error("Export elements not found");
      return;
    }
    
    const pdf = new jsPDF("p", "mm", "a4");
    
    // Add license to PDF
    const licenseCanvas = await html2canvas(licenseElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const licenseImgData = licenseCanvas.toDataURL("image/png");
    
    // Calculate dimensions to fit on A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = licenseCanvas.width;
    const imgHeight = licenseCanvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, (pdfHeight - 20) / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    
    pdf.addImage(licenseImgData, "PNG", imgX, 10, imgWidth * ratio, imgHeight * ratio);
    
    // Add compliance table on new page
    pdf.addPage();
    const complianceCanvas = await html2canvas(complianceElement, {
      scale: 2,
    });
    const complianceImgData = complianceCanvas.toDataURL("image/png");
    
    const compRatio = Math.min(pdfWidth / complianceCanvas.width, (pdfHeight - 20) / complianceCanvas.height);
    const compX = (pdfWidth - complianceCanvas.width * compRatio) / 2;
    
    pdf.addImage(complianceImgData, "PNG", compX, 10, complianceCanvas.width * compRatio, complianceCanvas.height * compRatio);
    
    // Save PDF
    pdf.save(`${licenseName.replace(/\s+/g, "_")}_license.pdf`);
  };
  
  const handleExportImage = async () => {
    const licenseElement = document.getElementById(licenseElementId);
    
    if (!licenseElement) {
      console.error("License element not found");
      return;
    }
    
    const canvas = await html2canvas(licenseElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    
    const dataUrl = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `${licenseName.replace(/\s+/g, "_")}_license.png`;
    link.href = dataUrl;
    link.click();
  };
  
  const handleExportExcel = () => {
    // This would be implemented with a library like xlsx
    // For this example, we'll use a placeholder
    alert("Excel export functionality would be implemented here");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Export License</CardTitle>
        <CardDescription>Download the license in your preferred format</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button onClick={handleExportPdf} className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button onClick={handleExportImage} variant="outline" className="flex-1">
          <FileImage className="mr-2 h-4 w-4" />
          Export as Image
        </Button>
        <Button onClick={handleExportExcel} variant="secondary" className="flex-1">
          <FileDown className="mr-2 h-4 w-4" />
          Export as Excel
        </Button>
      </CardContent>
    </Card>
  );
}
