import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { CheckCircle, Package, Truck, MapPin, CreditCard, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/constants";

// Demo completed order data
const demoOrder = {
  orderNumber: "SKD-2026-38471",
  status: "confirmed" as const,
  placedAt: new Date(Date.now() - 3600000).toISOString(),
  estimatedDelivery: new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
  paymentMethod: "M-Pesa",
  paymentStatus: "paid" as const,
  subtotal: 3490000,
  shipping: 15000,
  discount: 350000,
  total: 3154000,
  shippingAddress: {
    name: "John Doe",
    phone: "+255 712 345 678",
    street: "123 Samora Avenue",
    city: "Dar es Salaam",
    region: "Dar es Salaam",
  },
  items: [
    { productId: "p1", slug: products[0].slug, name: "iPhone 15 Pro Max 256GB", image: products[0].images[0], price: 3150000, quantity: 1, seller: "TechHub Tanzania" },
    { productId: "p17", slug: products[16].slug, name: "Wireless Noise-Canceling Earbuds Pro", image: products[16].images[0], price: 145000, quantity: 1, seller: "TechHub Tanzania" },
    { productId: "p29", slug: products[28].slug, name: "Stainless Steel Water Bottle 1L", image: products[28].images[0], price: 28000, quantity: 2, seller: "SportZone TZ" },
  ],
};

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const mainRef = useRef<HTMLDivElement>(null);

  // In a real app, fetch order by id from Supabase
  const order = demoOrder;

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".order-animate"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".order-content"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  const formatTZS = (n: number) => `Tshs ${n.toLocaleString()}/=`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        {/* Success Banner */}
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 py-12 sm:py-16">
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16 text-center">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Confirmed!</h1>
            <p className="text-white/70 mt-2 text-sm">
              Your order #{order.orderNumber} has been placed successfully.
            </p>
            <p className="text-white/50 text-xs mt-1">
              Estimated delivery: {order.estimatedDelivery}
            </p>
          </div>
        </div>

        <div className="order-content px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Status Timeline */}
            <div className="order-animate p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="text-sm font-bold mb-4">Order Status</h3>
              <div className="flex items-center justify-between">
                {[
                  { label: "Confirmed", done: true, icon: CheckCircle },
                  { label: "Processing", done: true, icon: Package },
                  { label: "Shipped", done: false, icon: Truck },
                  { label: "Delivered", done: false, icon: ShoppingBag },
                ].map((step, i, arr) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex items-center gap-0 flex-1">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-xs",
                          step.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className={cn("text-[10px] mt-1", step.done ? "text-emerald-600 font-medium" : "text-muted-foreground")}>
                          {step.label}
                        </p>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={cn("flex-1 h-px mx-2 mt-[-1.5rem]", step.done ? "bg-emerald-500" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="order-animate p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="text-sm font-bold mb-4">Items Ordered ({order.items.length})</h3>
              <div className="divide-y divide-border/50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                      <OptimizedImage src={item.image} alt={item.name} wrapperClassName="h-full w-full" shimmer={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.slug}`} className="text-sm font-medium hover:text-primary transition-colors truncate block">
                        {item.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">Sold by {item.seller}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold">{formatTZS(item.price)}</span>
                        <span className="text-[10px] text-muted-foreground">× {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="order-animate p-5 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold">Shipping Address</h3>
                </div>
                <p className="text-xs font-medium">{order.shippingAddress.name}</p>
                <p className="text-[11px] text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-[11px] text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.region}</p>
                <p className="text-[11px] text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
              <div className="order-animate p-5 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold">Payment</h3>
                </div>
                <p className="text-xs font-medium">{order.paymentMethod}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{order.paymentStatus}</p>
                <div className="mt-3 space-y-1 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatTZS(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatTZS(order.shipping)}</span></div>
                  {order.discount > 0 && (
                    <div className="flex justify-between"><span className="text-emerald-600">Discount</span><span className="text-emerald-600">-{formatTZS(order.discount)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-border/50 mt-1">
                    <span>Total</span><span>{formatTZS(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="order-animate p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/20">
              <h3 className="text-sm font-bold mb-2">What's Next?</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <span>You'll receive a confirmation email with your order details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <span>We'll notify you when your order ships with a tracking number.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <span>Expected delivery: <strong>{order.estimatedDelivery}</strong></span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="order-animate flex flex-col sm:flex-row items-center gap-3 justify-center pt-2 pb-8">
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/dashboard">
                  <Package className="h-4 w-4 mr-1" />
                  View My Orders
                </Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/marketplace">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}
