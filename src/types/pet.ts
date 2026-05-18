export type PetType = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'bird' | 'turtle';
export type CostumeId = 'none' | 'costume1' | 'costume2';
export type EvolutionStage = 'base' | 'evo1' | 'evo2';

export interface Pet {
  id: string;
  studentName: string;
  petName: string;
  petType: PetType;
  level: number;
  xp: number;
  xpToNext: number;
  mood: number;
  hunger: number;
  energy: number;
  activeCostume?: CostumeId;
}

export const XP_PER_LEVEL = 100;

export const PET_CONFIG = {
  cat: { name: '小猫', evo1: '天使猫', evo2: '仙灵猫', icon: '🐱' },
  dog: { name: '小狗', evo1: '超能犬', evo2: '黄金战犬', icon: '🐶' },
  rabbit: { name: '小兔', evo1: '魔法兔', evo2: '月光守护兔', icon: '🐰' },
  hamster: { name: '小仓鼠', evo1: '探险鼠', evo2: '太空仓鼠', icon: '🐹' },
  bird: { name: '小鸟', evo1: '火焰鸟', evo2: '雷霆神鸟', icon: '🐦' },
  turtle: { name: '小乌龟', evo1: '龙翼龟', evo2: '黄金龙龟', icon: '🐢' },
};

export const getEvolutionStage = (level: number): EvolutionStage => {
  if (level >= 15) return 'evo2';
  if (level >= 8) return 'evo1';
  return 'base';
};

export const getEvolutionName = (type: PetType, level: number): string => {
  const stage = getEvolutionStage(level);
  if (stage === 'evo2') return PET_CONFIG[type].evo2;
  if (stage === 'evo1') return PET_CONFIG[type].evo1;
  return PET_CONFIG[type].name;
};
