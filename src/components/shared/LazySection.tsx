import { useState, useRef, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Distance from viewport in px to start rendering (default: 300) */
  rootMargin?: string;
  /** Placeholder shown before the section becomes visible */
  placeholder?: ReactNode;
  /** Minimum height to reserve layout space before rendering */
  minHeight?: string;
}

/**
 * Delays rendering of children until the element is within `rootMargin`
 * of the viewport.  Reduces initial JS parse / render cost for sections
 * far below the fold.
 */
export function LazySection({
  children,
  rootMargin = "300px",
  placeholder,
  minHeight = "200px",
}: LazySectionProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : placeholder}
    </div>
  );
}
