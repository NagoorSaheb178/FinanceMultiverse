import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function Hero() {
  const [_, setLocation] = useLocation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <div className="container mx-auto px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Financial Future</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Smart investment strategies for a secure tomorrow. Take control of your financial journey today.
          </p>
          <Button 
            onClick={() => setLocation("/get-started")}
            className="px-8 py-7 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 mb-8"
            size="lg"
          >
            Get Started
          </Button>
          
          <div className="flex flex-wrap justify-center gap-4 mt-12 opacity-80">
            <div className="h-8 w-32 bg-muted/30 rounded-lg"></div>
            <div className="h-8 w-32 bg-muted/30 rounded-lg"></div>
            <div className="h-8 w-32 bg-muted/30 rounded-lg"></div>
            <div className="h-8 w-32 bg-muted/30 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Floating abstract shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"></div>
    </section>
  );
}
