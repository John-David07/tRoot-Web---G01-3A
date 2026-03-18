import { Suspense } from 'react';
import DashboardClient from '@/components/DashboardClient';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Plant Monitoring Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time sensor data from your plants
          </p>
        </header>

        <Suspense fallback={<div>Loading dashboard...</div>}>
          <DashboardClient />
        </Suspense>
      </div>
    </main>
  );
}