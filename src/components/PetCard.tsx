import { motion } from 'motion/react';
import { Pet, getEvolutionName } from '../types/pet';
import PetSprite from './PetSprite';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  index: number;
}

export default function PetCard({ pet, index }: PetCardProps) {
  const evolutionName = getEvolutionName(pet.petType, pet.level);
  const xpPercent = (pet.xp / pet.xpToNext) * 100;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.08, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={`/pet/${pet.id}`} className="block">
        <div className="card-sticker p-4 text-center cursor-pointer relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2 py-1 bg-accent/20 rounded-lg text-xs font-bold text-accent-foreground">
            Lv.{pet.level}
          </div>
          
          <PetSprite type={pet.petType} level={pet.level} mood={pet.mood} size="md" className="mx-auto mb-3" />
          
          <h3 className="font-bold text-lg mb-1">{pet.petName}</h3>
          <p className="text-xs text-muted-foreground mb-3">{pet.studentName} 的 {evolutionName}</p>
          
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
