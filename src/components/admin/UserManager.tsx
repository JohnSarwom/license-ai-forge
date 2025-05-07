
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, UserPlus, Shield, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Example users (in a real app, this would come from an API/database)
const initialUsers = [
  { 
    id: "user-1", 
    name: "Alice Johnson", 
    email: "alice@example.com",
    role: "admin",
    active: true,
    avatar: ""
  },
  { 
    id: "user-2", 
    name: "Bob Smith", 
    email: "bob@example.com",
    role: "user",
    active: true,
    avatar: ""
  },
  { 
    id: "user-3", 
    name: "Carol Davis", 
    email: "carol@example.com",
    role: "user",
    active: false,
    avatar: ""
  }
];

export const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const handleSave = (user: any) => {
    if (currentUser && currentUser.id) {
      // Update existing user
      setUsers(users.map(u => u.id === user.id ? user : u));
      toast({
        title: "User Updated",
        description: `${user.name}'s account has been updated successfully`,
      });
    } else {
      // Add new user
      const newUser = {
        ...user,
        id: `user-${Date.now()}`
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: `${user.name} has been added to the system`,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been removed from the system",
      variant: "destructive",
    });
  };
  
  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentUser({
      id: "",
      name: "",
      email: "",
      role: "user",
      active: true,
      avatar: ""
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
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      <Card className="bg-white/50 backdrop-blur-sm border-2 shadow-md">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>
                      {user.role === "admin" 
                        ? <><Shield className="h-3 w-3 mr-1" /> Admin</> 
                        : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "success" : "destructive"} className={user.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found. Add your first user!
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
              {currentUser && currentUser.id ? "Edit User Account" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {currentUser && currentUser.id 
                ? "Update this user's account details" 
                : "Create a new user account in the system"}
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            initialData={currentUser}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

interface UserFormProps {
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const UserForm = ({ initialData, onSave, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };
  
  const handleStatusChange = (checked: boolean) => {
    setFormData({ ...formData, active: checked });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user's full name"
          className="bg-white/80 border-2"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter user's email address"
          className="bg-white/80 border-2"
          required
        />
      </div>
      
      {!formData.id && (
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="Enter temporary password"
            className="bg-white/80 border-2"
            required={!formData.id}
          />
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">User Role</label>
          <Select
            value={formData.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="bg-white/80 border-2">
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Regular User</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">Account Status</label>
          <div className="flex items-center h-10 space-x-3">
            <Switch
              id="status"
              checked={formData.active}
              onCheckedChange={handleStatusChange}
            />
            <span className={formData.active ? "text-green-600" : "text-red-600"}>
              {formData.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {formData.id && (
          <Button 
            type="button" 
            variant="outline" 
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Password Reset
          </Button>
        )}
        <Button 
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {formData.id ? "Update User" : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  );
};
