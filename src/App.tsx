import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { perfTracker } from '@/lib/performance-tracker';
import Landing from '@/pages/Landing';
import AIChatPage from '@/pages/AIChatPage';
import MarketplacePage from '@/pages/MarketplacePage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import SellerListingsPage from '@/pages/SellerListingsPage';
import SellerProductFormPage from '@/pages/SellerProductFormPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SellerOnboardingPage from '@/pages/SellerOnboardingPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import StorePage from '@/pages/StorePage';
import CategoriesPage from '@/pages/CategoriesPage';
import DealsPage from '@/pages/DealsPage';
import ShopsPage from '@/pages/ShopsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import ReturnsPage from '@/pages/ReturnsPage';
import MessagesPage from '@/pages/MessagesPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import { AuthProvider } from '@/lib/auth';
import { LanguageProvider } from '@/lib/i18n';
import { WishlistProvider } from '@/lib/wishlist-context';
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { AIWidget } from '@/components/site/AIWidget';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useWishlist } from '@/lib/wishlist-context';
import { products } from '@/lib/constants';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  duration: 0.3,
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>At SokoDigital, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
            <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
            <p>We collect information you provide when creating an account, making a purchase, or contacting our support team. This includes your name, email address, phone number, and shipping address.</p>
            <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
            <p>Your information is used to process orders, provide customer support, improve our services, and send relevant updates about your purchases.</p>
            <h2 className="text-lg font-semibold text-foreground">Data Protection</h2>
            <p>We implement industry-standard security measures to protect your data. We never share your personal information with third parties without your consent.</p>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>Welcome to SokoDigital. By using our marketplace, you agree to these terms of service.</p>
            <h2 className="text-lg font-semibold text-foreground">Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials.</p>
            <h2 className="text-lg font-semibold text-foreground">Purchases & Payments</h2>
            <p>All transactions are processed securely. Prices are listed in Tanzanian Shillings (TZS) and include applicable taxes unless stated otherwise.</p>
            <h2 className="text-lg font-semibold text-foreground">Seller Responsibilities</h2>
            <p>Sellers must accurately describe their products, fulfill orders promptly, and adhere to our quality standards.</p>
            <h2 className="text-lg font-semibold text-foreground">Returns & Refunds</h2>
            <p>Returns are accepted within 14 days of delivery for most products. See our refund policy for detailed information.</p>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function WishlistPage() {
  const { items, remove } = useWishlist();

  const wishlistProducts = items
    .map((wi) => products.find((p) => p.id === wi.productId))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            {wishlistProducts.length > 0 && (
              <span className="text-sm text-muted-foreground">{wishlistProducts.length} items</span>
            )}
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {wishlistProducts.map((product) => {
                if (!product) return null;
                return (
                  <div key={product.id} className="group relative rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-all">
                    <Link to={`/product/${product.slug}`}>
                      <div className="aspect-square overflow-hidden bg-muted">
                        <OptimizedImage
                          src={product.images[0]}
                          alt={product.name}
                          wrapperClassName="h-full w-full"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          shimmer
                        />
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link to={`/product/${product.slug}`} className="text-xs font-medium hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-sm font-bold">
                          Tshs {(product.discountPrice || product.price).toLocaleString()}/=
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            Tshs {product.price.toLocaleString()}/=
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className="text-amber-500">★</span>
                        <span>{product.rating}</span>
                        <span>·</span>
                        <span>{product.sold} sold</span>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="mt-2 w-full py-1.5 rounded-lg border border-rose-200 text-[11px] font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Save your favorite items here to shop later.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  // Log performance report after each route navigation
  useEffect(() => {
    const t = setTimeout(async () => {
      const lcp = await perfTracker.getLCP();
      if (lcp !== null) {
        console.log(`📸 LCP: ${lcp}ms`);
      }
      perfTracker.logReport();
    }, 3000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
        <Route path="/marketplace" element={<AnimatedPage><MarketplacePage /></AnimatedPage>} />
        <Route path="/product/:id" element={<AnimatedPage><ProductDetailPage /></AnimatedPage>} />
        <Route path="/categories" element={<AnimatedPage><CategoriesPage /></AnimatedPage>} />
        <Route path="/shops" element={<AnimatedPage><ShopsPage /></AnimatedPage>} />
        <Route path="/deals" element={<AnimatedPage><DealsPage /></AnimatedPage>} />
        <Route path="/wishlist" element={<AnimatedPage><WishlistPage /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
        <Route path="/privacy" element={<AnimatedPage><PrivacyPage /></AnimatedPage>} />
        <Route path="/terms" element={<AnimatedPage><TermsPage /></AnimatedPage>} />
        <Route path="/store/:id" element={<AnimatedPage><StorePage /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
        <Route path="/faq" element={<AnimatedPage><FAQPage /></AnimatedPage>} />
        <Route path="/returns" element={<AnimatedPage><ReturnsPage /></AnimatedPage>} />
        <Route path="/messages" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
        <Route path="/order/:id" element={<AnimatedPage><OrderConfirmationPage /></AnimatedPage>} />
        <Route path="/thank-you" element={<AnimatedPage><OrderConfirmationPage /></AnimatedPage>} />
        <Route path="/chat" element={<AnimatedPage><AIChatPage /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><AuthPage /></AnimatedPage>} />
        <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
        <Route path="/dashboard/listings" element={<AnimatedPage><SellerListingsPage /></AnimatedPage>} />
        <Route path="/dashboard/listings/new" element={<AnimatedPage><SellerProductFormPage /></AnimatedPage>} />
        <Route path="/dashboard/listings/:id/edit" element={<AnimatedPage><SellerProductFormPage /></AnimatedPage>} />
        <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
        <Route path="/sell" element={<AnimatedPage><SellerOnboardingPage /></AnimatedPage>} />
        <Route path="/admin" element={<AnimatedPage><AdminDashboardPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <WishlistProvider>
            <AppRoutes />
            <AIWidget />
          </WishlistProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
