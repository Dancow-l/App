import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import {
  getTasbihCount,
  setTasbihCount,
  getTasbihPreset,
  setTasbihPreset,
} from '@/lib/storage';

const PRESETS = [33, 99, 100];

export default function Tasbih() {
  const [count, setCount] = useState(0);
  const [preset, setPresetState] = useState(33);
  const [justPressed, setJustPressed] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCount(getTasbihCount());
    setPresetState(getTasbihPreset());
  }, []);

  useEffect(() => {
    setCompleted(count >= preset && count > 0);
  }, [count, preset]);

  const handleCount = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    setTasbihCount(newCount);
    setJustPressed(true);
    setTimeout(() => setJustPressed(false), 150);
  }, [count]);

  const handleReset = () => {
    setCount(0);
    setTasbihCount(0);
    setCompleted(false);
  };

  const handlePreset = (p: number) => {
    setPresetState(p);
    setTasbihPreset(p);
    setCount(0);
    setTasbihCount(0);
    setCompleted(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleCount();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCount]);

  const progress = preset > 0 ? Math.min((count / preset) * 100, 100) : 0;

  return (
    <div className="min-h-screen pb-24 pt-6 px-5 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          Tasbih Counter
        </h1>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
          Tap the button or press Space
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white dark:bg-[#1e3028] rounded-[28px] p-6 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035] flex flex-col items-center justify-center"
      >
        {/* Presets */}
        <div className="flex gap-2 mb-8">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                preset === p
                  ? 'bg-[#F2C4A7] text-[#1D2B24]'
                  : 'bg-[#E8F3E3] dark:bg-[#2a4035] text-[#6E8078] dark:text-[#8fa396]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Progress Ring */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 192 192">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#E8F3E3"
              strokeWidth="12"
              className="dark:stroke-[#2a4035]"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#F2C4A7"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
              className="transition-all duration-500"
            />
          </svg>

          {/* Count in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={justPressed ? { scale: 1.2 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="text-6xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] tabular-nums"
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Completion sparkle */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-2 -right-2 w-10 h-10 bg-[#8BBE88] rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Target indicator */}
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396] mb-6">
          Target: {preset} &middot; Remaining: {Math.max(preset - count, 0)}
        </p>

        {/* Big Count Button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleCount}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F2C4A7] to-[#E8B08E] shadow-[0_14px_40px_rgba(242,196,167,0.4)] flex items-center justify-center mb-4 hover:shadow-[0_18px_50px_rgba(242,196,167,0.5)] transition-shadow"
        >
          <span className="text-2xl font-bold text-[#1D2B24]">+1</span>
        </motion.button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-[#6E8078] dark:text-[#8fa396] hover:text-[#1D2B24] dark:hover:text-[#F6F6F2] transition-colors py-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </motion.div>

      {/* Dhikr suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-5 grid grid-cols-3 gap-2"
      >
        {[
          { arabic: 'سُبْحَانَ ٱللَّٰهِ', label: 'Subhanallah' },
          { arabic: 'ٱلْحَمْدُ لِلَّٰهِ', label: 'Alhamdulillah' },
          { arabic: 'ٱللَّٰهُ أَكْبَرُ', label: 'Allahu Akbar' },
        ].map((dhikr) => (
          <button
            key={dhikr.label}
            onClick={() => {
              setPresetState(33);
              setTasbihPreset(33);
              setCount(0);
              setTasbihCount(0);
              setCompleted(false);
            }}
            className="bg-[#E8F3E3] dark:bg-[#1a2e22] rounded-2xl p-3 text-center hover:scale-105 active:scale-95 transition-transform"
          >
            <p className="font-arabic text-sm text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
              {dhikr.arabic}
            </p>
            <p className="text-[10px] text-[#6E8078] dark:text-[#8fa396]">
              {dhikr.label}
            </p>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
