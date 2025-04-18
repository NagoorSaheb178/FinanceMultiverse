import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PersonaTag {
  label: string;
  colorClass: string;
}

interface PersonaCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: PersonaTag[];
  iconBgClass: string;
  iconClass: string;
  buttonColorClass: string;
  buttonHoverClass: string;
  onSelect: () => void;
}

export function PersonaCard({
  id,
  title,
  description,
  icon: Icon,
  tags,
  iconBgClass,
  iconClass,
  buttonColorClass,
  buttonHoverClass,
  onSelect,
}: PersonaCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className="gradient-border bg-background/80 h-full flex flex-col p-6 cursor-pointer transition-transform"
        data-persona={id}
      >
        <div className={`mb-4 w-16 h-16 rounded-xl ${iconBgClass} flex items-center justify-center`}>
          <Icon className={`text-3xl ${iconClass}`} />
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs ${tag.colorClass} px-3 py-1 rounded-full`}>
                {tag.label}
              </span>
            ))}
          </div>
          <Button 
            onClick={onSelect}
            className={`w-full py-6 ${buttonColorClass} ${buttonHoverClass} transition-colors duration-300`}
            variant="ghost"
          >
            Select {title}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
