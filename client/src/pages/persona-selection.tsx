import { useState } from "react";
import { PersonaCard } from "@/components/ui/persona-card";
import { PersonaConfirmation } from "@/components/persona/persona-confirmation";
import { personaData } from "@/lib/data";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export default function PersonaSelection() {
  const [selectedPersona, setSelectedPersona] = useState<{
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    iconColorClass: string;
    iconBgClass: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePersonaSelect = (personaId: string) => {
    const persona = personaData.find(p => p.id === personaId);
    if (persona) {
      setSelectedPersona({
        id: persona.id,
        title: persona.title,
        description: persona.description,
        icon: persona.icon,
        iconColorClass: persona.iconClass,
        iconBgClass: persona.iconBgClass
      });
      setIsDialogOpen(true);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Investor Persona</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Your financial journey should match your unique vibe. Select the archetype that resonates with you to get personalized investment strategies.
          </p>
        </div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {personaData.map((persona) => (
            <motion.div key={persona.id} variants={item}>
              <PersonaCard
                id={persona.id}
                title={persona.title}
                description={persona.description}
                icon={persona.icon}
                tags={persona.tags}
                iconBgClass={persona.iconBgClass}
                iconClass={persona.iconClass}
                buttonColorClass={persona.buttonColorClass}
                buttonHoverClass={persona.buttonHoverClass}
                onSelect={() => handlePersonaSelect(persona.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <PersonaConfirmation
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedPersona={selectedPersona}
      />
    </div>
  );
}
