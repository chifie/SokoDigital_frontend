import { useRef,  useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Loader2, Upload, X, Plus, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { supabase } from '@/integrations/supabase/client';
import { CATEGORY_NAMES } from '@/lib/marketplace-data';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type SpecRow = { key: string; value: string };

const CURRENCIES = ['TZS', 'USD', 'KES'];

export default function SellerProductFormPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user, roles, loading: authLoading } = useAuth();
  const { loading: authGuardLoading, isAuthenticated } = useRequireAuth({
    preservePath: true,
    redirectTo: "/auth",
  });
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_NAMES[0]);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('TZS');
  const [stock, setStock] = useState('1');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: '', value: '' }]);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSeller = roles.includes('seller') || roles.includes('admin');

  useEffect(() => {
    if (!isEdit || !user || !id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (cancelled) return;
      if (error || !data) {
        setError('Could not load this listing.');
      } else if (data.seller_id !== user.id && !roles.includes('admin')) {
        setError("You don't have permission to edit this listing.");
      } else {
        setName(data.name);
        setDescription(data.description ?? '');
        setCategory(data.category);
        setPrice(String(data.price));
        setCurrency(data.currency ?? 'TZS');
        setStock(String(data.stock_quantity ?? 0));
        setLocation(data.location ?? '');
        setImages(data.images ?? (data.image_url ? [data.image_url] : []));
        const specEntries = Object.entries((data.specifications as Record<string, string>) ?? {});
        setSpecs(specEntries.length ? specEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
      }
      setLoadingExisting(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, id, user, roles]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".spf-form"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".spf-form"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !user) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError(err?.message ?? 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSpecRow = () => setSpecs((prev) => [...prev, { key: '', value: '' }]);
  const removeSpecRow = (index: number) =>
    setSpecs((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    const priceNum = Number(price);
    if (!name.trim() || !priceNum || priceNum <= 0) {
      setError('Please provide a product name and a valid price.');
      return;
    }

    setSaving(true);
    try {
      const specifications = Object.fromEntries(
        specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()])
      );

      let sellerName = user.email ?? 'Seller';
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.full_name) sellerName = profile.full_name;

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        category,
        price: priceNum,
        currency,
        stock_quantity: Number(stock) || 0,
        location: location.trim() || null,
        images,
        image_url: images[0] ?? null,
        specifications,
        seller_id: user.id,
        seller_name: sellerName,
      };

      if (isEdit && id) {
        const { error } = await supabase.from('products').update(payload).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      navigate('/dashboard/listings', { replace: true });
    } catch (err: any) {
      setError(err?.message ?? 'Could not save this listing.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || authGuardLoading || loadingExisting) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main ref={mainRef} className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold">Seller account required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only seller accounts can create listings.
          </p>
          <Link to="/dashboard" className="mt-6 inline-block text-primary hover:underline dark:text-primary">
            Back to dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main ref={mainRef} className="mx-auto max-w-3xl px-4 py-28 sm:px-6 lg:px-8">
        <Link
          to="/dashboard/listings"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to your listings
        </Link>

        <h1 className="text-2xl font-bold">{isEdit ? 'Edit product' : 'Add a product'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add photos, a price, and specifications so buyers know exactly what they're getting.
        </p>          <form onSubmit={submit} className="spf-form mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Photos */}
          <div>
            <label className="mb-2 block text-sm font-medium">Product photos</label>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
                  <img src={url} alt="Product" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              The first photo is used as the main listing image.
            </p>
          </div>

          {/* Basic info */}
          <div>
            <label className="mb-1 block text-sm font-medium">Product name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Handwoven Kitenge Tote Bag"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Describe your product, materials, condition, and what makes it stand out."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORY_NAMES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Business location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Dar es Salaam"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Price</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Stock quantity</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="mb-2 block text-sm font-medium">Specifications</label>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={s.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    placeholder="e.g. Material"
                    className="w-1/3 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    value={s.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    placeholder="e.g. 100% cotton"
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(i)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted"
                    aria-label="Remove specification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpecRow}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline dark:text-primary">
              <Plus className="h-3.5 w-3.5" />
              Add specification
            </button>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Save changes' : 'Publish listing'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
