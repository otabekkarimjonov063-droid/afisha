import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

const CATEGORIES = ['all', 'concerts', 'theatre', 'sports', 'exhibitions', 'conferences'];
const SORTS = ['newest', 'price-asc', 'price-desc'];

export default function Catalog() {
  const { t, i18n } = useTranslation();
  const { products } = useStore();
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category !== 'all') params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    setSearchParams(params);
  }, [debouncedSearch, category, sort, setSearchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(p => {
        const title = p.title?.[lang] || p.title?.uz || '';
        const desc = p.description?.[lang] || p.description?.uz || '';
        return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      });
    }

    // Category
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      // newest (assuming id is sort of chronological for seed data)
      return parseInt(b.id) - parseInt(a.id);
    });

    return result;
  }, [products, debouncedSearch, category, sort, priceRange, lang]);

  return (
    <>
      <Helmet>
        <title>{t('nav.catalog')} | Afisha</title>
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-soft p-6 md:p-8 space-y-8 sticky top-24">
              <h3 className="font-display font-bold text-xl mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                Filters
              </h3>
              
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-3 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow text-sm font-medium placeholder-slate-400" 
                      placeholder={t('common.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-3 uppercase tracking-wider">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-bold transition-all capitalize",
                          category === cat 
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105" 
                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-3 uppercase tracking-wider">Sort By</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full pl-4 pr-4 py-3 rounded-xl border-none bg-slate-50 dark:bg-slate-900 text-sm font-bold text-left focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span>{sort === 'newest' ? 'Newest First' : sort === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isSortOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          key="sort-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                        >
                          <div className="flex flex-col p-1">
                            {[
                              { value: 'newest', label: 'Newest First' },
                              { value: 'price-asc', label: 'Price: Low to High' },
                              { value: 'price-desc', label: 'Price: High to Low' }
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => { setSort(option.value); setIsSortOpen(false); }}
                                className={cn(
                                  "px-4 py-2.5 text-sm font-medium text-left rounded-lg transition-colors",
                                  sort === option.value 
                                    ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" 
                                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300"
                                )}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter mb-2">
                  {t('nav.catalog')}
                </h1>
                <p className="text-slate-500">Showing {filteredProducts.length} results</p>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
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
              <div className="py-20 text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{t('common.noResults')}</h3>
                <button 
                  onClick={() => { setSearchTerm(''); setCategory('all'); }}
                  className="text-violet-600 hover:underline font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}
