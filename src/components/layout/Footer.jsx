import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Share2, Globe, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="text-3xl font-bold font-display tracking-tighter text-white mb-6 inline-block">
              AFISHA<span className="text-coral-500">.</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-xs">
              {t('hero.subtitle')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider">{t('nav.catalog')}</h4>
            <ul className="space-y-3">
              <li><Link to="/catalog?category=concerts" className="hover:text-white transition-colors">Concerts</Link></li>
              <li><Link to="/catalog?category=theatre" className="hover:text-white transition-colors">Theatre</Link></li>
              <li><Link to="/catalog?category=sports" className="hover:text-white transition-colors">Sports</Link></li>
              <li><Link to="/catalog?category=exhibitions" className="hover:text-white transition-colors">Exhibitions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider">Info</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">{t('nav.faq')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider">{t('nav.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-violet-500 shrink-0" />
                <span>Tashkent, Amir Temur avenue 108</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-500 shrink-0" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-500 shrink-0" />
                <span>hello@afisha.uz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AFISHA. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
