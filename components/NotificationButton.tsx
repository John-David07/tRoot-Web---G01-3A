'use client';

import { useState } from 'react';

export function NotificationButton() {
  const [hasNotification, setHasNotification] = useState(true);

  return (
    <button
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      onClick={() => console.log('Notifications - feature coming soon')}
    >
      <span className="text-xl">🔔</span>
      {hasNotification && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}