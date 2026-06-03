import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  User,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { getTheme, setTheme, type Theme, getUserName, setUserName } from '@/lib/storage';

export default function Settings() {
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const [name, setName] = useState(getUserName());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  const handleNameChange = () => {
    const newName = prompt('Enter your name:', name);
    if (newName && newName.trim()) {
      const trimmed = newName.trim();
      setUserName(trimmed);
      setName(trimmed);
    }
  };

  const handleResetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          Settings
        </h1>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
          Customize your experience
        </p>
      </motion.div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
        >
          <h2 className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2] mb-3 uppercase tracking-wide">
            Profile
          </h2>
          <button
            onClick={handleNameChange}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F6F6F2] dark:hover:bg-[#162618] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#E8F3E3] dark:bg-[#2a4035] flex items-center justify-center">
              <User className="w-5 h-5 text-[#4A7C59] dark:text-[#8BBE88]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
                Display Name
              </p>
              <p className="text-xs text-[#6E8078] dark:text-[#8fa396]">{name}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6E8078] dark:text-[#8fa396]" />
          </button>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
        >
          <h2 className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2] mb-3 uppercase tracking-wide">
            Appearance
          </h2>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F6F6F2] dark:hover:bg-[#162618] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#F2C4A7]/30 dark:bg-[#3a2a1a] flex items-center justify-center">
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-[#B87A4F]" />
              ) : (
                <Moon className="w-5 h-5 text-[#E8B08E]" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
                Theme
              </p>
              <p className="text-xs text-[#6E8078] dark:text-[#8fa396]">
                {theme === 'light' ? 'Light mode' : 'Dark mode'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6E8078] dark:text-[#8fa396]" />
          </button>
        </motion.div>

        {/* Data */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
        >
          <h2 className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2] mb-3 uppercase tracking-wide">
            Data
          </h2>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-red-500">Reset All Data</p>
              <p className="text-xs text-[#6E8078] dark:text-[#8fa396]">
                Clear all habits, journal, and settings
              </p>
            </div>
          </button>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-[#1e3028] rounded-[24px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
        >
          <h2 className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2] mb-3 uppercase tracking-wide">
            About
          </h2>
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F3E3] dark:bg-[#2a4035] flex items-center justify-center">
              <Info className="w-5 h-5 text-[#4A7C59] dark:text-[#8BBE88]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
                Jurnals
              </p>
              <p className="text-xs text-[#6E8078] dark:text-[#8fa396]">
                Version 1.0 &middot; Your daily companion
              </p>
            </div>
          </div>
          <p className="text-xs text-[#6E8078] dark:text-[#8fa396] px-3 mt-1 leading-relaxed">
            Jurnals is a simple, peaceful app to help you track daily habits, write reflections,
            find Qibla direction, and collect prayers. All data is stored locally on your device.
          </p>
        </motion.div>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-5"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#1e3028] rounded-[28px] p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
                Reset All Data?
              </h3>
            </div>
            <p className="text-sm text-[#6E8078] dark:text-[#8fa396] mb-6">
              This will permanently delete all your habits, journal entries, prayers, and settings.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-medium text-[#6E8078] dark:text-[#8fa396] bg-[#F6F6F2] dark:bg-[#162618] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 py-3 rounded-2xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Reset All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
