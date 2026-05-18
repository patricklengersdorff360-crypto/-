import { useState, useEffect, useRef } from 'react';
import { getPets } from '../lib/petStore';
import { Pet } from '../types/pet';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudRain, Sun, Snowflake } from 'lucide-react';
import { cn } from '../lib/utils';
import WeatherEffects from '../components/WeatherEffects';

type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';
const GARDEN_W = 1200;
const GARDEN_H = 600;

const PAVILIONS = [
  { id: '1', name: '春风亭', x: 200, y: 150 },
  { id: '2', name: '听雨亭', x: 900, y: 300 },
  { id: '3', name: '赏花亭', x: 600, y: 450 },
];

interface PetState {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  action: 'walk' | 'idle' | 'sniff' | 'jump' | 'hide';
  msg: string;
  msgTimeout: number;
}

export default function Garden() {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [petStates, setPetStates] = useState<Record<string, PetState>>({});
  const [weather, setWeather] = useState<Weather>('sunny');
  const [weatherIndex, setWeatherIndex] = useState(0);
  const gardenRef = useRef<HTMLDivElement>(null);

  const weathers: Weather[] = ['sunny', 'cloudy', 'rainy', 'snowy'];

  useEffect(() => {
    const p = getPets();
    setPets(p);
    
    // Initialize pet states
    const initialStates: Record<string, PetState> = {};
    p.forEach(pet => {
      initialStates[pet.id] = {
        id: pet.id,
        x: Math.random() * (GARDEN_W - 100) + 50,
        y: Math.random() * (GARDEN_H - 100) + 50,
        targetX: Math.random() * (GARDEN_W - 100) + 50,
        targetY: Math.random() * (GARDEN_H - 100) + 50,
        action: 'idle',
        msg: '',
        msgTimeout: 0
      };
    });
    setPetStates(initialStates);
  }, []);

  // Weather cycle logic
  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherIndex(prev => (prev + 1) % weathers.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setWeather(weathers[weatherIndex]);
  }, [weatherIndex]);

  // Pet AI Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPetStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          const s = next[id];
          
          // Random dialog trigger
          if (s.msgTimeout > 0) {
            s.msgTimeout -= 1;
          } else {
            if (Math.random() > 0.95) {
              const msgs = weather === 'rainy' ? ['下雨啦，快躲起来！', '我有小雨伞 ☂️'] : 
                           weather === 'snowy' ? ['雪花白茫茫的~', '好冷好冷'] :
                           ['花儿好香～', '再玩一会儿！', '阳光真舒服'];
              s.msg = msgs[Math.floor(Math.random() * msgs.length)];
              s.msgTimeout = 5;
            } else {
              s.msg = '';
            }
          }

          // Movement logic
          if (weather === 'rainy' || weather === 'snowy') {
            // Head to nearest pavilion
            const nearest = PAVILIONS.reduce((prev, curr) => {
               const dPrev = Math.hypot(prev.x - s.x, prev.y - s.y);
               const dCurr = Math.hypot(curr.x - s.x, curr.y - s.y);
               return dCurr < dPrev ? curr : prev;
            });
            s.targetX = nearest.x + (Math.random() * 40 - 20);
            s.targetY = nearest.y + (Math.random() * 40 - 20);
            s.action = 'hide';
          } else {
            // Wander freely
            if (Math.abs(s.x - s.targetX) < 10 && Math.abs(s.y - s.targetY) < 10) {
              if (Math.random() > 0.7) {
                s.targetX = Math.random() * (GARDEN_W - 100) + 50;
                s.targetY = Math.random() * (GARDEN_H - 100) + 50;
                s.action = 'walk';
              } else {
                s.action = Math.random() > 0.5 ? 'sniff' : 'idle';
              }
            }
          }

          // Move towards target
          const dx = s.targetX - s.x;
          const dy = s.targetY - s.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 5) {
            s.x += (dx / dist) * 2;
            s.y += (dy / dist) * 2;
          }
        });
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [weather]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-100 to-green-100 font-sans">
      <WeatherEffects weather={weather} />
      
      {/* HUD */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link to="/">
          <button className="btn-push-secondary p-3 rounded-full flex items-center justify-center">
            <ArrowLeft size={24} />
          </button>
        </Link>
        <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white flex items-center gap-4">
          <div className="flex items-center gap-2">
            {weather === 'sunny' && <Sun className="text-orange-500 animate-spin-slow" />}
            {weather === 'cloudy' && <Cloud className="text-blue-400" />}
            {weather === 'rainy' && <CloudRain className="text-blue-600 animate-bounce" />}
            {weather === 'snowy' && <Snowflake className="text-blue-200 animate-pulse" />}
            <span className="font-black text-lg">
              {weather === 'sunny' ? '晴天 ☀️' : weather === 'cloudy' ? '多云 ☁️' : weather === 'rainy' ? '雨天 🌧️' : '雪天 ❄️'}
            </span>
          </div>
          <div className="h-6 w-px bg-muted" />
          <div className="text-sm font-bold text-muted-foreground">
            {pets.length} 只宠物正在共享花园
          </div>
        </div>
      </div>

      {/* Garden Area */}
      <div 
        ref={gardenRef}
        className="relative w-full h-full garden-floor overflow-auto select-none"
        style={{ width: GARDEN_W, height: GARDEN_H }}
      >
        {/* Decorations */}
        <div className="absolute top-20 left-40 text-6xl opacity-30">🌳</div>
        <div className="absolute top-80 left-10 text-6xl opacity-20">🌸</div>
        <div className="absolute top-40 right-20 text-6xl opacity-30">🌻</div>
        <div className="absolute bottom-20 left-1/2 text-6xl opacity-20">🌲</div>

        {/* Pavilions */}
        {PAVILIONS.map(p => (
          <div key={p.id} className="absolute z-10 flex flex-col items-center" style={{ left: p.x, top: p.y }}>
            <div className="text-8xl drop-shadow-xl">⛩️</div>
            <div className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold -mt-2 shadow-sm border border-muted">
              {p.name}
            </div>
          </div>
        ))}

        {/* Pets */}
        {pets.map(pet => {
          const state = petStates[pet.id];
          if (!state) return null;
          
          const getMoodColor = () => {
             if (pet.mood > 80) return 'bg-green-500';
             if (pet.mood > 50) return 'bg-blue-500';
             if (pet.mood > 30) return 'bg-yellow-500';
             return 'bg-red-500';
          };

          const getMoodEmoji = () => {
             if (pet.mood > 80) return '😆';
             if (pet.mood > 50) return '😊';
             if (pet.mood > 30) return '😐';
             return '😢';
          };

          return (
            <motion.div
              key={pet.id}
              className="absolute z-20 cursor-pointer"
              style={{ x: state.x, y: state.y }}
              animate={{ x: state.x, y: state.y }}
              transition={{ type: 'linear', duration: 0.1 }}
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              {/* Pet Label */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
                <AnimatePresence>
                  {state.msg && (
                    <motion.div 
                      key="msg"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-white px-3 py-1 rounded-xl shadow-md text-xs font-bold mb-1 border"
                    >
                      {state.msg}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-black shadow-sm", getMoodColor())}>
                   <span>{getMoodEmoji()}</span>
                   <span>{pet.petName}</span>
                </div>
              </div>

              {/* Pet Visual */}
              <div className="relative group">
                <span className="text-4xl pet-float block hover:scale-120 transition-transform">
                  {weather === 'rainy' && state.action !== 'hide' && (
                    <span className="absolute -top-4 -right-2 text-xl z-10">☂️</span>
                  )}
                  {state.action === 'sniff' && <span className="absolute -left-4 text-xl">🌸</span>}
                  {state.action === 'jump' && <span className="absolute -top-4 text-xl">⭐</span>}
                  
                  {PET_CONFIG[pet.petType].icon}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <style>{`
        .garden-floor {
          background-image: 
            radial-gradient(circle at 10px 10px, rgba(0,0,0,0.01) 2px, transparent 0);
          background-size: 40px 40px;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const PET_CONFIG: Record<string, { icon: string }> = {
  cat: { icon: '🐱' },
  dog: { icon: '🐶' },
  rabbit: { icon: '🐰' },
  hamster: { icon: '🐹' },
  bird: { icon: '🐦' },
  turtle: { icon: '🐢' },
};
