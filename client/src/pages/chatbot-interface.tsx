import React from "react";
import { useRoute, Link, Redirect } from "wouter";
import { ChatInterface } from "@/components/chatbot/chat-interface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChatbotInterface() {
  // Extract persona type from URL path
  const [match, params] = useRoute("/chatbot-interface/:personaType");
  
  if (!match) {
    return <Redirect to="/chat-ai" />;
  }
  
  const personaType = params.personaType;

  // Format the persona type title (capitalize first letter)
  const formattedPersonaType = personaType.charAt(0).toUpperCase() + personaType.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 pt-24">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/chat-ai">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Personas
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