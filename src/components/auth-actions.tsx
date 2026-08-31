"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { CircleUserRound, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

interface AuthActionsProps {
  className?: string;
  stacked?: boolean;
}

export function AuthActions({ className, stacked = false }: AuthActionsProps) {
  const { user, loading, signInWithDiscord, signOut } = useAuth();

  async function handleSignIn() {
    try {
      await signInWithDiscord();
      toast.success("Signed in with Discord.");
    } catch (err: any) {
      console.error("Sign-in error details:", err);
      toast.error("Could not sign in right now.", {
        description: err?.message || "Verify your Discord provider configuration in Firebase Console."
      });
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("Signed out.");
    } catch {
      toast.error("Could not sign out right now.");
    }
  }

  if (loading) {
    return <div className={cn("h-10 w-32 rounded-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] animate-pulse", className)} aria-hidden="true" />;
  }

  return (
    <div className={cn("flex items-center gap-3", stacked && "flex-col items-stretch", className)}>
      {user ? (
        <>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2 text-sm text-foreground">
            <CircleUserRound className="h-4 w-4 text-primary" />
            <span className="max-w-[12rem] truncate">{user.displayName ?? user.email ?? "Signed in"}</span>
          </div>
          <Button variant="secondary" onClick={handleSignOut} className={stacked ? "w-full" : undefined}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </>
      ) : (
        <div className={cn("relative group/tooltip", stacked && "w-full")}>
          <Button variant="primary" onClick={handleSignIn} className={stacked ? "w-full" : undefined}>
            <LogIn className="h-4 w-4" />
            Sign in with Discord
          </Button>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 bg-[#0D1A22] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-[10px] font-mono text-muted uppercase tracking-wider text-center w-64 clip-diagonal-sm shadow-xl">
            <span className="text-primary font-bold block mb-1">[ SECURE SYNC BENEFITS ]</span>
            Save your mains, customize queue prep plans, and track your skins wishlist.
          </div>
        </div>
      )}
    </div>
  );
}
