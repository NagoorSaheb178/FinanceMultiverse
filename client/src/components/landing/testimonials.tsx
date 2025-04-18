import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Innovator Archetype",
    content: "Finally found an investing platform that gets me. The personalized approach based on my goals and personality is exactly what I needed.",
    initials: "SK",
  },
  {
    name: "Marcus T.",
    role: "Adventurer Archetype",
    content: "The AI recommendations for my adventurer profile have been spot on. I've discovered investment opportunities I would have never found on my own.",
    initials: "MT",
  },
  {
    name: "Leila J.",
    role: "Artist Archetype",
    content: "Never thought investing could feel creative! The community aspect helps me learn while staying true to my values and creative mindset.",
    initials: "LJ",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          The Next Generation of Investors
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur-sm p-6 rounded-xl border border-primary/10">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarFallback className="bg-primary/20 text-primary">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
