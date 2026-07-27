import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Search, Store, BadgeCheck, MapPin, Star, ShoppingBag, Users, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { sellers } from "@/lib/constants";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { cn } from "@/lib/utils";

export default function ShopsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = sellers.filter((s) =>
    s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".shop-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.04,
          scrollTrigger: { trigger: main.querySelector(".shop-grid"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Popular Stores</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {sellers.length} trusted sellers on SokoDigital
            </p>
          </div>

          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stores by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="shop-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((seller) => (
              <Link
                key={seller.id}
                to={`/store/${seller.id}`}
                className="shop-card group relative rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Banner */}
                <div className="h-24 sm:h-28 overflow-hidden bg-muted">
                  {seller.banner ? (
                    <OptimizedImage
                      src={seller.banner}
                      alt=""
                      wrapperClassName="h-full w-full"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      shimmer
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                </div>

                {/* Logo */}
                <div className="relative px-4 pb-4">
                  <div className="flex items-end -mt-10 mb-3">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-background bg-background shadow-md shrink-0">
                      <OptimizedImage
                        src={seller.logo}
                        alt={seller.storeName}
                        wrapperClassName="h-full w-full"
                        className="object-cover h-full w-full"
                        shimmer
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    {seller.storeName}
                    {seller.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary fill-primary shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{seller.description}</p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {seller.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {seller.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="h-3 w-3" /> {seller.totalProducts} products
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {seller.followers.toLocaleString()} followers
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {seller.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 rounded-full bg-primary/5 text-[10px] font-medium text-primary border border-primary/10"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Store className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No stores found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
