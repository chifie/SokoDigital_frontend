import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  ArrowLeft, ArrowRight, Check, Store, User, MapPin,
  Shield, CreditCard, Truck, Image, FileText,
  Smartphone, Landmark, Globe, Camera, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { paymentMethods } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface StepProps {
  formData: Record<string, any>;
  updateForm: (field: string, value: any) => void;
}

const steps = [
  { id: "account", label: "Account", icon: User },
  { id: "business", label: "Business", icon: Store },
  { id: "location", label: "Location", icon: MapPin },
  { id: "verification", label: "Verify", icon: Shield },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "branding", label: "Branding", icon: Image },
  { id: "review", label: "Review", icon: FileText },
];

const businessTypes = [
  { id: "individual", label: "Individual", desc: "Sell as an individual" },
  { id: "company", label: "Company", desc: "Registered company" },
  { id: "partnership", label: "Partnership", desc: "Business partnership" },
  { id: "government", label: "Government Supplier", desc: "Government vendor" },
  { id: "ngo", label: "NGO", desc: "Non-profit organization" },
];

function StepAccount({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">Full Name *</Label>
          <Input
            placeholder="John Mushi"
            value={formData.fullName || ""}
            onChange={(e) => updateForm("fullName", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">Phone Number *</Label>
          <Input
            placeholder="+255 712 345 678"
            value={formData.phone || ""}
            onChange={(e) => updateForm("phone", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs font-medium">Email Address *</Label>
          <Input
            type="email"
            placeholder="john@sokodigital.co.tz"
            value={formData.email || ""}
            onChange={(e) => updateForm("email", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">Password *</Label>
          <Input
            type="password"
            placeholder="Min. 8 characters"
            value={formData.password || ""}
            onChange={(e) => updateForm("password", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">Confirm Password *</Label>
          <Input type="password" placeholder="Repeat password" className="h-11 rounded-xl mt-1" />
        </div>
      </div>
    </div>
  );
}

function StepBusiness({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-medium">Store Name *</Label>
        <Input
          placeholder="My Awesome Store"
          value={formData.storeName || ""}
          onChange={(e) => updateForm("storeName", e.target.value)}
          className="h-11 rounded-xl mt-1"
        />
      </div>
      <div>
        <Label className="text-xs font-medium">Business Description *</Label>
        <Textarea
          placeholder="Tell buyers about your business..."
          value={formData.description || ""}
          onChange={(e) => updateForm("description", e.target.value)}
          className="min-h-[100px] rounded-xl mt-1"
        />
      </div>
      <div>
        <Label className="text-xs font-medium">Business Type *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {businessTypes.map((bt) => (
            <button
              key={bt.id}
              type="button"
              onClick={() => updateForm("businessType", bt.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                formData.businessType === bt.id
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/30"
              )}
            >
              <p className="text-sm font-medium">{bt.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{bt.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium">Years in Business</Label>
        <Input type="number" placeholder="e.g., 3" className="h-11 rounded-xl mt-1" />
      </div>
    </div>
  );
}

function StepLocation({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">Country *</Label>
          <Input value="Tanzania" disabled className="h-11 rounded-xl mt-1 bg-muted/50" />
        </div>
        <div>
          <Label className="text-xs font-medium">Region *</Label>
          <Input
            placeholder="e.g., Dar es Salaam"
            value={formData.region || ""}
            onChange={(e) => updateForm("region", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">District *</Label>
          <Input
            placeholder="e.g., Ilala"
            value={formData.district || ""}
            onChange={(e) => updateForm("district", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium">Ward</Label>
          <Input placeholder="e.g., Kariakoo" className="h-11 rounded-xl mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs font-medium">Street Address *</Label>
          <Input
            placeholder="123 Maktaba Street"
            value={formData.street || ""}
            onChange={(e) => updateForm("street", e.target.value)}
            className="h-11 rounded-xl mt-1"
          />
        </div>
      </div>
      <div className="p-4 rounded-xl bg-muted/50 border border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Pin your location on the map (optional)</span>
        </div>
        <div className="mt-2 h-32 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
          Map integration coming soon
        </div>
      </div>
    </div>
  );
}

function StepVerification({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">TIN Number</Label>
          <Input placeholder="123-456-789" className="h-11 rounded-xl mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">BRELA Registration</Label>
          <Input placeholder="BRELA/2024/12345" className="h-11 rounded-xl mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">Business License</Label>
          <Input placeholder="License number" className="h-11 rounded-xl mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">National ID Number</Label>
          <Input placeholder="ID number" className="h-11 rounded-xl mt-1" />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-xs font-medium mb-2 block">Upload Documents</Label>
        <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer group">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
          <p className="text-sm font-medium">Drop your documents here</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (max 10MB each)</p>
          <Button variant="outline" size="sm" className="mt-3 rounded-full text-xs">
            Choose Files
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {["Business License", "TIN Certificate", "National ID"].map((doc) => (
            <div key={doc} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              {doc}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepPayment({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Select your payout methods. You'll receive payments from sales directly to these accounts.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {paymentMethods.filter(pm => ["mpesa", "airtel", "mixx", "halopesa", "crdb", "nmb", "nbc"].includes(pm.id)).map((pm) => {
          const Icon = pm.icon === "smartphone" ? Smartphone : Landmark;
          const isSelected = formData.paymentMethods?.includes(pm.id);
          return (
            <button
              key={pm.id}
              type="button"
              onClick={() => {
                const current = formData.paymentMethods || [];
                const updated = current.includes(pm.id)
                  ? current.filter((id: string) => id !== pm.id)
                  : [...current, pm.id];
                updateForm("paymentMethods", updated);
              }}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                isSelected ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{pm.name}</p>
                <p className="text-[11px] text-muted-foreground">{pm.description}</p>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepShipping({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-medium mb-3 block">Delivery Regions</Label>
        <div className="flex flex-wrap gap-2">
          {["Dar es Salaam", "Arusha", "Mwanza", "Mbeya", "Dodoma", "Tanga", "Zanzibar", "Morogoro", "Kilimanjaro", "All Tanzania"].map((region) => {
            const isSelected = formData.deliveryRegions?.includes(region);
            return (
              <button
                key={region}
                type="button"
                onClick={() => {
                  const current = formData.deliveryRegions || [];
                  const updated = current.includes(region)
                    ? current.filter((r: string) => r !== region)
                    : [...current, region];
                  updateForm("deliveryRegions", updated);
                }}
                className={cn(
                  "px-4 py-2 rounded-xl border text-xs font-medium transition-all",
                  isSelected ? "border-primary bg-primary/5 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium">Delivery Fee (Within Region)</Label>
          <Input type="number" placeholder="e.g., 5000" className="h-11 rounded-xl mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium">Delivery Fee (Cross-Region)</Label>
          <Input type="number" placeholder="e.g., 15000" className="h-11 rounded-xl mt-1" />
        </div>
      </div>

      <div>
        <Label className="text-xs font-medium mb-2 block">Return Policy *</Label>
        <Textarea
          placeholder="Describe your return policy..."
          value={formData.returnPolicy || ""}
          onChange={(e) => updateForm("returnPolicy", e.target.value)}
          className="min-h-[80px] rounded-xl mt-1"
        />
      </div>
    </div>
  );
}

function StepBranding({ formData, updateForm }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl border border-dashed border-border/50">
        <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center">
          <Camera className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Upload Store Logo</p>
          <p className="text-xs text-muted-foreground mt-1">Recommended: 500x500px, PNG or JPG</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full text-xs">Upload Logo</Button>
      </div>

      <div className="flex flex-col items-center gap-4 p-6 rounded-xl border border-dashed border-border/50">
        <div className="h-32 w-full rounded-xl bg-muted flex items-center justify-center">
          <Camera className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Upload Store Banner</p>
          <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x300px</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full text-xs">Upload Banner</Button>
      </div>

      <div>
        <Label className="text-xs font-medium">Store Description</Label>
        <Textarea
          placeholder="Tell customers about your store..."
          className="min-h-[80px] rounded-xl mt-1"
        />
      </div>

      <div>
        <Label className="text-xs font-medium">Social Media Links</Label>
        <div className="space-y-2 mt-2">
          {["Instagram", "Facebook", "WhatsApp"].map((social) => (
            <div key={social} className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input placeholder={`${social} URL`} className="h-10 rounded-xl flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReview({ formData, updateForm: _updateForm }: StepProps) {
  return (
    <div className="space-y-4">
      {[
        { icon: User, label: "Account", fields: ["Full Name", "Email", "Phone"] },
        { icon: Store, label: "Business", fields: ["Store Name", "Business Type"] },
        { icon: MapPin, label: "Location", fields: ["Region", "District", "Street"] },
        { icon: Shield, label: "Verification", fields: ["TIN Number", "Documents Uploaded"] },
        { icon: CreditCard, label: "Payment", fields: [`${(formData.paymentMethods || []).length} methods selected`] },
        { icon: Truck, label: "Shipping", fields: [`${(formData.deliveryRegions || []).length} regions selected`] },
      ].map((section) => (
        <div key={section.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
          <section.icon className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium">{section.label}</p>
            {section.fields.map((f) => (
              <p key={f} className="text-xs text-muted-foreground">{f}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const stepComponents = [StepAccount, StepBusiness, StepLocation, StepVerification, StepPayment, StepShipping, StepBranding, StepReview];

export default function SellerOnboardingPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const updateForm = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const StepComponent = stepComponents[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsComplete(true);
    }
  };

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelector(".sell-form"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: main.querySelector(".sell-form"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  if (isComplete) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
        <Header />
        <main ref={mainRef} className="flex-1 flex items-center justify-center pb-16 lg:pb-0">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center max-w-md mx-auto px-4">
            <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
            <p className="text-muted-foreground mb-2">Your seller application is being reviewed.</p>
            <p className="text-sm text-muted-foreground mb-8">We'll notify you via email and SMS once approved.</p>
            <div className="flex items-center justify-center gap-3">
              <Button className="rounded-full px-6" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
              <Button variant="outline" className="rounded-full px-6" onClick={() => navigate("/")}>Browse Marketplace</Button>
            </div>
          </motion.div>
        </main>
        <Footer />
        <MobileBottomNav />
        <AIAssistant />
      </motion.div>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => currentStep > 0 ? setCurrentStep(prev => prev - 1) : navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Become a Seller</span>
              </div>
              <h1 className="text-2xl font-bold mt-1">Set Up Your Store</h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{steps[currentStep].label}</span>
              <span className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500"
              />
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-between mt-3">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => i < currentStep && setCurrentStep(i)}
                    className={cn(
                      "flex flex-col items-center gap-1 transition-all",
                      isCompleted && "cursor-pointer",
                      !isCompleted && !isCurrent && "opacity-40"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                      isCompleted && "bg-emerald-500 text-white",
                      isCurrent && "bg-primary text-white ring-2 ring-primary/20",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-[9px] font-medium hidden md:block",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card p-6 md:p-8"
            >
              {/* Step Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{steps[currentStep].label}</h2>
                  <p className="text-xs text-muted-foreground">
                    {["Create your seller account", "Tell us about your business", "Set your location",
                      "Verify your identity", "Set up payment methods", "Configure shipping",
                      "Brand your store", "Review and submit"][currentStep]}
                  </p>
                </div>
              </div>

              <div className="sell-form">
                <StepComponent formData={formData} updateForm={updateForm} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => currentStep > 0 ? setCurrentStep(prev => prev - 1) : navigate("/")}
              className="rounded-xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={handleNext} className="rounded-xl px-6 gap-2">
              {currentStep === steps.length - 1 ? (
                <>Submit Application <Check className="h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>

          {/* Auto-save indicator */}
          <p className="text-center text-[10px] text-muted-foreground mt-4">
            Your progress is saved automatically
          </p>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
    </motion.div>
  );
}
