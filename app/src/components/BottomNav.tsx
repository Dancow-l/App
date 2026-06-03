import { motion } from 'framer-motion';
import {
  Home,
  CheckSquare,
  BookOpen,
  Compass,
  Heart,
  CircleDot,
} from 'lucide-react';

type Page = 'home' | 'habits' | 'journal' | 'compass' | 'amalan' | 'tasbih' | 'settings';

interface BottomNavProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { key: 'habits', label: 'Habits', icon: <CheckSquare className="w-5 h-5" /> },
  { key: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
  { key: 'compass', label: 'Qibla', icon: <Compass className="w-5 h-5" /> },
  { key: 'amalan', label: 'Amalan', icon: <Heart className="w-5 h-5" /> },
  { key: 'tasbih', label: 'Tasbih', icon: <CircleDot className="w-5 h-5" /> },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main Nav Pill */}
      <div className="mx-3 mb-3">
        <nav className="bg-white/90 dark:bg-[#1e3028]/90 backdrop-blur-xl rounded-[24px] shadow-[0_-4px_24px_rgba(29,43,36,0.08)] border border-[#E8F3E3]/60 dark:border-[#2a4035]/60 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = current === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className="relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-2xl transition-all"
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavDot"
                      className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#F2C4A7]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div
                    className={`transition-colors ${
                      isActive
                        ? 'text-[#1D2B24] dark:text-[#F6F6F2]'
                        : 'text-[#A8B8A0] dark:text-[#5a7a68]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors ${
                      isActive
                        ? 'text-[#1D2B24] dark:text-[#F6F6F2]'
                        : 'text-[#A8B8A0] dark:text-[#5a7a68]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export type { Page };
