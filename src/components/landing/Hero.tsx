import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Shield, ImageOff } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { banners } from "@/lib/constants";
import { gsap } from "gsap";
import { useAuth } from "@/lib/auth";

/**
 * Generate AVIF / WebP / JPEG variants from an Unsplash URL
 * by manipulating the `fm` and `q` parameters.
 */
function getFormatVariants(url: string | undefined) {
  if (!url) return { avif: "", webp: "", jpeg: "" };
  if (!url.includes("unsplash.com")) {
    return { avif: url, webp: url, jpeg: url };
  }
  const avif = url
    .replace(/fm=\w+/g, "fm=avif")
    .replace(/q=\d+/g, "q=80");
  const webp = url;
  const jpeg = url
    .replace(/fm=\w+/g, "")
    .replace(/\?&/g, "?")
    .replace(/&&/g, "&")
    .replace(/\?$/, "");
  return { avif, webp, jpeg };
}

/* ─── Kichi‑style Hero — horizontal CSS slide, rise‑fade content, no progress bar ─── */
export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isPausedRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();
  const { user } = useAuth();

  isPausedRef.current = isPaused;

  const activeBanners = banners.filter((b) => b.isActive && b.type === "hero");

  /* ─── Cleanup on unmount ─── */
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, []);

  /* ─── Entrance fade‑in ─── */
  useEffect(() => {
    const el = sectionRef.current?.querySelector(".hero-slider-container");
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, []);

  /* ─── Kichi‑style rise‑fade content entrance (CSS, not GSAP) ─── */
  const animateSlideContent = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const slide = section.querySelector(`[data-slide="${index}"]`);
    if (!slide) return;

    // Trigger CSS rise‑fade animations by toggling a class
    const badge = slide.querySelector(".hero-badge");
    const cta = slide.querySelector(".hero-cta");
    const trust = slide.querySelector(".hero-trust");

    [badge, cta, trust].forEach((el) => {
      if (el) {
        el.classList.remove("rise-fade-in");
        // Force reflow so the animation re‑triggers
        void (el as HTMLElement).offsetWidth;
        el.classList.add("rise-fade-in");
      }
    });
  }, []);

  /* ─── Autoplay (internal timer, no progress bar) ─── */
  const scheduleNext = useCallback(() => {
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    autoplayRef.current = setTimeout(() => {
      if (!isPausedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
      } else {
        // When paused, keep checking every second instead of recursive scheduling
        autoplayRef.current = setTimeout(() => {
          if (!isPausedRef.current) {
            setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
          } else {
            // Still paused — check again in 1s
            scheduleNext();
          }
        }, 1000);
      }
    }, 5000);
  }, [activeBanners.length]);

  /* ─── Kichi‑style horizontal slide ─── */
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimatingRef.current || targetIndex === currentSlide) return;
      isAnimatingRef.current = true;
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);

      setCurrentSlide(targetIndex);

      // Wait for CSS transition to finish, then allow next animation
      animTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
      }, 400); // matches CSS transition duration
    },
    [currentSlide]
  );

  const handleNext = useCallback(() => {
    const next = (currentSlide + 1) % activeBanners.length;
    goToSlide(next);
  }, [currentSlide, activeBanners.length, goToSlide]);

  const handlePrev = useCallback(() => {
    const prev = (currentSlide - 1 + activeBanners.length) % activeBanners.length;
    goToSlide(prev);
  }, [currentSlide, activeBanners.length, goToSlide]);

  /* ─── Start autoplay + content animation on mount / slide change ─── */
  useEffect(() => {
    if (!activeBanners.length) return;
    animateSlideContent(currentSlide);
    scheduleNext();
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, activeBanners.length]);

  /* ─── Touch / Hover ─── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[currentSlide];

  /* ─── CTA routing ─── */
  const handleCTA = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth");
    }
  };

  return (
    <section ref={sectionRef} className="px-4 sm:px-8 lg:px-12 xl:px-16 mt-4">
      <div
        ref={containerRef}
        className="hero-slider-container rounded-2xl overflow-hidden relative group opacity-0 shadow-sm border border-gray-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ─── Kichi‑style horizontal slide track ─── */}
        <div className="relative overflow-hidden">
          {/* Spacer for aspect ratio */}
          <div className="w-full aspect-[21/9] sm:aspect-[21/9] lg:aspect-[64/18]" />

          {/* Slide track */}
          <div
            className="absolute inset-0 flex transition-transform duration-[400ms] ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {activeBanners.map((b, idx) => (
              <div
                key={b.id}
                data-slide={idx}
                className="relative w-full h-full shrink-0 overflow-hidden"
              >
                {/* HD Banner with AVIF / WebP / JPEG format negotiation */}
                <div className="absolute inset-0">
                  <FormatPicture
                    desktopUrl={b.desktopImage}
                    mobileUrl={b.mobileImage ?? b.desktopImage}
                    alt={b.title}
                    idx={idx}
                    fallbackContent={
                      <div className="banner-fallback hidden flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 gap-2">
                        <ImageOff className="h-8 w-8 text-orange-400/60" />
                        <span className="text-xs text-orange-500/80 font-medium">{b.badge || b.title}</span>
                      </div>
                    }
                  />
                </div>

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-[1]" />

                {/* Content */}
                <div className="absolute inset-0 z-10 flex items-center">
                  <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 max-w-2xl">
                    {/* Badge — rise‑fade CSS animation */}
                    {b.badge && (
                      <span className="hero-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 sm:mb-4 w-fit bg-white/20 backdrop-blur-sm text-white shadow-sm border border-white/20 opacity-0">
                        {b.badge}
                      </span>
                    )}

                    {/* CTA — rise‑fade CSS animation, delayed */}
                    <Link
                      to={user ? b.link || "/marketplace" : "/auth"}
                      onClick={handleCTA}
                      className="hero-cta mt-4 sm:mt-6 inline-flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-fit active:scale-95 hover:scale-105 bg-orange-500 text-white hover:bg-orange-600 opacity-0"
                      style={{ animationDelay: "0.25s" }}
                    >
                      {user ? b.cta || "Shop Now" : "Sign In to Shop"}
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>

                    {/* Trust indicators — rise‑fade CSS animation, further delayed */}
                    <div
                      className="hero-trust hidden sm:flex items-center gap-4 mt-4 text-[11px] text-white/80 opacity-0"
                      style={{ animationDelay: "0.45s" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-orange-400" />
                        Free delivery over 50K
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-orange-400" />
                        Secure payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Nav Arrows (show on hover, like Kichi) ─── */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2.5 sm:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2.5 sm:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* ─── Dot indicators ─── */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                className={cn(
                  "rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "w-6 sm:w-8 h-2.5 sm:h-3 shadow-sm"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                )}
                style={{
                  backgroundColor: index === currentSlide ? "#F97316" : undefined,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* ─── Simple pause chip (clean, minimal) ─── */}
        {isPaused && (
          <div className="absolute top-3 sm:top-5 left-3 sm:left-5 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] px-2.5 py-1 rounded-full shadow-sm border border-white/10">
            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
            Paused
          </div>
        )}
      </div>
    </section>
  );
}
