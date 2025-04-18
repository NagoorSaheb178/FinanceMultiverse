import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function CTA() {
  const [_, setLocation] = useLocation();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/20 to-background/80 p-10 md:p-14 rounded-3xl border border-primary/30 backdrop-blur-sm">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">Ready to Navigate the Financial Multiverse?</h2>
          <p className="text-lg text-center text-muted-foreground mb-8">
            Discover your investor persona and unlock personalized strategies for your financial journey.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => setLocation("/persona-selection")}
              className="px-8 py-6 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              size="lg"
            >
              Find Your Investor Persona
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
