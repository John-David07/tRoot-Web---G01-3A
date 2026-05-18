'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

interface CircularProgressProps {
  value: number;
  label: string;
}

export function CircularProgress({ value, label }: CircularProgressProps) {
  const getColor = (val: number) => {
    if (val > 80) return '#2196F3'; // saturated - Blue
    if (val > 40) return '#4CAF50'; // Optimal - Green
    return '#FF9800'; // Dry - Orange
  };

  const getTextColor = (val: number) => {
    // Dark text for lighter backgrounds, white for darker
    if (val > 80) return '#1a1a1a'; // Dark text on blue
    if (val > 40) return '#1a1a1a'; // Dark text on green
    return '#1a1a1a'; // Dark text on orange
  };

  const getStatus = (val: number) => {
    if (val > 80) return 'saturated';
    if (val > 40) return 'Optimal';
    return 'Dry';
  };

  const color = getColor(value);
  const textColor = getTextColor(value);
  const status = getStatus(value);

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '24px',
            textColor: textColor,
          })}
        />
      </div>
      <div className="mt-2 text-center">
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          status === 'saturated' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
          status === 'Optimal' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' :
          'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
        }`}>
          {status}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}