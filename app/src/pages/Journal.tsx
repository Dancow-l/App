import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Save,
  BookHeart,
  Lightbulb,
  Target,
  Check,
} from 'lucide-react';
import {
  getJournalEntries,
  getJournalEntry,
  saveJournalEntry,
  getStreak,
  type JournalEntry,
} from '@/lib/storage';

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[month];
}

function getDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Journal() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [streak, setStreak] = useState(getStreak());
  const [saved, setSaved] = useState(false);

  const [grateful, setGrateful] = useState('');
  const [learned, setLearned] = useState('');
  const [tomorrow, setTomorrow] = useState('');

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  useEffect(() => {
    const entry = getJournalEntry(selectedDate);
    if (entry) {
      setGrateful(entry.grateful);
      setLearned(entry.learned);
      setTomorrow(entry.tomorrow);
    } else {
      setGrateful('');
      setLearned('');
      setTomorrow('');
    }
    setSaved(false);
  }, [selectedDate]);

  const handleSave = () => {
    saveJournalEntry({
      date: selectedDate,
      grateful,
      learned,
      tomorrow,
    });
    setEntries(getJournalEntries());
    setStreak(getStreak());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const hasEntry = (day: number): boolean => {
    const key = getDateKey(currentYear, currentMonth, day);
    return entries.some((e) => e.date === key);
  };

  const isToday = (day: number): boolean => {
    const key = getDateKey(currentYear, currentMonth, day);
    return key === today.toISOString().split('T')[0];
  };

  const isSelected = (day: number): boolean => {
    const key = getDateKey(currentYear, currentMonth, day);
    return key === selectedDate;
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          Journal
        </h1>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#F2C4A7]" />
          <span className="text-sm text-[#6E8078] dark:text-[#8fa396]">
            Streak: {streak.current} days
          </span>
        </div>
      </motion.div>

      {/* Calendar Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1e3028] rounded-[28px] p-5 mb-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-[#E8F3E3] dark:bg-[#2a4035] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-4 h-4 text-[#1D2B24] dark:text-[#F6F6F2]" />
          </button>
          <h2 className="text-base font-semibold text-[#1D2B24] dark:text-[#F6F6F2]">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-[#E8F3E3] dark:bg-[#2a4035] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-4 h-4 text-[#1D2B24] dark:text-[#F6F6F2]" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-[#6E8078] dark:text-[#8fa396] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Previous month days */}
          {Array.from({ length: firstDay }, (_, i) => {
            const day = daysInPrevMonth - firstDay + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="aspect-square flex items-center justify-center text-xs text-[#C8D8C4] dark:text-[#3a5a45] rounded-full"
              >
                {day}
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const hasEntryFlag = hasEntry(day);
            const isTodayFlag = isToday(day);
            const isSelectedFlag = isSelected(day);

            return (
              <motion.button
                key={day}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const key = getDateKey(currentYear, currentMonth, day);
                  setSelectedDate(key);
                }}
                className={`aspect-square flex items-center justify-center text-xs font-medium rounded-full relative transition-all ${
                  isSelectedFlag
                    ? 'bg-[#F2C4A7] text-[#1D2B24]'
                    : isTodayFlag
                    ? 'bg-[#E8F3E3] text-[#4A7C59] dark:bg-[#2a4035] dark:text-[#8BBE88]'
                    : 'text-[#1D2B24] dark:text-[#F6F6F2] hover:bg-[#F0F0EC] dark:hover:bg-[#2a4035]'
                }`}
              >
                {day}
                {hasEntryFlag && !isSelectedFlag && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8BBE88]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Journal Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#1e3028] rounded-[28px] p-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1D2B24] dark:text-[#F6F6F2]">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </h2>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-xs text-[#4A7C59] dark:text-[#8BBE88] font-medium"
              >
                <Check className="w-3 h-3" />
                Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grateful Field */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookHeart className="w-4 h-4 text-[#F2C4A7]" />
            <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
              Today I&apos;m grateful for...
            </label>
          </div>
          <textarea
            value={grateful}
            onChange={(e) => setGrateful(e.target.value)}
            placeholder="Write something you're grateful for..."
            className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] resize-none focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
            rows={2}
          />
        </div>

        {/* Learned Field */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[#8BBE88]" />
            <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
              What I learned today...
            </label>
          </div>
          <textarea
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            placeholder="A lesson or insight from today..."
            className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] resize-none focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
            rows={2}
          />
        </div>

        {/* Tomorrow Field */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#9B8355]" />
            <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2]">
              Tomorrow I want to...
            </label>
          </div>
          <textarea
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder="An intention for tomorrow..."
            className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] resize-none focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
            rows={2}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-[#1D2B24] dark:bg-[#F6F6F2] text-white dark:text-[#1D2B24] py-3.5 rounded-2xl text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          Save Entry
        </button>
      </motion.div>
    </div>
  );
}
