'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [refreshRate, setRefreshRate] = useState('30');
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Handle calibration
  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      alert('Sensors calibrated successfully');
    }, 2000);
  };

  // Handle reset data
  const handleResetData = () => {
    if (confirm('Are you sure? This will clear all local storage and sensor logs.')) {
      localStorage.clear();
      alert('Data reset completed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">System Settings</h1>

      <div className="space-y-6">
        {/* General Section */}
        <div className="bg-white rounded-lg border-green-400 shadow-green-200 mb-6 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
          
          {/* Data Refresh Rate */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Data Refresh Rate</p>
              <p className="text-sm text-gray-500">How often sensor data updates</p>
            </div>
            <select
              value={refreshRate}
              onChange={(e) => setRefreshRate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-900"
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>

          {/* Calibration */}
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Calibration</p>
              <p className="text-sm text-gray-500">Recalibrate soil moisture sensors</p>
            </div>
            <button
              onClick={handleCalibrate}
              disabled={isCalibrating}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50"
            >
              {isCalibrating ? 'Calibrating...' : 'Calibrate'}
            </button>
          </div>

          {/* Reset Data */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-600">Reset Data</p>
              <p className="text-sm text-gray-500">Clear all local storage and sensor logs</p>
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
        <div className="bg-white rounded-lg shadow-green-200 mb-6 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Info</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Firmware Version</span>
              <span className="font-medium text-gray-900">v2.4.12-stable</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Hardware ID</span>
              <span className="font-medium text-gray-900">EG-SENS-8842-X</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Network Status</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">AI Model</span>
              <span className="font-medium text-gray-900">Gemini 2.0 Flash</span>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-green-200 shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Auto-Irrigation Triggered (Today, 14:43 AM)
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                🔥 High Temperature Alert: 32°C detected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}