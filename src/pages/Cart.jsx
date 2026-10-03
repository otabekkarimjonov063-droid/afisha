import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Cart() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, promos, clearCart, user } = useStore();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const [checkoutForm, setCheckoutForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    comment: '',
    payment: 'cash'
  });

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percent') {
      return (subtotal * appliedPromo.discount) / 100;
    }
    return appliedPromo.discount;
  }, [subtotal, appliedPromo]);

  const total = subtotal - discount;

  const handleApplyPromo = () => {
    setPromoError('');
    const found = promos.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
    if (found) {
      if (found.used >= found.limit) {
        setPromoError(t('cart.promo_limit'));
      } else {
        setAppliedPromo(found);
        toast.success(t('cart.promo_success'));
      }
    } else {
      setPromoError(t('cart.promo_invalid'));
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Validate
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      toast.error(t('cart.fill_required'));
      return;
    }

    const order = {
      id: Date.now().toString(),
      customer: checkoutForm,
      items: cart,
      subtotal,
      discount,
      total,
      promo: appliedPromo?.code || null,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    // Save to local storage (in real app, send to backend)
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...storedOrders]));

    // Send to Telegram if env variables are set
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const itemsList = cart.map(i => `- ${i.title?.uz || i.title?.en} (${i.size}) x${i.qty}`).join('\n');
      const commentText = order.customer.comment ? `\n📝 Izoh: ${order.customer.comment}` : '';
      const text = `🎉 Yangi Buyurtma!\n\n👤 Mijoz: ${order.customer.name}\n📞 Tel: ${order.customer.phone}\n📍 Manzil: ${order.customer.address}${commentText}\n\n🛒 Xaridlar:\n${itemsList}\n\n💰 Summa: ${order.total} UZS\n💳 To'lov: ${order.customer.payment}`;
      
      const photoUrl = cart[0]?.image;
      const endpoint = photoUrl && photoUrl.startsWith('http') ? 'sendPhoto' : 'sendMessage';
      
      const body = endpoint === 'sendPhoto'
        ? { chat_id: chatId, photo: photoUrl, caption: text, parse_mode: 'HTML' }
        : { chat_id: chatId, text, parse_mode: 'HTML' };

      fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(e => console.error('Telegram error', e));
    }

    clearCart();
    toast.success(t('cart.order_success'));
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Helmet><title>{t('nav.cart')} | Afisha</title></Helmet>
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black font-display mb-4">{t('cart.empty_title')}</h2>
        <p className="text-slate-500 mb-8 max-w-md">{t('cart.empty_desc')}</p>
        <Link to="/catalog">
          <Button size="lg">{t('cart.explore')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{t('nav.cart')} | Afisha</title></Helmet>
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter mb-10">
          {t('cart.your')} <span className="text-violet-600">{t('cart.title')}</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center hidden md:flex text-sm font-medium text-slate-500">
                <div className="w-1/2">{t('cart.product')}</div>
                <div className="w-1/6 text-center">{t('cart.size')}</div>
                <div className="w-1/6 text-center">{t('cart.quantity')}</div>
                <div className="w-1/6 text-right">{t('cart.total')}</div>
              </div>
              
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-full md:w-1/2 flex items-center gap-4">
                      <div className="w-20 h-24 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.title?.[lang] || item.title?.uz || ''} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">{item.category}</div>
                        <h4 className="font-bold font-display leading-tight mb-2 line-clamp-2">{item.title?.[lang] || item.title?.uz || ''}</h4>
                        <div className="text-violet-600 font-bold">{item.price.toLocaleString()} UZS</div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/6 md:text-center">
                      <span className="md:hidden text-sm text-slate-500 mr-2">{t('cart.size')}:</span>
                      <span className="font-medium px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded-md">{item.size}</span>
                    </div>

                    <div className="w-full md:w-1/6 flex justify-start md:justify-center">
                      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                        <button 
                          onClick={() => updateCartQty(item.id, item.size, Math.max(1, item.qty - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateCartQty(item.id, item.size, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="w-full md:w-1/6 flex justify-between md:justify-end items-center">
                      <span className="font-bold text-lg">{(item.price * item.qty).toLocaleString()}</span>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="ml-4 p-2 text-slate-400 hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/30 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checkout Form & Summary */}
          <div className="w-full lg:w-96 shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft p-6">
              <h3 className="text-xl font-bold font-display mb-6">{t('cart.summary_title')}</h3>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('cart.subtotal')}</span>
                  <span>{subtotal.toLocaleString()} UZS</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-lime-600 dark:text-lime-400">
                    <span>{t('cart.discount')} ({appliedPromo.code})</span>
                    <span>-{discount.toLocaleString()} UZS</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-violet-600">{total.toLocaleString()} UZS</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-slate-500 block mb-2">{t('cart.promo_code')}</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. WELCOME10" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>{t('cart.apply')}</Button>
                </div>
                {promoError && <p className="text-xs text-coral-500 mt-2">{promoError}</p>}
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <Input 
                  label={t('cart.full_name')} 
                  required 
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                />
                <Input 
                  label={t('cart.phone')} 
                  placeholder="+998 90 123 45 67" 
                  required 
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                />
                <Input 
                  label={t('cart.address')} 
                  required 
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                />
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">{t('cart.comment')}</label>
                  <textarea 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[80px]"
                    value={checkoutForm.comment}
                    onChange={(e) => setCheckoutForm({...checkoutForm, comment: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-500 block mb-2">{t('cart.payment')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${checkoutForm.payment === 'cash' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                      <input type="radio" name="payment" value="cash" className="hidden" checked={checkoutForm.payment === 'cash'} onChange={(e) => setCheckoutForm({...checkoutForm, payment: e.target.value})} />
                      <span className="font-bold">{t('cart.cash')}</span>
                      <span className="text-xs text-slate-500 mt-1">{t('cart.on_delivery')}</span>
                    </label>
                    <label className={`border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${checkoutForm.payment === 'card' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                      <input type="radio" name="payment" value="card" className="hidden" checked={checkoutForm.payment === 'card'} onChange={(e) => setCheckoutForm({...checkoutForm, payment: e.target.value})} />
                      <span className="font-bold">{t('cart.card')}</span>
                      <span className="text-xs text-slate-500 mt-1">{t('cart.payme_click')}</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full mt-6 flex items-center justify-center gap-2">
                  {t('cart.place_order')} <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
