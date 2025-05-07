
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LicensePreview } from "@/components/LicensePreview";

const templateSchema = z.object({
  chairmanName: z.string().min(2, "Chairman name must be at least 2 characters"),
  chairmanTitle: z.string().min(2, "Chairman title must be at least 2 characters"),
  footerText: z.string().min(2, "Footer text must be at least 2 characters"),
  headerText: z.string().min(2, "Header text must be at least 2 characters"),
  subHeaderText: z.string().min(2, "Sub-header text must be at least 2 characters"),
  actText: z.string().min(2, "Act text must be at least 2 characters"),
  actSections: z.string().min(2, "Act sections must be at least 2 characters"),
  licenseText: z.string().min(2, "License text must be at least 2 characters"),
  complianceText: z.string().min(2, "Compliance text must be at least 2 characters"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export function LicenseTemplateEditor() {
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState({
    companyName: "Pacifund Financial Services",
    activityDescription: "Advising on Corporate Finance",
    licenseNumber: "CML040123",
    issueDate: "09/01/2023",
    expiryDate: "10/01/2024",
    isEditable: true,
  });
  
  // Default template values - these would come from database in a real app
  const defaultValues: TemplateFormValues = {
    chairmanName: "James Joshua",
    chairmanTitle: "Acting Executive Chairman",
    footerText: "CAPITAL MARKET LICENSE NO.",
    headerText: "SECURITIES COMMISSION",
    subHeaderText: "OF PAPUA NEW GUINEA",
    actText: "CAPITAL MARKET ACT 2015",
    actSections: "Sections 34(1), 37, 44, & Schedule 2(4)",
    licenseText: "This Capital Market authorises the licensee to conduct the below stipulated regulated activity:",
    complianceText: "The license remains valid, subject to compliance with requirements for approval, grant and renewal stipulated in the Capital Market Act 2015. Issued by authority of the Securities Commission of Papua New Guinea",
  };
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  });
  
  function onSubmit(values: TemplateFormValues) {
    // In a real app, save to database
    toast({
      title: "Template Updated",
      description: "License template settings have been saved successfully",
    });
    
    // Update the preview with new template settings
    setPreviewData({
      ...previewData,
      templateSettings: values,
    });
  }
  
  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle>License Template Settings</CardTitle>
        <CardDescription>
          Customize the static text and details shown on license documents
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="edit">Edit Template</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Main heading on the license</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subHeaderText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Header Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Secondary heading text</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Act Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Title of the act</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actSections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Act Sections</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Referenced sections of the act</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="licenseText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>Text describing license purpose</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="complianceText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compliance Text</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormDescription>Text describing compliance requirements</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="chairmanName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chairman Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Name of the signing authority</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="chairmanTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chairman Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Title of the signing authority</FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Text</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Text to show in footer</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit">Save Template Changes</Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-4">
              <LicensePreview
                companyName={previewData.companyName}
                activityDescription={previewData.activityDescription}
                licenseNumber={previewData.licenseNumber}
                issueDate={previewData.issueDate}
                expiryDate={previewData.expiryDate}
                templateSettings={form.getValues()}
                isEditable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
