import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { Search, MessageCircle, Store, ChevronRight, Send, CheckCheck, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  role: "seller" | "buyer";
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  productName?: string;
  productImage?: string;
}

const conversations: Conversation[] = [
  { id: "c1", name: "Amina Fashion House", role: "seller", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80&fm=webp&fit=crop", lastMessage: "Your order has been shipped! Tracking number: TZ789456123", lastTime: "2m ago", unread: 2, online: true, productName: "Kitenge Dress", productImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80&fm=webp&fit=crop" },
  { id: "c2", name: "TechHub Tanzania", role: "seller", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fm=webp&fit=crop", lastMessage: "Yes, we have the iPhone 15 Pro Max in stock. Available in Natural Titanium and Blue Titanium.", lastTime: "1h ago", unread: 0, online: true, productName: "iPhone 15 Pro Max", productImage: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=300&q=80&fm=webp&fit=crop" },
  { id: "c3", name: "SokoDigital Support", role: "buyer", avatar: "", lastMessage: "Your refund of Tshs 145,000 has been processed.", lastTime: "3h ago", unread: 0, online: true },
  { id: "c4", name: "Mama's Fresh Groceries", role: "seller", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80&fm=webp&fit=crop", lastMessage: "Fresh organic honey is now back in stock! 🍯", lastTime: "1d ago", unread: 0, online: false },
  { id: "c5", name: "Grace Beauty Store", role: "seller", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&fm=webp&fit=crop", lastMessage: "The Vitamin C serum is on sale this week!", lastTime: "2d ago", unread: 0, online: false, productName: "Vitamin C Serum", productImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80&fm=webp&fit=crop" },
];

const chatMessages = [
  { id: "m1", from: "them", text: "Hello! How can I help you today?", time: "10:30 AM" },
  { id: "m2", from: "me", text: "Hi, I'm interested in the product. Is it in stock?", time: "10:32 AM" },
  { id: "m3", from: "them", text: "Yes, we have it in stock! Available in all colors.", time: "10:33 AM" },
  { id: "m4", from: "them", text: "Would you like to place an order?", time: "10:33 AM" },
  { id: "m5", from: "me", text: "Great! What about delivery time?", time: "10:35 AM" },
  { id: "m6", from: "them", text: "Standard delivery takes 2-3 days within Dar es Salaam.", time: "10:36 AM" },
];

export default function MessagesPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedConv, setSelectedConv] = useState<string | null>("c1");
  const [messages, setMessages] = useState(chatMessages);
  const [inputMsg, setInputMsg] = useState("");

  const activeConv = conversations.find((c) => c.id === selectedConv);

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, from: "me", text: inputMsg.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInputMsg("");
    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m${Date.now()}`, from: "them", text: "Thank you for your message! We'll get back to you shortly.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 1500);
  };

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".msg-animate"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.04,
          scrollTrigger: { trigger: main.querySelector(".msg-content"), start: "top 90%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background flex flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pb-16 lg:pb-0">
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Conversation List */}
          <div className="w-full sm:w-80 lg:w-96 border-r border-border/50 flex flex-col bg-card shrink-0">
            <div className="p-4 border-b border-border/50">
              <h1 className="text-base font-bold">Messages</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">{conversations.length} conversations</p>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/30">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={cn(
                    "msg-animate w-full text-left p-3 hover:bg-muted/50 transition-colors",
                    selectedConv === conv.id && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                        {conv.avatar ? (
                          <OptimizedImage src={conv.avatar} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                      {conv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{conv.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTime}</span>
                      </div>
                      {conv.productName && (
                        <p className="text-[10px] text-primary truncate">{conv.productName}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary text-[8px] font-bold text-primary-foreground flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden sm:flex flex-1 flex-col">
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-3 border-b border-border/50 bg-card shrink-0">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-muted">
                      {activeConv.avatar ? (
                        <OptimizedImage src={activeConv.avatar} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <Store className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    {activeConv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activeConv.name}</p>
                    <p className="text-[10px] text-muted-foreground">{activeConv.online ? "Online" : "Offline"}</p>
                  </div>
                  {activeConv.productImage && (
                    <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                      <OptimizedImage src={activeConv.productImage} alt="" wrapperClassName="h-full w-full" shimmer={false} />
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-muted/20">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.from === "me"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card border border-border/50 text-foreground rounded-bl-md"
                        )}
                      >
                        <p>{msg.text}</p>
                        <p className={cn("text-[10px] mt-1", msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                          {msg.time}
                          {msg.from === "me" && (
                            <CheckCheck className="inline h-3 w-3 ml-1" />
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border/50 bg-card">
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="submit"
                      disabled={!inputMsg.trim()}
                      className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">Choose a conversation from the left to start chatting</p>
                </div>
              </div>
            )}
          </div>

          {/* On mobile, the conversation list takes full width and the chat view is hidden */}
          {/* A real app would add a "back to list" button in the chat header on mobile */}
        </div>
      </main>
    </motion.div>
  );
}
