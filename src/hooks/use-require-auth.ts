import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";

interface UseRequireAuthOptions {
  /** Where to redirect unauthenticated users (default: /auth) */
  redirectTo?: string;
  /** Whether to include a ?redirect= param back to the current page */
  preservePath?: boolean;
  /** Current page path to redirect back to (uses window.location.pathname if omitted) */
  returnPath?: string;
}

interface UseRequireAuthReturn {
  /** The authenticated user (null if not authenticated) */
  user: ReturnType<typeof useAuth>["user"];
  /** Whether auth state is still loading */
  loading: boolean;
  /** Whether the user is authenticated (shortcut for !loading && !!user) */
  isAuthenticated: boolean;
  /** Whether auth is still resolving (shorter alias for loading) */
  isAuthLoading: boolean;
}

/**
 * Hook that requires authentication to access the current page.
 *
 * - While auth is loading, it returns `{ loading: true, isAuthenticated: false }`
 * - When auth resolves as not authenticated, it redirects to the auth page
 * - Uses a redirect queue to prevent stale/clashing navigations
 * - Returns early so the calling component can show a loader instead of flash-redirecting
 *
 * @example
 * ```tsx
 * const { user, loading, isAuthenticated } = useRequireAuth({ preservePath: true });
 * if (loading) return <Spinner />;
 * if (!isAuthenticated) return null; // redirect already triggered
 * return <div>Welcome, {user.email}</div>;
 * ```
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthReturn {
  const { redirectTo = "/auth", preservePath = true, returnPath } = options;
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const redirectedRef = useRef(false);

  const path = returnPath || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");

  useEffect(() => {
    // Reset redirect ref when user changes (e.g. after login)
    if (user) {
      redirectedRef.current = false;
      return;
    }
  }, [user]);

  useEffect(() => {
    // Only redirect once per mount — prevents double-redirect loops
    if (loading || user || redirectedRef.current) return;

    redirectedRef.current = true;

    const target = preservePath && path !== "/"
      ? `${redirectTo}?redirect=${encodeURIComponent(path)}`
      : redirectTo;

    // Use replace to avoid polluting browser history
    navigate(target, { replace: true });
  }, [loading, user, navigate, redirectTo, preservePath, path]);

  return {
    user,
    loading,
    isAuthenticated: !loading && !!user,
    isAuthLoading: loading,
  };
}
