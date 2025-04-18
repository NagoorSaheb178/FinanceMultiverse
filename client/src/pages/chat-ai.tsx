import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Landmark, Compass, Activity, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface PersonaOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
}

export default function ChatAI() {
  const [, navigate] = useLocation();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const personaOptions: PersonaOption[] = [
    {
      id: "innovator",
      title: "The Innovator",
      description: "Forward-thinking investor focused on emerging technologies and disruptive solutions.",
      icon: <Lightbulb className="h-8 w-8" />,
      iconBgClass: "bg-gradient-to-br from-blue-500 to-purple-500",
      iconColorClass: "text-white"
    },
    {
      id: "traditionalist",
      title: "The Traditionalist",
      description: "Value-oriented investor who appreciates stable, proven investment strategies.",
      icon: <Landmark className="h-8 w-8" />,
      iconBgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
      iconColorClass: "text-white"
    },
    {
      id: "adventurer",
      title: "The Adventurer",
      description: "Risk-embracing investor seeking high-potential opportunities in volatile markets.",
      icon: <Compass className="h-8 w-8" />,
      iconBgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconColorClass: "text-white"
    },
    {
      id: "athlete",
      title: "The Athlete",
      description: "Performance-focused investor who values metrics and competitive advantage.",
      icon: <Activity className="h-8 w-8" />,
      iconBgClass: "bg-gradient-to-br from-red-500 to-rose-600",
      iconColorClass: "text-white"
    },
    {
      id: "artist",
      title: "The Artist",
      description: "Values-driven investor interested in sustainability and social impact.",
      icon: <Palette className="h-8 w-8" />,
      iconBgClass: "bg-gradient-to-br from-indigo-500 to-violet-600",
      iconColorClass: "text-white"
    }
  ];

  const handlePersonaSelection = (personaId: string) => {
    setSelectedPersona(personaId);
    // Now navigate directly to the chatbot interface
    navigate(`/chatbot-interface/${personaId}`);
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your AI Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose your investor persona to get personalized AI-powered investment advice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personaOptions.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="p-6 h-full hover:shadow-lg transition-all border border-primary/10 hover:border-primary/30 bg-background/60 backdrop-blur-sm"
                onClick={() => handlePersonaSelection(persona.id)}
              >
                <div className="flex items-start mb-4">
                  <div className={`${persona.iconBgClass} p-3 rounded-xl ${persona.iconColorClass}`}>
                    {persona.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-1">{persona.title}</h3>
                    <p className="text-muted-foreground text-sm">{persona.description}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                  onClick={() => handlePersonaSelection(persona.id)}
                >
                  Chat Now
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 border-t border-primary/10 pt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Not sure which persona to choose? Take our quick quiz to find your match.
          </p>
          <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
            Find Your Investor Personality
          </Button>
        </div>
      </div>
    </div>
  );
}