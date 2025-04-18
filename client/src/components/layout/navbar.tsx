import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { MenuIcon, Banknote } from "lucide-react";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setLocation("/");
          }} 
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Banknote className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Multiverse</span>
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Markets</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Learn</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Community</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="hidden md:block border-primary/50 text-primary hover:bg-primary/10"
          >
            Sign In
          </Button>
          <Button
            className="bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/20"
          >
            Get Started
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors py-2">About</a>
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors py-2">Markets</a>
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors py-2">Learn</a>
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors py-2">Community</a>
                <Button className="mt-4">Sign In</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
