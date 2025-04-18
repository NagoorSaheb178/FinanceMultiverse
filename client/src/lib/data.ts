import { 
  Lightbulb, 
  Building2, 
  Compass, 
  Activity, 
  Palette 
} from "lucide-react";

export const personaData = [
  {
    id: "innovator",
    title: "Innovator",
    description: "Forward-thinking, tech-savvy, and always seeking the next big thing. You're interested in emerging markets and disruptive technologies.",
    icon: Lightbulb,
    iconBgClass: "bg-primary/20",
    iconClass: "text-primary",
    buttonColorClass: "bg-primary/20 text-primary-light",
    buttonHoverClass: "hover:bg-primary/30",
    tags: [
      { label: "Tech Stocks", colorClass: "bg-primary/20 text-primary-light" },
      { label: "Startups", colorClass: "bg-primary/20 text-primary-light" },
      { label: "Web3", colorClass: "bg-primary/20 text-primary-light" }
    ]
  },
  {
    id: "traditionalist",
    title: "Traditionalist",
    description: "Disciplined, methodical, and focused on long-term stability. You value consistency and proven investment strategies.",
    icon: Building2,
    iconBgClass: "bg-secondary/20",
    iconClass: "text-secondary",
    buttonColorClass: "bg-secondary/20 text-secondary-light",
    buttonHoverClass: "hover:bg-secondary/30",
    tags: [
      { label: "Blue Chips", colorClass: "bg-secondary/20 text-secondary-light" },
      { label: "Dividend Stocks", colorClass: "bg-secondary/20 text-secondary-light" },
      { label: "Bonds", colorClass: "bg-secondary/20 text-secondary-light" }
    ]
  },
  {
    id: "adventurer",
    title: "Adventurer",
    description: "Risk-taking, curious, and always seeking new horizons. You embrace volatility and are willing to explore unconventional investments.",
    icon: Compass,
    iconBgClass: "bg-accent/20",
    iconClass: "text-accent",
    buttonColorClass: "bg-accent/20 text-accent",
    buttonHoverClass: "hover:bg-accent/30",
    tags: [
      { label: "Cryptocurrencies", colorClass: "bg-accent/20 text-accent" },
      { label: "NFTs", colorClass: "bg-accent/20 text-accent" },
      { label: "Emerging Markets", colorClass: "bg-accent/20 text-accent" }
    ]
  },
  {
    id: "athlete",
    title: "Athlete",
    description: "Competitive, disciplined, and results-driven. You set clear financial goals and are determined to outperform the market.",
    icon: Activity,
    iconBgClass: "bg-primary/20",
    iconClass: "text-primary",
    buttonColorClass: "bg-primary/20 text-primary-light",
    buttonHoverClass: "hover:bg-primary/30",
    tags: [
      { label: "Growth Stocks", colorClass: "bg-primary/20 text-primary-light" },
      { label: "ETFs", colorClass: "bg-primary/20 text-primary-light" },
      { label: "Performance Focused", colorClass: "bg-primary/20 text-primary-light" }
    ]
  },
  {
    id: "artist",
    title: "Artist",
    description: "Creative, intuitive, and values-driven. You invest with both heart and mind, seeking companies that align with your personal philosophy.",
    icon: Palette,
    iconBgClass: "bg-secondary/20",
    iconClass: "text-secondary",
    buttonColorClass: "bg-secondary/20 text-secondary-light",
    buttonHoverClass: "hover:bg-secondary/30",
    tags: [
      { label: "ESG Investing", colorClass: "bg-secondary/20 text-secondary-light" },
      { label: "Creative Industries", colorClass: "bg-secondary/20 text-secondary-light" },
      { label: "Impact Funds", colorClass: "bg-secondary/20 text-secondary-light" }
    ]
  }
];
