import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../../../public/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-glow">
              <Sparkles className="w-4 h-4" />
              AI-Powered Productivity
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your AI Assistant for
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Perfect </span>
              Daily Planning
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Transform your productivity with intelligent todo management that seamlessly integrates with Gmail and Calendar. Let AI create your complete daily agenda automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant={'hero'} size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Free 14-day trial
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                No credit card required
              </div>
            </div>
          </div>
          
          {/* Right image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={"../../../public/hero-image.jpg"} 
                alt="AI Todo App Interface" 
                className="w-full rounded-2xl shadow-elegant"
              />
            </div>
            {/* Floating decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;