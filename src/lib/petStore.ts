import { Pet, PetType, XP_PER_LEVEL } from '../types/pet';

const STORAGE_KEY = 'classroom-pets';

export const getPets = (): Pet[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePets = (pets: Pet[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
};

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const updatePetData = (pet: Pet, updates: Partial<Pet>): Pet => {
  const updated = { ...pet, ...updates };
  
  // Normal stats boundaries
  updated.mood = clamp(updated.mood, 0, 100);
  updated.hunger = clamp(updated.hunger, 0, 100);
  updated.energy = clamp(updated.energy, 0, 100);

  // Level up logic
  while (updated.xp >= updated.xpToNext) {
    updated.xp -= updated.xpToNext;
    updated.level += 1;
    updated.xpToNext = XP_PER_LEVEL;
  }

  return updated;
};

export const addPetXp = (pet: Pet, amount: number): Pet => {
  return updatePetData(pet, {
    xp: pet.xp + amount,
    mood: pet.mood + amount / 2,
    hunger: pet.hunger - amount / 4,
    energy: pet.energy - amount / 5
  });
};

export const adoptPet = (studentName: string, petName: string, petType: PetType): Pet => {
  const newPet: Pet = {
    id: crypto.randomUUID(),
    studentName,
    petName,
    petType,
    level: 1,
    xp: 0,
    xpToNext: XP_PER_LEVEL,
    mood: 80,
    hunger: 80,
    energy: 80,
    activeCostume: 'none'
  };
  const pets = getPets();
  savePets([...pets, newPet]);
  return newPet;
};
