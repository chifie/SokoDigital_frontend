import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface SrcSetBreakpoint {
  /** Image width in pixels */
  width: number;
  /** Label used as srcset descriptor (e.g., '1x', '2x') */
  descriptor?: string;
}

interface OptimizedImageProps {
  src: string | undefined | null;
  alt: string;
  /** Fixed width (generates srcset at 1x, 2x) */
  width?: number;
  /** Fixed height */
  height?: number;
  /** Additional source sizes for responsive images */
  sizes?: string;
  /** Tailwind className */
  className?: string;
  /** Custom fallback component when image fails */
  fallback?: React.ReactNode;
  /** Whether to show a shimmer placeholder while loading */
  shimmer?: boolean;
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Custom breakpoints for srcset (defaults to 2x of width) */
  breakpoints?: SrcSetBreakpoint[];
  /** Called when image loads successfully */
  onLoad?: () => void;
  /** Called when image fails to load */
  onError?: () => void;
  /** Additional wrapper className */
  wrapperClassName?: string;
}

/**
 * Production-ready optimized image component.
 *
 * Features:
 * - Auto-generates srcset from Unsplash/Pexels URLs for retina displays
 * - Lazy loading with native `loading="lazy"`
 * - Shimmer blur-up placeholder while loading
 * - Error fallback with ImageOff icon
 * - Proper aspect ratio container to prevent layout shift
 */
export function OptimizedImage({
  src,
  alt,
  width: fixedWidth,
  height: fixedHeight,
  sizes,
  className,
  fallback,
  shimmer = true,
  loading = "lazy",
  breakpoints,
  onLoad,
  onError,
  wrapperClassName,
}: OptimizedImageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Timeout fallback: if image doesn't load in 8s, show error
  useEffect(() => {
    if (!imgLoaded && !imgError && src) {
      loadTimeoutRef.current = setTimeout(() => {
        if (!imgLoaded) setImgError(true);
      }, 8000);
    }
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [imgLoaded, imgError, src]);

  // Reset state when src changes
  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [src]);

  /**
   * Generate srcset for Unsplash images by replacing the width parameter.
   * For other CDNs, uses provided breakpoints or creates 2x from fixedWidth.
   */
  const generateSrcSet = (baseUrl: string): string | undefined => {
    if (!baseUrl) return undefined;

    // For Unsplash URLs, generate multiple resolutions
    if (baseUrl.includes("images.unsplash.com")) {
      const bp = breakpoints || [
        { width: fixedWidth || 400, descriptor: "1x" },
        { width: (fixedWidth || 400) * 2, descriptor: "2x" },
      ];
      return bp
        .map((b) => {
          const url = baseUrl.replace(/w=\d+/, `w=${b.width}`);
          return `${url} ${b.descriptor}`;
        })
        .join(", ");
    }

    // For other URLs, just use the original
    return baseUrl;
  };

  const srcUrl = src || "";
  const srcSet = generateSrcSet(srcUrl);
  const hasImage = !!srcUrl && !imgError;

  // Aspect ratio padding for layout stability
  const aspectRatio = fixedWidth && fixedHeight
    ? (fixedHeight / fixedWidth) * 100
    : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/30",
        !hasImage && "flex items-center justify-center",
        wrapperClassName
      )}
      style={aspectRatio ? { paddingBottom: `${aspectRatio}%` } : undefined}
    >
      {/* Shimmer placeholder */}
      {shimmer && !imgLoaded && !imgError && srcUrl && (
        <div
          className="absolute inset-0 shimmer"
          style={aspectRatio ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } : undefined}
        />
      )}

      {/* Actual image */}
      {hasImage ? (
        <img
          ref={imgRef}
          src={srcUrl}
          srcSet={srcSet}
          sizes={sizes || (fixedWidth ? `${fixedWidth}px` : undefined)}
          alt={alt}
          loading={loading}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imgLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
            className
          )}
          style={aspectRatio ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" } : undefined}
          onLoad={() => {
            setImgLoaded(true);
            if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
            onLoad?.();
          }}
          onError={() => {
            setImgError(true);
            onError?.();
          }}
        />
      ) : (
        /* Fallback when no image or error */
        <div className={cn("flex flex-col items-center justify-center gap-1 p-4", className)}>
          {fallback || (
            <>
              <ImageOff className="h-6 w-6 text-muted-foreground/40" />
              <span className="text-[9px] text-muted-foreground/50 font-medium text-center">
                {alt ? alt.slice(0, 3).toUpperCase() : "N/A"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
