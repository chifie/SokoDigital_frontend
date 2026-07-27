import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Truck, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { banners } from "@/lib/constants";
import { gsap } from "gsap";
import { useAuth } from "@/lib/auth";

/* ─── Hero Component ─── */
export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isPausedRef = useRef(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const navigate = useNavigate();
  const { user } = useAuth();

  isPausedRef.current = isPaused;

  const activeBanners = banners.filter((b) => b.isActive && b.type === "hero");

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  /* ─── Entrance ─── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelector(".hero-slider-container"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  /* ─── Ken Burns zoom on current slide image ─── */
  const animateKenBurns = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const slide = section.querySelector(`[data-slide="${index}"]`);
    if (!slide) return;
    const img = slide.querySelector(".ken-burns-img") as HTMLElement | null;
    if (!img) return;

    gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1, transformOrigin: "center center" },
        {
          scale: 1.08,
          duration: 6,
          ease: "power1.out",
        }
      );
    }, img);
  }, []);

  /* ─── Per-slide content entrance ─── */
  const animateSlideContent = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const slide = section.querySelector(`[data-slide="${index}"]`);
    if (!slide) return;

    gsap.context(() => {
      gsap.fromTo(
        slide.querySelector(".hero-badge"),
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(
        slide.querySelector(".hero-cta"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.35 }
      );
      gsap.fromTo(
        slide.querySelector(".hero-trust"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.55 }
      );
    }, slide);
  }, []);

  /* ─── Progress bar ─── */
  const handleNextRef = useRef<() => void>(() => {});

  const startProgress = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    const TOTAL_MS = 6000;
    const INTERVAL_MS = 30;
    const STEP = (INTERVAL_MS / TOTAL_MS) * 100;
    let current = 0;

    progressIntervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      current += STEP;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = undefined;
        handleNextRef.current();
      } else {
        setProgress(current);
      }
    }, INTERVAL_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Slide transition — Ken Burns crossfade ─── */
  const animateSlide = useCallback(
    (fromIndex: number, toIndex: number) => {
      const slider = sliderRef.current;
      if (!slider || isAnimatingRef.current || fromIndex === toIndex) return;
      isAnimatingRef.current = true;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

      const fromSlide = slider.querySelector(`[data-slide="${fromIndex}"]`) as HTMLElement | null;
      const toSlide   = slider.querySelector(`[data-slide="${toIndex}"]`)   as HTMLElement | null;
      if (!fromSlide || !toSlide) {
        isAnimatingRef.current = false;
        startProgress();
        return;
      }

      const fromImg = fromSlide.querySelector(".ken-burns-img") as HTMLElement | null;
      if (fromImg) {
        gsap.context(() => {
          gsap.to(fromImg, { scale: 1, duration: 0.3, ease: "power2.in" });
        }, fromImg);
      }

      gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            isAnimatingRef.current = false;
            animateSlideContent(toIndex);
            animateKenBurns(toIndex);
            startProgress();
          },
        });

        tl.to(fromSlide, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
        tl.fromTo(
          toSlide,
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out" },
          "-=0.05"
        );
      }, slider);

      animTimeoutRef.current = setTimeout(() => {
        if (isAnimatingRef.current) {
          isAnimatingRef.current = false;
          animateSlideContent(toIndex);
          animateKenBurns(toIndex);
          startProgress();
        }
      }, 1000);
    },
    [animateSlideContent, animateKenBurns, startProgress]
  );

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % activeBanners.length;
      animateSlide(prev, next);
      return next;
    });
  }, [activeBanners.length, animateSlide]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => {
      const prevIdx = (prev - 1 + activeBanners.length) % activeBanners.length;
      animateSlide(prev, prevIdx);
      return prevIdx;
    });
  }, [activeBanners.length, animateSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide((prev) => {
        if (prev !== index) animateSlide(prev, index);
        return index;
      });
    },
    [animateSlide]
  );

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  useEffect(() => {
    if (!activeBanners.length) return;
    animateSlideContent(currentSlide);
    animateKenBurns(currentSlide);
    startProgress();
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
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

  /* ─── Handle CTA click: route based on auth status ─── */
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
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-orange-100">
          <div
            className="h-full bg-orange-500 rounded-r-full transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Slides */}
        <div ref={sliderRef} className="relative overflow-hidden">
          {/* Spacer div maintains the aspect ratio */}
          <div className="w-full aspect-[21/9] sm:aspect-[21/9] lg:aspect-[64/18]" />

          {activeBanners.map((b, idx) => (
            <div
              key={b.id}
              data-slide={idx}
              className={cn(
                "absolute inset-0 w-full h-full overflow-hidden transition-none",
                idx === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
              )}
              style={{ pointerEvents: idx === currentSlide ? "auto" : "none" }}
            >
              {/* Responsive banner image with Ken Burns effect */}
              <picture>
                {b.avifImage && <source type="image/avif" srcSet={b.avifImage} />}
                {b.webpImage && <source type="image/webp" srcSet={b.webpImage} />}
                <source media="(max-width: 639px)" srcSet={b.mobileImage ?? b.desktopImage} />
                <img
                  src={b.desktopImage}
                  alt={b.title}
                  className="ken-burns-img w-full h-full object-cover will-change-transform"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </picture>

              {/* Subtle dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-[1]" />

              {/* Content wrapper */}
              <div className="absolute inset-0 z-10 flex items-center">
                <div className="flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 max-w-2xl">
                  {/* Badge */}
                  {b.badge && (
                    <span className="hero-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-3 sm:mb-4 w-fit bg-white/20 backdrop-blur-sm text-white shadow-sm border border-white/20">
                      {b.badge}
                    </span>
                  )}

                  {/* CTA */}
                  <Link
                    to={user ? b.link || "/marketplace" : "/auth"}
                    onClick={handleCTA}
                    className="hero-cta mt-4 sm:mt-6 inline-flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-fit active:scale-95 hover:scale-105 bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {user ? b.cta || "Shop Now" : "Sign In to Shop"}
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>

                  {/* Trust indicators */}
                  <div className="hero-trust hidden sm:flex items-center gap-4 mt-4 text-[11px] text-white/80">
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

        {/* Nav Arrows */}
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

        {/* Dot indicators */}
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
                  backgroundColor:
                    index === currentSlide ? "#F97316" : undefined,
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Pause indicator */}
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
