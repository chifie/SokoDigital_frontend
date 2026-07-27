import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, ShoppingCart, Heart, Bell, MessageCircle,
  Menu, X, Store, Moon, Sun, User, LogOut, LayoutDashboard, ShoppingBag
} from "lucide-react";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories, trendingSearches, products } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist-context";
import { LanguageSelector } from "@/components/shared/LanguageSelector";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { itemCount: cartCount } = useCart();
  const { user, loading: authLoading, signOut } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const notificationCount = 2;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products based on debounced search query
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [debouncedQuery]);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchSuggestions(false);
    }
  };

  // Get user display info
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-primary">
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="shrink-0 group">
          <div className="flex items-center gap-2.5">
            <div className="h-20 w-auto text-white group-hover:scale-105 transition-transform duration-300">
              <Logo className="h-20 w-auto" />
            </div>
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div ref={searchRef} className="flex-1 max-w-md mx-4 hidden md:block relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/15 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
            </div>
          </form>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSearchSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50"
              >
                {searchQuery.trim() && searchResults.length > 0 ? (
                  <div className="py-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                      Products
                    </p>
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => { setShowSearchSuggestions(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <OptimizedImage src={p.images[0]} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            Tshs {(p.discountPrice || p.price).toLocaleString()}/=
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1 px-3">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-left py-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Trending</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trendingSearches.slice(0, 5).map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            navigate(`/marketplace?search=${encodeURIComponent(term)}`);
                            setShowSearchSuggestions(false);
                          }}
                          className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                    {/* Category quick links */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                      <div className="grid grid-cols-2 gap-1">
                        {categories.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/marketplace?category=${cat.slug}`}
                            onClick={() => setShowSearchSuggestions(false)}
                            className="text-xs text-gray-600 hover:text-primary py-1 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          {/* Mobile Search */}
          <button className="md:hidden text-white p-1.5" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-5 w-5" />
          </button>

          {/* Messages */}
          <Link to="/messages" className="relative text-white p-1.5" title="Messages">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative text-white p-1.5" title="Wishlist">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center shadow-sm ring-2 ring-primary animate-pulse-glow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative text-white p-1.5 hover:bg-white/10 rounded-full transition-all duration-200 active:scale-95"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-5 w-5 sm:h-5 sm:w-5" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative text-white p-1.5" title="Notifications">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-[8px] font-bold text-white flex items-center justify-center shadow-sm ring-2 ring-primary">
                    {notificationCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl">
              <DropdownMenuLabel className="text-sm font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { icon: ShoppingCart, title: "Order Shipped!", desc: "Your iPhone 15 is on its way" },
                { icon: ShoppingBag, title: "Flash Sale! 60% Off", desc: "Electronics deals end soon" },
                { icon: MessageCircle, title: "Seller responded", desc: "TechHub Tanzania replied" },
              ].map((n, i) => {
                const Icon = n.icon;
                return (
                  <DropdownMenuItem key={i} className="cursor-pointer py-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Link to="/cart" className="relative text-white p-1.5" title="Cart">
            <ShoppingCart data-cart-target className="h-5 w-5 sm:h-6 sm:w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-white text-[8px] font-bold text-primary flex items-center justify-center shadow-sm ring-2 ring-primary animate-scale-in">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!authLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white p-1.5 group/avatar">
                  {userAvatar ? (
                    <div className="h-7 w-7 rounded-full ring-2 ring-white/30 overflow-hidden group-hover/avatar:ring-white/60 transition-all">
                      <OptimizedImage src={userAvatar} alt={userName} wrapperClassName="h-full w-full" shimmer={false} loading="eager" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white group-hover/avatar:bg-white/30 transition-all">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="text-sm font-semibold">
                  <div className="truncate">{userName}</div>
                  <div className="text-xs font-normal text-muted-foreground truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-3" onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-3" onClick={() => navigate("/dashboard/listings")}>
                  <Store className="h-4 w-4" />
                  My Listings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-3 text-rose-500" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth?redirect=/marketplace" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline px-2 py-1.5 touch-manipulation">
              <User className="h-4 w-4" />
              {authLoading ? "..." : "Log In"}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="sm:hidden text-white p-1.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden px-4 pb-3"
          >
            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`); setShowSearch(false); }}}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-white/15 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  autoFocus
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden overflow-hidden bg-primary/95 backdrop-blur-sm"
          >
            <div className="px-4 pb-4 space-y-1">
              {user ? (
                <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10 mb-2">
                  {userAvatar ? (
                    <OptimizedImage src={userAvatar} alt="" wrapperClassName="h-9 w-9 rounded-full ring-2 ring-white/30" className="rounded-full" shimmer={false} loading="lazy" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-white">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-xs text-white/60 truncate">{user.email}</p>
                  </div>
                </div>
              ) : null}
              <Link to={user ? "/dashboard" : "/auth?redirect=/marketplace"} className="block px-4 py-2.5 rounded-lg text-white/90 text-sm font-medium hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                {user ? "Dashboard" : "Log In / Sign Up"}
              </Link>
              <Link to="/sell" className="block px-4 py-2.5 rounded-lg text-white/90 text-sm font-medium hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                <Store className="h-4 w-4 inline mr-2" />
                Start Selling
              </Link>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/marketplace?category=${cat.slug}`}
                  className="block px-4 py-2 rounded-lg text-white/70 text-sm hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-rose-300 text-sm font-medium hover:bg-white/10 mt-2"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
