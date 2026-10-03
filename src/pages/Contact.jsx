import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast, { Toaster } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Contact() {
  const { t } = useTranslation();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const text = `📬 <b>Yangi xabar (Aloqa)!</b>\n\n👤 Ism: ${name}\n📧 Email: ${email}\n\n📝 Xabar:\n${message}`;
      
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
      }).catch(err => console.error('Telegram error', err));
    }
    
    toast.success(t('contact.succ_msg'));
    e.target.reset();
  };

  const position = [41.311081, 69.240562]; // Tashkent coordinates

  return (
    <>
      <Helmet><title>{t('nav.contact')} | Afisha</title></Helmet>
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-10 text-center">
          {t('contact.get_in')} <span className="text-violet-600">{t('contact.touch')}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-soft p-8">
              <h3 className="text-2xl font-bold font-display mb-6">{t('contact.info')}</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{t('contact.visit_us')}</div>
                    <div className="text-slate-500" dangerouslySetInnerHTML={{ __html: t('contact.address') }}></div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coral-100 dark:bg-coral-900/30 text-coral-600 dark:text-coral-400 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{t('contact.call_us')}</div>
                    <div className="text-slate-500">+998 90 123 45 67</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{t('contact.email_us')}</div>
                    <div className="text-slate-500">hello@afisha.uz</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Ish vaqtlari (Working Hours)</div>
                    <div className="text-slate-500" dangerouslySetInnerHTML={{ __html: t('contact.hours') }}></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-soft p-8">
            <h3 className="text-2xl font-bold font-display mb-6">{t('contact.send_msg')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" label={t('contact.name')} required />
              <Input name="email" label={t('contact.email')} type="email" required />
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">{t('contact.message')}</label>
                <textarea 
                  name="message"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[120px]"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">{t('contact.send_btn')}</Button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-soft h-[400px]">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Afisha Store <br /> Tashkent.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
