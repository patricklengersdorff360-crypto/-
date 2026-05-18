import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PetType, PET_CONFIG } from '../types/pet';
import { adoptPet } from '../lib/petStore';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface AddPetDialogProps {
  onClose: () => void;
  onAdopt: () => void;
}

const PET_TYPES: PetType[] = ['cat', 'dog', 'rabbit', 'hamster', 'bird', 'turtle'];

export default function AddPetDialog({ onClose, onAdopt }: AddPetDialogProps) {
  const [studentName, setStudentName] = useState('');
  const [petName, setPetName] = useState('');
  const [selectedType, setSelectedType] = useState<PetType>('cat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !petName) return;
    adoptPet(studentName, petName, selectedType);
    onAdopt();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-background w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-center">🎉 认养新宠物</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold px-1">同学姓名</label>
            <input 
              required
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="例如：王小明"
              className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold px-1">宠物昵称</label>
            <input 
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="给宠物起个好听的名字"
              className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold px-1">选择宠物种类</label>
            <div className="grid grid-cols-3 gap-3">
              {PET_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    selectedType === type 
                      ? "border-primary bg-primary/10" 
                      : "border-muted hover:border-primary/40"
                  )}
                >
                  <span className="text-3xl">{PET_CONFIG[type].icon}</span>
                  <span className="text-xs font-bold">{PET_CONFIG[type].name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="btn-push w-full py-4 text-lg mt-4"
          >
            确认认养
          </button>
        </form>
      </motion.div>
    </div>
  );
}
