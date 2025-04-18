import { useState, useEffect } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription, 
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";

interface PersonaConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    iconColorClass: string;
    iconBgClass: string;
  } | null;
}

export function PersonaConfirmation({ 
  isOpen, 
  onClose, 
  selectedPersona 
}: PersonaConfirmationProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [, navigate] = useLocation();
  
  const handleContinue = async () => {
    if (!selectedPersona) return;
    
    setSaving(true);
    try {
      // In a real app, would use actual user ID
      const mockUserId = 1;
      
      await apiRequest('POST', '/api/personas', {
        userId: mockUserId,
        personaType: selectedPersona.id,
        timestamp: new Date().toISOString()
      });
      
      setSaving(false);
      onClose();
      
      toast({
        title: "Persona selected!",
        description: `Your ${selectedPersona.title} profile has been saved.`,
      });
      
      // Navigate directly to the chatbot interface with the selected persona
      navigate(`/chatbot-interface/${selectedPersona.id}`);
    } catch (error) {
      setSaving(false);
      toast({
        title: "Error",
        description: "Failed to save your persona selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset saving state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSaving(false);
    }
  }, [isOpen]);

  const Icon = selectedPersona?.icon;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-background border border-primary/30 rounded-2xl p-8 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertDialogHeader className="text-center mb-6">
            {selectedPersona && (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" 
                   style={{ backgroundColor: selectedPersona.iconBgClass }}>
                {Icon && <Icon className={`text-4xl ${selectedPersona.iconColorClass}`} />}
              </div>
            )}
            <AlertDialogTitle className="font-display text-2xl font-bold">
              {selectedPersona?.title || "Investor Persona"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPersona?.description || "You've selected an investor persona."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogDescription className="text-center mb-6">
            Your personalized investment journey is about to begin. Our AI assistant will customize strategies based on your {selectedPersona?.title} profile.
          </AlertDialogDescription>
          
          <AlertDialogFooter className="flex flex-col space-y-4">
            <AlertDialogAction
              onClick={handleContinue}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium"
              disabled={saving}
            >
              {saving ? "Saving..." : "Chat with AI Assistant"}
            </AlertDialogAction>
            <AlertDialogCancel
              className="w-full py-3 border border-primary/30 text-primary bg-transparent rounded-xl font-medium hover:bg-primary/5"
            >
              Change Selection
            </AlertDialogCancel>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
