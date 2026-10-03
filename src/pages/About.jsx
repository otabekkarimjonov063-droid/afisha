import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet><title>{t('nav.about')} | Afisha</title></Helmet>
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-6">
            {String(t('about.title')).split(' ').slice(0, 1).join(' ')} <span className="text-violet-600">{String(t('about.title')).split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-xl text-slate-500">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-soft">
            <img 
              src="https://picsum.photos/seed/studio/800/600" 
              alt="Studio" 
              className="w-full aspect-video object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold font-display">{t('about.section2.title')}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t('about.section2.p1')}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {t('about.section2.p2')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
