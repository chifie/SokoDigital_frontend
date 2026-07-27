import { useRef,  useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Pencil, Trash2, Package, Loader2, ImageOff } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Product = Tables<'products'>;

export default function SellerListingsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { user, roles, loading: authLoading } = useAuth();
  const { loading: authGuardLoading, isAuthenticated } = useRequireAuth({
    preservePath: true,
    redirectTo: "/auth",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSeller = roles.includes('seller') || roles.includes('admin');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user || !isSeller) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (!cancelled) {
        if (error) setError(error.message);
        else setProducts(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isSeller]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".sl-header"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".sl-header"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        main.querySelectorAll(".sl-grid"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".sl-grid"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeletingId(id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  if (authLoading || authGuardLoading || (loading && isSeller)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main ref={mainRef} className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="sl-header mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the products your shop sells on SokoDigital.
            </p>
          </div>
          {isSeller && (
            <Link
              to="/dashboard/listings/new"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          )}
        </div>

        {!isSeller && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">You're not registered as a seller yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Only seller accounts can list products. Contact support if you'd like to switch your
              account to a seller account.
            </p>
          </div>
        )}

        {isSeller && error && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isSeller && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No listings yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first product with photos, a price, and specifications.
            </p>
            <Link
              to="/dashboard/listings/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add your first product
            </Link>
          </div>
        )}

        {isSeller && products.length > 0 && (
          <div className="sl-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-elegant"
              >
                <div className="aspect-[4/3] w-full bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <ImageOff className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold">{p.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {p.currency} {Number(p.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.stock_quantity} in stock
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/dashboard/listings/${p.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
