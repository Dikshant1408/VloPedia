"use client";

import { AuthActions } from "@/components/auth-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ProtectedRoute({ title, description, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full max-w-xl space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          <div className="space-y-2">
            <div className="mx-auto h-5 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="mx-auto h-4 w-72 animate-pulse rounded-full bg-white/5" />
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl space-y-6 text-center">
          <Badge className="mx-auto">Protected route</Badge>
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted">{description}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left text-sm leading-6 text-muted">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Sign in to continue
            </p>
            <p className="mt-2">
              This area stays locked until a Firebase user session exists. Use Google sign-in or email/password from the header.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <AuthActions />
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}