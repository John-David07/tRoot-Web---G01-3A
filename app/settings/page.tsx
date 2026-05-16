'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  useEffect(() => {
    document.title = 'Soil Monitor | Settings';
  }, []);
  // Handle reset data
  const handleResetData = () => {
    if (confirm('Are you sure? This will clear all local storage settings.')) {
      localStorage.clear();
      alert('Local settings have been reset.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h1>

      <div className="space-y-6">
        {/* General Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-400 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General</h2>
          
          {/* Reset Data - Only working feature */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Reset Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clear all local preferences and settings</p>
            </div>
            <button
              onClick={handleResetData}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* System Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-400 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Info</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Firmware Version</span>
              <span className="font-medium text-gray-900 dark:text-white">v2.4.12-stable</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Hardware ID</span>
              <span className="font-medium text-gray-900 dark:text-white">EG-SENS-8842-X</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Network Status</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">AI Model</span>
              <span className="font-medium text-gray-900 dark:text-white">Gemini 2.5 Flash Lite</span>
            </div>
          </div>
        </div>

        {/* Information Section - Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-green-400 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Information</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Notifications will appear here
              </p>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Real-time alerts coming in future updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}