import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/ProductCard';

export default function Favorites() {
  const { t } = useTranslation();
  const { products, favorites } = useStore();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <>
      <Helmet><title>{t('nav.favorites')} | Afisha</title></Helmet>
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-10">
          Your <span className="text-coral-500">Favorites</span>
        </h1>

        {favoriteProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {favoriteProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-3xl font-black font-display mb-4">No favorites yet</h2>
            <p className="text-slate-500 mb-8 max-w-md">Save the posters you love and find them here later.</p>
            <Link to="/catalog">
              <Button size="lg">Explore Collection</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
