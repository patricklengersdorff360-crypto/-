import { useState, useEffect } from 'react';
import { getPets, adoptPet } from '../lib/petStore';
import { Pet } from '../types/pet';
import { Plus, Flower2 } from 'lucide-react';
import PetCard from '../components/PetCard';
import AddPetDialog from '../components/AddPetDialog';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Index() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setPets(getPets());
  }, []);

  const handleAdopt = () => {
    setPets(getPets());
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black mb-2"
          >
            🐾 萌宠教室
          </motion.h1>
          <p className="text-muted-foreground font-medium">每位同学都有自己的小伙伴</p>
        </div>
        
        <div className="flex gap-4">
          <Link to="/garden">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-push-secondary flex gap-2 items-center"
            >
              <Flower2 size={20} />
              花草园
            </motion.button>
          </Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDialogOpen(true)}
            className="btn-push flex gap-2 items-center"
          >
            <Plus size={20} />
            认养宠物
          </motion.button>
        </div>
      </header>

      {pets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-8xl mb-6"
          >
            🐣
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">还没有小伙伴呢！</h2>
          <p className="text-muted-foreground mb-8">开始第一步，为同学们认养宠物吧</p>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="btn-push text-lg px-10 py-4"
          >
            开始认养 🎉
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {pets.map((pet, index) => (
            <PetCard key={pet.id} pet={pet} index={index} />
          ))}
        </div>
      )}

      {isDialogOpen && (
        <AddPetDialog 
          onClose={() => setIsDialogOpen(false)} 
          onAdopt={handleAdopt} 
        />
      )}
    </div>
  );
}
