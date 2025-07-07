import { Button } from "../ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "Start organizing instantly",
    "Connect Gmail & Calendar in seconds", 
    "AI creates your first daily plan",
    "Free for 14 days, no commitment"
  ];

  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to transform your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> productivity</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already discovered the power of AI-driven task management.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;