'use client';

import { useEffect, useState } from 'react';

interface Plant {
  name: string;
  scientificName: string;
  reason: string;
}

interface PlantRecommendationsProps {
  moisture: number;
  temperature: number;
  humidity: number;
}

const FALLBACK_PLANTS: Plant[] = [
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    reason: "Extremely adaptable and tolerates a wide range of conditions."
  },
  {
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    reason: "Survives in low light and irregular watering schedules."
  },
  {
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    reason: "Very forgiving plant that adapts to most indoor environments."
  }
];

export function PlantRecommendations({ moisture, temperature, humidity }: PlantRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Plant[]>(FALLBACK_PLANTS);
  const [loading, setLoading] = useState(true);
  const [isAiMode, setIsAiMode] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moisture, temperature, humidity }),
        });
        
        const data = await res.json();
        
        // Check if we got valid AI recommendations
        if (res.ok && data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          setIsAiMode(true);
        } else {
          // API returned error or invalid data - use fallback
          setRecommendations(FALLBACK_PLANTS);
          setIsAiMode(false);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setRecommendations(FALLBACK_PLANTS);
        setIsAiMode(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [moisture, temperature, humidity]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Plant Recommendations
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Analyzing conditions...</p>
          <p className="text-sm text-gray-400 mt-2">AI is finding the best plants for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Plant Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((plant, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-green-400 shadow-green-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">🌱</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {plant.scientificName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {plant.reason}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        {isAiMode 
          ? "AI-powered recommendations based on current sensor readings"
          : "Using default recommendations (AI service temporarily unavailable)"}
      </p>
    </div>
  );
}