'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'History', path: '/history', icon: '📅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-40 border-green-400 shadow-green-200 shadow-md ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-600"
        >
          <span className="text-gray-600 dark:text-gray-300">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>

        {/* Logo / Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed ? (
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Plant Monitor</h2>
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto"></div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 transition-colors ${
                pathname === item.path
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Spacer - pushes main content right */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} />
    </>
  );
}