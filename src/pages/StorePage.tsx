import { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { Store, Package, MapPin, BadgeCheck, Star, Clock, Users, ShoppingBag, Share2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProductCard } from "@/components/product/ProductCard";
import { sellers, products } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


export default function StorePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const seller = sellers.find((s) => s.id === id) || sellers[0];
  const storeProducts = products.filter((p) => p.seller.id === seller.id);
  const [followers, setFollowers] = useState(seller.followers);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".store-product-section"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".store-product-section"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        {/* Store Banner */}
        <div className="relative h-40 sm:h-48 md:h-56 bg-gradient-to-r from-primary/80 via-primary to-secondary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }} />
          </div>
        </div>

        {/* Store Info */}
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            {/* Store Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-background bg-card overflow-hidden shadow-xl shrink-0">
              {seller.logo ? (
                <OptimizedImage src={seller.logo} alt={seller.storeName} wrapperClassName="w-full h-full" shimmer={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Store className="h-10 w-10 text-primary" />
                </div>
              )}
            </div>

            {/* Store Details */}
            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-bold truncate flex items-center gap-2">
                  {seller.storeName}
                  {seller.verified && (
                    <BadgeCheck className="h-5 w-5 text-primary fill-primary shrink-0" />
                  )}
                </h1>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs rounded-lg px-4 bg-primary hover:bg-primary/90"
                    onClick={() => setFollowers(followers + 1)}
                  >
                    Follow ({followers.toLocaleString()})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-lg p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Store Stats */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {seller.rating}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {seller.totalSales.toLocaleString()} sales
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  {storeProducts.length} products
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {seller.responseTime}
                </span>
              </div>

              {/* Store badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {seller.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 rounded-full"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Store Description + Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Description */}
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold mb-2">About Store</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {seller.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-lg p-4 border border-border/50">
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Store Info</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  {seller.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                  {seller.followers.toLocaleString()} followers
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  Response: {seller.responseTime}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  {seller.responseRate}% response rate
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  Joined {new Date(seller.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {/* Store Products */}
          <div className="store-product-section mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Products ({storeProducts.length})</h2>
              <Link to="/products" className="text-xs text-primary hover:underline font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {storeProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}

// Calendar icon used in store info
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
