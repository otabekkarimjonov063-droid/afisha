import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, ShoppingBag, Heart, Menu, X, User, ChevronDown } from 'lucide-react';
import { useStore } from '@/store';
import { cn } from '@/utils/cn';

function LanguageSwitcher({ i18n }) {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="relative hidden sm:block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold"
      >
        {i18n.language.toUpperCase()}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 w-28 z-[60]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  i18n.language === lang.code 
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                )}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, cart, favorites, user } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { to: '/', label: 'nav.home' },
    { to: '/catalog', label: 'nav.catalog' },
    { to: '/about', label: 'nav.about' },
    { to: '/contact', label: 'nav.contact' },
    { to: '/faq', label: 'nav.faq' },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' }
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="w-full bg-gradient-to-r from-violet-600 via-coral-500 to-lime-500 overflow-hidden py-2.5">
        <div className="w-[200%] flex animate-marquee whitespace-nowrap text-white text-xs md:text-sm font-bold tracking-widest uppercase">
          <span className="flex-1 text-center">🔥 Super Chegirmalar: Tanlangan afishalarga 50% gacha chegirma 🔥</span>
          <span className="flex-1 text-center">🚀 500,000 UZS dan oshgan xaridlar uchun yetkazib berish bepul 🚀</span>
          <span className="flex-1 text-center">🌟 Har hafta yangi kolleksiyalar 🌟</span>
          <span className="flex-1 text-center">🔥 Super Chegirmalar: Tanlangan afishalarga 50% gacha chegirma 🔥</span>
          <span className="flex-1 text-center">🚀 500,000 UZS dan oshgan xaridlar uchun yetkazib berish bepul 🚀</span>
          <span className="flex-1 text-center">🌟 Har hafta yangi kolleksiyalar 🌟</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-display tracking-tighter text-violet-600 dark:text-violet-400">
          AFISHA<span className="text-coral-500">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                'text-sm font-medium transition-colors relative py-1',
                isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  {t(link.label)}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400 transition-transform duration-300 origin-left", 
                    isActive ? "scale-x-100" : "scale-x-0"
                  )} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher i18n={i18n} />

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <Link to="/favorites" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-coral-500 text-white text-[10px] flex items-center justify-center rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white text-[10px] flex items-center justify-center rounded-full">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </Link>

          <Link to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'} className="hidden md:flex p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <User className="w-5 h-5" />
          </Link>

          <button 
            className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-white dark:bg-slate-900 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xl font-bold font-display tracking-tighter text-violet-600 dark:text-violet-400">
                AFISHA.
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col p-4 gap-4 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'text-lg font-medium p-3 rounded-xl transition-colors',
                    isActive ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  {t(link.label)}
                </NavLink>
              ))}
              
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
              
              <Link 
                to={user ? (user.role === 'admin' ? '/admin' : '/profile') : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                {user ? t('nav.profile') : t('nav.login')}
              </Link>
              
              <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full max-w-[200px]">
                  {['uz', 'ru', 'en'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => i18n.changeLanguage(lang)}
                      className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg uppercase transition-all",
                        i18n.language === lang 
                          ? "bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400" 
                          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
