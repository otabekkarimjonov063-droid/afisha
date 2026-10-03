import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { cn } from '@/utils/cn';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { user, toggleFavorite, favorites, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isFavorite = favorites.includes(product.id);
  const lang = i18n.language;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { register: true } });
      return;
    }
    
    addToCart({ ...product, size: 'A3', qty: 1 });
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      className={cn(
        "group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-soft hover:shadow-2xl cursor-pointer h-full flex flex-col transition-shadow",
        product.oldPrice 
          ? "border-0 shadow-coral-500/20 hover:shadow-coral-500/40" 
          : "border border-slate-100 dark:border-slate-700 hover:shadow-violet-500/10 dark:hover:shadow-violet-900/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      {/* Animated Gradient Border for Discounted Items */}
      {product.oldPrice && (
        <div className="absolute -inset-[150%] z-0 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_200deg,theme(colors.coral.500)_360deg)] opacity-100" />
      )}
      {product.oldPrice && (
        <div className="absolute -inset-[150%] z-0 animate-[spin_3s_linear_infinite_reverse] bg-[conic-gradient(from_0deg,transparent_0_200deg,theme(colors.violet.500)_360deg)] opacity-100" />
      )}

      {/* Inner Card Content */}
      <div className={cn(
        "relative z-10 flex flex-col h-full bg-white dark:bg-slate-800",
        product.oldPrice ? "m-[4px] rounded-[20px] overflow-hidden" : ""
      )}>
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
          <motion.img
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            src={product.image}
            alt={product.title?.[lang] || product.title?.uz || ''}
            className="w-full h-full object-cover"
          />
          
          {/* Shine Sweep Effect */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%', opacity: 0 }}
            animate={isHovered ? { x: '100%', opacity: 1 } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {product.oldPrice && (
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-coral-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-coral-500/50"
              >
                SALE
              </motion.span>
            )}
            {product.featured && (
              <span className="bg-lime-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-lime-400/30">
                HOT
              </span>
            )}
          </div>

          <button 
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:scale-110 transition-transform"
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn("w-5 h-5", isFavorite ? "fill-coral-500 text-coral-500" : "text-slate-600 dark:text-slate-300")} />
            </motion.div>
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex justify-center">
            <button 
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-violet-500 transition-colors shadow-glow"
            >
              <ShoppingBag className="w-4 h-4" />
              {t('common.addToCart')}
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider">
            {product.category}
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2">
            {product.title?.[lang] || product.title?.uz || ''}
          </h3>
          
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {product.oldPrice && (
                <div className="text-sm text-slate-400 dark:text-slate-500 line-through decoration-coral-500/50 mb-0.5">
                  {product.oldPrice.toLocaleString()} UZS
                </div>
              )}
              <div className={cn("text-xl font-black", product.oldPrice ? "text-coral-500" : "text-violet-600 dark:text-violet-400")}>
                {product.price.toLocaleString()} UZS
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
