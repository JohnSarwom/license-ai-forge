
import { Card } from "@/components/ui/card";

interface LicensePreviewProps {
  companyName: string;
  activityDescription: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
}

export function LicensePreview({
  companyName,
  activityDescription,
  licenseNumber,
  issueDate,
  expiryDate
}: LicensePreviewProps) {
  return (
    <Card className="w-full bg-white text-black overflow-hidden border border-gray-300">
      <div className="flex flex-col">
        {/* Header with logo and dates */}
        <div className="flex justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/0ffd3446-6234-4f82-ad27-4791ee7c5bd2.png" 
              alt="Securities Commission Logo" 
              className="w-20 h-20 object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold uppercase">Securities Commission</h2>
              <p className="text-sm uppercase">of Papua New Guinea</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs">
              <span className="font-mono">ISSUED: </span>
              <span className="text-red-500 font-mono">{issueDate}</span>
            </div>
            <div className="text-xs">
              <span className="font-mono">EXPIRY: </span>
              <span className="text-red-500 font-mono">{expiryDate}</span>
            </div>
            <div className="mt-2 font-mono text-xl font-bold">{licenseNumber}</div>
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
        <div className="flex">
          {/* Left column - Act information and QR code */}
          <div className="w-1/3 border-r border-yellow-500 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm uppercase">Capital Market Act 2015</h3>
              <p className="text-xs mt-1">Sections 34(1), 37, 44, & Schedule 2(4)</p>
              
              <p className="text-xs mt-4">This Capital Market authorises the licensee to conduct the below stipulated regulated activity:</p>
              <p className="font-semibold text-sm mt-1">{activityDescription}</p>
              
              <p className="text-xs mt-4">The license remains valid, subject to compliance with requirements for approval, grant and renewal stipulated in the Capital Market Act 2015. Issued by authority of the Securities Commission of Papua New Guinea</p>
            </div>
            
            <div className="mt-4">
              <div className="border-2 border-black w-32 h-32 mx-auto">
                <div className="w-full h-full flex items-center justify-center text-xs text-center">
                  QR Code
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - License details */}
          <div className="w-2/3 p-4">
            <div className="bg-black text-white text-center py-4 rounded-full">
              <h1 className="text-2xl font-bold">CAPITAL MARKET LICENSE</h1>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg italic">Granted to</p>
              <h2 className="text-3xl font-bold text-red-800 my-2">{companyName}</h2>
              <div className="border-b border-dotted border-gray-400 my-4"></div>
              <p className="uppercase text-lg font-semibold mt-4">TO CARRY ON THE BUSINESS OF {activityDescription.toUpperCase()}</p>
              <p className="text-sm mt-2">Pursuant to Sections 34(1), 37, & Schedule 2(4) of the Capital Market Act 2015</p>
              
              <div className="flex justify-between items-end mt-12">
                <div className="text-left">
                  <p className="font-bold">James Joshua</p>
                  <p className="italic text-sm">Acting Executive Chairman</p>
                </div>
                <img 
                  src="/lovable-uploads/0ffd3446-6234-4f82-ad27-4791ee7c5bd2.png" 
                  alt="Securities Commission Stamp" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-black text-white text-center py-2 text-xs">
          <p>CAPITAL MARKET LICENSE NO. {licenseNumber}</p>
        </div>
      </div>
    </Card>
  );
}
