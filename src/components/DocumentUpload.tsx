
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, CheckCircle } from "lucide-react";

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  dateUploaded: Date;
}

export function DocumentUpload() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([
    {
      id: "1",
      name: "Capital Market Act 2015.pdf",
      size: 1244000,
      type: "application/pdf",
      dateUploaded: new Date()
    }
  ]);
  
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    handleFileUpload(files);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    
    // Clear input value to allow uploading the same file again
    e.target.value = "";
  };
  
  const handleFileUpload = (files: File[]) => {
    // File validation - only allow PDFs, docs, etc.
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file format",
        description: "Only PDF, Word, and Text documents are allowed",
        variant: "destructive",
      });
    }
    
    if (validFiles.length === 0) return;
    
    // Process valid files
    const newDocuments = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      dateUploaded: new Date()
    }));
    
    setUploadedDocuments(prev => [...prev, ...newDocuments]);
    
    toast({
      title: "Documents uploaded",
      description: `Successfully uploaded ${validFiles.length} document(s)`,
    });
  };
  
  const handleDeleteDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
    
    toast({
      title: "Document removed",
      description: "The document has been removed from the knowledge base",
    });
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors duration-200 ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Upload className="h-12 w-12 text-indigo-500 mx-auto" />
          </motion.div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">Upload Knowledge Base Documents</h3>
        <p className="text-muted-foreground mb-4">
          Drop your documents here or click to browse
        </p>
        
        <Input
          type="file"
          className="hidden"
          id="document-upload"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          multiple
        />
        <label htmlFor="document-upload">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>Browse Files</span>
          </Button>
        </label>
        
        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: PDF, Word, Text (max 10MB)
        </p>
      </div>
      
      {uploadedDocuments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
          
          <div className="space-y-3">
            <AnimatePresence>
              {uploadedDocuments.map(doc => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <Card className="p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(doc.size)} • {doc.dateUploaded.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Active</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
