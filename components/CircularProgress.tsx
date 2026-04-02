'use client';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularProgressProps {
  value: number;
  label: string;
}

export function CircularProgress({ value, label }: CircularProgressProps) {
  const getColor = (val: number) => {
    if (val > 80) return '#2196F3'; // Wet - Blue
    if (val > 40) return '#4CAF50'; // Optimal - Green
    return '#FF9800'; // Dry - Orange
  };

  const getStatus = (val: number) => {
    if (val > 80) return 'Wet';
    if (val > 40) return 'Optimal';
    return 'Dry';
  };

  const color = getColor(value);
  const status = getStatus(value);

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '24px',
            textColor: '#ffffff',
            pathColor: color,
            trailColor: '#e0e0e0',
          })}
        />
      </div>
      <div className="mt-2 text-center">
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
          status === 'Wet' ? 'bg-blue-100 text-blue-600' :
          status === 'Optimal' ? 'bg-green-100 text-green-600' :
          'bg-orange-100 text-orange-600'
        }`}>
          {status}
        </span>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}