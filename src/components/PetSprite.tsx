import { motion } from 'motion/react';
import { PetType, EvolutionStage, CostumeId, PET_CONFIG, getEvolutionStage } from '../types/pet';
import { cn } from '../lib/utils';

interface PetSpriteProps {
  type: PetType;
  level: number;
  costume?: CostumeId;
  mood?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-24 h-24 text-4xl',
  lg: 'w-48 h-48 text-7xl',
  xl: 'w-64 h-64 text-8xl',
};

export default function PetSprite({ type, level, costume = 'none', mood = 80, className, size = 'md' }: PetSpriteProps) {
  const stage = getEvolutionStage(level);
  const config = PET_CONFIG[type];
  
  // Expression based on mood
  const getExpression = () => {
    if (mood > 80) return '😆';
    if (mood > 50) return '😊';
    if (mood > 30) return '😐';
    return '😢';
  };

  // Evolution effects or extra visual elements
  const getStageDecoration = () => {
    if (stage === 'evo2') return '✨👑✨';
    if (stage === 'evo1') return '⚡';
    return '';
  };

  // For real app, use: src={`/assets/pets/${type}-${stage}${costume !== 'none' ? '-' + costume : ''}.png`}
  // Here we use styled emojis as high-quality placeholders
  
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center pet-float", sizeClasses[size], className)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className={cn(
        "absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse",
        stage === 'evo1' && "bg-accent/20",
        stage === 'evo2' && "bg-yellow-400/30 blur-2xl"
      )} />
      
      <div className="relative z-10 flex flex-col items-center">
        {stage !== 'base' && (
          <motion.div 
            className="absolute -top-4 text-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {getStageDecoration()}
          </motion.div>
        )}
        
        <span className="drop-shadow-lg leading-none">
          {config.icon}
        </span>
        
        {costume !== 'none' && stage === 'base' && (
          <div className="absolute -bottom-2 text-xl drop-shadow-sm">
            {costume === 'costume1' ? '👕' : '👑'}
          </div>
        )}
        
        <div className="absolute -right-2 -top-2 text-xl">
          {getExpression()}
        </div>
      </div>
    </motion.div>
  );
}
