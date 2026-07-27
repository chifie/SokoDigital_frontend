import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Bot, Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { gsap } from 'gsap';

type Msg = { role: 'user' | 'assistant'; content: string };

/** Local canned responses — works immediately without needing the edge function deployed */
function localReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('bei')) {
    return "Prices on SokoDigital vary by seller. You can find products starting from as low as TZS 5,000. Use the sort by price filter to find the best deals! 💰";
  }
  if (lower.includes('ship') || lower.includes('delivery') || lower.includes('usafirishaji')) {
    return "We offer nationwide delivery across Tanzania Mainland & Zanzibar! Free delivery on orders over 50,000 TZS. Typical delivery takes 1-5 business days. 🚚";
  }
  if (lower.includes('return') || lower.includes('refund')) {
    return "Most products on SokoDigital can be returned within 14 days of delivery. Check each product's return policy on its detail page for specific terms. 🔄";
  }
  if (lower.includes('sell') || lower.includes('vendor') || lower.includes('store')) {
    return "Ready to start selling? Click 'Start Selling' in the footer or visit /sell. You'll go through our onboarding steps — account, business info, location, verification, payment, and branding! 🏪";
  }
  if (lower.includes('pay') || lower.includes('payment') || lower.includes('malipo')) {
    return "We accept M-Pesa, Airtel Money, Tigo Pesa, HaloPesa, and bank transfers (CRDB, NMB, NBC). All payments are secured end-to-end. 🔒";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('habari') || lower.includes('mambo')) {
    return "Hello! 👋 Welcome to SokoDigital! I'm here to help you find products, track orders, or answer any questions. What can I help you with today?";
  }
  if (lower.includes('product') || lower.includes('find') || lower.includes('search') || lower.includes('tafuta')) {
    return "You can find products by browsing categories, using the search bar, or checking out our Top Selling and New Arrivals sections on the home page. What are you looking for specifically? 🔍";
  }
  if (lower.includes('track') || lower.includes('order') || lower.includes('agizo')) {
    return "To track your order, go to your Dashboard and click on 'My Orders'. You'll see the current status and delivery updates for all your purchases. 📦";
  }
  return "Great question! To help you best, could you tell me more about what you're looking for? I can assist with finding products, checking prices, understanding shipping and payments, or helping you start selling! 😊";
}

function fallbackReply(input: string, lang: 'en' | 'sw'): string {
  const sw = lang === 'sw';
  if (sw) {
    // Swahili canned responses
    const lower = input.toLowerCase();
    if (lower.includes('bei') || lower.includes('gharama')) return "Bei kwenye SokoDigital zinatofautiana kulingana na muuzaji. Unaweza kupata bidhaa kuanzia TZS 5,000! Tumia kichujio cha bei kupata ofa bora. 💰";
    if (lower.includes('usafirishaji') || lower.includes('delivery')) return "Tunatoa usafirishaji kote Tanzania Bara na Zanzibar! Usafirishaji bila malipo kwa maagizo zaidi ya 50,000 TZS. Inachukua siku 1-5. 🚚";
    return "Swali zuri! Unaweza kunitaja zaidi unachotaka? Ninaweza kusaidia kutafuta bidhaa, bei, usafirishaji, au kuanza kuuza! 😊";
  }
  return localReply(input);
}

export function AIWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLang();
  const location = useLocation();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // GSAP floating animation for the AI widget button
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn || open) return;

    const ctx = gsap.context(() => {
      gsap.to(btn, {
        y: -5,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to(btn, {
        boxShadow: '0 0 20px rgba(var(--primary-rgb, 99,102,241), 0.4)',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.3,
      });
    }, btn);

    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMsgs([{ role: 'assistant', content: t('ai.welcome') }]);
  }, [lang, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open, loading]);

  if (location.pathname.startsWith('/chat')) return null;

  const send = async (text?: string) => {
    const v = (text ?? input).trim();
    if (!v || loading) return;
    const next: Msg[] = [...msgs, { role: 'user', content: v }];
    setMsgs(next);
    setInput('');
    setLoading(true);
    try {
      // Try the edge function first
      const { data, error } = await supabase.functions.invoke('soko-ai', {
        body: { messages: next, lang },
      });
      if (error) throw error;
      const reply = (data as { text?: string })?.text?.trim();
      if (reply) {
        setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
      } else {
        // Edge function returned empty — use local fallback (handles EN + SW)
        setMsgs((m) => [...m, { role: 'assistant', content: fallbackReply(v, lang) }]);
      }
    } catch {
      // Edge function unavailable — use local fallback (handles EN + SW)
      setMsgs((m) => [...m, { role: 'assistant', content: fallbackReply(v, lang) }]);
    } finally {
      setLoading(false);
    }
  };


  const quick = [
    t('ai.quick.find'),
    t('ai.quick.track'),
    t('ai.quick.sell'),
    t('ai.quick.pay'),
  ];

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            AI
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[540px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <div className="flex items-center justify-between gap-3 bg-primary p-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{t('ai.title')}</div>
                <div className="flex items-center gap-1.5 text-[11px] opacity-90">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  {t('ai.online')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-muted/40 p-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm ' +
                    (m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm')
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Soko AI is typing…
                </div>
              </div>
            )}
          </div>


          <div className="border-t border-border bg-card px-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quick.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 pb-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('ai.placeholder')}
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                aria-label="Send"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
