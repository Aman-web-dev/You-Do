import HeroSection from "@/components/LandingPage/hero";
import CTASection from "@/components/LandingPage/ctaSection";
import FeaturesSection from "@/components/LandingPage/featureSection";
import Header from "@/components/LandingPage/header";
// import '../../src/app/globals.css';



export default function Home() {
  return (
   <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
