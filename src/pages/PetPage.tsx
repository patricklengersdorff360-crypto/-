import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPets, savePets, addPetXp, updatePetData } from '../lib/petStore';
import { Pet, getEvolutionName, getEvolutionStage } from '../types/pet';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Sparkles, Utensils, Gamepad2, Bed, Shirt } from 'lucide-react';
import PetSprite from '../components/PetSprite';
import StatBar from '../components/StatBar';
import SpeechBubble from '../components/SpeechBubble';
import { cn } from '../lib/utils';

export default function PetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [bubbleText, setBubbleText] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [showEvolutionCelebration, setShowEvolutionCelebration] = useState(false);

  useEffect(() => {
    const pets = getPets();
    const found = pets.find(p => p.id === id);
    if (!found) navigate('/');
    else setPet(found);
  }, [id, navigate]);

  const showBubble = (text: string) => {
    setBubbleText(text);
    setIsBubbleVisible(true);
    setTimeout(() => setIsBubbleVisible(false), 3000);
  };

  const handleAction = (xp: number, message: string) => {
    if (!pet) return;
    const prevStage = getEvolutionStage(pet.level);
    const updated = addPetXp(pet, xp);
    const nextStage = getEvolutionStage(updated.level);
    
    if (prevStage !== nextStage) {
      setShowEvolutionCelebration(true);
      setTimeout(() => setShowEvolutionCelebration(false), 4000);
    }
    
    updatePetInStore(updated);
    showBubble(message);
  };

  const updatePetInStore = (updated: Pet) => {
    const pets = getPets();
    const newPets = pets.map(p => p.id === updated.id ? updated : p);
    savePets(newPets);
    setPet(updated);
  };

  const handleCare = (type: 'feed' | 'play' | 'rest') => {
    if (!pet) return;
    let updated = { ...pet };
    let msg = '';

    if (type === 'feed') {
      updated = updatePetData(pet, { hunger: pet.hunger + 25, energy: pet.energy + 10 });
      msg = '真好吃！谢谢主人 🍖';
    } else if (type === 'play') {
      updated = updatePetData(pet, { mood: pet.mood + 20, energy: pet.energy - 15 });
      msg = '太开心啦！我们再玩会儿 ⚽';
    } else if (type === 'rest') {
      updated = updatePetData(pet, { energy: pet.energy + 30, mood: pet.mood + 5 });
      msg = '呼呼...睡个好觉 💤';
    }

    updatePetInStore(updated);
    showBubble(msg);
  };

  if (!pet) return null;

  const stage = getEvolutionStage(pet.level);
  const evoName = getEvolutionName(pet.petType, pet.level);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 font-bold mb-8 hover:opacity-70 transition-opacity"
      >
        <ArrowLeft size={20} />
        返回班级
      </button>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left column: Visuals */}
        <div className="relative flex flex-col items-center">
          <SpeechBubble text={bubbleText} isVisible={isBubbleVisible} />
          
          <div className="relative mb-8">
            <PetSprite 
              type={pet.petType} 
              level={pet.level} 
              costume={pet.activeCostume}
              mood={pet.mood} 
              size="xl" 
            />
            
            {stage !== 'base' && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-10 border-4 border-dashed border-accent/20 rounded-full -z-10"
              />
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3 py-1 bg-accent text-accent-foreground font-black rounded-xl text-sm">
                LV.{pet.level}
              </span>
              <h1 className="text-3xl font-black">{pet.petName}</h1>
            </div>
            <p className="text-muted-foreground font-medium">{pet.studentName} 的 {evoName}</p>
          </div>

          <div className="w-full mt-8 card-sticker p-6 bg-accent/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold flex items-center gap-1">
                    <Trophy size={16} className="text-accent" />
                    进化之路
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {stage === 'base' ? '距离觉醒还差 ' + (8 - pet.level) + ' 级' : 
                     stage === 'evo1' ? '距离传说还差 ' + (15 - pet.level) + ' 级' : 
                     '已达到传说形态 ✨'}
                  </span>
                </div>
                <div className="h-6 bg-muted rounded-full relative overflow-hidden">
                   <div className="absolute inset-0 flex justify-between px-10 items-center z-10 opacity-30">
                      <div className={cn("w-2 h-2 rounded-full", pet.level >= 1 ? "bg-black" : "bg-gray-400")} />
                      <div className={cn("w-2 h-2 rounded-full", pet.level >= 8 ? "bg-black" : "bg-gray-400")} />
                      <div className={cn("w-2 h-2 rounded-full", pet.level >= 15 ? "bg-black" : "bg-gray-400")} />
                   </div>
                   <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pet.level / 15) * 100}%` }}
                   />
                </div>
          </div>
        </div>

        {/* Right column: Actions & Stats */}
        <div className="space-y-8">
          <div className="card-sticker p-6 space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
              📊 身体状态
            </h3>
            <div className="space-y-4">
              <StatBar label="心情" value={pet.mood} icon="😊" color="bg-green-400" />
              <StatBar label="饥渴" value={pet.hunger} icon="🍖" color="bg-orange-400" />
              <StatBar label="体力" value={pet.energy} icon="⚡" color="bg-blue-400" />
              
              <div className="pt-4 border-t border-muted">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>经验值 XP</span>
                  <span>{pet.xp} / {pet.xpToNext}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    animate={{ width: `${(pet.xp / pet.xpToNext) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="card-sticker p-6">
                <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                  ✨ 老师奖励
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton onClick={() => handleAction(20, '作业完成得真棒！+20 XP')} icon={Sparkles} label="完成作业" xp="+20" />
                  <ActionButton onClick={() => handleAction(15, '课堂发言很积极！+15 XP')} icon={Sparkles} label="课堂表现" xp="+15" />
                  <ActionButton onClick={() => handleAction(10, '每天都要坚持哦！+10 XP')} icon={Sparkles} label="打卡签到" xp="+10" />
                  <ActionButton onClick={() => handleAction(15, '乐于助人是好习惯！+15 XP')} icon={Sparkles} label="帮助同学" xp="+15" />
                  <div className="col-span-2">
                    <ActionButton onClick={() => handleAction(30, '进步神速，继续加油！+30 XP')} icon={Trophy} label="考试进步" xp="+30" />
                  </div>
                </div>
             </div>

             <div className="card-sticker p-6">
                <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                  🧤 日常照护
                </h3>
                <div className="flex gap-4">
                   <CareButton onClick={() => handleCare('feed')} icon={Utensils} label="喂食" color="bg-orange-100 text-orange-600" />
                   <CareButton onClick={() => handleCare('play')} icon={Gamepad2} label="玩耍" color="bg-green-100 text-green-600" />
                   <CareButton onClick={() => handleCare('rest')} icon={Bed} label="休息" color="bg-blue-100 text-blue-600" />
                </div>
             </div>

             {pet.level >= 5 && stage === 'base' && (
                <div className="card-sticker p-6">
                   <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                     👗 更换服装
                   </h3>
                   <div className="flex gap-4">
                      <CostumeButton active={pet.activeCostume === 'none'} onClick={() => updatePetInStore({...pet, activeCostume: 'none'})} label="默认" />
                      <CostumeButton active={pet.activeCostume === 'costume1'} onClick={() => updatePetInStore({...pet, activeCostume: 'costume1'})} label="潮流装" disabled={pet.level < 5} />
                      <CostumeButton active={pet.activeCostume === 'costume2'} onClick={() => updatePetInStore({...pet, activeCostume: 'costume2'})} label="皇家装" disabled={pet.level < 10} />
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEvolutionCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-accent/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
              className="bg-white p-12 rounded-full shadow-2xl flex flex-col items-center"
            >
              <div className="text-8xl mb-4">✨进化✨</div>
              <h2 className="text-4xl font-black text-accent-foreground">恭喜进化啦！</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, label, xp }: any) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 rounded-xl border-2 border-muted hover:border-primary transition-colors bg-white font-bold"
    >
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-primary" />
        <span>{label}</span>
      </div>
      <span className="text-xs text-primary">{xp}</span>
    </motion.button>
  );
}

function CareButton({ onClick, icon: Icon, label, color }: any) {
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn("flex flex-col items-center justify-center gap-1 flex-1 p-4 rounded-2xl transition-all", color)}
    >
      <Icon size={24} />
      <span className="text-sm font-bold">{label}</span>
    </motion.button>
  );
}

function CostumeButton({ active, onClick, label, disabled }: any) {
  return (
    <motion.button 
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl border-2 font-bold transition-all",
        active ? "border-primary bg-primary text-white" : "border-muted text-muted-foreground",
        disabled && "opacity-30 grayscale cursor-not-allowed"
      )}
    >
      {label}
    </motion.button>
  );
}
