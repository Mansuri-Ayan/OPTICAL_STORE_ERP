import React, { ErrorInfo, ReactNode, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/router";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/api/auth.api";

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-red-200 shadow-sm text-center">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-4">An unexpected error occurred in the optical terminal.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AuthBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      try {
        let token = useAuthStore.getState().accessToken;
        if (!token) {
          try {
            const refreshRes = await authApi.refresh();
            if (refreshRes?.access_token) {
              token = refreshRes.access_token;
              useAuthStore.setState({ accessToken: token });
            }
          } catch {
            // No valid refresh cookie present
          }
        }

        if (token) {
          const user = await authApi.getMe();
          if (isMounted) {
            useAuthStore.getState().setAuth(user, token);
          }
        } else {
          if (isMounted) {
            useAuthStore.getState().clearAuth();
          }
        }
      } catch {
        if (isMounted) {
          useAuthStore.getState().clearAuth();
        }
      } finally {
        if (isMounted) {
          useAuthStore.getState().setLoading(false);
        }
      }
    }
    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                fontSize: '13px',
                borderRadius: '10px',
                padding: '10px 14px',
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthBootstrap>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
