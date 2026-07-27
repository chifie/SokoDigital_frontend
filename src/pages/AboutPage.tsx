import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { BadgeCheck, Globe, Heart, Shield, Truck, Sparkles, Store, Users, Package, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { cn } from "@/lib/utils";

const values = [
  { icon: Shield, title: "Trust & Safety", desc: "Every seller is verified. Every transaction is protected." },
  { icon: Heart, title: "Community First", desc: "Built for Tanzanian buyers and sellers, by Tanzanians." },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery network ensuring your orders arrive on time." },
  { icon: Sparkles, title: "Quality Assured", desc: "We maintain high standards for all products on our platform." },
  { icon: Globe, title: "Nationwide Reach", desc: "Connecting buyers and sellers across all regions of Tanzania." },
  { icon: BadgeCheck, title: "Fair Pricing", desc: "Competitive prices with no hidden fees or surprises." },
];

const milestones = [
  { year: "2022", title: "The Beginning", desc: "SokoDigital was founded with a vision to transform Tanzanian e-commerce." },
  { year: "2023", title: "1,000 Sellers", desc: "Reached 1,000 registered sellers across Tanzania." },
  { year: "2024", title: "50K Products", desc: "Platform surpassed 50,000 active product listings." },
  { year: "2025", title: "1M Orders", desc: "Celebrated one million orders delivered nationwide." },
  { year: "2026", title: "Nationwide Leader", desc: "Tanzania's most trusted online marketplace." },
];

const team = [
  { name: "Amina Juma", role: "CEO & Co-Founder", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80&fm=webp&fit=crop" },
  { name: "James Ochieng", role: "CTO & Co-Founder", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fm=webp&fit=crop" },
  { name: "Mwanahamisi Salim", role: "Head of Operations", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80&fm=webp&fit=crop" },
  { name: "Raj Patel", role: "Head of Growth", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80&fm=webp&fit=crop" },
];

export default function AboutPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".about-animate"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: main.querySelector(".about-content"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 py-16 sm:py-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative z-10 px-4 sm:px-8 lg:px-12 xl:px-16 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">About SokoDigital</h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Tanzania's premier online marketplace connecting millions of buyers with trusted sellers across the nation.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="about-content px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
          <div className="about-animate max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To empower Tanzanian businesses and consumers by providing a trusted, accessible, and innovative 
              online marketplace. We believe in the power of e-commerce to transform lives, create opportunities, 
              and build a stronger economy for Tanzania.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, value: "50K+", label: "Active Buyers" },
              { icon: Store, value: "10K+", label: "Trusted Sellers" },
              { icon: Package, value: "100K+", label: "Products Listed" },
              { icon: ShoppingCart, value: "1M+", label: "Orders Delivered" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="about-animate text-center p-6 rounded-2xl bg-card border border-border/50">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Values */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="about-animate p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-xs text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Milestones */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Journey</h2>
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {milestones.map((m, i) => (
              <div key={i} className="about-animate relative pl-12 pb-8 last:pb-0">
                <div className={cn(
                  "absolute left-2.5 w-3 h-3 rounded-full border-2 border-background",
                  "bg-primary ring-2 ring-primary/30"
                )} />
                <div className="bg-card rounded-xl p-4 border border-border/50">
                  <span className="text-[11px] font-bold text-primary">{m.year}</span>
                  <h3 className="text-sm font-semibold mt-0.5">{m.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Team */}
          <h2 className="text-2xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {team.map((t, i) => (
              <div key={i} className="about-animate text-center p-4 rounded-2xl bg-card border border-border/50">
                <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-3 bg-muted ring-2 ring-border/50">
                  <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-sm font-semibold">{t.name}</h3>
                <p className="text-[11px] text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
