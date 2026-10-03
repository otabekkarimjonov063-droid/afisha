import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Phone, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { hashPassword } from '@/utils/crypto';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, users, login, registerUser } = useStore();
  const [isLogin, setIsLogin] = useState(location.state?.register ? false : true);
  const [authMethod, setAuthMethod] = useState('username'); // 'username' or 'phone'
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    username: '',
    phone: '',
    password: '',
    name: '' // for register
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    }
  }, [user, navigate]);

  // Seed admin user on mount if users array is empty
  useEffect(() => {
    const seedAdmin = async () => {
      if (users.length === 0) {
        const hashed = await hashPassword('admin123');
        registerUser({
          id: 'admin-0',
          username: 'admin',
          name: 'Super Admin',
          phone: '+998900000000',
          passwordHash: hashed,
          role: 'admin',
          createdAt: new Date().toISOString()
        });
      }
    };
    seedAdmin();
  }, [users, registerUser]);

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (!val.startsWith('+998')) {
      if (val.startsWith('998')) val = '+' + val;
      else if (val.length > 0) val = '+998' + val;
    }
    // simple mask logic can be added here, keeping it basic for now
    setForm({ ...form, phone: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password.length < 6) {
      toast.error(t('login.err_password'));
      return;
    }

    const hashed = await hashPassword(form.password);

    if (isLogin) {
      // Login
      const foundUser = users.find(u => 
        (authMethod === 'username' && u.username === form.username) ||
        (authMethod === 'phone' && u.phone === form.phone)
      );

      if (!foundUser || foundUser.passwordHash !== hashed) {
        toast.error(t('login.err_invalid'));
        return;
      }

      login(foundUser);
      toast.success(t('login.succ_login'));

      if (foundUser.role === 'admin') {
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
        if (botToken && chatId) {
          const time = new Date().toLocaleString('uz-UZ');
          const ident = authMethod === 'username' ? form.username : form.phone;
          const text = `🚨 <b>Admin Paneliga kirildi!</b>\n\n👤 Ism: ${foundUser.name}\n🔑 Login (${authMethod}): ${ident}\n⏰ Vaqt: ${time}`;
          
          fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
          }).catch(err => console.error('Telegram error', err));
        }
      }

      navigate(foundUser.role === 'admin' ? '/admin' : '/profile');
      
    } else {
      // Register
      if (authMethod === 'username' && users.some(u => u.username === form.username)) {
        toast.error(t('login.err_taken_user'));
        return;
      }
      if (authMethod === 'phone' && users.some(u => u.phone === form.phone)) {
        toast.error(t('login.err_taken_phone'));
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: form.name,
        username: form.username,
        phone: form.phone,
        passwordHash: hashed,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      registerUser(newUser);
      login(newUser);
      toast.success(t('login.succ_reg'));
      navigate('/profile');
    }
  };

  return (
    <>
      <Helmet><title>{isLogin ? t('login.login_tab') : t('login.register_tab')} | Afisha</title></Helmet>
      <Toaster position="top-center" />
      
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black font-display tracking-tighter mb-2">
              {isLogin ? t('login.welcome') : t('login.create_account')}
            </h1>
            <p className="text-slate-500">
              {isLogin ? t('login.welcome_desc') : t('login.create_desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-soft overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              <button 
                className={`flex-1 py-4 text-sm font-bold transition-colors ${isLogin ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50 dark:bg-violet-900/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                onClick={() => setIsLogin(true)}
              >
                {t('login.login_tab')}
              </button>
              <button 
                className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLogin ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50 dark:bg-violet-900/10' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                onClick={() => setIsLogin(false)}
              >
                {t('login.register_tab')}
              </button>
            </div>

            <div className="p-8">
              
              {/* Auth Method Switcher */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
                <button 
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMethod === 'username' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                  onClick={() => setAuthMethod('username')}
                >
                  {t('login.use_username')}
                </button>
                <button 
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                  onClick={() => setAuthMethod('phone')}
                >
                  {t('login.use_phone')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input 
                        label={t('login.full_name')} 
                        placeholder="John Doe" 
                        required 
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {authMethod === 'username' ? (
                  <div className="relative">
                    <Input 
                      label={t('login.username')} 
                      placeholder="admin" 
                      className="pl-10"
                      required 
                      value={form.username}
                      onChange={(e) => setForm({...form, username: e.target.value})}
                    />
                    <User className="absolute left-3 bottom-3 w-5 h-5 text-slate-400" />
                  </div>
                ) : (
                  <div className="relative">
                    <Input 
                      label={t('login.phone')} 
                      placeholder="+998 90 123 45 67" 
                      className="pl-10"
                      required 
                      value={form.phone}
                      onChange={handlePhoneChange}
                    />
                    <Phone className="absolute left-3 bottom-3 w-5 h-5 text-slate-400" />
                  </div>
                )}

                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    label={t('login.password')} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10"
                    required 
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                  />
                  <Lock className="absolute left-3 bottom-3 w-5 h-5 text-slate-400" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <Button type="submit" className="w-full mt-6 py-3">
                  {isLogin ? t('login.login_btn') : t('login.create_btn')}
                </Button>
              </form>

              {isLogin && (
                <div className="mt-6 text-center text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: t('login.demo_admin') }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
