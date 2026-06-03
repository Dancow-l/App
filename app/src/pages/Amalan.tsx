import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Plus,
  Trash2,
  BookOpen,
  Sparkles,
  Shield,
  Heart,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  getAmalan,
  toggleAmalan,
  addCustomAmalan,
  deleteCustomAmalan,
  type AmalanItem,
} from '@/lib/storage';

const categoryIcons: Record<string, React.ReactNode> = {
  Daily: <Sparkles className="w-4 h-4" />,
  Quran: <BookOpen className="w-4 h-4" />,
  Protection: <Shield className="w-4 h-4" />,
  Dhikr: <Heart className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  Daily: 'bg-[#F2C4A7]/30 text-[#B87A4F] dark:bg-[#3a2a1a] dark:text-[#E8B08E]',
  Quran: 'bg-[#E8F3E3] text-[#4A7C59] dark:bg-[#1a2e22] dark:text-[#8BBE88]',
  Protection: 'bg-[#E8D5E0] text-[#8B5E7B] dark:bg-[#2a1e28] dark:text-[#C49BB5]',
  Dhikr: 'bg-[#D4E8CE] text-[#4A7C59] dark:bg-[#1a2e22] dark:text-[#8BBE88]',
};

export default function Amalan() {
  const [amalan, setAmalan] = useState<AmalanItem[]>(getAmalan());
  const [selectedAmalan, setSelectedAmalan] = useState<AmalanItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmalan, setNewAmalan] = useState({
    title: '',
    arabic: '',
    transliteration: '',
    translation: '',
    category: 'Daily',
  });

  const handleToggle = (id: string) => {
    const updated = toggleAmalan(id);
    setAmalan(updated);
    if (selectedAmalan?.id === id) {
      setSelectedAmalan(updated.find((a) => a.id === id) || null);
    }
  };

  const handleAdd = () => {
    if (!newAmalan.title.trim()) return;
    const updated = addCustomAmalan({
      title: newAmalan.title,
      arabic: newAmalan.arabic,
      transliteration: newAmalan.transliteration,
      translation: newAmalan.translation,
      category: newAmalan.category,
    });
    setAmalan(updated);
    setNewAmalan({ title: '', arabic: '', transliteration: '', translation: '', category: 'Daily' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this prayer?')) {
      const updated = deleteCustomAmalan(id);
      setAmalan(updated);
      if (selectedAmalan?.id === id) {
        setSelectedAmalan(null);
      }
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
            Deeds (Amalan)
          </h1>
          <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
            Daily prayers and remembrance
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-[#1D2B24] dark:bg-[#F6F6F2] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5 text-white dark:text-[#1D2B24]" />
        </button>
      </motion.div>

      {/* Amalan List */}
      <div className="space-y-3">
        <AnimatePresence>
          {amalan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white dark:bg-[#1e3028] rounded-[20px] p-4 shadow-[0_8px_24px_rgba(29,43,36,0.05)] border border-[#E8F3E3]/50 dark:border-[#2a4035]"
            >
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    item.completed
                      ? 'bg-[#F2C4A7] border-[#F2C4A7]'
                      : 'border-[#C8D8C4] dark:border-[#3a5a45]'
                  }`}
                >
                  {item.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-[#1D2B24]" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>

                {/* Category Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    categoryColors[item.category] || categoryColors.Daily
                  }`}
                >
                  {categoryIcons[item.category] || <Sparkles className="w-4 h-4" />}
                </div>

                {/* Title & Category */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      item.completed
                        ? 'text-[#6E8078] dark:text-[#5a7a68] line-through'
                        : 'text-[#1D2B24] dark:text-[#F6F6F2]'
                    }`}
                  >
                    {item.title}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${
                      categoryColors[item.category] || categoryColors.Daily
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedAmalan(item)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#E8F3E3] dark:hover:bg-[#2a4035] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#6E8078] dark:text-[#8fa396]" />
                  </button>
                  {item.isCustom && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAmalan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedAmalan(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1e3028] w-full max-w-lg rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-[#C8D8C4] dark:bg-[#4a6a55] rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[10px] px-3 py-1 rounded-full font-medium ${
                    categoryColors[selectedAmalan.category] || categoryColors.Daily
                  }`}
                >
                  {selectedAmalan.category}
                </span>
                <button
                  onClick={() => setSelectedAmalan(null)}
                  className="w-8 h-8 rounded-full bg-[#F6F6F2] dark:bg-[#2a4035] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#1D2B24] dark:text-[#F6F6F2]" />
                </button>
              </div>

              <h2 className="text-lg font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-4">
                {selectedAmalan.title}
              </h2>

              {selectedAmalan.arabic && (
                <div className="mb-4">
                  <p className="font-arabic text-2xl text-[#1D2B24] dark:text-[#F6F6F2] leading-relaxed text-right">
                    {selectedAmalan.arabic}
                  </p>
                </div>
              )}

              {selectedAmalan.transliteration && (
                <div className="mb-3 bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-4">
                  <p className="text-xs text-[#6E8078] dark:text-[#8fa396] mb-1">Transliteration</p>
                  <p className="text-sm text-[#1D2B24] dark:text-[#F6F6F2] italic">
                    {selectedAmalan.transliteration}
                  </p>
                </div>
              )}

              {selectedAmalan.translation && (
                <div className="mb-5 bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-4">
                  <p className="text-xs text-[#6E8078] dark:text-[#8fa396] mb-1">Translation</p>
                  <p className="text-sm text-[#1D2B24] dark:text-[#F6F6F2]">
                    {selectedAmalan.translation}
                  </p>
                </div>
              )}

              {/* Mark as done button */}
              <button
                onClick={() => handleToggle(selectedAmalan.id)}
                className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  selectedAmalan.completed
                    ? 'bg-[#E8F3E3] dark:bg-[#2a4035] text-[#4A7C59] dark:text-[#8BBE88]'
                    : 'bg-[#1D2B24] dark:bg-[#F6F6F2] text-white dark:text-[#1D2B24]'
                }`}
              >
                {selectedAmalan.completed ? 'Completed!' : 'Mark as done'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-[#1e3028] w-full max-w-lg rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-[#C8D8C4] dark:bg-[#4a6a55] rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
                  Add Custom Prayer
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-8 h-8 rounded-full bg-[#F6F6F2] dark:bg-[#2a4035] flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#1D2B24] dark:text-[#F6F6F2]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2] mb-1 block">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newAmalan.title}
                    onChange={(e) => setNewAmalan({ ...newAmalan, title: e.target.value })}
                    placeholder="e.g., Morning Dua"
                    className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2] mb-1 block">
                    Arabic Text (optional)
                  </label>
                  <textarea
                    value={newAmalan.arabic}
                    onChange={(e) => setNewAmalan({ ...newAmalan, arabic: e.target.value })}
                    placeholder="Write in Arabic..."
                    className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] font-arabic text-right resize-none focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2] mb-1 block">
                    Transliteration (optional)
                  </label>
                  <input
                    type="text"
                    value={newAmalan.transliteration}
                    onChange={(e) => setNewAmalan({ ...newAmalan, transliteration: e.target.value })}
                    placeholder="e.g., Bismillahirrahmanirrahim"
                    className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2] mb-1 block">
                    Translation (optional)
                  </label>
                  <textarea
                    value={newAmalan.translation}
                    onChange={(e) => setNewAmalan({ ...newAmalan, translation: e.target.value })}
                    placeholder="Write the meaning..."
                    className="w-full bg-[#F6F6F2] dark:bg-[#162618] rounded-2xl p-3.5 text-sm text-[#1D2B24] dark:text-[#F6F6F2] placeholder:text-[#A8B8A0] dark:placeholder:text-[#4a6a55] resize-none focus:outline-none focus:ring-2 focus:ring-[#8BBE88] transition-all"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#1D2B24] dark:text-[#F6F6F2] mb-1 block">
                    Category
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(categoryIcons).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewAmalan({ ...newAmalan, category: cat })}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          newAmalan.category === cat
                            ? categoryColors[cat]
                            : 'bg-[#F6F6F2] dark:bg-[#162618] text-[#6E8078] dark:text-[#8fa396]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!newAmalan.title.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#1D2B24] dark:bg-[#F6F6F2] text-white dark:text-[#1D2B24] py-3.5 rounded-2xl text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Prayer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
