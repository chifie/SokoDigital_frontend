import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'en' | 'sw';

const STORAGE_KEY = 'sokodigital-lang';

const DICT: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.home': { en: 'Home', sw: 'Mwanzo' },
  'nav.marketplace': { en: 'Marketplace', sw: 'Soko' },
  'nav.categories': { en: 'Categories', sw: 'Aina' },
  'nav.shops': { en: 'Shops', sw: 'Maduka' },
  'nav.deals': { en: 'Deals', sw: 'Ofa' },
  'nav.about': { en: 'About', sw: 'Kuhusu' },
  'nav.contact': { en: 'Contact', sw: 'Wasiliana' },
  'nav.login': { en: 'Login', sw: 'Ingia' },
  'nav.register': { en: 'Register', sw: 'Jisajili' },
  'nav.sell': { en: 'Start Selling', sw: 'Anza Kuuza' },
  'nav.help': { en: 'Help Center', sw: 'Kituo cha Msaada' },
  'nav.ai': { en: 'AI Assistant', sw: 'Msaidizi AI' },
  'nav.search': { en: 'What are you looking for today?', sw: 'Unatafuta nini leo?' },
  'nav.cart': { en: 'Cart', sw: 'Rukwama' },
  'nav.wishlist': { en: 'Wishlist', sw: 'Orodha ya Tamanio' },
  'nav.profile': { en: 'Profile', sw: 'Wasifu' },
  'nav.notifications': { en: 'Notifications', sw: 'Arifa' },
  'nav.messages': { en: 'Messages', sw: 'Jumbe' },
  'nav.signin': { en: 'Sign In', sw: 'Ingia' },
  'nav.signup': { en: 'Sign Up', sw: 'Jisajili' },
  'nav.becomeSeller': { en: 'Become a Seller', sw: 'Kuwa Muuzaji' },
  'nav.trackOrder': { en: 'Track Order', sw: 'Fuatilia Oda' },

  // Hero
  'hero.shopNow': { en: 'Shop Now', sw: 'Nunua Sasa' },
  'hero.exploreDeals': { en: 'Explore Deals', sw: 'Angalia Ofa' },
  'hero.freeDelivery': { en: 'Free Delivery', sw: 'Usafirishaji Bure' },
  'hero.securePayments': { en: 'Secure Payments', sw: 'Malipo Salama' },
  'hero.support24': { en: '24/7 Support', sw: 'Msaada 24/7' },
  'hero.startShopping': { en: 'Start Shopping', sw: 'Anza Kununua' },
  'hero.trending': { en: 'Trending', sw: 'Unaovuma' },

  // Categories
  'categories.title': { en: 'Shop by Category', sw: 'Nunua kwa Aina' },
  'categories.subtitle': { en: 'Explore millions of products across all categories', sw: 'Gundua mamilioni ya bidhaa kwenye aina zote' },
  'categories.viewAll': { en: 'View All', sw: 'Angalia Zote' },
  'categories.products': { en: 'products', sw: 'bidhaa' },
  'categories.shopNow': { en: 'Shop now', sw: 'Nunua sasa' },

  // Products
  'products.title': { en: 'Discover Products', sw: 'Gundua Bidhaa' },
  'products.subtitle': { en: 'Handpicked selections just for you', sw: 'Uchaguzi uliochaguliwa kwako' },
  'products.featured': { en: 'Featured', sw: 'Zilizochaguliwa' },
  'products.trending': { en: 'Trending Now', sw: 'Zinazovuma Sasa' },
  'products.recommended': { en: 'For You', sw: 'Kwako' },
  'products.viewAll': { en: 'View All Products', sw: 'Angalia Bidhaa Zote' },
  'products.addToCart': { en: 'Add to Cart', sw: 'Ongeza Kwenye Rukwama' },
  'products.buyNow': { en: 'Buy Now', sw: 'Nunua Sasa' },
  'products.added': { en: 'Added', sw: 'Imeongezwa' },
  'products.outOfStock': { en: 'Out of stock', sw: 'Imeisha' },
  'products.onlyLeft': { en: 'Only {n} left', sw: 'Zimebaki {n}' },
  'products.freeDelivery': { en: 'Free delivery in Tanzania', sw: 'Usafirishaji bure Tanzania' },
  'products.sold': { en: 'sold', sw: 'zimeuzwa' },
  'products.quickView': { en: 'Quick View', sw: 'Angalia Haraka' },

  // Flash Sale
  'flashSale.title': { en: 'Flash Sale', sw: 'Ofa Maalum' },
  'flashSale.subtitle': { en: 'Limited time offers', sw: 'Ofa za muda mfupi' },
  'flashSale.limited': { en: 'Limited Time', sw: 'Muda Mdogo' },
  'flashSale.endsIn': { en: 'Ends in', sw: 'Inaisha kwa' },
  'flashSale.claimed': { en: '{n}% claimed', sw: '{n}% imechukuliwa' },
  'flashSale.hurry': { en: 'Hurry! Limited stock', sw: 'Haraka! Hisa chache' },
  'flashSale.viewAll': { en: 'View All Flash Deals', sw: 'Angalia Ofa Zote' },

  // Sellers
  'sellers.title': { en: 'Popular Sellers', sw: 'Wauzaji Maarufu' },
  'sellers.subtitle': { en: 'Top-rated verified sellers from across Tanzania', sw: 'Wauzaji waliothibitishwa kutoka Tanzania' },
  'sellers.viewAll': { en: 'View All', sw: 'Angalia Wote' },
  'sellers.products': { en: 'Products', sw: 'Bidhaa' },
  'sellers.followers': { en: 'Followers', sw: 'Wafuasi' },
  'sellers.response': { en: 'Response', sw: 'Mwitikio' },
  'sellers.verified': { en: 'Verified', sw: 'Imethibitishwa' },

  // Testimonials
  'testimonials.title': { en: 'What Our Community Says', sw: 'Wanachosema Wateja Wetu' },
  'testimonials.subtitle': { en: 'Join millions of satisfied buyers and sellers across Tanzania', sw: 'Jiunge na mamilioni ya wanunuzi na wauzaji Tanzania' },

  // Statistics
  'stats.title': { en: 'SokoDigital by the Numbers', sw: 'SokoDigital kwa Takwimu' },
  'stats.subtitle': { en: 'Growing Tanzania\'s digital marketplace every day', sw: 'Kukuza soko la digitali Tanzania kila siku' },
  'stats.growth': { en: '{n} growth', sw: '{n} ukuaji' },

  // Newsletter
  'newsletter.title': { en: 'Never Miss a Deal', sw: 'Usikose Ofa' },
  'newsletter.subtitle': { en: 'Subscribe to our newsletter and get exclusive offers delivered to your inbox.', sw: 'Jisajili kupata ofa maalum kwenye barua pepe yako.' },
  'newsletter.placeholder': { en: 'Enter your email', sw: 'Weka barua pepe yako' },
  'newsletter.subscribe': { en: 'Subscribe', sw: 'Jisajili' },
  'newsletter.weeklyDeals': { en: 'Weekly deals', sw: 'Ofa za wiki' },
  'newsletter.exclusive': { en: 'Exclusive offers', sw: 'Ofa maalum' },
  'newsletter.noSpam': { en: 'No spam ever', sw: 'Hakuna spam' },
  'newsletter.success': { en: 'Subscribed!', sw: 'Umejisajili!' },

  // Download App
  'app.title': { en: 'Download the SokoDigital App', sw: 'Pakua Programu ya SokoDigital' },
  'app.subtitle': { en: 'Get the best shopping experience on your mobile device.', sw: 'Pata uzoefu bora wa ununuzi kwenye simu yako.' },
  'app.comingSoon': { en: 'Coming Soon', sw: 'Inakuja Hivi Karibuni' },
  'app.scanToDownload': { en: 'Scan to Download', sw: 'Scan ili Kupakua' },
  'app.appStore': { en: 'App Store', sw: 'Duka la Programu' },
  'app.googlePlay': { en: 'Google Play', sw: 'Google Play' },

  // Footer
  'footer.tagline': { en: 'Tanzania\'s premier online marketplace connecting buyers and sellers across the nation.', sw: 'Soko la kwanza la digitali Tanzania linalounganisha wanunuzi na wauzaji.' },
  'footer.securePayments': { en: 'Secure Payments', sw: 'Malipo Salama' },
  'footer.freeDelivery': { en: 'Free Delivery', sw: 'Usafirishaji Bure' },
  'footer.easyReturns': { en: 'Easy Returns', sw: 'Kurudisha Rahisi' },
  'footer.mobileMoney': { en: 'Mobile Money', sw: 'Pesa za Simu' },
  'footer.followUs': { en: 'Follow Us', sw: 'Tufuate' },
  'footer.subscribe': { en: 'Subscribe', sw: 'Jisajili' },
  'footer.stayInLoop': { en: 'Stay in the loop', sw: 'Endelea kufahamishwa' },
  'footer.allRights': { en: 'All rights reserved for Tanzania', sw: 'Haki zote zimehifadhiwa kwa Tanzania' },

  // Cart
  'cart.title': { en: 'Shopping Cart', sw: 'Rukwama ya Ununuzi' },
  'cart.empty': { en: 'Your cart is empty', sw: 'Rukwama yako haina kitu' },
  'cart.emptyDesc': { en: 'Looks like you haven\'t added anything yet', sw: 'Inaonekana bado hujaongeza chochote' },
  'cart.startShopping': { en: 'Start Shopping', sw: 'Anza Kununua' },
  'cart.summary': { en: 'Order Summary', sw: 'Muhtasari wa Oda' },
  'cart.subtotal': { en: 'Subtotal', sw: 'Jumla Ndogo' },
  'cart.shipping': { en: 'Shipping', sw: 'Usafirishaji' },
  'cart.free': { en: 'Free', sw: 'Bure' },
  'cart.total': { en: 'Total', sw: 'Jumla' },
  'cart.coupon': { en: 'Coupon code', sw: 'Msimbo wa Punguzo' },
  'cart.apply': { en: 'Apply', sw: 'Tumia' },
  'cart.checkout': { en: 'Proceed to Checkout', sw: 'Endelea na Malipo' },

  // Checkout
  'checkout.title': { en: 'Checkout', sw: 'Malipo' },
  'checkout.delivery': { en: 'Delivery', sw: 'Usafirishaji' },
  'checkout.payment': { en: 'Payment', sw: 'Malipo' },
  'checkout.confirm': { en: 'Confirm', sw: 'Thibitisha' },
  'checkout.placeOrder': { en: 'Place Order', sw: 'Weka Oda' },
  'checkout.orderPlaced': { en: 'Order Placed', sw: 'Oda Imewekwa' },
  'checkout.continue': { en: 'Continue Shopping', sw: 'Endelea Kununua' },
  'checkout.ssl': { en: 'Secured with 256-bit SSL encryption', sw: 'Imelindwa kwa usimbaji 256-bit SSL' },

  // Seller Onboarding
  'sell.title': { en: 'Set Up Your Store', sw: 'Anzisha Duka Lako' },
  'sell.becomeSeller': { en: 'Become a Seller', sw: 'Kuwa Muuzaji' },
  'sell.step': { en: 'Step {n} of 8', sw: 'Hatua {n} kati ya 8' },
  'sell.submit': { en: 'Submit Application', sw: 'Tuma Maombi' },
  'sell.submitted': { en: 'Application Submitted', sw: 'Maombi Yamewasilishwa' },
  'sell.approval': { en: 'Your seller application is being reviewed.', sw: 'Maombi yako yanakaguliwa.' },
  'sell.notify': { en: 'We\'ll notify you via email and SMS once approved.', sw: 'Tutakujulisha kwa barua pepe na SMS ukikubaliwa.' },
  'sell.goDashboard': { en: 'Go to Dashboard', sw: 'Nenda kwenye Dashibodi' },
  'sell.browse': { en: 'Browse Marketplace', sw: 'Vinjari Soko' },

  // Dashboard
  'dashboard.orders': { en: 'Orders', sw: 'Oda' },
  'dashboard.wishlist': { en: 'Wishlist', sw: 'Tamanio' },
  'dashboard.reviews': { en: 'Reviews', sw: 'Maoni' },
  'dashboard.payments': { en: 'Payments', sw: 'Malipo' },
  'dashboard.profile': { en: 'Profile', sw: 'Wasifu' },
  'dashboard.signOut': { en: 'Sign Out', sw: 'Toka' },
  'dashboard.recentlyViewed': { en: 'Recently Viewed', sw: 'Uliyotazama Hivi Karibuni' },
  'dashboard.startSelling': { en: 'Start Selling', sw: 'Anza Kuuza' },

  // Common
  'common.loading': { en: 'Loading...', sw: 'Inapakia...' },
  'common.error': { en: 'Error', sw: 'Hitilafu' },
  'common.save': { en: 'Save', sw: 'Hifadhi' },
  'common.cancel': { en: 'Cancel', sw: 'Ghairi' },
  'common.delete': { en: 'Delete', sw: 'Futa' },
  'common.edit': { en: 'Edit', sw: 'Hariri' },
  'common.search': { en: 'Search', sw: 'Tafuta' },
  'common.filter': { en: 'Filter', sw: 'Chuja' },
  'common.sort': { en: 'Sort', sw: 'Panga' },
  'common.share': { en: 'Share', sw: 'Shiriki' },
  'common.viewAll': { en: 'View All', sw: 'Angalia Zote' },
  'common.learnMore': { en: 'Learn More', sw: 'Jifunze Zaidi' },

  // Trust features
  'trust.freeDelivery': { en: 'Free Delivery Nationwide', sw: 'Usafirishaji Bure Tanzania' },
  'trust.securePayments': { en: 'Secure Payments', sw: 'Malipo Salama' },
  'trust.verifiedSellers': { en: 'Verified Sellers', sw: 'Wauzaji Waliothibitishwa' },
  'trust.easyReturns': { en: 'Easy Returns', sw: 'Kurudisha Rahisi' },
  'trust.support24': { en: '24/7 Support', sw: 'Msaada 24/7' },
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LangCtx = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem(STORAGE_KEY) as Lang) || 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch { /* localStorage may be unavailable */ }
  }, [lang]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = DICT[key]?.[lang] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LangCtx.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
