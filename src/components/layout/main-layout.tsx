'use client';

import { useAuth } from '@/contexts/auth-context';
import { Navbar } from './navbar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
