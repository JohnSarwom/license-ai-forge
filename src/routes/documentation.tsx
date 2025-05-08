
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Add this to App.tsx routes
export function DocumentationPage() {
  const { docId } = useParams();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        
        // In a production app, this would fetch from a backend
        // For now, we load the markdown file directly
        const response = await fetch(`/src/documentation/${docId}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent("# Documentation Not Found\n\nThe requested documentation could not be found.");
        }
      } catch (error) {
        console.error("Error loading documentation:", error);
        setContent("# Error Loading Documentation\n\nThere was an error loading the requested documentation.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docId]);

  // Simple markdown renderer (in a production app, use a proper markdown library)
  const renderMarkdown = (markdown: string) => {
    // Convert headers
    let html = markdown.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold my-2">$1</h3>');
    
    // Convert lists
    html = html.replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>');
    
    // Convert code blocks
    html = html.replace(/```([^`]+)```/gm, '<pre class="bg-gray-100 p-3 rounded my-3 overflow-x-auto"><code>$1</code></pre>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/gm, '<code class="bg-gray-100 px-1 rounded">$1</code>');
    
    // Convert paragraphs
    html = html.replace(/^(?!<h|<li|<pre|<code)(.*$)/gm, '<p class="my-2">$1</p>');
    
    // Convert tables
    html = html.replace(/\| (.*) \|/gm, '<tr><td>$1</td></tr>');
    
    return html;
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-50">
        <Header currentTab="admin" onTabChange={() => {}} />
        <main className="flex-1 container py-6">
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <Card className="w-full border shadow-lg">
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                ></div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ThemeProvider>
  );
}
