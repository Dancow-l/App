/**
 * Local Storage Utilities for Jurnals App
 * All data is stored in the browser's localStorage
 */

const STORAGE_KEYS = {
  HABITS: 'jurnals_habits',
  JOURNAL_ENTRIES: 'jurnals_journal_entries',
  TASBIH_COUNT: 'jurnals_tasbih_count',
  TASBIH_PRESET: 'jurnals_tasbih_preset',
  THEME: 'jurnals_theme',
  USER_NAME: 'jurnals_user_name',
  AMALAN: 'jurnals_amalan',
  STREAK: 'jurnals_streak',
  LAST_VISIT: 'jurnals_last_visit',
} as const;

// Generic helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// HABITS
export interface Habit {
  id: string;
  label: string;
  completed: boolean;
  category: 'prayer' | 'dhikr' | 'charity' | 'quran' | 'other';
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'fajr', label: 'Dawn prayer (Fajr)', completed: false, category: 'prayer' },
  { id: 'dhuhur', label: 'Noon prayer (Dhuhr)', completed: false, category: 'prayer' },
  { id: 'asr', label: 'Afternoon prayer (Asr)', completed: false, category: 'prayer' },
  { id: 'maghrib', label: 'Sunset prayer (Maghrib)', completed: false, category: 'prayer' },
  { id: 'isya', label: 'Night prayer (Isya)', completed: false, category: 'prayer' },
  { id: 'morning_dhikr', label: 'Morning dhikr', completed: false, category: 'dhikr' },
  { id: 'evening_dhikr', label: 'Evening dhikr', completed: false, category: 'dhikr' },
  { id: 'sadaqah', label: 'Charity (Sadaqah)', completed: false, category: 'charity' },
  { id: 'quran', label: 'Read Quran', completed: false, category: 'quran' },
  { id: 'sedekah', label: 'Give thanks (Alhamdulillah)', completed: false, category: 'other' },
];

export function getHabits(): Habit[] {
  return getItem<Habit[]>(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
}

export function toggleHabit(id: string): Habit[] {
  const habits = getHabits();
  const updated = habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h));
  setItem(STORAGE_KEYS.HABITS, updated);
  updateStreak();
  return updated;
}

export function resetDailyHabits(): void {
  const habits = getHabits();
  const reset = habits.map((h) => ({ ...h, completed: false }));
  setItem(STORAGE_KEYS.HABITS, reset);
}

// JOURNAL ENTRIES
export interface JournalEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  grateful: string;
  learned: string;
  tomorrow: string;
}

export function getJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES, []);
}

export function getJournalEntry(date: string): JournalEntry | undefined {
  const entries = getJournalEntries();
  return entries.find((e) => e.date === date);
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id'>): JournalEntry[] {
  const entries = getJournalEntries();
  const existingIndex = entries.findIndex((e) => e.date === entry.date);
  const newEntry: JournalEntry = {
    ...entry,
    id: existingIndex >= 0 ? entries[existingIndex].id : `entry_${Date.now()}`,
  };
  if (existingIndex >= 0) {
    entries[existingIndex] = newEntry;
  } else {
    entries.push(newEntry);
  }
  setItem(STORAGE_KEYS.JOURNAL_ENTRIES, entries);
  updateStreak();
  return entries;
}

// TASBIH
export function getTasbihCount(): number {
  return getItem<number>(STORAGE_KEYS.TASBIH_COUNT, 0);
}

export function setTasbihCount(count: number): void {
  setItem(STORAGE_KEYS.TASBIH_COUNT, count);
}

export function getTasbihPreset(): number {
  return getItem<number>(STORAGE_KEYS.TASBIH_PRESET, 33);
}

export function setTasbihPreset(preset: number): void {
  setItem(STORAGE_KEYS.TASBIH_PRESET, preset);
}

// THEME
export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  return getItem<Theme>(STORAGE_KEYS.THEME, 'light');
}

