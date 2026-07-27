import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Clock, Zap, ShoppingBag, TrendingUp, Tag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProductCard } from "@/components/product/ProductCard";
import { products, flashSales } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CountdownTimer({ endTime, label }: { endTime: string; label?: string }) {
  const calc = () => {
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  const pad = (n: number) => n.toString().padStart(2, "0");

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-[11px] text-muted-foreground mr-1">{label}</span>}
      <div className="flex items-center gap-1 font-mono font-bold text-rose-500">
        <span className="bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded text-xs">{pad(t.hours)}</span>
        <span className="text-rose-300">:</span>
        <span className="bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded text-xs">{pad(t.minutes)}</span>
        <span className="text-rose-300">:</span>
        <span className="bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded text-xs">{pad(t.seconds)}</span>
      </div>
    </div>
  );
}

const dealCategories = ["All Deals", "Electronics", "Fashion", "Home & Kitchen", "Sports", "Beauty"];

export default function DealsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All Deals");

  const discountProducts = products
    .filter((p) => p.discountPrice)
    .sort((a, b) => {
      const aDisc = ((a.price - (a.discountPrice || a.price)) / a.price) * 100;
      const bDisc = ((b.price - (b.discountPrice || b.price)) / b.price) * 100;
      return bDisc - aDisc;
    });

  const filtered = activeTab === "All Deals"
    ? discountProducts
    : discountProducts.filter((p) => p.category === activeTab);

  const activeFlash = flashSales.find((f) => f.isActive);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".deal-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.04,
          scrollTrigger: { trigger: main.querySelector(".deal-grid"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, [activeTab]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 p-8 sm:p-12 mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-300" />
                </div>
                <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Limited Time</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Today's Best Deals</h1>
              <p className="text-white/70 mt-2 max-w-lg">Grab huge discounts on top brands. Offers end soon!</p>
              {activeFlash && (
                <div className="mt-4">
                  <CountdownTimer endTime={activeFlash.endTime} label="Ends in" />
                </div>
              )}
            </div>
          </div>

          {/* Active Flash Sale Section */}
          {activeFlash && (
            <div className="mb-10 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-rose-950/20 dark:via-background dark:to-amber-950/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Flash Sale — Up to {activeFlash.discount}% Off</h2>
                    <p className="text-[11px] text-muted-foreground">{activeFlash.description}</p>
                  </div>
                </div>
                {activeFlash && <CountdownTimer endTime={activeFlash.endTime} />}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeFlash.products.map((p, i) => (
                  <div key={p.id} className="deal-card">
                    <ProductCard product={p} index={i} compact />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
            {dealCategories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground hover:text-foreground border-border hover:border-primary/30"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              {filtered.length} deals available
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Up to {Math.max(...filtered.map(p => ((p.price - (p.discountPrice || p.price)) / p.price) * 100)).toFixed(0)}% off
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Limited time offers
            </span>
          </div>

          {/* Deal Grid */}
          <div className="deal-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((p, i) => {
              const discountPct = p.discountPrice
                ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
                : 0;
              return (
                <div key={p.id} className="deal-card relative">
                  {discountPct >= 30 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-xs">
                        -{discountPct}%
                      </span>
                    </div>
                  )}
                  <ProductCard product={p} index={i} compact />
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No deals in this category right now</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab("All Deals")}>
                View All Deals
              </Button>
            </div>
          )}

          {/* Browse all */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-3">Looking for more great prices?</p>
            <Button asChild>
              <Link to="/marketplace?sort=price-asc">Browse Lowest Prices</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
