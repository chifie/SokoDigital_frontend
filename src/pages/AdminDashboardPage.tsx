import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Store, Package, ShoppingCart, BarChart3, Shield,
  FileText, Check, X, Image,
  Search, Filter, TrendingUp, DollarSign,
  AlertTriangle, Ban, UserCheck, Eye, Edit3, Trash2, Plus,
  ToggleLeft, ToggleRight, Download, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AIWidget } from "@/components/site/AIWidget";
import { cn, formatTZS } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Demo data
const recentUsers = [
  { id: "u1", name: "John Mushi", email: "john@sokodigital.co.tz", role: "buyer", status: "active", joined: "Jul 12, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "u2", name: "Amina Hassan", email: "amina@sokodigital.co.tz", role: "seller", status: "active", joined: "Jun 28, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" },
  { id: "u3", name: "Peter Kamau", email: "peter@sokodigital.co.tz", role: "seller", status: "suspended", joined: "Jun 15, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter" },
  { id: "u4", name: "Grace Wanjiku", email: "grace@sokodigital.co.tz", role: "buyer", status: "active", joined: "Jul 1, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace" },
  { id: "u5", name: "Juma Bakari", email: "juma@sokodigital.co.tz", role: "seller", status: "pending", joined: "Jul 10, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juma" },
];

const verificationRequests = [
  { id: "v1", name: "Juma Bakari", storeName: "Juma Tech Store", email: "juma@sokodigital.co.tz", docs: ["TIN Certificate", "Business License", "National ID"], submitted: "Jul 10, 2024", status: "pending" },
  { id: "v2", name: "Sarah Akinyi", storeName: "Beauty & Glow TZ", email: "sarah@sokodigital.co.tz", docs: ["TIN Certificate", "National ID"], submitted: "Jul 8, 2024", status: "pending" },
  { id: "v3", name: "Rashid Salim", storeName: "Rashid Furniture", email: "rashid@sokodigital.co.tz", docs: ["Business License", "BRELA Registration", "National ID"], submitted: "Jul 5, 2024", status: "pending" },
];

const banners = [
  { id: "b1", title: "Premium Tech Deals", type: "hero", status: "active", priority: 1, startDate: "Jul 1", endDate: "Jul 15", impressions: 45200, clicks: 1230 },
  { id: "b2", title: "Tanzanian Fashion Week", type: "category", status: "active", priority: 2, startDate: "Jul 1", endDate: "Jul 31", impressions: 32100, clicks: 890 },
  { id: "b3", title: "Free Delivery Week", type: "promotional", status: "inactive", priority: 3, startDate: "Aug 1", endDate: "Aug 7", impressions: 0, clicks: 0 },
];

const recentOrders = [
  { id: "ORD-001", customer: "John Mushi", items: 3, total: 4289000, status: "delivered", date: "Jul 12" },
  { id: "ORD-002", customer: "Grace Wanjiku", items: 1, total: 85000, status: "shipped", date: "Jul 11" },
  { id: "ORD-003", customer: "Amina Hassan", items: 2, total: 698000, status: "processing", date: "Jul 10" },
  { id: "ORD-004", customer: "Peter Kamau", items: 1, total: 3490000, status: "pending", date: "Jul 9" },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: 1280, revenue: 4472000000, growth: "+12%" },
  { name: "Wireless Headphones", sales: 3450, revenue: 1204050000, growth: "+8%" },
  { name: "Organic Skincare Bundle", sales: 3450, revenue: 307050000, growth: "+23%" },
  { name: "Premium Kitenge Dress", sales: 2340, revenue: 152100000, growth: "+15%" },
];

// Chart data (simplified)
const weeklySales = [
  { day: "Mon", amount: 4200000, orders: 12 },
  { day: "Tue", amount: 3800000, orders: 10 },
  { day: "Wed", amount: 5100000, orders: 15 },
  { day: "Thu", amount: 4700000, orders: 13 },
  { day: "Fri", amount: 6800000, orders: 18 },
  { day: "Sat", amount: 7200000, orders: 22 },
  { day: "Sun", amount: 4500000, orders: 11 },
];

