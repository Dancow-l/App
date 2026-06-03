import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  BookOpen,
  Flame,
  TrendingUp,
  Sunrise,
  CloudSun,
  Moon,
  Stars,
} from 'lucide-react';
import { getUserName, setUserName, getTodayProgress, getStreak, getHabits } from '@/lib/storage';
import { getDailyQuote } from '@/data/quotes';

function getGreeting(): { text: string; icon: React.ReactNode } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: <Sunrise className="w-5 h-5" /> };
  if (hour < 15) return { text: 'Good afternoon', icon: <CloudSun className="w-5 h-5" /> };
  if (hour < 18) return { text: 'Good evening', icon: <Sun className="w-5 h-5" /> };
  if (hour < 21) return { text: 'Good evening', icon: <Moon className="w-5 h-5" /> };
  return { text: 'Good night', icon: <Stars className="w-5 h-5" /> };
}

function getPrayerTime(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Fajr is coming soon';
  if (hour < 12) return 'Dhuhr is at noon';
  if (hour < 15) return 'Asr is in the afternoon';
  if (hour < 18) return 'Maghrib is at sunset';
  return 'Isya is at night';
}

export default function Home() {
  const [name, setName] = useState(getUserName());
  const [progress, setProgress] = useState(getTodayProgress());
  const [streak, setStreak] = useState(getStreak());
  const [quote] = useState(getDailyQuote());
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setProgress(getTodayProgress());
      setStreak(getStreak());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedName = getUserName();
    setName(storedName);
  }, []);

  const habits = getHabits();
  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  const handleUpdateName = () => {
    const newName = prompt('Enter your name:', name);
    if (newName && newName.trim()) {
      setUserName(newName.trim());
      setName(newName.trim());
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gradient-to-br from-[#E8F3E3] to-[#D4E8CE] dark:from-[#1a2e22] dark:to-[#162618] rounded-[28px] p-6 mb-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#6E8078] dark:text-[#8fa396]">{greeting.icon}</span>
          <span className="text-sm text-[#6E8078] dark:text-[#8fa396] font-medium">
            {greeting.text}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          {name}
        </h1>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396] mb-4">
          {getPrayerTime()}
        </p>
        <button
          onClick={handleUpdateName}
          className="inline-flex items-center gap-2 bg-[#1D2B24] dark:bg-[#F6F6F2] text-white dark:text-[#1D2B24] px-4 py-2.5 rounded-full text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <Sun className="w-4 h-4" />
          Update prayers today
        </button>
      </motion.div>

      {/* Today's Quote Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="bg-white dark:bg-[#1e3028] rounded-[28px] p-6 mb-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-[#6E8078] dark:text-[#8fa396]" />
          <span className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2]">
            Today&apos;s quote
          </span>
        </div>
        <p className="text-lg font-medium text-[#1D2B24] dark:text-[#F6F6F2] italic leading-relaxed mb-2">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
          — {quote.source}
        </p>
      </motion.div>

      {/* Progress & Streak Row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#6E8078] dark:text-[#8fa396]" />
            <span className="text-xs font-semibold text-[#6E8078] dark:text-[#8fa396] uppercase tracking-wide">
              Progress
            </span>
          </div>
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#E8F3E3"
                strokeWidth="8"
                className="dark:stroke-[#2a4035]"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#8BBE88"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
              {progress}%
            </span>
          </div>
          <p className="text-xs text-center text-[#6E8078] dark:text-[#8fa396]">
            {completedCount}/{totalCount} habits
          </p>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="bg-gradient-to-br from-[#F2C4A7] to-[#E8B08E] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-[#1D2B24]" />
            <span className="text-xs font-semibold text-[#1D2B24] uppercase tracking-wide">
              Streak
            </span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-[#1D2B24]">
              {streak.current}
            </span>
            <p className="text-xs text-[#1D2B24]/70 mt-1">
              {streak.current === 1 ? 'day' : 'days'}
            </p>
          </div>
          {streak.longest > 0 && (
            <p className="text-xs text-center text-[#1D2B24]/60 mt-2">
              Best: {streak.longest} days
            </p>
          )}
        </motion.div>
      </div>

      {/* Decorative Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-[#8BBE88] pointer-events-none"
      />
    </div>
  );
}
