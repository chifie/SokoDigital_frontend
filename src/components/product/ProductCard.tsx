import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Check, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { Link, useNavigate } from "react-router";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProductCardProps {
  product: Product;
  index?: number;
  compact?: boolean;
}

interface FlyElement {
  id: string;
  startX: number;
  startY: number;
}

export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [flyElements, setFlyElements] = useState<FlyElement[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flyTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Image load timeout fallback: if image doesn't load in 5s, show fallback
  useEffect(() => {
    if (!imgLoaded && !imgError) {
      loadTimeoutRef.current = setTimeout(() => {
        setImgError(true);
      }, 5000);
    }
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [imgLoaded, imgError]);

  // Cleanup fly timeouts on unmount
  useEffect(() => {
    const timeouts = flyTimeoutsRef.current;
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // GSAP scroll reveal and hover animations
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      // Scroll-triggered reveal
      gsap.fromTo(
        card,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: index * 0.04,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // Hover animation: subtle scale + elevation
      card.addEventListener("mouseenter", () => {
        const inner = card.querySelector(".product-card-inner");
        if (inner) {
          gsap.to(inner, {
            y: -4,
            scale: 1.01,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          });
        }
        // Animate image zoom
        const img = card.querySelector(".product-card-image");
        if (img) {
          gsap.to(img, {
            scale: 1.05,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });

      card.addEventListener("mouseleave", () => {
        const inner = card.querySelector(".product-card-inner");
        if (inner) {
          gsap.to(inner, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          });
        }
        const img = card.querySelector(".product-card-image");
        if (img) {
          gsap.to(img, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    }, card);

    return () => ctx.revert();
  }, [index]);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : undefined;

  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    // Get the cart icon position for the fly animation
    const cartIcon = document.querySelector('[data-cart-target]');
    const button = buttonRef.current;

    if (button && cartIcon) {
      const btnRect = button.getBoundingClientRect();

      const flyId = Date.now().toString();
      const flyEl: FlyElement = {
        id: flyId,
        startX: btnRect.left + btnRect.width / 2,
        startY: btnRect.top,
      };

      setFlyElements((prev) => [...prev, flyEl]);

      // Remove fly element after animation completes
      const timeout = setTimeout(() => {
        setFlyElements((prev) => prev.filter((f) => f.id !== flyId));
      }, 700);
      flyTimeoutsRef.current.push(timeout);
    }

    // Add to cart
    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.discountPrice || product.price,
      quantity: 1,
      sellerId: product.seller.id,
      sellerName: product.seller.storeName,
      maxQuantity: product.quantity,
    });

    toast.success(`${product.name.slice(0, 30)}... added to cart!`, {
      duration: 2000,
      icon: <ShoppingCart className="h-4 w-4" />,
    });

    setTimeout(() => setIsAdding(false), 1200);
  }, [product, addItem, isAdding]);

  return (
    <div
      ref={cardRef}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block cursor-pointer">
        <div className="product-card-inner bg-card rounded-xl shadow-sm overflow-hidden dark:border dark:border-border/50">
        <div className="aspect-square overflow-hidden relative bg-muted/50 rounded-t-xl dark:bg-muted/20">
          {/* Blur-up placeholder */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 shimmer" />
          )}

          {/* Wishlist button (hidden in compact mode) */}
          {!compact && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute right-2 top-2 z-10 w-7 h-7 rounded-full backdrop-blur-sm shadow-md flex items-center justify-center transition-colors bg-white/90 text-foreground hover:bg-white"
              title="Add to wishlist"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isWishlisted ? "fill-rose-500 text-rose-500" : ""
                )}
              />
            </button>
          )}

          {/* Low stock badge */}
          {isLowStock && (
            <span className="absolute left-2 bottom-2 z-10 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-amber-950 shadow-md">
              Only {product.quantity} left
            </span>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
              -{discount}%
            </span>
          )}

          {/* Image with blur-up transition */}
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/60 to-muted/30 dark:from-muted/40 dark:to-muted/10 gap-1">
              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
              <span className="text-[9px] text-muted-foreground/50 font-medium">{product.name.slice(0, 2).toUpperCase()}</span>
            </div>
          ) : (
            <img
              src={product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              loading="lazy"
              className={cn(
                "product-card-image w-full h-full object-cover transition-all duration-500",
                imgLoaded ? "opacity-100 blur-0 scale-100" : "opacity-100 blur-md scale-105"
              )}
              onLoad={() => {
                setImgLoaded(true);
                if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
              }}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <div className={cn(compact ? "p-1.5" : "p-2")}>
          {/* Product name */}
          <p className={cn(
            "text-foreground line-clamp-2 leading-tight",
            compact ? "text-[10px] mb-0.5" : "text-[11px] lg:text-xs mb-1"
          )}>
            {product.name}
          </p>

          {/* Price */}
          <p className={cn("font-bold text-primary", compact ? "text-xs" : "text-sm")}>
            Tshs {displayPrice.toLocaleString()}/=
          </p>
          {oldPrice && (
            <p className="text-[10px] text-muted-foreground line-through">
              Tshs {oldPrice.toLocaleString()}/=
            </p>
          )}

          {/* Compact mode: only price + discount, no extras */}
          {!compact && (
            <>
              {/* Min order */}
              <p className="text-[10px] text-primary mt-0.5">Min. order: 1 pieces</p>

              {/* Stock */}
              {isOutOfStock ? (
                <p className="text-[10px] text-muted-foreground mt-0.5">Out of stock</p>
              ) : (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {product.quantity} in stock
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-1 mt-1.5">
                <button
                  ref={buttonRef}
                  onClick={handleAddToCart}
                  disabled={isAdding || isOutOfStock}
                  className={cn(
                    "flex-1 text-[10px] py-1.5 px-1 rounded-md border border-secondary text-secondary hover:bg-secondary/5 hover:shadow-sm active:scale-[0.95] transition-all duration-200 inline-flex items-center justify-center gap-0.5",
                    isAdding && "bg-secondary/10 border-secondary/50",
                    isOutOfStock && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isAdding ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <ShoppingCart className="h-3 w-3" />
                  )}
                  {isAdding ? "Added" : "Add"}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/checkout?product=${product.slug}`);
                  }}
                  className="flex-1 text-[10px] py-1.5 px-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-md active:scale-[0.95] transition-all duration-200 font-medium shadow-sm"
                >
                  Shop Now
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </Link>

      {/* Fly-to-cart animation elements */}
      <AnimatePresence>
        {flyElements.map((fly) => (
          <motion.div
            key={fly.id}
            initial={{
              position: "fixed",
              top: fly.startY,
              left: fly.startX,
              x: "-50%",
              y: 0,
              scale: 1,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              top: 48,
              left: window.innerWidth - 60,
              x: "-50%",
              y: "-50%",
              scale: 0.2,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="pointer-events-none"
          >
            <div className="h-8 w-8 rounded-full bg-secondary shadow-lg flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