const maxAmount = Math.max(...weeklySales.map((s) => s.amount));

export default function AdminDashboardPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("overview");


  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".admin-stats"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".admin-stats"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".admin-content"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".admin-content"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Admin</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage your marketplace platform</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button size="sm" className="rounded-xl gap-1.5">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="admin-stats grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: DollarSign, label: "Total Revenue", value: formatTZS(4850000000), change: "+18%", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: ShoppingCart, label: "Total Orders", value: "23,450", change: "+12%", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Users, label: "Active Users", value: "12,890", change: "+8%", color: "text-violet-500", bg: "bg-violet-500/10" },
              { icon: Store, label: "Sellers", value: "1,234", change: "+15%", color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl border border-border/50 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <Badge className={cn("text-[10px] border-0 rounded-full", stat.color, stat.bg)}>
                    <TrendingUp className="h-3 w-3 mr-1" />{stat.change}
                  </Badge>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Verification Alert */}
          {verificationRequests.filter((v) => v.status === "pending").length > 0 && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400 flex-1">
                {verificationRequests.filter((v) => v.status === "pending").length} seller verification request(s) pending review
              </p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs"
                onClick={() => setActiveTab("verification")}
              >
                Review Now
              </Button>
            </div>
          )}

          {/* Tabs */}
          <div className="admin-content">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-muted p-1 rounded-xl w-full sm:w-auto overflow-x-auto flex-nowrap">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "users", label: "Users", icon: Users },
                { id: "verification", label: "Verification", icon: Shield },
                { id: "banners", label: "Banners", icon: Image },
                { id: "products", label: "Products", icon: Package },
                { id: "orders", label: "Orders", icon: ShoppingCart },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 p-6 rounded-xl border border-border/50 bg-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Weekly Sales</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-500" /> +15%</span>
                      vs last week
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {weeklySales.map((s) => (
                      <div key={s.day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{formatTZS(s.amount).replace(/TZS/g, '').trim()}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(s.amount / maxAmount) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={cn(
                            "w-full rounded-lg transition-all hover:opacity-80",
                            "bg-gradient-to-t from-primary to-blue-400"
                          )}
                        />
                        <span className="text-[10px] text-muted-foreground">{s.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="p-6 rounded-xl border border-border/50 bg-card">
                  <h3 className="font-semibold mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {topProducts.map((p, i) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{p.sales.toLocaleString()} sold</span>
                            <span>·</span>
                            <span className="text-emerald-500">{p.growth}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 p-6 rounded-xl border border-border/50 bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Orders</h3>
                    <Button variant="ghost" size="sm" className="text-xs rounded-full">View All</Button>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.customer} · {order.items} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatTZS(order.total)}</p>
                          <Badge className={cn(
                            "rounded-full text-[10px] border-0 mt-0.5",
                            order.status === "delivered" && "bg-emerald-500/10 text-emerald-500",
                            order.status === "shipped" && "bg-blue-500/10 text-blue-500",
                            order.status === "processing" && "bg-amber-500/10 text-amber-500",
                            order.status === "pending" && "bg-muted text-muted-foreground",
                          )}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Health */}
                <div className="p-6 rounded-xl border border-border/50 bg-card">
                  <h3 className="font-semibold mb-4">Platform Health</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Uptime", value: "99.9%", color: "text-emerald-500" },
                      { label: "Avg Response Time", value: "240ms", color: "text-emerald-500" },
                      { label: "Error Rate", value: "0.02%", color: "text-emerald-500" },
                      { label: "Active Users Now", value: "847", color: "text-blue-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className={cn("text-sm font-semibold", item.color)}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-border/30">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="h-9 pl-9 rounded-xl text-sm" />
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                  <Button size="sm" className="rounded-xl gap-1.5">
                    <UserCheck className="h-4 w-4" /> Invite
                  </Button>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Role</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Joined</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge className={cn(
                            "rounded-full text-[10px] border-0",
                            user.role === "seller" && "bg-blue-500/10 text-blue-500",
                            user.role === "buyer" && "bg-emerald-500/10 text-emerald-500",
                          )}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className={cn(
                              "h-2 w-2 rounded-full",
                              user.status === "active" && "bg-emerald-500",
                              user.status === "suspended" && "bg-rose-500",
                              user.status === "pending" && "bg-amber-500",
                            )} />
                            <span className="text-xs capitalize">{user.status}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground hidden lg:table-cell">{user.joined}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg">
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            {user.status !== "suspended" ? (
                              <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg text-rose-500">
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg text-emerald-500">
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification">
              <div className="space-y-4">
                {verificationRequests.map((req) => (
                  <div key={req.id} className="p-6 rounded-xl border border-border/50 bg-card">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.name}`} />
                          <AvatarFallback className="rounded-xl">{req.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{req.name}</p>
                          <p className="text-sm text-muted-foreground">{req.storeName}</p>
                          <p className="text-xs text-muted-foreground">{req.email}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/10 text-amber-500 border-0 rounded-full">Pending</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {req.docs.map((doc) => (
                        <div key={doc} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs">
                          <FileText className="h-3 w-3" />
                          {doc}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Submitted {req.submitted}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl text-xs text-rose-500 border-rose-200 dark:border-rose-800 gap-1">
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                        <Button size="sm" className="rounded-xl text-xs gap-1">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Banners Tab */}
            <TabsContent value="banners">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{banners.filter((b) => b.status === "active").length} active banners</p>
                  <Button size="sm" className="rounded-xl gap-1.5">
                    <Plus className="h-4 w-4" /> Create Banner
                  </Button>
                </div>
                {banners.map((banner) => (
                  <div key={banner.id} className="p-5 rounded-xl border border-border/50 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{banner.title}</h3>
                          <Badge className={cn(
                            "rounded-full text-[10px] border-0",
                            banner.type === "hero" && "bg-violet-500/10 text-violet-500",
                            banner.type === "category" && "bg-blue-500/10 text-blue-500",
                            banner.type === "promotional" && "bg-amber-500/10 text-amber-500",
                          )}>{banner.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Priority {banner.priority}</span>
                          <span>·</span>
                          <span>{banner.startDate} - {banner.endDate}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span>{banner.impressions.toLocaleString()} impressions</span>
                          <span>{banner.clicks.toLocaleString()} clicks</span>
                          {banner.impressions > 0 && (
                            <span className="text-emerald-500">
                              {((banner.clicks / banner.impressions) * 100).toFixed(1)}% CTR
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className={cn(
                            "h-8 w-8 rounded-lg",
                            banner.status === "active" ? "text-emerald-500" : "text-muted-foreground"
                          )}
                        >
                          {banner.status === "active" ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 rounded-lg text-rose-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Product Moderation</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Review, approve, or reject product listings submitted by sellers. Ensure all products meet quality standards.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                  {[
                    { label: "Pending", count: "12", color: "text-amber-500" },
                    { label: "Approved", count: "4,230", color: "text-emerald-500" },
                    { label: "Rejected", count: "8", color: "text-rose-500" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl border border-border/50 bg-card">
                      <p className={cn("text-2xl font-bold", item.color)}>{item.count}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Button className="rounded-full px-6">Review Pending Products</Button>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-border/30">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="h-9 pl-9 rounded-xl text-sm" />
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Order</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Customer</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Total</th>
                      <th className="text-right p-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{order.customer}</td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge className={cn(
                            "rounded-full text-[10px] border-0",
                            order.status === "delivered" && "bg-emerald-500/10 text-emerald-500",
                            order.status === "shipped" && "bg-blue-500/10 text-blue-500",
                            order.status === "processing" && "bg-amber-500/10 text-amber-500",
                            order.status === "pending" && "bg-muted text-muted-foreground",
                          )}>{order.status}</Badge>
                        </td>
                        <td className="p-4 text-right font-semibold">{formatTZS(order.total)}</td>
                        <td className="p-4 text-xs text-muted-foreground text-right hidden lg:table-cell">{order.date}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
            </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
      <AIWidget />
    </motion.div>
  );
}
