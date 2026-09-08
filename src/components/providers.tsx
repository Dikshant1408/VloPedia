"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { SoundProvider } from "@/components/sound-provider";
import { Toaster } from "sonner";

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster position="top-right" richColors closeButton theme={theme} />;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SoundProvider>
          <AuthProvider>{children}</AuthProvider>
          <ThemedToaster />
        </SoundProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
