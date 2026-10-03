import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet><title>{t('nav.faq')} | Afisha</title></Helmet>
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl min-h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-10 text-center">
          {String(t('faq.title1'))} <span className="text-violet-600">{String(t('faq.title2'))}</span>
        </h1>

        <div className="space-y-4">
          {(t('faq.items', { returnObjects: true }) || []).map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden"
            >
              <button 
                className="w-full flex items-center justify-between p-6 text-left font-bold text-lg focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180 text-violet-600' : 'text-slate-400'}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
