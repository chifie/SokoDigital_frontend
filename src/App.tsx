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
import { AIWidget } from '@/components/site/AIWidget';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AIAssistant } from '@/components/ai/AIAssistant';

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

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground">support@sokodigital.co.tz</p>
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
        <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
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
          <AIAssistant />
          <AIWidget />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
