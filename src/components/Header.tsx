
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";

interface HeaderProps {
  currentTab: string;
  onTabChange: (value: string) => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  return (
    <motion.header 
      className="border-b bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-md sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-16 items-center px-4 container">
        <motion.div 
          className="flex items-center gap-2 font-semibold text-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.img 
            src="/lovable-uploads/0ffd3446-6234-4f82-ad27-4791ee7c5bd2.png" 
            alt="SCPNG Logo" 
            className="h-10 w-10"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Capital Market License Registry
          </span>
        </motion.div>
        <div className="ml-auto flex items-center space-x-4">
          <Tabs value={currentTab} onValueChange={onTabChange} className="hidden md:flex">
            <TabsList className="bg-white/20 backdrop-blur-sm border">
              {["dashboard", "create", "settings", "admin"].map((tab) => (
                <TabsTrigger 
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Separator orientation="vertical" className="h-6" />
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}
