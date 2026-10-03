import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  // In a real app, filter by user id, but here we just show all stored locally for demo
  // since it's a local storage demo without a real backend filtering.

  return (
    <>
      <Helmet><title>{t('profile.title')} | Afisha</title></Helmet>
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-10">
          {t('profile.my')} <span className="text-violet-600">{t('profile.title')}</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* User Info */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold font-display mb-1">{user.name}</h2>
              <p className="text-slate-500 mb-6">{user.phone || `@${user.username}`}</p>
              
              <Button variant="outline" className="w-full flex justify-center gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> {t('profile.logout')}
              </Button>
            </div>
          </div>

          {/* Orders History */}
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-violet-600" /> {t('profile.history')}
            </h3>

            {storedOrders.length > 0 ? (
              <div className="space-y-4">
                {storedOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-soft p-6">
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">{t('profile.order')} #{order.id}</div>
                        <div className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                          {order.status}
                        </span>
                        <div className="font-bold text-violet-600 block">{order.total.toLocaleString()} UZS</div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div className="text-sm font-medium text-slate-500 mb-2">{t('profile.items')}:</div>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span>{item.qty}x {item.title?.[i18n.language] || item.title?.uz || 'Product'} ({t('profile.size')} {item.size})</span>
                            <span className="font-medium text-slate-600 dark:text-slate-400">{(item.price * item.qty).toLocaleString()} UZS</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
                <p className="text-slate-500">{t('profile.no_orders')}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
