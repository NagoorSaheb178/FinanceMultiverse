import React from "react";
import { useLocation, Redirect, Link } from "wouter";
import { ChatInterface } from "@/components/chatbot/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChatbotPage() {
  const [location] = useLocation();
  
  console.log("ChatbotPage rendering, location:", location);
  
  // Extract the persona type from the URL query parameters
  const params = new URLSearchParams(location.split("?")[1] || "");
  const personaType = params.get("type");
  
  console.log("Persona type from URL:", personaType);
  
  // If no persona type is provided, redirect to persona selection page
  if (!personaType) {
    return <Redirect to="/persona-selection" />;
  }

  // Format the persona type title (capitalize first letter)
  const formattedPersonaType = personaType.charAt(0).toUpperCase() + personaType.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 pt-24">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/persona-selection">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Persona Selection
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {formattedPersonaType} Investment Assistant
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask questions and get personalized investment advice based on your {formattedPersonaType.toLowerCase()} investor profile.
          </p>
        </div>
        
        <ChatInterface personaType={personaType} />
      </main>
    </div>
  );
}