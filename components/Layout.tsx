'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    /*{ name: 'Sensors', path: '/sensors', icon: '📊' },*/
    { name: 'History', path: '/history', icon: '📅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 pb-24">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="justify bottom-0 left-0 right-0 bg-grey dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-green-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}