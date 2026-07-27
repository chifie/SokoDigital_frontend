import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  ArrowLeft, MapPin, Truck, CreditCard, Smartphone, Landmark,
  Shield, Check, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { paymentMethods } from "@/lib/constants";
import { cn, formatTZS } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const deliveryOptions = [
  { id: "standard", name: "Standard Delivery", desc: "5-7 business days", price: 0, eta: "Jul 22 - Jul 26" },
  { id: "express", name: "Express Delivery", desc: "2-3 business days", price: 25000, eta: "Jul 19 - Jul 20" },
  { id: "pickup", name: "Pickup Station", desc: "Pick up at nearest hub", price: 0, eta: "Jul 18" },
];

export default function CheckoutPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { user, loading, isAuthenticated } = useRequireAuth({
    preservePath: true,
    redirectTo: "/auth",
  });
  const [step] = useState<"delivery" | "payment" | "confirm">("delivery");
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const subtotal = 3490000 + 349000 * 2 + 89000;
  const shipping = selectedDelivery === "express" ? 25000 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  // Auth guard: show loader while resolving, redirect if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Verifying your session...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // redirect already triggered by useRequireAuth
  }

  if (isComplete) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
        <Header />
        <main ref={mainRef} className="flex-1 flex items-center justify-center pb-16 lg:pb-0">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto px-4">
            <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed</h2>
            {/* eslint-disable-next-line react-hooks/purity */}
            <p className="text-muted-foreground mb-2">Your order #ORD-{Date.now().toString(36).toUpperCase()} has been placed successfully.</p>
            <p className="text-sm text-muted-foreground mb-8">You'll receive a confirmation via SMS and email shortly.</p>
            <div className="flex items-center justify-center gap-3">
              <Button className="rounded-full px-6" onClick={() => navigate("/dashboard")}>Track Order</Button>
              <Button variant="outline" className="rounded-full px-6" onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
          </motion.div>
        </main>
        <Footer />
        <MobileBottomNav />
        <AIAssistant />
      </motion.div>
    );
  }


  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".checkout-delivery"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".checkout-delivery"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".checkout-payment"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".checkout-payment"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".checkout-summary"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".checkout-summary"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigate("/cart")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground text-sm">Complete your purchase</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { id: "delivery", label: "Delivery" },
              { id: "payment", label: "Payment" },
              { id: "confirm", label: "Confirm" },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step === s.id ? "bg-primary text-white" :
                  ["delivery", "payment", "confirm"].indexOf(step) > i ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                )}>
                  {["delivery", "payment", "confirm"].indexOf(step) > i ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium hidden sm:block", step === s.id ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                {i < 2 && <div className={cn("h-px w-8", ["delivery", "payment", "confirm"].indexOf(step) > i ? "bg-emerald-500" : "bg-border")} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="checkout-delivery rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Delivery Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium">Full Name</Label>
                    <Input defaultValue="John Mushi" className="h-11 rounded-xl mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Phone Number</Label>
                    <Input defaultValue="+255 712 345 678" className="h-11 rounded-xl mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-medium">Street Address</Label>
                    <Input defaultValue="123 Maktaba Street, Kariakoo" className="h-11 rounded-xl mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">City</Label>
                    <Input defaultValue="Dar es Salaam" className="h-11 rounded-xl mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Region</Label>
                    <Input defaultValue="Ilala" className="h-11 rounded-xl mt-1" />
                  </div>
                </div>
              </motion.div>

              {/* Delivery Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Delivery Method</h2>
                </div>
                <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery} className="space-y-3">
                  {deliveryOptions.map((opt) => (
                    <div key={opt.id} className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer",
                      selectedDelivery === opt.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                    )}>
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{opt.name}</p>
                          <span className={cn("text-sm font-semibold", opt.price === 0 && "text-emerald-500")}>
                            {opt.price === 0 ? "FREE" : formatTZS(opt.price)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc} • Estimated {opt.eta}</p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>

              {/* Step 2: Payment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="checkout-payment rounded-2xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid sm:grid-cols-2 gap-3">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon === "smartphone" ? Smartphone : pm.icon === "landmark" ? Landmark : CreditCard;
                    return (
                      <div key={pm.id} className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                        selectedPayment === pm.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                      )}>
                        <RadioGroupItem value={pm.id} id={pm.id} />
                        <Label htmlFor={pm.id} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <p className="font-medium text-sm">{pm.name}</p>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{pm.description}</p>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </motion.div>

              {/* Step 3: Order Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-border/50 bg-card p-6"
              >
                <Label className="text-xs font-medium mb-2 block">Order Note (Optional)</Label>
                <Input placeholder="Any special instructions for the seller?" className="h-11 rounded-xl" />
              </motion.div>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="checkout-summary lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h2 className="font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    {[
                      { name: "iPhone 15 Pro Max 256GB", qty: 1, price: 3490000 },
                      { name: "Wireless Headphones", qty: 2, price: 698000 },
                      { name: "Organic Skincare Bundle", qty: 1, price: 89000 },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-[10px] font-medium">{item.qty}</span>
                        <p className="text-xs text-muted-foreground flex-1 line-clamp-1">{item.name}</p>
                        <span className="text-xs font-medium">{formatTZS(item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2 mt-4 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatTZS(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className={cn(shipping === 0 && "text-emerald-500")}>{shipping === 0 ? "FREE" : formatTZS(shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatTZS(total)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6 h-12 rounded-xl text-sm font-semibold gap-2"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="mt-4 flex items-center gap-2 justify-center text-[11px] text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Secured with 256-bit SSL encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
    </motion.div>
  );
}
