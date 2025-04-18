import React, { useState, useRef, useEffect } from "react";
import { SendIcon, Bot, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Generate responses based on persona type
const generateBotResponse = (message: string, personaType: string): string => {
  // Lowercase the message for easier matching
  const lowercaseMessage = message.toLowerCase();
  
  // Common investment terms to detect in user messages
  const containsStocks = lowercaseMessage.includes("stock") || lowercaseMessage.includes("shares");
  const containsCrypto = lowercaseMessage.includes("crypto") || lowercaseMessage.includes("bitcoin") || lowercaseMessage.includes("ethereum");
  const containsETF = lowercaseMessage.includes("etf") || lowercaseMessage.includes("exchange traded");
  const containsRisk = lowercaseMessage.includes("risk") || lowercaseMessage.includes("volatile");
  const containsStrategy = lowercaseMessage.includes("strategy") || lowercaseMessage.includes("plan");
  const isGreeting = lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi ") || lowercaseMessage.includes("hey") || lowercaseMessage === "hi";
  
  // Generic responses when we can't match anything specific
  const genericResponses = [
    "That's an interesting perspective. Tell me more about your investment goals.",
    "I see. Have you considered how that fits into your overall financial plan?",
    "Thanks for sharing. What timeline are you considering for these investments?",
    "I understand. How does this align with your risk tolerance?",
    "Great point. What's your experience with this type of investment so far?"
  ];
  
  // Greeting responses
  if (isGreeting) {
    switch (personaType) {
      case "innovator":
        return "Hello! As an Innovator, you're probably interested in emerging technologies and disruptive investments. How can I help you navigate the cutting edge of the market today?";
      case "traditionalist":
        return "Greetings! For a Traditionalist like you, stability and proven strategies are key. What part of your investment portfolio would you like to discuss?";
      case "adventurer":
        return "Hey there! Ready for some investment adventures? As an Adventurer, you're comfortable with volatility. What exciting opportunities are you considering?";
      case "athlete":
        return "Hi! With your Athlete mindset, you're focused on performance and results. What investment goals are you training for today?";
      case "artist":
        return "Hello! As an Artist investor, you value creativity and meaning in your portfolio. What values-driven investments are you contemplating?";
      default:
        return "Hello! How can I assist with your investment journey today?";
    }
  }
  
  // Persona-specific responses
  switch (personaType) {
    case "innovator":
      if (containsStocks) {
        return "For an innovation-focused investor like you, consider tech companies working on AI, quantum computing, or biotech. These high-growth sectors align with your forward-thinking perspective.";
      } else if (containsCrypto) {
        return "Beyond just Bitcoin and Ethereum, you might explore layer-2 solutions, DeFi protocols, or specialized blockchain applications that are creating new paradigms. These align well with your innovator mindset.";
      } else if (containsRisk) {
        return "As an Innovator, you understand that breakthrough technologies come with higher risk. Consider balancing your portfolio with 60-70% disruptive tech and 30-40% more established companies that are still innovation-focused.";
      } else if (containsStrategy) {
        return "A solid innovation strategy includes staying informed on technological trends, following thought leaders in emerging tech, and diversifying across multiple cutting-edge sectors rather than focusing on a single technology.";
      }
      break;
      
    case "traditionalist":
      if (containsStocks) {
        return "For a Traditionalist investor, blue-chip stocks with strong dividend histories like Johnson & Johnson, Procter & Gamble, or Coca-Cola might be worth considering for their stability and reliability.";
      } else if (containsETF) {
        return "Index ETFs that track the S&P 500 or total market funds would align well with your traditionalist approach. They offer broad market exposure with lower fees and proven long-term performance.";
      } else if (containsRisk) {
        return "Your traditionalist approach wisely acknowledges that managing risk is central to preserving wealth. A 60/40 split between stocks and bonds has historically provided good protection while allowing for growth.";
      } else if (containsStrategy) {
        return "A time-tested strategy for traditionalists includes dollar-cost averaging, reinvesting dividends, and periodic rebalancing to maintain your desired asset allocation. Consistency is your ally.";
      }
      break;
      
    case "adventurer":
      if (containsCrypto) {
        return "As an Adventurer, you might enjoy exploring newer cryptocurrencies with unique use cases, but remember to only allocate funds you can afford to lose to these high-risk ventures.";
      } else if (containsRisk) {
        return "Your adventurous spirit embraces risk, but consider setting aside 20-30% in more stable investments as your 'home base' while you venture into more volatile opportunities with the rest.";
      } else if (containsStrategy) {
        return "For adventurous investors, a barbell strategy might work well - keeping significant portions in very safe assets and high-risk investments, with less in the middle. This lets you explore while maintaining some security.";
      } else if (containsStocks) {
        return "Consider emerging market stocks or small-cap companies with high growth potential. These align with your adventurous approach, offering higher volatility but potentially greater returns.";
      }
      break;
      
    case "athlete":
      if (containsStocks) {
        return "For an achievement-focused Athlete investor, growth stocks with strong momentum and companies consistently outperforming their sectors might be worth researching.";
      } else if (containsETF) {
        return "Consider ETFs focused on sectors showing strong performance metrics or funds designed to outperform the market. Your athlete mindset appreciates measurable results.";
      } else if (containsStrategy) {
        return "A disciplined strategy suits your athletic approach - set clear performance benchmarks, regularly review your investments against these goals, and be willing to pivot quickly when certain positions underperform.";
      } else if (containsRisk) {
        return "Like athletic training, investment success requires balancing intensity with recovery. Consider allocating 70% to growth-focused investments and 30% to more conservative positions to manage overall portfolio risk.";
      }
      break;
      
    case "artist":
      if (containsStocks) {
        return "Companies with strong ESG profiles or in creative industries might resonate with your artistic values. Consider businesses that prioritize sustainability, ethical practices, or cultural contributions.";
      } else if (containsETF) {
        return "There are several ETFs focused on sustainability, social impact, or creative industries that would align with your artistic values while providing diversification.";
      } else if (containsStrategy) {
        return "As an Artist investor, your strategy might prioritize companies whose values align with yours. Consider creating a values-based framework to evaluate potential investments beyond just financial metrics.";
      } else if (containsRisk) {
        return "Finding the balance between expression and security is key for Artist investors. Consider allocating a portion of your portfolio to impact investments that speak to you, while maintaining core positions in broader funds.";
      }
      break;
  }
  
  // Return a generic response if no specific matches were found
  const randomIndex = Math.floor(Math.random() * genericResponses.length);
  return genericResponses[randomIndex];
};

interface ChatInterfaceProps {
  personaType: string;
}

export function ChatInterface({ personaType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      content: `Welcome to your Financial Multiverse AI assistant! As a ${personaType} investor, I'll provide personalized advice tailored to your investment style. How can I help you today?`,
      sender: "bot" as const,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [personaType]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content, personaType);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    toast({
      title: "Chat cleared",
      description: "All chat messages have been cleared.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 overflow-hidden border border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col h-[500px]">
        <div className="p-4 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-bold text-lg">
              {personaType.charAt(0).toUpperCase() + personaType.slice(1)} AI Assistant
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] items-start ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                    message.sender === "user"
                      ? "bg-primary ml-2"
                      : "bg-secondary mr-2"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/20 text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-start">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary mr-2">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl p-4 bg-secondary/20 text-foreground">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "200ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "400ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-primary/20 bg-primary/5">
          <div className="flex">
            <Input
              className="flex-1 bg-background border-primary/20 focus-visible:ring-primary/50"
              placeholder="Ask for investment advice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              className="ml-2 bg-primary hover:bg-primary/90"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}