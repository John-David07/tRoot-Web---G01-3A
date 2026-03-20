interface PlantRecommendationsProps {
  humidity: number;
}

interface Plant {
  name: string;
  scientificName: string;
  description: string;
  icon: string;
}

export function PlantRecommendations({ humidity }: PlantRecommendationsProps) {
  const getRecommendations = (): Plant[] => {
    // Logic based on humidity (same as Flutter version)
    if (humidity > 70) {
      return [
        {
          name: 'Spider Plant',
          scientificName: 'Chlorophytum comosum',
          description: `Perfectly matches the ${Math.round(humidity)}% humidity in your home.`,
          icon: '🕷️'
        },
        {
          name: 'Fern',
          scientificName: 'Nephrolepis exaltata',
          description: 'Thrives in high humidity environments.',
          icon: '🌿'
        }
      ];
    } else if (humidity < 40) {
      return [
        {
          name: 'Snake Plant',
          scientificName: 'Sansevieria trifasciata',
          description: 'Tolerates dry air and irregular watering.',
          icon: '🐍'
        },
        {
          name: 'Aloe Vera',
          scientificName: 'Aloe barbadensis millis',
          description: 'This plant is low maintenance and suitable for indoor spaces.',
          icon: '🌱'
        }
      ];
    } else {
      return [
        {
          name: 'Snake Plant',
          scientificName: 'Sansevieria trifasciata',
          description: 'Perfect for beginners, tolerates low light.',
          icon: '🐍'
        },
        {
          name: 'Aloe Vera',
          scientificName: 'Aloe barbadensis millis',
          description: 'This plant is low maintenance and suitable for indoor spaces.',
          icon: '🌱'
        },
        {
          name: 'Spider Plant',
          scientificName: 'Chlorophytum comosum',
          description: `Perfectly matches the ${Math.round(humidity)}% humidity in your home.`,
          icon: '🕷️'
        }
      ];
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Plant Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((plant) => (
          <div
            key={plant.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-green-400 shadow-green-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{plant.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {plant.scientificName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {plant.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}