import { Card, CardContent } from "@/components/ui/card";
import { 
  Fingerprint, 
  BrainCircuit, 
  Users
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Personalized Strategy",
    description: "Discover investment strategies that align with your unique personality and goals.",
    bgColor: "bg-primary/20",
    borderColor: "border-primary/20 hover:border-primary/40",
    iconColor: "text-primary"
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights",
    description: "Get real-time market analysis and recommendations tailored to your investor type.",
    bgColor: "bg-secondary/20",
    borderColor: "border-secondary/20 hover:border-secondary/40",
    iconColor: "text-secondary"
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with like-minded investors and learn from their experiences and strategies.",
    bgColor: "bg-accent/20",
    borderColor: "border-accent/20 hover:border-accent/40",
    iconColor: "text-accent"
  }
];

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`bg-background/50 backdrop-blur-sm p-8 rounded-2xl border ${feature.borderColor} transition-all duration-300`}
            >
              <CardContent className="p-0">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`text-2xl ${feature.iconColor}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
