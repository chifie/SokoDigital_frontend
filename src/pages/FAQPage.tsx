import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { ChevronDown, Search, MessageCircle, HelpCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 2-5 business days within Tanzania. Express delivery is available for 1-2 day delivery in major cities. Delivery times vary based on your location and the seller's location." },
      { q: "Can I track my order?", a: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order from your Dashboard under 'Orders'." },
      { q: "What shipping methods are available?", a: "We offer Standard and Express shipping. Some sellers also offer Free Shipping on orders above a certain amount. The available options are shown at checkout." },
      { q: "Do you ship to all regions in Tanzania?", a: "Yes, we deliver to all regions including Dar es Salaam, Arusha, Mwanza, Zanzibar, Mbeya, Dodoma, and more. Remote areas may have extended delivery times." },
      { q: "Can I change my shipping address after placing an order?", a: "You can change your shipping address within 1 hour of placing the order. Contact our support team immediately and we'll help you update it." },
    ],
  },
  {
    category: "Payments & Pricing",
    items: [
      { q: "What payment methods are accepted?", a: "We accept M-Pesa, Tigo Pesa, Airtel Money, bank transfers, and credit/debit cards. All payments are processed securely." },
      { q: "Is it safe to pay online?", a: "Absolutely. All payments are encrypted and processed through secure payment gateways. We never store your payment information." },
      { q: "Are prices in Tanzanian Shillings?", a: "Yes, all prices are listed in Tanzanian Shillings (TZS) and include applicable taxes unless stated otherwise." },
      { q: "Can I pay on delivery?", a: "Cash on delivery is available for selected sellers and locations. Look for the 'Pay on Delivery' option at checkout." },
      { q: "Do you offer discounts or promo codes?", a: "Yes! We regularly offer discounts, flash sales, and promo codes. Follow us on social media and subscribe to our newsletter to stay updated." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "Most products can be returned within 14 days of delivery. The product must be unused and in its original packaging. Some items like perishable goods cannot be returned." },
      { q: "How do I initiate a return?", a: "Go to your Dashboard > Orders, find the order you want to return, and click 'Return Item'. Follow the instructions to print the return label and drop off the package." },
      { q: "How long do refunds take?", a: "Refunds are processed within 5-7 business days after we receive the returned item. The money will be sent back to your original payment method." },
      { q: "What if I receive a damaged item?", a: "If you receive a damaged or incorrect item, contact us within 48 hours of delivery. We'll arrange a free return and send a replacement immediately." },
    ],
  },
  {
    category: "Selling on SokoDigital",
    items: [
      { q: "How do I become a seller?", a: "Click 'Start Selling' on our website, complete the registration form, and verify your business. Once approved, you can start listing products immediately." },
      { q: "What are the selling fees?", a: "There are no registration fees. We charge a small commission on each sale. The exact percentage depends on your product category. Check our Seller Academy for details." },
      { q: "How do I get paid?", a: "Sellers receive payments directly to their registered mobile money or bank account. Payouts are processed weekly for confirmed deliveries." },
      { q: "Can I sell both new and used items?", a: "Yes, you can sell new, used, and refurbished items. Make sure to clearly mark the condition of each product in your listing." },
    ],
  },
  {
    category: "Account & Security",
    items: [
      { q: "How do I create an account?", a: "Click 'Log In' and then 'Create an Account'. You can sign up with your email or continue with Google. It takes less than a minute." },
      { q: "I forgot my password. What should I do?", a: "Click 'Forgot Password?' on the login page. Enter your email address and we'll send you a link to reset your password." },
      { q: "How is my personal data protected?", a: "We use industry-standard encryption and security measures to protect your data. See our Privacy Policy for detailed information." },
      { q: "Can I delete my account?", a: "Yes, you can request account deletion by contacting our support team. Your data will be permanently removed within 30 days." },
    ],
  },
];

export default function FAQPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allFaqs = faqs.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  );

  const filtered = searchQuery.trim()
    ? allFaqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".faq-category"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: main.querySelector(".faq-content"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 py-12 sm:py-16">
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
            <p className="text-white/70 mt-2 max-w-lg mx-auto text-sm">
              Find answers to common questions about shopping and selling on SokoDigital.
            </p>
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/15 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        <div className="faq-content px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
          {searchQuery.trim() ? (
            <div className="max-w-3xl mx-auto">
              {filtered.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">{filtered.length} result(s) found</p>
                  {filtered.map((faq, i) => {
                    const key = `search-${i}`;
                    return (
                      <div key={key} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", openItems[key] && "rotate-180")} />
                        </button>
                        {openItems[key] && (
                          <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No FAQs found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {faqs.map((cat) => (
                <div key={cat.category} className="faq-category">
                  <h2 className="text-lg font-bold mb-4">{cat.category}</h2>
                  <div className="space-y-2">
                    {cat.items.map((item, i) => {
                      const key = `${cat.category}-${i}`;
                      return (
                        <div key={key} className="rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/20 transition-colors">
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                          >
                            <span>{item.q}</span>
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", openItems[key] && "rotate-180")} />
                          </button>
                          {openItems[key] && (
                            <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Still need help? */}
          <div className="text-center mt-12 p-8 rounded-2xl bg-card border border-border/50 max-w-xl mx-auto">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-base font-bold mb-1">Still have questions?</h3>
            <p className="text-xs text-muted-foreground mb-4">Our support team is ready to help you.</p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
