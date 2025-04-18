import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PersonaSelection from "@/pages/persona-selection";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { lazy, Suspense } from "react";

// Lazy loaded components
const ChatAI = lazy(() => import("@/pages/chat-ai"));
const ChatbotInterface = lazy(() => import("@/pages/chatbot-interface"));

function Router() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/get-started" component={PersonaSelection} />
          <Route path="/persona-selection" component={PersonaSelection} />
          <Route path="/chat-ai" component={ChatAI} />
          <Route path="/chatbot-interface/:personaType" component={ChatbotInterface} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
