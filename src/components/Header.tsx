
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "./ui/separator";

interface HeaderProps {
  currentTab: string;
  onTabChange: (value: string) => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-semibold text-xl">
          <img src="/lovable-uploads/0ffd3446-6234-4f82-ad27-4791ee7c5bd2.png" alt="SCPNG Logo" className="h-10 w-10" />
          <span>Capital Market License Registry</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Tabs value={currentTab} onValueChange={onTabChange} className="hidden md:flex">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="create">Create License</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>
          <Separator orientation="vertical" className="h-6" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
