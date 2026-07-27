import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Search, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { categories } from "@/lib/constants";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

const CATEGORY_ICONS: Record<string, string> = {
  "Phones & Tablets": "📱",
  "Computers": "💻",
  "Electronics": "⚡",
  "Fashion": "👗",
  "Shoes": "👟",
  "Beauty": "💄",
  "Groceries": "🛒",
  "Furniture": "🪑",
  "Home & Kitchen": "🏠",
  "Gaming": "🎮",
  "Automotive": "🚗",
  "Sports": "🏆",
  "Baby Products": "👶",
  "Books": "📚",
  "Health": "❤️",
};

export default function CategoriesPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".cat-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.04,
          scrollTrigger: { trigger: main.querySelector(".cat-grid"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Browse Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} categories · {categories.reduce((s, c) => s + c.productCount, 0).toLocaleString()} products
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Category Grid */}
          <div className="cat-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((cat) => (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.slug}`}
                className="cat-card group relative rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    wrapperClassName="h-full w-full"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    shimmer
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-white drop-shadow-sm">
                    {CATEGORY_ICONS[cat.name] || "📦"} {cat.name}
                  </h3>
                  <p className="text-[10px] text-white/70 mt-0.5">
                    {cat.productCount.toLocaleString()} products
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No categories found for "{searchQuery}"</p>
            </div>
          )}

          {/* Subcategories */}
          {!searchQuery && categories.filter(c => c.subcategories).length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-6">Popular Subcategories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.filter(c => c.subcategories).flatMap(cat =>
                  (cat.subcategories || []).map(sub => (
                    <Link
                      key={sub.id}
                      to={`/marketplace?category=${sub.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted hover:border-primary/30 transition-all group"
                    >
                      <div>
                        <p className="text-sm font-medium">{sub.name}</p>
                        <p className="text-[10px] text-muted-foreground">{sub.productCount.toLocaleString()} items</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
