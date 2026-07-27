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
import { AuthProvider } from '@/lib/auth';
import { LanguageProvider } from '@/lib/i18n';
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { AIWidget } from '@/components/site/AIWidget';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

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

function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">Browse all categories coming soon</p>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function ShopsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Shops</h1>
          <p className="text-muted-foreground mt-2">Discover stores coming soon</p>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function DealsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-muted-foreground mt-2">Flash sales coming soon</p>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">About SokoDigital</h1>
          <p className="text-muted-foreground">Tanzania's premier online marketplace connecting buyers and sellers across the nation.</p>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
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
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">Email: support@sokodigital.co.tz</p>
          <p className="text-muted-foreground mt-2">Phone: +255 712 345 678</p>
          <p className="text-muted-foreground mt-2">Location: Dar es Salaam, Tanzania</p>
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
          <AppRoutes />
          <AIWidget />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
