import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield,
  Check, Share2, ChevronRight, MapPin, BadgeCheck, Plus, Minus,
  RotateCcw, Camera, ThumbsUp, MessageSquare, Send, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth";
import { cn, getRatingColor, formatTZS } from "@/lib/utils";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { usePageSEO } from "@/lib/seo";

// ===== StarRating Component =====
function StarRating({ value, onChange, size = "md", interactive = false }: {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={cn(
            "transition-all",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default",
            size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-6 w-6" : "h-4 w-4"
          )}
        >
          <Star
            className={cn(
              "w-full h-full transition-colors",
              (hovered || value) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ===== Review Data =====
const existingReviews = [
  { id: "r1", user: "Amina K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AminaK", rating: 5, date: "2 weeks ago", text: "Amazing product! Exceeded my expectations. The quality is outstanding and delivery was fast.", likes: 24, images: [] as string[] },
  { id: "r2", user: "David M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DavidM", rating: 4, date: "1 month ago", text: "Great value for money. Would definitely recommend to others.", likes: 12, images: [] as string[] },
  { id: "r3", user: "Sarah J.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ", rating: 5, date: "3 weeks ago", text: "Perfect! Exactly as described. Very happy with my purchase.", likes: 18, images: [] as string[] },
];

// ===== Main Page =====
export default function ProductDetailPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  // Review state
  const [reviews, setReviews] = useState(existingReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.slug === id) || products[0];
  usePageSEO(product.name, `${product.description.slice(0, 150)} — Shop now on SokoDigital`);
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const displayPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : undefined;

  // Average rating
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating > 0) ratingDistribution[Math.round(r.rating) - 1]++; });

  const handleSubmitReview = () => {
    if (!newRating || !newReviewText.trim()) {
      toast.error("Please provide a rating and review text");
      return;
    }
    setSubmittingReview(true);
    setTimeout(() => {
      const newReview = {
        id: `r${Date.now()}`,
        user: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        rating: newRating,
        date: "Just now",
        text: newReviewText.trim(),
        likes: 0,
        images: reviewImages,
      };
      setReviews((prev) => [newReview, ...prev]);
      setNewRating(0);
      setNewReviewText("");
      setReviewImages([]);
      setShowReviewForm(false);
      setSubmittingReview(false);
      toast.success("Review submitted successfully!");
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 3 - reviewImages.length;
    Array.from(files).slice(0, remaining).forEach((file) => {
      const url = URL.createObjectURL(file);
      setReviewImages((prev) => [...prev, url]);
    });
  };


  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".pd-gallery"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".pd-gallery"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".pd-info"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".pd-info"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".pd-reviews"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".pd-reviews"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".pd-related"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".pd-related"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col bg-background">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <button onClick={() => navigate(-1)} className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <span className="text-border">/</span>
            <Link to="/marketplace" className="hover:text-foreground">{product.category}</Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </div>

          {/* Product Main Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Image Gallery */}
            <div className="pd-gallery space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/50 group">
                <OptimizedImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105"
                  wrapperClassName="absolute inset-0"
                  shimmer={true}
                  loading="eager"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    -{discount}%
                  </span>
                )}
                <button onClick={() => setIsWishlisted(!isWishlisted)} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all shadow-sm">
                  <Heart className={cn("h-4 w-4", isWishlisted ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
                </button>
                <button className="absolute top-3 right-14 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all shadow-sm">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={cn("aspect-square rounded-lg overflow-hidden border-2 transition-all", selectedImage === i ? "border-primary" : "border-border/50 hover:border-primary/50")}
                  >
                    <OptimizedImage src={img} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="pd-info space-y-5">
              {/* Seller */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <OptimizedImage src={product.seller.logo} alt="" wrapperClassName="h-5 w-5" className="rounded-full" shimmer={false} />
                </div>
                <span className="text-xs text-muted-foreground">
                  Sold by <Link to={`/store/${product.seller.id}`} className="text-foreground font-medium hover:text-primary">{product.seller.storeName}</Link>
                </span>
                {product.seller.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary fill-primary" />}
              </div>

              <h1 className="text-xl md:text-2xl font-bold leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <StarRating value={Math.round(product.rating)} size="sm" />
                  <span className={cn("text-sm font-bold ml-1", getRatingColor(product.rating))}>{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.sold.toLocaleString()} sold</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-bold text-primary">Tshs {displayPrice.toLocaleString()}/=</span>
                {oldPrice && <span className="text-base text-muted-foreground line-through">Tshs {oldPrice.toLocaleString()}/=</span>}
                {discount > 0 && <Badge className="bg-secondary/10 text-secondary border-0 text-xs font-semibold">Save {discount}%</Badge>}
              </div>

              {/* Colors & Sizes - same as before */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5">Color: <span className="text-muted-foreground font-normal">{product.colors[0]}</span></p>
                  <div className="flex gap-1.5 flex-wrap">
                    {product.colors.map((color) => (
                      <button key={color} className={cn("px-3 py-1.5 rounded-lg border text-xs transition-all", color === product.colors![0] ? "border-primary bg-primary/5 text-primary" : "border-border/50 hover:border-primary/30")}>{color}</button>
                    ))}
                  </div>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5">Size: <span className="text-muted-foreground font-normal">{product.sizes[0]}</span></p>
                  <div className="flex gap-1.5 flex-wrap">
                    {product.sizes.map((size) => (
                      <button key={size} className={cn("px-3 py-1.5 rounded-lg border text-xs transition-all min-w-[40px]", size === product.sizes![0] ? "border-primary bg-primary/5 text-primary" : "border-border/50 hover:border-primary/30")}>{size}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-xs font-medium mb-1.5">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-muted rounded-lg p-0.5">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-8 w-8 rounded-md hover:bg-background flex items-center justify-center transition-colors"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} className="h-8 w-8 rounded-md hover:bg-background flex items-center justify-center transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  {product.quantity <= 10 && product.quantity > 0 && (
                    <span className="text-[11px] text-rose-500 font-medium">Only {product.quantity} left!</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="lg" className="flex-1 h-11 rounded-lg text-sm font-semibold gap-2" onClick={() => {
                  setIsAdded(true);
                  addItem({
                    productId: product.id, name: product.name, image: product.images[0],
                    price: product.discountPrice || product.price, quantity,
                    sellerId: product.seller.id, sellerName: product.seller.storeName, maxQuantity: product.quantity,
                  });
                  toast.success(`${product.name.slice(0, 30)}... added to cart!`, { duration: 2000, icon: <ShoppingCart className="h-4 w-4" /> });
                  setTimeout(() => setIsAdded(false), 2000);
                }}>
                  {isAdded ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                </Button>
                <Button size="lg" variant="outline" className="h-11 rounded-lg text-sm font-semibold" onClick={() => navigate("/checkout")}>Buy Now</Button>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-xs"><Truck className="h-3.5 w-3.5 text-emerald-500" /><span className="font-medium">Free Delivery</span><span className="text-muted-foreground">· Estimated 3-5 business days</span></div>
                <div className="flex items-center gap-2 text-xs"><RotateCcw className="h-3.5 w-3.5 text-blue-500" /><span className="font-medium">Easy Returns</span><span className="text-muted-foreground">· 14-day return policy</span></div>
                <div className="flex items-center gap-2 text-xs"><Shield className="h-3.5 w-3.5 text-primary" /><span className="font-medium">Secure Payment</span><span className="text-muted-foreground">· M-Pesa, Airtel, Visa</span></div>
              </div>

              {/* Seller Info Card */}
              <Link to={`/store/${product.seller.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:shadow-sm transition group">
                <div className="h-12 w-12 rounded-lg overflow-hidden ring-2 ring-border/50 flex-shrink-0">
                  <OptimizedImage src={product.seller.logo} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{product.seller.storeName}</p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <MapPin className="h-3 w-3" />{product.seller.location}
                    <span className="text-emerald-500 ml-1">{product.seller.responseRate}% response</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            </div>
          </div>

          {/* Description + Reviews */}
          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            {/* Description + Specs */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-base font-bold mb-2">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              <div>
                <h2 className="text-base font-bold mb-3">Specifications</h2>
                <div className="rounded-lg border border-border/50 overflow-hidden text-sm">
                  <table className="w-full">
                    <tbody>
                      {[
                        { label: "Brand", value: product.brand || "Generic" },
                        { label: "Category", value: product.category },
                        { label: "Condition", value: product.condition.charAt(0).toUpperCase() + product.condition.slice(1) },
                        { label: "SKU", value: product.sku },
                        { label: "Warranty", value: product.warranty || "—" },
                        { label: "Return Policy", value: product.returnPolicy || "—" },
                      ].map((spec, i) => (
                        <tr key={spec.label} className={cn(i % 2 === 0 && "bg-muted/30")}>
                          <td className="px-3 py-2.5 font-medium text-muted-foreground w-1/3 text-xs">{spec.label}</td>
                          <td className="px-3 py-2.5 text-xs">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pd-reviews">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">Reviews ({reviews.length})</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs gap-1"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Write
                </Button>
              </div>

              {/* Rating Summary */}
              <div className="p-4 rounded-xl border border-border/50 bg-card mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                    <StarRating value={Math.round(avgRating)} size="sm" />
                    <p className="text-[10px] text-muted-foreground mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star - 1] || 0;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-[11px]">
                          <span className="w-3 text-muted-foreground">{star}</span>
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
                      <h3 className="text-sm font-semibold">Write a Review</h3>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Your Rating</p>
                        <StarRating value={newRating} onChange={setNewRating} size="lg" interactive />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Your Review</p>
                        <Textarea
                          placeholder="Share your experience with this product..."
                          value={newReviewText}
                          onChange={(e) => setNewReviewText(e.target.value)}
                          className="min-h-[80px] text-sm rounded-lg resize-none"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Add Photos (optional)</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                          >
                            <Camera className="h-5 w-5 text-muted-foreground" />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          {reviewImages.map((img, i) => (
                            <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-border/50">
                              <OptimizedImage src={img} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                              <button
                                onClick={() => {
                                  URL.revokeObjectURL(reviewImages[i]);
                                  setReviewImages((prev) => prev.filter((_, j) => j !== i));
                                }}
                                className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/50 text-white flex items-center justify-center"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="rounded-lg text-xs gap-1" onClick={handleSubmitReview} disabled={submittingReview}>
                          {submittingReview ? "Submitting..." : <><Send className="h-3.5 w-3.5" /> Submit Review</>}
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Review List */}
              <div className="space-y-3">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg border border-border/50 bg-card hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                        {review.avatar ? <OptimizedImage src={review.avatar} alt="" wrapperClassName="h-full w-full" className="rounded-full" shimmer={false} /> : review.user[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{review.user}</p>
                        <p className="text-[10px] text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating value={review.rating} size="sm" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.text}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-1.5 mt-2">
                        {review.images.map((img, j) => (
                          <div key={j} className="h-12 w-12 rounded-lg overflow-hidden border border-border/30">
                            <OptimizedImage src={img} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="text-[11px] text-muted-foreground hover:text-primary mt-1.5 flex items-center gap-1 transition-colors">
                      <ThumbsUp className="h-3 w-3" /> {review.likes}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="pd-related mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">Related Products</h2>
              <Link to="/marketplace" className="text-xs text-primary font-medium hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Sticky Mobile Add to Cart Bar ─── */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-primary truncate">
              {formatTZS(displayPrice)}
            </p>
            {oldPrice && (
              <p className="text-[11px] text-muted-foreground line-through">
                {formatTZS(oldPrice)}
              </p>
            )}
          </div>
          <div className="flex items-center bg-muted rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-7 w-7 rounded-md hover:bg-background flex items-center justify-center transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              className="h-7 w-7 rounded-md hover:bg-background flex items-center justify-center transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <Button
            size="sm"
            className="h-9 rounded-lg text-xs font-semibold gap-1.5 shrink-0"
            onClick={() => {
              if (!user) {
                navigate(`/auth?redirect=/product/${product.slug}`);
                return;
              }
              setIsAdded(true);
              addItem({
                productId: product.id, name: product.name, image: product.images[0],
                price: product.discountPrice || product.price, quantity,
                sellerId: product.seller.id, sellerName: product.seller.storeName, maxQuantity: product.quantity,
              });
              toast.success(`${product.name.slice(0, 24)}... added to cart!`, { duration: 2000 });
              setTimeout(() => setIsAdded(false), 2000);
            }}
          >
            {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {isAdded ? "Added" : "Cart"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 rounded-lg text-xs font-semibold shrink-0"
            onClick={() => {
              if (!user) {
                navigate(`/auth?redirect=/checkout`);
                return;
              }
              navigate("/checkout");
            }}
          >
            Buy
          </Button>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </motion.div>
  );
}


