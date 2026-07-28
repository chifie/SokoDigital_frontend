import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  User, Package, Heart, MapPin, CreditCard, Clock,
  ShoppingBag, Star, ChevronRight, LogOut, Shield,
  Bell, Store, Plus, ArrowRight, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AIWidget } from "@/components/site/AIWidget";
import { cn, formatTZS } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const orders = [
  { id: "ORD-2024-001", date: "Jul 12, 2024", status: "delivered", items: 3, total: 4289000, payment: "M-Pesa" },
  { id: "ORD-2024-002", date: "Jul 10, 2024", status: "shipped", items: 1, total: 85000, payment: "Airtel Money" },
  { id: "ORD-2024-003", date: "Jul 5, 2024", status: "processing", items: 2, total: 698000, payment: "Visa" },
];

const wishlistItems = [
  { name: "MacBook Pro 14\" M3 Pro", price: 4490000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=100&fm=webp&fit=crop" },
  { name: "Samsung 65\" 4K Smart TV", price: 2490000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=100&fm=webp&fit=crop" },
  { name: "Premium Leather Handbag", price: 350000, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=100&fm=webp&fit=crop" },
];

const addresses = [
  { label: "Home", street: "123 Maktaba Street, Kariakoo", city: "Dar es Salaam", default: true },
  { label: "Office", street: "456 Samora Ave, City Centre", city: "Dar es Salaam", default: false },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  delivered: { label: "Delivered", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  shipped: { label: "Shipped", color: "text-blue-500", bg: "bg-blue-500/10" },
  processing: { label: "Processing", color: "text-amber-500", bg: "bg-amber-500/10" },
  cancelled: { label: "Cancelled", color: "text-rose-500", bg: "bg-rose-500/10" },
};

export default function DashboardPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".dash-profile"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".dash-profile"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".dash-stats"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".dash-stats"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".dash-tabs"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".dash-tabs"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Profile Header */}
          <div className="dash-profile flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-6 rounded-2xl border border-border/50 bg-card">
            <Avatar className="h-16 w-16 rounded-2xl ring-4 ring-border/50">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback className="rounded-2xl text-2xl">J</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">John Mushi</h1>
              <p className="text-sm text-muted-foreground">john@sokodigital.co.tz · +255 712 345 678</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="rounded-full text-[10px] px-2.5 py-0.5 bg-primary/10 text-primary">
                  <ShoppingBag className="h-3 w-3 mr-1" /> Buyer
                </Badge>
                <Badge variant="secondary" className="rounded-full text-[10px] px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Shield className="h-3 w-3 mr-1" /> Verified
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate("/sell")}>
              <Store className="h-3.5 w-3.5 mr-1.5" /> Start Selling
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="dash-stats grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Package, label: "Orders", value: "12", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Heart, label: "Wishlist", value: "5", color: "text-rose-500", bg: "bg-rose-500/10" },
              { icon: Star, label: "Reviews", value: "8", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: CreditCard, label: "Saved Cards", value: "2", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl border border-border/50 bg-card text-center hover:shadow-sm transition">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-2", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Tabs */}
          <div className="dash-tabs">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-muted p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {[
                { id: "orders", label: "Orders", icon: Package },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "addresses", label: "Addresses", icon: MapPin },
                { id: "payments", label: "Payments", icon: CreditCard },
                { id: "profile", label: "Profile", icon: User },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-3">
                {orders.map((order, i) => {
                  const status = statusConfig[order.status] || statusConfig.processing;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:shadow-sm transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.date} · {order.items} item(s)</p>
                          <p className="text-xs text-muted-foreground">Paid via {order.payment}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatTZS(order.total)}</p>
                        <Badge className={cn("rounded-full text-[10px] mt-1", status.bg, status.color, "border-0")}>
                          {status.label}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
                <Button variant="ghost" className="w-full rounded-xl text-sm gap-2">
                  View All Orders <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <div className="space-y-3">
                {wishlistItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card"
                  >
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      <OptimizedImage src={item.image} alt={item.name} wrapperClassName="h-full w-full" shimmer={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-sm font-bold mt-0.5">{formatTZS(item.price)}</p>
                    </div>
                    <Button size="sm" className="rounded-xl text-xs shrink-0">
                      Add to Cart
                    </Button>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.label} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{addr.label}</p>
                        {addr.default && <Badge className="text-[10px] bg-primary/10 text-primary border-0 rounded-full">Default</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{addr.street}</p>
                      <p className="text-xs text-muted-foreground">{addr.city}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5">
                  <Plus className="h-4 w-4" /> Add New Address
                </Button>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="space-y-3">
                {[
                  { name: "M-Pesa", number: "+255 712 345 678", icon: "smartphone" },
                  { name: "Visa", number: "**** 4821", icon: "credit-card" },
                ].map((pm) => (
                  <div key={pm.name} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.name}</p>
                      <p className="text-xs text-muted-foreground">{pm.number}</p>
                    </div>
                    <Badge className="rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 border-0">Default</Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5">
                  <Plus className="h-4 w-4" /> Add Payment Method
                </Button>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="space-y-4">
                {[
                  { icon: User, label: "Full Name", value: "John Mushi" },
                  { icon: Mail, label: "Email", value: "john@sokodigital.co.tz" },
                  { icon: Phone, label: "Phone", value: "+255 712 345 678" },
                  { icon: Bell, label: "Notifications", value: "Enabled" },
                  { icon: Shield, label: "Two-Factor Auth", value: "Disabled" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card">
                    <item.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 text-rose-500 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            </TabsContent>            </Tabs>
          </div>

          {/* Recently Viewed */}
          <div className="mt-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recently Viewed
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shrink-0 w-36 p-3 rounded-xl border border-border/50 bg-card">
                  <div className="h-24 rounded-lg bg-muted mb-2" />
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
      <AIWidget />
    </motion.div>
  );
}
