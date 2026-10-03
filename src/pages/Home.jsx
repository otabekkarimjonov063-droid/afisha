import { useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Ticket, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store';
import { cn } from '@/utils/cn';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { t, i18n } = useTranslation();
  const { products } = useStore();
  const featured = products.filter(p => p.featured).slice(0, 8);

  const heroRef = useRef(null);
  const textRef = useRef(null);
  const postersRef = useRef(null);

  // GSAP animations for Hero
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Magnetic button effect could be here or done with framer motion
      
      // Horizontal scroll for posters showcase
      const posters = gsap.utils.toArray('.showcase-poster');
      
      if (postersRef.current && posters.length > 0) {
        gsap.to(posters, {
          xPercent: -100 * (posters.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: postersRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + postersRef.current.offsetWidth * 2
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('nav.home')} | Afisha</title>
      </Helmet>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[95vh] flex items-center bg-mesh bg-grain overflow-hidden pt-20">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div ref={textRef} className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[1.1] mb-6">
                <span className="block">{String(t('hero.title')).split(' ').slice(0, 2).join(' ')}</span>
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-coral-500 mr-4">
                  {String(t('hero.title')).split(' ').slice(2).join(' ')}
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/catalog">
                <Button size="lg" className="rounded-full px-8 flex items-center gap-2 group">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg" className="rounded-full">
                  {t('nav.about')}
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img 
                    key={i} 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" 
                  />
                ))}
              </div>
              <p>{t('home.socialProof')}</p>
            </motion.div>
          </div>

          {/* Floating Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: -10 }}
            transition={{ duration: 1, delay: 0.4, type: 'spring', bounce: 0.4 }}
            className="flex-1 hidden md:block relative perspective-1000"
          >
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotateX: [0, 5, 0],
                rotateY: [-10, -5, -10]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 dark:border-slate-800/50 backdrop-blur-sm max-w-md ml-auto"
            >
              <img 
                src="https://picsum.photos/seed/hero/800/1200" 
                alt="Hero Poster"
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 to-transparent mix-blend-overlay"></div>
            </motion.div>
            
            {/* Background blur blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-500/20 dark:bg-violet-600/30 blur-[100px] rounded-full z-0 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-coral-500/20 dark:bg-coral-600/30 blur-[80px] rounded-full z-0 pointer-events-none"></div>
          </motion.div>

        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-24 bg-white dark:bg-slate-900 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-4">
                {String(t('home.featured.title')).split(' ').slice(0, 1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-coral-500">{String(t('home.featured.title')).split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl">{t('home.featured.subtitle')}</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 font-medium text-violet-600 hover:text-violet-700 transition-colors">
              {t('home.featured.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/catalog">
              <Button variant="outline" className="w-full rounded-xl">{t('home.featured.viewAllMobile')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* GSAP Horizontal Scroll Showcase */}
      <section ref={postersRef} className="bg-slate-950 py-24 overflow-hidden relative">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight">
            {String(t('home.upcoming.title')).split(' ').slice(0, 1).join(' ')} <span className="text-lime-400">{String(t('home.upcoming.title')).split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>
        
        <div className="flex gap-8 px-4 w-[400vw] md:w-[200vw] lg:w-[150vw]">
          {products.slice(0, 5).map((p, i) => (
            <div key={p.id} className="showcase-poster w-[80vw] md:w-[40vw] lg:w-[25vw] shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative group cursor-pointer">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="text-lime-400 font-bold mb-2">{p.eventDate}</div>
                  <h3 className="text-3xl font-bold text-white font-display leading-tight">{p.title?.[i18n.language] || p.title?.uz || ''}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center rounded-2xl mb-4">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black font-display mb-2">5K+</div>
              <div className="text-slate-500 font-medium">{t('home.stats.sold')}</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400 flex items-center justify-center rounded-2xl mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black font-display mb-2">10K+</div>
              <div className="text-slate-500 font-medium">{t('home.stats.customers')}</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 flex items-center justify-center rounded-2xl mb-4">
                <Star className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black font-display mb-2">4.9</div>
              <div className="text-slate-500 font-medium">{t('home.stats.rating')}</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-2xl mb-4">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div className="text-4xl font-black font-display mb-2">500+</div>
              <div className="text-slate-500 font-medium">{t('home.stats.events')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-white/10 to-transparent translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black font-display text-white tracking-tight mb-6">
            {t('home.newsletter.title')}
          </h2>
          <p className="text-violet-200 text-lg max-w-xl mb-10">
            {t('home.newsletter.subtitle')}
          </p>
          
          <form className="w-full max-w-md flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder={t('home.newsletter.placeholder')} 
              className="flex-1 px-6 py-4 rounded-xl border-none focus:outline-none focus:ring-4 focus:ring-white/20 text-slate-900"
              required
            />
            <Button variant="primary" className="bg-slate-900 text-white hover:bg-slate-800 shadow-none">
              {t('home.newsletter.button')}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
