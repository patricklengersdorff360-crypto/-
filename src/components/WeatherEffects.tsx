import { motion } from 'motion/react';
import { cn } from '../lib/utils';

type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

interface WeatherEffectsProps {
  weather: Weather;
}

export default function WeatherEffects({ weather }: WeatherEffectsProps) {
  if (weather === 'sunny' || weather === 'cloudy') return null;

  const drops = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {weather === 'rainy' && drops.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 + '%' }}
          animate={{ y: '100vh' }}
          transition={{ 
            duration: 0.5 + Math.random() * 0.5, 
            repeat: Infinity, 
            ease: 'linear',
            delay: Math.random() * 2
          }}
          className="absolute w-0.5 h-4 bg-blue-400/40"
        />
      ))}

      {weather === 'snowy' && drops.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 + '%' }}
          animate={{ y: '100vh', x: (Math.random() * 20 - 10) + 'vw' }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity, 
            ease: 'linear',
            delay: Math.random() * 2
          }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
        />
      ))}
      
      {weather === 'rainy' && (
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]" />
      )}
      {weather === 'snowy' && (
        <div className="absolute inset-0 bg-white/5" />
      )}
    </div>
  );
}
