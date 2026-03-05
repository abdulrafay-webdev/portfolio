'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminApi } from '@/lib/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = adminApi.isAuthenticated();
    const isLoginPage = pathname === '/admin' || pathname === '/admin/';
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      router.push('/admin');
    } else {
      setLoading(false);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    adminApi.logout();
    router.push('/admin');
  };

  // If on login page, don't show layout
  if (pathname === '/admin' || pathname === '/admin/') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="/admin/dashboard" className="text-gray-700 hover:text-neon-purple transition-colors">
                  Dashboard
                </a>
                <a href="/admin/projects" className="text-gray-700 hover:text-neon-purple transition-colors">
                  Projects
                </a>
                <a href="/admin/services" className="text-gray-700 hover:text-neon-purple transition-colors">
                  Services
                </a>
              </nav>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
