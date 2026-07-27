import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Hero } from "@/components/landing/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { categories, products, sellers, stats } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BadgeCheck, Eye, Users, Store, Package, ShoppingCart } from "lucide-react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { LazySection } from "@/components/shared/LazySection";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { useTheme } from "@/hooks/use-theme";

const ICON_MAP: Record<string, React.ElementType> = { Users, Store, Package, ShoppingCart };

const INITIAL_PRODUCTS = 12;
const LOAD_MORE_COUNT = 8;

export default function Landing() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visibleCount < products.length;

  // Load more products (simulated async)
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, products.length));
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, hasMore]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  const { isDark } = useTheme();
  const dealsScrollRef = useRef<HTMLDivElement>(null);

  /* ─── Countdown Timer for Today's Deals ─── */
  const dealEndTime = useRef(Date.now() + 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = dealEndTime.current - now;
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const scrollDeals = (direction: 'left' | 'right') => {
    if (!dealsScrollRef.current) return;
    const scrollAmount = 300;
    dealsScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  /* ─── Stats counting animation ─── */
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const numbers = el.querySelectorAll(".stat-number");
    if (!numbers.length) return;

    const ctx = gsap.context(() => {
      numbers.forEach((num) => {
        const targetText = num.textContent || "";
        // Parse numeric value (e.g., "50K+" → 50, "1M+" → 1000)
        const raw = targetText.replace(/[^\dKM.]/g, "");
        let target = 0;
        let suffix = "";
        if (raw.endsWith("K")) {
          target = parseFloat(raw) * 1000;
          suffix = "K+";
        } else if (raw.endsWith("M")) {
          target = parseFloat(raw) * 1000000;
          suffix = "M+";
        } else {
          target = parseFloat(raw) || 0;
          suffix = targetText.replace(/[\d]/g, "");
        }

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: num,
            start: "top 90%",
            once: true,
          },
          onUpdate: () => {
            if (target >= 1000000) {
              num.textContent = (obj.val / 1000000).toFixed(1) + suffix;
            } else if (target >= 1000) {
              num.textContent = Math.round(obj.val / 1000) + suffix;
            } else {
              num.textContent = Math.round(obj.val) + suffix;
            }
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useGsapScroll(mainRef, [
    // Category pills with scale-in — tighter stagger
    { selector: '.landing-cat-pill', stagger: 0.03, from: { y: 12, scale: 0.9 }, to: { scale: 1 }, duration: 0.35, ease: 'power3.out', start: 'top 92%', trigger: '.landing-cat-pills' },
    // Grid cards (Top Selling, New Arrivals, Today's Deal) — merged into one trigger
    { selector: '.landing-grid-card', stagger: 0.08, from: { y: 25 }, duration: 0.4, ease: 'power3.out', start: 'top 92%' },
    // Today's Deal individual cards — shorter duration
    { selector: '.todays-deal-card', stagger: 0.04, from: { y: 15 }, duration: 0.35, ease: 'power3.out', start: 'top 92%' },
    // Stats section + section titles + view more links — merged
    { selector: '.landing-stats, .landing-section-title, .landing-view-more', stagger: 0.06, duration: 0.4, ease: 'power3.out', from: { y: 10 }, start: 'top 92%' },
    // Store avatars
    { selector: '.landing-store-link', stagger: 0.03, from: { y: 12, scale: 0.95 }, to: { scale: 1 }, duration: 0.3, ease: 'power3.out', start: 'top 92%' },
    // All products section
    { selector: '.landing-products-section', single: true, duration: 0.5, ease: 'power3.out', from: { y: 18 }, start: 'top 92%' },
    // Download app section — merged all download-related animations into one trigger
    { selector: '.landing-download-app, .landing-store-badge, .landing-feature-text', stagger: 0.08, duration: 0.4, ease: 'power3.out', from: { y: 15 }, start: 'top 92%' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Header />

      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <Hero />

        {/* ─── Category Pills ─── */}
        <section className="landing-cat-pills px-4 sm:px-8 lg:px-12 xl:px-16 mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categories.slice(0, 20).map((cat) => (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.slug}`}
                className="landing-cat-pill shrink-0 px-4 py-2 rounded-full bg-card border border-border text-sm text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Top Selling / New Arrivals / Today's Deal ─── */}
        <section className="landing-grid-section px-4 sm:px-8 lg:px-12 xl:px-16 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Top Selling — using ProductCard for consistent sizing */}
            <div className="landing-grid-card bg-card rounded-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="landing-section-title text-sm font-bold text-foreground">Top Selling</h2>
                <Link to="/marketplace" className="landing-view-more text-[11px] text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {products.slice(0, 4).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} compact />
                ))}
              </div>
            </div>

            {/* New Arrivals — using ProductCard for consistent sizing */}
            <div className="landing-grid-card bg-card rounded-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="landing-section-title text-sm font-bold text-foreground">New Arrivals</h2>
                <Link to="/marketplace" className="landing-view-more text-[11px] text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {products.slice(4, 8).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} compact />
                ))}
              </div>
            </div>

            {/* Today's Deal — visually consistent with Top Selling & New Arrivals */}
            <div className="landing-grid-card bg-card rounded-lg p-4 flex flex-col md:col-span-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="landing-section-title text-sm font-bold text-foreground shrink-0">
                    Today's Deals
                  </h2>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/50">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate">Free shipping</span>
                </div>
                <Link
                  to="/marketplace?sort=discount"
                  className="landing-view-more text-[11px] text-primary hover:underline font-medium shrink-0"
                >
                  See all →
                </Link>
              </div>

              {/* Carousel */}
              <div className="todays-deal-carousel relative group/carousel">
                {/* Scroll Arrows */}
                <button
                  onClick={() => scrollDeals('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20 bg-background/90 hover:bg-background backdrop-blur-sm rounded-full p-1 shadow border border-border/50 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Previous deals"
                >
                  <svg className="h-3 w-3 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollDeals('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20 bg-background/90 hover:bg-background backdrop-blur-sm rounded-full p-1 shadow border border-border/50 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Next deals"
                >
                  <svg className="h-3 w-3 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                <div ref={dealsScrollRef} className="flex gap-2 sm:gap-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {(() => {
                    const usedIds = new Set(products.slice(0, 8).map(p => p.id));
                    const dealProducts = products
                      .filter(p => !usedIds.has(p.id))
                      .slice(0, 16);
                    return dealProducts.length > 0 ? dealProducts.map((p, i) => (
                      <div
                        key={p.id}
                        className="todays-deal-card w-[calc(50%_-_4px)] sm:w-[calc(33.333%_-_10.667px)] md:w-[calc(25%_-_12px)] lg:w-[calc(20%_-_12.8px)] xl:w-[calc(16.667%_-_13.333px)] flex-shrink-0 snap-start"
                      >
                        <ProductCard product={p} index={i + 8} compact />
                      </div>
                    )) : (
                      <p className="text-xs text-muted-foreground py-4 text-center w-full">
                        More deals coming soon!
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Section ─── */}
        <section ref={statsRef} className="landing-stats px-4 sm:px-8 lg:px-12 xl:px-16 mt-8">
          <div className={cn(
            "rounded-2xl p-8 sm:p-10",
            isDark
              ? "bg-gray-900/50 border border-gray-800"
              : "bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100"
          )}>
            <h2 className="landing-section-title text-center text-sm font-bold text-foreground mb-8">
              SokoDigital by the Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => {
                const Icon = ICON_MAP[stat.icon] || Package;
                return (
                  <div key={stat.label} className="text-center landing-stats">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                      isDark ? "bg-orange-500/10" : "bg-orange-100"
                    )}>
                      <Icon className={cn(
                        "h-6 w-6",
                        isDark ? "text-orange-400" : "text-orange-600"
                      )} />
                    </div>
                    <p className={cn(
                      "stat-number text-2xl sm:text-3xl font-extrabold",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {stat.value}
                    </p>
                    <p className={cn(
                      "text-xs sm:text-sm mt-1",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}>
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Stores (lazy) ─── */}
        <LazySection>
        <section className="landing-stores-section px-4 sm:px-8 lg:px-12 xl:px-16 mt-8">
          <div className="bg-card rounded-lg p-6">
            <h2 className="landing-section-title text-sm font-bold text-foreground mb-6">Popular Stores</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
              {sellers.slice(0, 12).map((seller) => (
                <Link
                  key={seller.id}
                  to={`/store/${seller.id}`}
                  className="landing-store-link flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-border/50 group-hover:ring-primary transition-colors">
                    {seller.logo ? (
                      <OptimizedImage src={seller.logo} alt={seller.storeName} wrapperClassName="w-full h-full" shimmer={false} />
                    ) : (
                      <span className="text-2xl font-bold text-primary">{seller.storeName.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-center text-foreground w-full inline-flex items-center justify-center gap-1 min-w-0">
                    <span className="truncate min-w-0">{seller.storeName}</span>
                    {seller.verified && (
                      <BadgeCheck className="inline-block shrink-0 text-primary fill-primary" style={{ width: 12, height: 12 }} />
                    )}
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/stores" className="landing-view-more text-sm text-primary hover:underline mt-4 block text-right font-medium">
              View more →
            </Link>
          </div>
        </section>
        </LazySection>

        {/* ─── Featured Products (lazy) ─── */}
        <LazySection>
        <section className="landing-featured-section px-4 sm:px-8 lg:px-12 xl:px-16 mt-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/80 via-background to-background dark:from-amber-950/10 border border-amber-200/50 dark:border-amber-800/30 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="landing-section-title text-sm font-bold text-foreground">Featured Products</h2>
              <Link to="/marketplace?sort=featured" className="landing-view-more text-[11px] text-primary hover:underline font-medium">View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 relative z-10">
              {products.filter(p => p.featured).slice(0, 6).map((product, index) => (
                <div key={product.id} className="relative group/card">
                  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-amber-400/30 via-transparent to-amber-400/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative">
                    <ProductCard product={product} index={index} />
                  </div>
                  <div className="absolute top-2 left-2 z-10">
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-400/90 text-amber-950 rounded-full shadow-xs">
                      Featured
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </LazySection>

        {/* ─── All Products (Infinite Scroll, lazy) ─── */}
        <LazySection>
        <section className="landing-products-section px-4 sm:px-8 lg:px-12 xl:px-16 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="landing-section-title text-sm font-bold text-foreground">All Products</h2>
            <span className="text-xs text-muted-foreground">
              Showing {Math.min(visibleCount, products.length)} of {products.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
            {products.slice(0, visibleCount).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {/* Loading skeletons */}
            {isLoadingMore &&
              Array.from({ length: LOAD_MORE_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Sentinel element for IntersectionObserver */}
          <div ref={sentinelRef} className="w-full h-4" />

          {/* Load More button (fallback) */}
          <div className="flex flex-col items-center justify-center mt-6 gap-3">
            {hasMore && !isLoadingMore && (
              <Button
                variant="outline"
                className="rounded-full px-8 gap-2 shadow-sm"
                onClick={loadMore}
              >
                <Eye className="h-4 w-4" />
                Load More ({products.length - visibleCount} remaining)
              </Button>
            )}
            {!hasMore && (
              <p className="text-xs text-muted-foreground">You've viewed all products</p>
            )}
            <Button variant="ghost" size="sm" className="rounded-full text-xs" asChild>
              <Link to="/marketplace">Browse full marketplace →</Link>
            </Button>
          </div>
        </section>
        </LazySection>

        {/* ─── Download App (Alibaba-inspired, lazy) ─── */}
        <LazySection>
        <section className="landing-download-app px-4 sm:px-8 lg:px-12 xl:px-16 mt-8 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-8 sm:p-12 shadow-sm text-center">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent/5 blur-2xl" />

            <div className="relative z-10 max-w-xl mx-auto">
              <p className="landing-feature-text text-sm sm:text-base text-muted-foreground">
                <span className="text-foreground font-medium">Download </span>
                <a
                  href="#"
                  className="text-primary hover:underline font-semibold"
                  target="_blank"
                  rel="noopener"
                >
                  SokoDigital App
                </a>
              </p>
              <p className="landing-feature-text text-sm sm:text-base text-muted-foreground mt-1">
                Trade on the go with the{' '}
                <span className="text-foreground font-semibold">SokoDigital app</span>
              </p>

              {/* Store Badges */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {/* App Store */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener"
                  className="landing-store-badge inline-block hover:opacity-80 transition-opacity"
                  aria-label="Download from App Store"
                >
                  <img
                    src="https://s.alicdn.com/@img/imgextra/i4/O1CN01i9Aj641atkjJJ9I6y_!!6000000003388-2-tps-396-132.png"
                    alt="Download from App Store"
                    loading="lazy"
                    className="h-10 sm:h-12 w-auto"
                  />
                </a>
                {/* Google Play */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener"
                  className="landing-store-badge inline-block hover:opacity-80 transition-opacity"
                  aria-label="Download from Google Play"
                >
                  <img
                    src="https://s.alicdn.com/@img/imgextra/i4/O1CN018KnDNq1JleFgkjLRq_!!6000000001069-2-tps-447-132.png"
                    alt="Download from Google Play"
                    loading="lazy"
                    className="h-10 sm:h-12 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
        </section>
        </LazySection>
      </main>

      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
