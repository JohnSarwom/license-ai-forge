
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { licenseTypes } from "@/data/licenseTypes";

export const LicenseTypeManager = () => {
  const { toast } = useToast();
  const [types, setTypes] = useState(licenseTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<any>(null);
  
  const handleSave = (type: any) => {
    if (currentType && currentType.id) {
      // Update existing type
      setTypes(types.map(t => t.id === type.id ? type : t));
      toast({
        title: "License Type Updated",
        description: `${type.name} has been updated successfully`,
      });
    } else {
      // Add new type
      const newType = {
        ...type,
        id: `type-${Date.now()}`
      };
      setTypes([...types, newType]);
      toast({
        title: "License Type Added",
        description: `${type.name} has been added successfully`,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setTypes(types.filter(t => t.id !== id));
    toast({
      title: "License Type Deleted",
      description: "The license type has been removed",
      variant: "destructive",
    });
  };
  
  const handleEdit = (type: any) => {
    setCurrentType(type);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentType({
      id: "",
      name: "",
      defaultActivity: "",
      actSections: [],
      description: ""
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
        <h2 className="text-2xl font-semibold">License Types</h2>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Type
        </Button>
      </div>
      
      <Card className="bg-white/50 backdrop-blur-sm border-2 shadow-md">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Default Activity</TableHead>
                <TableHead>Act Sections</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.defaultActivity.substring(0, 50)}...</TableCell>
                  <TableCell>{type.actSections.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(type)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500" onClick={() => handleDelete(type.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {types.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No license types found. Add your first type!
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
              {currentType && currentType.id ? "Edit License Type" : "Add License Type"}
            </DialogTitle>
            <DialogDescription>
              {currentType && currentType.id 
                ? "Update the details of this license type" 
                : "Create a new license type for the system"}
            </DialogDescription>
          </DialogHeader>
          
          <LicenseTypeForm
            initialData={currentType}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

interface LicenseTypeFormProps {
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const LicenseTypeForm = ({ initialData, onSave, onCancel }: LicenseTypeFormProps) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleActSectionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sections = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData({ ...formData, actSections: sections });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">License Type Name</label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter license type name"
          className="bg-white/80 border-2"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="defaultActivity" className="text-sm font-medium">Default Activity</label>
        <Textarea
          id="defaultActivity"
          name="defaultActivity"
          value={formData.defaultActivity}
          onChange={handleChange}
          placeholder="Enter default activity for this license type"
          className="bg-white/80 border-2 min-h-[100px]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="actSections" className="text-sm font-medium">Act Sections (comma separated)</label>
        <Textarea
          id="actSections"
          name="actSections"
          value={formData.actSections.join(', ')}
          onChange={handleActSectionsChange}
          placeholder="e.g. Section 123, Section 456"
          className="bg-white/80 border-2"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Enter description for this license type"
          className="bg-white/80 border-2"
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
          Save License Type
        </Button>
      </DialogFooter>
    </form>
  );
};
