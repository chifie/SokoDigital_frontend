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
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
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
import { SEO, routeMeta } from '@/lib/seo';

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

function AnimatedPage({ children, path }: { children: React.ReactNode; path?: string }) {
  const meta = path ? routeMeta[path] : undefined;
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {meta && <SEO title={meta.title} description={meta.description} />}
      {children}
    </motion.div>
  );
}

function WishlistPage() {
  const { items, remove } = useWishlist();

  const wishlistProducts = items
    .map((wi) => products.find((p) => p.id === wi.productId))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="My Wishlist" description="View and manage your saved products on SokoDigital." />
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
        <Route path="/" element={<AnimatedPage path="/"><Landing /></AnimatedPage>} />
        <Route path="/marketplace" element={<AnimatedPage path="/marketplace"><MarketplacePage /></AnimatedPage>} />
        <Route path="/product/:id" element={<AnimatedPage><ProductDetailPage /></AnimatedPage>} />
        <Route path="/categories" element={<AnimatedPage path="/categories"><CategoriesPage /></AnimatedPage>} />
        <Route path="/shops" element={<AnimatedPage path="/shops"><ShopsPage /></AnimatedPage>} />
        <Route path="/deals" element={<AnimatedPage path="/deals"><DealsPage /></AnimatedPage>} />
        <Route path="/wishlist" element={<AnimatedPage path="/wishlist"><WishlistPage /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage path="/about"><AboutPage /></AnimatedPage>} />
        <Route path="/privacy" element={<AnimatedPage path="/privacy"><PrivacyPage /></AnimatedPage>} />
        <Route path="/terms" element={<AnimatedPage path="/terms"><TermsPage /></AnimatedPage>} />
        <Route path="/store/:id" element={<AnimatedPage><StorePage /></AnimatedPage>} />
        <Route path="/contact" element={<AnimatedPage path="/contact"><ContactPage /></AnimatedPage>} />
        <Route path="/faq" element={<AnimatedPage path="/faq"><FAQPage /></AnimatedPage>} />
        <Route path="/returns" element={<AnimatedPage path="/returns"><ReturnsPage /></AnimatedPage>} />
        <Route path="/messages" element={<AnimatedPage path="/messages"><MessagesPage /></AnimatedPage>} />
        <Route path="/order/:id" element={<AnimatedPage><OrderConfirmationPage /></AnimatedPage>} />
        <Route path="/thank-you" element={<AnimatedPage><OrderConfirmationPage /></AnimatedPage>} />
        <Route path="/chat" element={<AnimatedPage path="/chat"><AIChatPage /></AnimatedPage>} />
        <Route path="/auth" element={<AnimatedPage path="/auth"><AuthPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage path="/login"><AuthPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage path="/register"><AuthPage /></AnimatedPage>} />
        <Route path="/dashboard" element={<AnimatedPage path="/dashboard"><DashboardPage /></AnimatedPage>} />
        <Route path="/dashboard/listings" element={<AnimatedPage><SellerListingsPage /></AnimatedPage>} />
        <Route path="/dashboard/listings/new" element={<AnimatedPage><SellerProductFormPage /></AnimatedPage>} />
        <Route path="/dashboard/listings/:id/edit" element={<AnimatedPage><SellerProductFormPage /></AnimatedPage>} />
        <Route path="/cart" element={<AnimatedPage path="/cart"><CartPage /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage path="/checkout"><CheckoutPage /></AnimatedPage>} />
        <Route path="/sell" element={<AnimatedPage path="/sell"><SellerOnboardingPage /></AnimatedPage>} />
        <Route path="/admin" element={<AnimatedPage path="/admin"><AdminDashboardPage /></AnimatedPage>} />
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
