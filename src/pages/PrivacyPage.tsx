import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SEO } from "@/lib/seo";

export default function PrivacyPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <SEO title="Privacy Policy" />
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
    </motion.div>
  );
}
