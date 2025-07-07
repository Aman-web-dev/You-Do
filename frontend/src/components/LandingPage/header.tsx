'use client'

import { Button } from "../ui/button";
import { Brain } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">YouDo Ai</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button onClick={()=>{window.location.href="/auth"}} variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button variant="hero">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;