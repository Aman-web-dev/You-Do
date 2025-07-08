"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Brain } from "lucide-react";
import { createClient } from "@/utils/client";
import { User2 } from "lucide-react";
import LoadingSpinner from "../ui/loadingSpinner";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true)
    const handleClient = async () => {
      const supabaseClient = await createClient();

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        setUser(user);
      }
      setLoading(false)
    };
    handleClient();
  }, []);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">YouDo AI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            {loading ? (
              <LoadingSpinner />
            ) : user && user?.email ? (
              <Button
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                variant="default"
                size={"sm"}
                className="hidden sm:inline-flex bg-green-900 text-white"
              >
                <User2 />
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    window.location.href = "/auth";
                  }}
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button variant={"default"} className="text-white">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
