import { Link, useNavigate } from "react-router";
import { useState, type FormEvent } from "react";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { footerLinks } from "@/lib/constants";
import { useAuth } from "@/lib/auth";

/**
 * Map footer link text → route path or external URL.
 * Fallback:  #  if no mapping is defined.
 */
function linkToRoute(label: string): string {
  const map: Record<string, string> = {
    // Sell on SokoDigital
    "Become a Vendor": "/sell",
    "Become a Manufacturer": "/sell",
    "Seller Dashboard": "/dashboard/listings",
    "Seller Academy": "/dashboard/listings/new",
    Advertising: "/contact",
    // Get Support
    "Help Center": "/contact",
    "Check Order Status": "/dashboard",
    "Live Chat": "/chat",
    "Refund Policy": "/contact",
    "Contact Us": "/contact",
    // Payment & Protection
    "Safe and Easy Payment": "/",
    "Money Back Policy": "/contact",
    "On-Time Shipping": "/",
    "After Sales Protection": "/contact",
    "Secure Checkout": "/checkout",
    // Resources
    "SokoDigital Logistics": "/",
    "Sales Tax & VAT": "/",
    "Shipping Info": "/",
    "Returns Center": "/cart",
    FAQ: "/contact",
    // Get to Know Us
    "About SokoDigital": "/about",
    "Corporate Responsibility": "/about",
    "News Center": "/",
    Careers: "/about",
    "Press Kit": "/about",
  };
  return map[label] || "#";
}

/** Social links with real URLs */
const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/sokodigital", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/sokodigital", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/sokodigital", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@sokodigital", label: "Youtube" },
  { icon: Linkedin, href: "https://linkedin.com/company/sokodigital", label: "LinkedIn" },
];

export function Footer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("sending");
    // Simulate signup — in production, call an API endpoint
    await new Promise((r) => setTimeout(r, 800));
    setNewsletterStatus("sent");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterStatus("idle"), 3000);
  };

  return (
    <footer className="mt-auto pt-12">
      {/* Colored bar */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary" />

      <div className="bg-card py-10">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Brand + Social + Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <Logo className="h-16 w-auto text-primary" />
              </Link>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Tanzania's premier online marketplace. Shop millions of products from trusted sellers across the nation.
              </p>
              <div className="flex items-center gap-2 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 text-muted-foreground group"
                    aria-label={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:text-right">
              <h4 className="text-sm font-bold text-primary mb-2">Stay in the loop</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get exclusive deals and new arrivals straight to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm md:ml-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterStatus === "sending" || newsletterStatus === "sent"}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center gap-1.5"
                >
                  {newsletterStatus === "sending" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : newsletterStatus === "sent" ? (
                    "Subscribed!"
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-bold text-primary mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.slice(0, 5).map((link) => {
                    const route = linkToRoute(link);
                    if (route.startsWith("http")) {
                      return (
                        <li key={link}>
                          <a
                            href={route}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={link}>
                        <Link
                          to={route}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick actions row */}
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    My Dashboard
                  </Link>
                  <span className="text-border text-xs">|</span>
                  <button
                    onClick={() => navigate("/cart")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Cart
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-primary hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                  <span className="text-border text-xs">|</span>
                  <Link
                    to="/register"
                    className="text-xs font-semibold text-primary hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </>
              )}
              <span className="text-border text-xs">|</span>
              <Link
                to="/sell"
                className="text-xs font-semibold text-primary hover:underline transition-colors"
              >
                Start Selling
              </Link>
              <span className="text-border text-xs">|</span>
              <Link
                to="/marketplace"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-muted-foreground">
              &copy; {new Date().getFullYear()} SokoDigital. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <span className="text-border">|</span>
              <Link to="/about" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <span className="text-border">|</span>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
