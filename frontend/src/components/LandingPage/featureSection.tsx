import { Card,CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Mail, Calendar, Brain, Zap, Shield, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Gmail Integration",
      description: "Automatically turn emails into actionable tasks. Never miss important follow-ups again.",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Calendar Sync",
      description: "Smart scheduling that works around your meetings and commitments seamlessly.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Task Creation",
      description: "Let AI analyze your priorities and create the perfect daily agenda automatically.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Automation",
      description: "Reduce manual work with intelligent task prioritization and scheduling.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data stays secure with enterprise-grade encryption and privacy controls.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Tracking",
      description: "Understand where your time goes with detailed analytics and insights.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything you need to stay
            <span className="bg-gradient-primary bg-clip-text text-transparent"> organized</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful integrations and AI-driven features that adapt to your workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
              <CardHeader>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;