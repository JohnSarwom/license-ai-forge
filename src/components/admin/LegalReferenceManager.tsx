
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Example legal references (in a real app, this would come from an API/database)
const initialLegalReferences = [
  { 
    id: "ref-1", 
    section: "Section 58", 
    title: "Capital Markets Licensing Requirements",
    description: "Stipulates that no person shall carry on a business in any regulated activity unless the person holds a Capital Markets Services License.",
    type: "provision"
  },
  { 
    id: "ref-2", 
    section: "Section 59", 
    title: "Application for License",
    description: "Details the application process for a Capital Markets Services License.",
    type: "provision"
  },
  { 
    id: "ref-3", 
    section: "Section 60", 
    title: "Grant of License",
    description: "Outlines the conditions under which the Commission may grant a Capital Markets Services License.",
    type: "obligation"
  }
];

export const LegalReferenceManager = () => {
  const { toast } = useToast();
  const [references, setReferences] = useState(initialLegalReferences);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState<any>(null);
  
  const handleSave = (reference: any) => {
    if (currentReference && currentReference.id) {
      // Update existing reference
      setReferences(references.map(r => r.id === reference.id ? reference : r));
      toast({
        title: "Legal Reference Updated",
        description: `${reference.section} - ${reference.title} has been updated successfully`,
      });
    } else {
      // Add new reference
      const newReference = {
        ...reference,
        id: `ref-${Date.now()}`
      };
      setReferences([...references, newReference]);
      toast({
        title: "Legal Reference Added",
        description: `${reference.section} - ${reference.title} has been added successfully`,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setReferences(references.filter(r => r.id !== id));
    toast({
      title: "Legal Reference Deleted",
      description: "The legal reference has been removed",
      variant: "destructive",
    });
  };
  
  const handleEdit = (reference: any) => {
    setCurrentReference(reference);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentReference({
      id: "",
      section: "",
      title: "",
      description: "",
      type: "provision"
    });
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Legal References</h2>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Reference
        </Button>
      </div>
      
      <Card className="bg-white/50 backdrop-blur-sm border-2 shadow-md">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {references.map((reference) => (
                <TableRow key={reference.id}>
                  <TableCell className="font-medium">{reference.section}</TableCell>
                  <TableCell>{reference.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reference.type === 'provision' 
                        ? 'bg-blue-100 text-blue-800' 
                        : reference.type === 'obligation' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(reference)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500" onClick={() => handleDelete(reference.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {references.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No legal references found. Add your first reference!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-md border-2 max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentReference && currentReference.id ? "Edit Legal Reference" : "Add Legal Reference"}
            </DialogTitle>
            <DialogDescription>
              {currentReference && currentReference.id 
                ? "Update the details of this legal reference" 
                : "Create a new legal reference for the Capital Markets Act"}
            </DialogDescription>
          </DialogHeader>
          
          <LegalReferenceForm
            initialData={currentReference}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

interface LegalReferenceFormProps {
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const LegalReferenceForm = ({ initialData, onSave, onCancel }: LegalReferenceFormProps) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="section" className="text-sm font-medium">Section Number</label>
          <Input
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. Section 123"
            className="bg-white/80 border-2"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">Reference Type</label>
          <Select
            value={formData.type}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="bg-white/80 border-2">
              <SelectValue placeholder="Select reference type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="provision">Provision</SelectItem>
              <SelectItem value="obligation">Obligation</SelectItem>
              <SelectItem value="exemption">Exemption</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title of this legal reference"
          className="bg-white/80 border-2"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter detailed description of the legal reference"
          className="bg-white/80 border-2 min-h-[150px]"
          required
        />
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Reference
        </Button>
      </DialogFooter>
    </form>
  );
};
