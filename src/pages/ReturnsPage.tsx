import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Package, ClipboardCheck, Truck, CreditCard, Shield, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Package, title: "Request Return", desc: "Log in to your account, go to Orders, and click 'Return Item' on the product you want to return." },
  { icon: ClipboardCheck, title: "Get Approved", desc: "Your return request is reviewed within 24 hours. You'll receive an email once approved." },
  { icon: Truck, title: "Ship It Back", desc: "Print the free return label and drop off the package at the nearest collection point." },
  { icon: CheckCircle, title: "Inspection", desc: "Once received, our team inspects the item to ensure it meets return conditions within 2 days." },
  { icon: CreditCard, title: "Refund Issued", desc: "Your refund is processed within 48 hours of inspection. Funds return to your original payment method." },
];

const conditions = [
  { icon: CheckCircle, good: true, text: "Item must be unused and in original condition" },
  { icon: CheckCircle, good: true, text: "Original packaging must be included" },
  { icon: CheckCircle, good: true, text: "Return must be initiated within 14 days of delivery" },
  { icon: CheckCircle, good: true, text: "All tags and accessories must be attached" },
  { icon: AlertCircle, good: false, text: "Perishable goods cannot be returned" },
  { icon: AlertCircle, good: false, text: "Custom/personalized items are non-returnable" },
  { icon: AlertCircle, good: false, text: "Digital/downloadable products are non-returnable" },
  { icon: AlertCircle, good: false, text: "Items damaged by improper use are not eligible" },
];

export default function ReturnsPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".return-animate"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".return-content"), start: "top 90%", once: true } }
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Returns & Refunds</h1>
            <p className="text-white/70 mt-2 max-w-lg mx-auto text-sm">
              Easy, hassle-free returns. We make it simple to return your purchases.
            </p>
          </div>
        </div>

        <div className="return-content px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Quick Summary */}
            <div className="return-animate grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: "14-Day Returns", desc: "Initiate a return within 14 days of delivery" },
                { icon: Truck, title: "Free Return Shipping", desc: "We provide free return labels" },
                { icon: CreditCard, title: "Fast Refunds", desc: "Refunds processed within 5-7 business days" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-5 rounded-xl bg-card border border-border/50 text-center">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Return Process */}
            <div>
              <h2 className="text-xl font-bold mb-6">How to Return an Item</h2>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />
                <div className="space-y-6">
                  {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i} className="return-animate relative flex items-start gap-5">
                        <div className="relative z-10 shrink-0">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-background">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="pt-1.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-primary">Step {i + 1}</span>
                          </div>
                          <h3 className="text-sm font-semibold">{step.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div>
              <h2 className="text-xl font-bold mb-6">Return Conditions</h2>
              <div className="return-animate grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
                    <div className={c.good ? "text-emerald-500 shrink-0 mt-0.5" : "text-rose-500 shrink-0 mt-0.5"}>
                      {c.good ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="return-animate p-6 rounded-2xl bg-card border border-border/50">
              <h2 className="text-base font-bold mb-4">Common Questions</h2>
              <div className="space-y-3">
                {[
                  { q: "How long does a refund take?", a: "Refunds are processed within 5-7 business days after we receive your return. The time it takes for the money to appear in your account depends on your payment method." },
                  { q: "Can I exchange an item instead of returning it?", a: "Yes, you can request an exchange during the return process. We'll ship the replacement once the return is received." },
                  { q: "Who pays for return shipping?", a: "We provide free return shipping for most items. In some cases, return shipping costs may be deducted from your refund." },
                  { q: "What if my item arrived damaged?", a: "Contact us within 48 hours of delivery with photos of the damage. We'll arrange a free return and send a replacement or full refund." },
                ].map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 cursor-pointer text-sm font-medium [&::-webkit-details-marker]:hidden">
                      <span>{faq.q}</span>
                      <HelpCircle className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="return-animate text-center py-8">
              <h2 className="text-lg font-bold mb-2">Ready to start a return?</h2>
              <p className="text-sm text-muted-foreground mb-4">Go to your Dashboard and find the order you want to return.</p>
              <Button asChild>
                <Link to="/dashboard">Go to My Orders</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Questions? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
