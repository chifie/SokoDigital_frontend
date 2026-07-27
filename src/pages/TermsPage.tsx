import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SEO } from "@/lib/seo";

export default function TermsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <SEO title="Terms of Service" />
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
    </motion.div>
  );
}
