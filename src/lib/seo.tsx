import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
}

const SITE_NAME = "SokoDigital";
const DEFAULT_DESC = "Tanzania's premier online marketplace connecting buyers and sellers across the nation.";
const DEFAULT_OG = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80&fm=webp&fit=crop";

/**
 * Lightweight SEO component — sets <title> and <meta> tags on mount.
 * No external dependencies needed.
 */
export function SEO({ title, description = DEFAULT_DESC, ogImage = DEFAULT_OG }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:card", "summary_large_image");
  }, [title, description, ogImage]);

  return null;
}

/** Route → SEO config map for the app */
export interface RouteMeta {
  title: string;
  description?: string;
}

export const routeMeta: Record<string, RouteMeta> = {
  "/": { title: "Home — Shop Tanzania" },
  "/marketplace": { title: "Marketplace", description: "Browse thousands of products from trusted sellers across Tanzania." },
  "/categories": { title: "Categories", description: "Browse products by category — Phones, Fashion, Electronics, Groceries & more." },
  "/deals": { title: "Today's Deals", description: "Flash sales and limited-time discounts on top brands." },
  "/shops": { title: "Popular Stores", description: "Discover trusted sellers and stores on SokoDigital." },
  "/wishlist": { title: "My Wishlist", description: "View and manage your saved products." },
  "/cart": { title: "Shopping Cart", description: "Review your items before checkout." },
  "/checkout": { title: "Checkout", description: "Complete your purchase securely." },
  "/about": { title: "About Us", description: "Learn about SokoDigital's mission, team, and journey." },
  "/privacy": { title: "Privacy Policy", description: "How we collect, use, and protect your personal information." },
  "/terms": { title: "Terms of Service", description: "Terms governing your use of the SokoDigital marketplace." },
  "/contact": { title: "Contact Us", description: "Get in touch with our support team." },
  "/faq": { title: "Frequently Asked Questions", description: "Find answers about orders, payments, returns & selling." },
  "/returns": { title: "Returns & Refunds", description: "Hassle-free returns — initiate a return within 14 days." },
  "/messages": { title: "Messages", description: "Chat with sellers and SokoDigital support." },
  "/chat": { title: "AI Assistant", description: "Get help from the SokoDigital AI assistant." },
  "/auth": { title: "Sign In", description: "Sign in or create a SokoDigital account." },
  "/login": { title: "Sign In", description: "Sign in to your SokoDigital account." },
  "/register": { title: "Create Account", description: "Join SokoDigital as a buyer or seller." },
  "/dashboard": { title: "Dashboard", description: "Manage your orders, listings, and profile." },
  "/dashboard/listings": { title: "My Listings", description: "View and manage your product listings." },
  "/dashboard/listings/new": { title: "New Listing", description: "Add a new product listing." },
  "/sell": { title: "Start Selling", description: "Register as a seller on SokoDigital." },
  "/admin": { title: "Admin Dashboard", description: "Manage the SokoDigital platform." },
  "/order": { title: "Order Details", description: "View your order details and status." },
  "/thank-you": { title: "Order Confirmed", description: "Your order has been placed successfully." },
  "/stores": { title: "All Stores", description: "Browse all stores and sellers on SokoDigital." },
};

/**
 * Hook for dynamic routes — call this inside a page component to override SEO.
 * Works together with the static routeMeta in AnimatedPage.
 */
export function usePageSEO(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description || DEFAULT_DESC);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description || DEFAULT_DESC, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description || DEFAULT_DESC);
  }, [title, description]);
}
