import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 1200);
  };

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".contact-animate"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".contact-content"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 py-12 sm:py-16">
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Us</h1>
            <p className="text-white/70 mt-2 max-w-lg mx-auto text-sm">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>

        <div className="contact-content px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Mail, title: "Email", desc: "support@sokodigital.co.tz", sub: "We reply within 2 hours" },
                { icon: Phone, title: "Phone", desc: "+255 712 345 6476", sub: "Mon-Fri 8AM-6PM" },
                { icon: MapPin, title: "Location", desc: "Dar es Salaam, Tanzania", sub: "Samora Avenue" },
                { icon: Clock, title: "Business Hours", desc: "Monday - Friday", sub: "8:00 AM - 6:00 PM" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="contact-animate flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-foreground mt-0.5">{item.desc}</p>
                      <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="contact-animate p-6 sm:p-8 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Send us a message</h2>
                    <p className="text-xs text-muted-foreground">Fill out the form below and we'll get back to you.</p>
                  </div>
                </div>

                {status === "sent" ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground mt-1">We'll get back to you within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Your Name</label>
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Your Email</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Issue</option>
                        <option value="payment">Payment Question</option>
                        <option value="seller">Seller Inquiry</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button type="submit" disabled={status === "sending"} className="w-full rounded-xl gap-2">
                      {status === "sending" ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