export function setTheme(theme: Theme): void {
  setItem(STORAGE_KEYS.THEME, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// USER NAME
export function getUserName(): string {
  return getItem<string>(STORAGE_KEYS.USER_NAME, 'Friend');
}

export function setUserName(name: string): void {
  setItem(STORAGE_KEYS.USER_NAME, name);
}

// AMALAN (Prayers/Deeds)
export interface AmalanItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  completed?: boolean;
  isCustom?: boolean;
}

const DEFAULT_AMALAN: AmalanItem[] = [
  {
    id: 'bismillah',
    title: 'Say Bismillah',
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    transliteration: 'Bismillahirrahmanirrahim',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    category: 'Daily',
    completed: false,
  },
  {
    id: 'alfatihah',
    title: 'Recite Surah Al-Fatihah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ',
    transliteration: 'Alhamdulillahi rabbil alamin',
    translation: 'Praise be to Allah, Lord of the Worlds.',
    category: 'Quran',
    completed: false,
  },
  {
    id: 'ayat_kursi',
    title: 'Read Ayat Al-Kursi',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Allahu la ilaha illa huwal hayyul qayyum',
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer.',
    category: 'Protection',
    completed: false,
  },
  {
    id: 'tasbih',
    title: 'Tasbih (Subhanallah)',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah.',
    category: 'Dhikr',
    completed: false,
  },
  {
    id: 'tahmid',
    title: 'Tahmid (Alhamdulillah)',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah.',
    category: 'Dhikr',
    completed: false,
  },
  {
    id: 'takbir',
    title: 'Takbir (Allahu Akbar)',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest.',
    category: 'Dhikr',
    completed: false,
  },
];

export function getAmalan(): AmalanItem[] {
  return getItem<AmalanItem[]>(STORAGE_KEYS.AMALAN, DEFAULT_AMALAN);
}

export function toggleAmalan(id: string): AmalanItem[] {
  const amalan = getAmalan();
  const updated = amalan.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a));
  setItem(STORAGE_KEYS.AMALAN, updated);
  return updated;
}

export function addCustomAmalan(item: Omit<AmalanItem, 'id' | 'isCustom'>): AmalanItem[] {
  const amalan = getAmalan();
  const newItem: AmalanItem = {
    ...item,
    id: `custom_${Date.now()}`,
    isCustom: true,
    completed: false,
  };
  amalan.push(newItem);
  setItem(STORAGE_KEYS.AMALAN, amalan);
  return amalan;
}

export function deleteCustomAmalan(id: string): AmalanItem[] {
  const amalan = getAmalan();
  const updated = amalan.filter((a) => a.id !== id);
  setItem(STORAGE_KEYS.AMALAN, updated);
  return updated;
}

// STREAK
export interface StreakData {
  current: number;
  longest: number;
  lastDate: string;
  history: string[]; // array of dates with activity
}

export function getStreak(): StreakData {
  return getItem<StreakData>(STORAGE_KEYS.STREAK, {
    current: 0,
    longest: 0,
    lastDate: '',
    history: [],
  });
}

function updateStreak(): void {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreak();
  
  if (streak.lastDate === today) return;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastDate === yesterdayStr) {
    streak.current += 1;
  } else {
    streak.current = 1;
  }
  
  streak.lastDate = today;
  if (streak.current > streak.longest) {
    streak.longest = streak.current;
  }
  if (!streak.history.includes(today)) {
    streak.history.push(today);
  }
  
  setItem(STORAGE_KEYS.STREAK, streak);
}

export function checkAndResetDaily(): void {
  const today = new Date().toISOString().split('T')[0];
  const lastVisit = getItem<string>(STORAGE_KEYS.LAST_VISIT, '');
  
  if (lastVisit !== today) {
    // New day - reset habits
    resetDailyHabits();
    setItem(STORAGE_KEYS.LAST_VISIT, today);
  }
}

// PROGRESS
export function getTodayProgress(): number {
  const habits = getHabits();
  if (habits.length === 0) return 0;
  const completed = habits.filter((h) => h.completed).length;
  return Math.round((completed / habits.length) * 100);
}

// INITIALIZATION
export function initializeApp(): void {
  // Set theme
  const theme = getTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  // Check for new day
  checkAndResetDaily();
}
