import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Sun,
  CloudSun,
  Heart,
  BookOpen,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { getHabits, toggleHabit, type Habit, resetDailyHabits } from '@/lib/storage';

const categoryIcons: Record<string, React.ReactNode> = {
  prayer: <Sun className="w-4 h-4" />,
  dhikr: <Sparkles className="w-4 h-4" />,
  charity: <Heart className="w-4 h-4" />,
  quran: <BookOpen className="w-4 h-4" />,
  other: <CloudSun className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  prayer: 'bg-[#E8F3E3] text-[#4A7C59] dark:bg-[#1a2e22] dark:text-[#8BBE88]',
  dhikr: 'bg-[#F2C4A7]/30 text-[#B87A4F] dark:bg-[#3a2a1a] dark:text-[#E8B08E]',
  charity: 'bg-[#E8D5E0] text-[#8B5E7B] dark:bg-[#2a1e28] dark:text-[#C49BB5]',
  quran: 'bg-[#D4E8CE] text-[#4A7C59] dark:bg-[#1a2e22] dark:text-[#8BBE88]',
  other: 'bg-[#F0E6D3] text-[#9B8355] dark:bg-[#2a2518] dark:text-[#C4B58A]',
};

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      const completed = habits.filter((h) => h.completed).length;
      setProgress(Math.round((completed / habits.length) * 100));
    }
  }, [habits]);

  const handleToggle = (id: string) => {
    const updated = toggleHabit(id);
    setHabits(updated);
  };

  const handleReset = () => {
    if (window.confirm('Reset all habits for today?')) {
      resetDailyHabits();
      setHabits(getHabits());
    }
  };

  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          Daily Habits
        </h1>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
          Small reminders that stack into real change
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 mb-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2]">
            Today&apos;s Progress
          </span>
          <span className="text-sm font-bold text-[#8BBE88]">
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#E8F3E3] dark:bg-[#2a4035] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8BBE88] to-[#6BAF69] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-[#6E8078] dark:text-[#8fa396] mt-2">
          {completedCount} of {habits.length} habits completed
        </p>
      </motion.div>

      {/* Habits List */}
      <div className="space-y-3">
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => handleToggle(habit.id)}
              className={`bg-white dark:bg-[#1e3028] rounded-[20px] p-4 shadow-[0_8px_24px_rgba(29,43,36,0.05)] border border-[#E8F3E3]/50 dark:border-[#2a4035] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all ${
                habit.completed ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-[#F2C4A7] border-[#F2C4A7]'
                      : 'border-[#C8D8C4] dark:border-[#3a5a45]'
                  }`}
                >
                  {habit.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-[#1D2B24]" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    categoryColors[habit.category]
                  }`}
                >
                  {categoryIcons[habit.category]}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      habit.completed
                        ? 'text-[#6E8078] dark:text-[#5a7a68] line-through'
                        : 'text-[#1D2B24] dark:text-[#F6F6F2]'
                    }`}
                  >
                    {habit.label}
                  </p>
                </div>

                {/* Category badge */}
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    categoryColors[habit.category]
                  }`}
                >
                  {habit.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleReset}
        className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-[#6E8078] dark:text-[#8fa396] hover:text-[#1D2B24] dark:hover:text-[#F6F6F2] transition-colors py-3"
      >
        <RotateCcw className="w-4 h-4" />
        Reset today&apos;s habits
      </motion.button>
    </div>
  );
}
