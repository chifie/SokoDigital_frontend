import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart, Trash2, Minus, Plus, ArrowLeft, Tag,
  Truck, Shield, CreditCard, ArrowRight, Heart, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AIWidget } from "@/components/site/AIWidget";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { useCart } from "@/lib/cart-context";
import { paymentMethods } from "@/lib/constants";
import { cn, formatTZS } from "@/lib/utils";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";

export default function CartPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { items: cartItems, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();
  const shipping = subtotal >= 500000 ? 0 : 15000;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  useGsapScroll(mainRef, [
    { selector: '.cart-items', stagger: 0.06 },
    { selector: '.cart-summary', stagger: 0.06 },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground text-sm">{cartItems.length} items in your cart</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet</p>
              <Button className="rounded-full px-8" onClick={() => navigate("/marketplace")}>
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="cart-items lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all"
                  >
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                      <OptimizedImage src={item.image} alt={item.name} wrapperClassName="h-full w-full" shimmer={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item.productId}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">Seller: {item.sellerName}</p>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="h-8 w-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 bg-muted rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="h-7 w-7 rounded-lg hover:bg-background flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="h-7 w-7 rounded-lg hover:bg-background flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-base">{formatTZS(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Clear cart + Wishlist suggestion */}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-xs text-rose-500 hover:text-rose-600 gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30" onClick={clearCart}>
                    <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                  </Button>
                  <p className="text-xs text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground flex-1">
                    Items in your wishlist are waiting for you
                  </p>
                  <Button variant="ghost" size="sm" className="text-xs rounded-full">View Wishlist</Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="cart-summary lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatTZS(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5" />
                          Shipping
                        </span>
                        <span className={cn("font-medium", shipping === 0 && "text-emerald-500")}>
                          {shipping === 0 ? "Free" : formatTZS(shipping)}
                        </span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-emerald-500">
                          <span>Discount (10%)</span>
                          <span>-{formatTZS(discount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatTZS(total)}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div className="mt-4">
                      {couponApplied ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
                          <Tag className="h-4 w-4" />
                          <span>Code <strong>SAVE10</strong> applied!</span>
                          <button onClick={() => { setCouponApplied(false); setCouponCode(""); }} className="ml-auto text-xs underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="h-10 rounded-xl text-sm"
                          />
                          <Button
                            variant="outline"
                            className="h-10 rounded-xl shrink-0"
                            onClick={() => {
                              if (couponCode.toLowerCase() === "save10") setCouponApplied(true);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className="w-full mt-4 h-12 rounded-xl text-sm font-semibold gap-2"
                      onClick={() => navigate("/checkout")}
                    >
                      <CreditCard className="h-4 w-4" />
                      Proceed to Checkout
                    </Button>

                    {/* Payment methods */}
                    <div className="mt-4">
                      <p className="text-[11px] text-muted-foreground text-center mb-2">We accept</p>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {paymentMethods.slice(0, 5).map((p) => (
                          <span key={p.id} className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium text-muted-foreground">
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
                    {[
                      { icon: Shield, text: "Secure Checkout", desc: "SSL encrypted payment" },
                      { icon: Truck, text: "Free Delivery", desc: "On orders over 500,000 TZS" },
                      { icon: RotateCcw, text: "Easy Returns", desc: "14-day return policy" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-medium">{item.text}</p>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
      <AIWidget />
    </motion.div>
  );
}
