'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Navbar } from './navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="relative flex min-h-screen flex-col">
      {isAuthenticated && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
