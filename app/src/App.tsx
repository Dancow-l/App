import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav, { type Page } from '@/components/BottomNav';
import Home from '@/pages/Home';
import Habits from '@/pages/Habits';
import Journal from '@/pages/Journal';
import Compass from '@/pages/Compass';
import Amalan from '@/pages/Amalan';
import Tasbih from '@/pages/Tasbih';
import Settings from '@/pages/Settings';
import { initializeApp } from '@/lib/storage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeApp();
    setIsReady(true);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'habits':
        return <Habits />;
      case 'journal':
        return <Journal />;
      case 'compass':
        return <Compass />;
      case 'amalan':
        return <Amalan />;
      case 'tasbih':
        return <Tasbih />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F6F2] dark:bg-[#1D2B24]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#E8F3E3] to-[#F2C4A7] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#1D2B24]">J</span>
          </div>
          <h1 className="text-xl font-bold text-[#1D2B24] dark:text-[#F6F6F2]">Jurnals</h1>
          <p className="text-sm text-[#6E8078] dark:text-[#8fa396] mt-1">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2] dark:bg-[#1D2B24] transition-colors duration-300">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#E8F3E3] to-[#F2C4A7] flex items-center justify-center">
            <span className="text-sm font-bold text-[#1D2B24]">J</span>
          </div>
          <span className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2]">
            Jurnals
          </span>
        </div>
        <button
          onClick={() => setCurrentPage('settings')}
          className="w-9 h-9 rounded-full bg-white/80 dark:bg-[#1e3028]/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6E8078] dark:text-[#8fa396]"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <main className="pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav current={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
