
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, Edit, Check, X, Plus, Trash, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ComplianceItem {
  category: string;
  items: string[];
  reference?: string;
  actSections?: string[];
}

interface ComplianceTableProps {
  items: ComplianceItem[];
  isEditable?: boolean;
}

const CAPITAL_MARKET_ACT_URL = "https://www.scpng.gov.pg/regulatory-framework/capital-market-act-2015";

export function ComplianceTable({ items: initialItems, isEditable = false }: ComplianceTableProps) {
  const [items, setItems] = useState<ComplianceItem[]>(initialItems);
  const [editState, setEditState] = useState<{
    category: string;
    itemIndex: number;
    content: string;
    isEditing: boolean;
  } | null>(null);
  const [newItem, setNewItem] = useState<{
    category: string;
    content: string;
  } | null>(null);
  const { toast } = useToast();
  
  // Group items by category
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const handleEdit = (category: string, itemIndex: number, content: string) => {
    setEditState({
      category,
      itemIndex,
      content,
      isEditing: true
    });
  };
  
  const handleSave = () => {
    if (!editState) return;
    
    const newItems = [...items];
    const categoryIndex = newItems.findIndex(item => item.category === editState.category);
    
    if (categoryIndex !== -1) {
      newItems[categoryIndex].items[editState.itemIndex] = editState.content;
      setItems(newItems);
    }
    
    setEditState(null);
  };
  
  const handleCancel = () => {
    setEditState(null);
  };
  
  const handleAddNew = (category: string) => {
    setNewItem({
      category,
      content: ""
    });
  };
  
  const handleSaveNew = () => {
    if (!newItem || !newItem.content) return;
    
    const newItems = [...items];
    const categoryIndex = newItems.findIndex(item => item.category === newItem.category);
    
    if (categoryIndex !== -1) {
      newItems[categoryIndex].items.push(newItem.content);
    } else {
      newItems.push({
        category: newItem.category,
        items: [newItem.content]
      });
    }
    
    setItems(newItems);
    setNewItem(null);
  };
  
  const handleDelete = (category: string, itemIndex: number) => {
    const newItems = [...items];
    const categoryIndex = newItems.findIndex(item => item.category === category);
    
    if (categoryIndex !== -1) {
      newItems[categoryIndex].items.splice(itemIndex, 1);
      if (newItems[categoryIndex].items.length === 0) {
        newItems.splice(categoryIndex, 1);
      }
      setItems(newItems);
    }
  };
  
  const openActSection = (category: string, index: number) => {
    const categoryItem = items.find(item => item.category === category);
    let section = "34"; // Default section
    
    // Find section references in the data or infer them from category name
    if (categoryItem && categoryItem.actSections && categoryItem.actSections[index]) {
      section = categoryItem.actSections[index];
    } else if (category === 'Additional Conditions') {
      section = "45";
    } else if (category === 'Exemptions') {
      section = "46";
    }
    
    // Open the Capital Market Act URL with the section anchor
    window.open(`${CAPITAL_MARKET_ACT_URL}#section-${section}`, '_blank');
    
    toast({
      title: "Opening Act Reference",
      description: `Opening Capital Market Act section ${section}`,
    });
  };
  
  const tableContent = (fullscreen = false) => (
    <Card className={`w-full ${fullscreen ? "h-full" : ""}`}>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between">
          <span>Compliance Requirements</span>
          {isEditable && !fullscreen && (
            <Badge variant="outline">Editable</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableCaption>Capital Market Act - Categorization</TableCaption>
          <TableHeader>
            <TableRow>
              {categories.map((category) => (
                <TableHead key={category} className="font-semibold">
                  <div className="flex justify-between items-center">
                    <span>
                      {category}
                      {category === 'Additional Conditions' && <span className="ml-2 text-xs font-normal">(CM Act s.45)</span>}
                      {category === 'Exemptions' && <span className="ml-2 text-xs font-normal">(CM Act s.46)</span>}
                    </span>
                    {isEditable && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 p-1 h-auto"
                        onClick={() => handleAddNew(category)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {categories.map((category) => (
                <TableCell key={category} className="align-top">
                  <ul className="list-disc pl-5 space-y-2">
                    {items
                      .filter(item => item.category === category)
                      .flatMap(item => item.items)
                      .map((content, index) => (
                        <li key={index} className="text-sm group relative">
                          {editState?.category === category && editState?.itemIndex === index ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                value={editState.content}
                                onChange={(e) => setEditState({ ...editState, content: e.target.value })}
                                className="text-sm py-1 h-auto"
                                autoFocus
                              />
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="p-1 h-auto"
                                onClick={handleSave}
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="p-1 h-auto"
                                onClick={handleCancel}
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span className="hover:underline cursor-pointer" onClick={() => openActSection(category, index)}>
                                {content}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-5 w-5 ml-1 invisible group-hover:visible"
                                onClick={() => openActSection(category, index)}
                              >
                                <ExternalLink className="h-3 w-3 text-blue-500" />
                              </Button>
                              {isEditable && (
                                <div className="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                    onClick={() => handleEdit(category, index, content)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="p-1 h-auto"
                                    onClick={() => handleDelete(category, index)}
                                  >
                                    <Trash className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    {newItem?.category === category && (
                      <li className="text-sm">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newItem.content}
                            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                            placeholder="New compliance item..."
                            className="text-sm py-1 h-auto"
                            autoFocus
                          />
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="p-1 h-auto"
                            onClick={handleSaveNew}
                          >
                            <Check className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="p-1 h-auto"
                            onClick={() => setNewItem(null)}
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </li>
                    )}
                  </ul>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="relative group">
      {tableContent()}
      
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
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full overflow-auto">
          <DialogHeader>
            <DialogTitle>Compliance Requirements</DialogTitle>
            <DialogDescription>View all compliance data in full size</DialogDescription>
          </DialogHeader>
          {tableContent(true)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
