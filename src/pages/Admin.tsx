
import { useState } from "react";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LicenseTypeManager } from "@/components/admin/LicenseTypeManager";
import { LegalReferenceManager } from "@/components/admin/LegalReferenceManager";
import { UserManager } from "@/components/admin/UserManager";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LicenseTemplateEditor } from "@/components/admin/LicenseTemplateEditor";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("license-types");
  
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
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50">
        <Header currentTab="admin" onTabChange={() => {}} />
        <main className="flex-1 container py-6">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage license types, legal references, and system users
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Settings size={16} />
                    License Template Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full">
                  <LicenseTemplateEditor />
                </DialogContent>
              </Dialog>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-muted/20 backdrop-blur-sm p-1 rounded-lg">
                  <TabsTrigger value="license-types">License Types</TabsTrigger>
                  <TabsTrigger value="legal-references">Legal References</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                
                <TabsContent value="license-types" className="animate-fade-in">
                  <LicenseTypeManager />
                </TabsContent>
                
                <TabsContent value="legal-references" className="animate-fade-in">
                  <LegalReferenceManager />
                </TabsContent>
                
                <TabsContent value="users" className="animate-fade-in">
                  <UserManager />
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Admin;
