import { useRef,  useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { ShoppingBag, Store, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth, AppRole } from '@/lib/auth';
import { Logo } from '@/components/Logo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

type Mode = 'login' | 'register';
type SignupRole = Exclude<AppRole, 'admin'>;

export default function AuthPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<SignupRole>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [user, loading, navigate, redirectTo]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Contact the site administrator.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
            data: { full_name: fullName, role },
          },
        });
        if (error) throw error;
      }
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Contact the site administrator.');
      return;
    }
    try {
      const { lovable } = await import('@/integrations/lovable/index');
      const r = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (r?.error) setError((r.error as any)?.message ?? 'Google sign-in failed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in unavailable');
    }
  };


  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        main.querySelectorAll(".auth-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
          scrollTrigger: { trigger: main.querySelector(".auth-card"), start: "top 85%", once: true } }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main ref={mainRef} className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4">
                <Logo className="h-16 w-auto text-primary" />
              </div>
              <h1 className="text-2xl font-bold">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === 'login'
                  ? 'Sign in to continue shopping or managing your shop.'
                  : 'Join SokoDigital as a buyer or seller in seconds.'}
              </p>
            </div>

            {mode === 'register' && (
              <div className="mb-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${
                    role === 'buyer'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-semibold">Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${
                    role === 'seller'
                      ? 'border-secondary bg-secondary/10 text-secondary'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <Store className="h-5 w-5" />
                  <span className="font-semibold">Seller</span>
                </button>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Full name</label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Jane Doe"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              {resetSent && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                  Check your email for the password reset link.
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>

              {mode === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={busy}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={google}
              type="button"
              className="w-full rounded-lg border border-border bg-background py-2.5 font-medium transition hover:bg-muted"
            >
              Continue with Google
            </button>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === 'login' ? (
                <>
                  New to SokoDigital?{' '}
                  <button className="font-semibold text-primary hover:underline" onClick={() => setMode('register')}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button className="font-semibold text-primary hover:underline" onClick={() => setMode('login')}>
                    Sign in
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">Back to home</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
