/**
 * Lightweight performance tracker for measuring image load times
 * and key user experience metrics.
 *
 * Usage:
 *   import { perfTracker } from "@/lib/performance-tracker";
 *
 *   // Track image load completion
 *   perfTracker.imageLoaded("hero-banner-1", Date.now() - start);
 *
 *   // Get cumulative report
 *   console.table(perfTracker.getReport());
 */

type MetricName = "hero-image" | "product-image" | "avatar" | "category-image" | "seller-logo" | "other";

interface MetricEntry {
  name: string;
  type: MetricName;
  loadTimeMs: number;
  url: string;
  timestamp: number;
}

interface MetricSummary {
  type: MetricName;
  count: number;
  avgLoadTimeMs: number;
  minLoadTimeMs: number;
  maxLoadTimeMs: number;
  totalLoadTimeMs: number;
}

class PerformanceTracker {
  private entries: MetricEntry[] = [];
  private marks: Map<string, number> = new Map();
  private enabled = false;

  constructor() {
    // Only enable in production or when ?perf=true is present
    if (typeof window !== "undefined") {
      this.enabled =
        import.meta.env.PROD ||
        new URLSearchParams(window.location.search).has("perf");
    }
  }

  /** Mark a starting point for timing */
  mark(name: string): void {
    if (!this.enabled) return;
    this.marks.set(name, performance.now());
  }

  /** Measure elapsed time from a mark */
  measure(name: string, type: MetricName = "other", url: string = ""): number | null {
    if (!this.enabled) return null;
    const start = this.marks.get(name);
    if (!start) return null;
    const elapsed = performance.now() - start;
    this.entries.push({
      name,
      type,
      loadTimeMs: Math.round(elapsed),
      url: url.slice(0, 120),
      timestamp: Date.now(),
    });
    this.marks.delete(name);
    return elapsed;
  }

  /** Record a direct image load time */
  imageLoaded(name: string, type: MetricName, loadTimeMs: number, url: string = ""): void {
    if (!this.enabled) return;
    this.entries.push({
      name,
      type,
      loadTimeMs: Math.round(loadTimeMs),
      url: url.slice(0, 120),
      timestamp: Date.now(),
    });
  }

  /** Get a summary grouped by metric type */
  getSummary(): MetricSummary[] {
    const groups = new Map<MetricName, MetricEntry[]>();
    for (const entry of this.entries) {
      const group = groups.get(entry.type) || [];
      group.push(entry);
      groups.set(entry.type, group);
    }

    return Array.from(groups.entries()).map(([type, entries]) => {
      const times = entries.map((e) => e.loadTimeMs);
      return {
        type,
        count: entries.length,
        avgLoadTimeMs: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        minLoadTimeMs: Math.min(...times),
        maxLoadTimeMs: Math.max(...times),
        totalLoadTimeMs: times.reduce((a, b) => a + b, 0),
      };
    });
  }

  /** Get all raw entries */
  getEntries(): MetricEntry[] {
    return [...this.entries];
  }

  /** Log a formatted report to the console */
  logReport(): void {
    if (!this.enabled) return;
    const summary = this.getSummary();
    console.group("📊 SokoDigital Performance Report");
    console.log(`Total images tracked: ${this.entries.length}`);
    console.log(`Total load time: ${this.entries.reduce((s, e) => s + e.loadTimeMs, 0).toLocaleString()}ms`);
    console.log("");
    console.table(summary);
    console.log("");
    if (summary.length > 0) {
      const slowest = [...this.entries].sort((a, b) => b.loadTimeMs - a.loadTimeMs)[0];
      console.warn(`⚠️  Slowest image: "${slowest.name}" (${slowest.loadTimeMs}ms) — ${slowest.url}`);
    }
    console.groupEnd();
  }

  /** Reset all tracked data */
  reset(): void {
    this.entries = [];
    this.marks.clear();
  }

  /** Get LCP (Largest Contentful Paint) if available */
  getLCP(): Promise<number | null> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
        resolve(null);
        return;
      }
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) {
            resolve(Math.round(last.startTime));
          }
          observer.disconnect();
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
        // Timeout after 10s
        setTimeout(() => resolve(null), 10000);
      } catch {
        resolve(null);
      }
    });
  }
}

export const perfTracker = new PerformanceTracker();
