import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { MainLayout } from '@/components/layout/main-layout'
import { ToastProvider } from "@/components/providers/toast-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Family Menu - Your Family Meal Planning Assistant',
  description: 'Plan your family meals, manage recipes, generate shopping lists, and track nutrition with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  )
}
