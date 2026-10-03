import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Settings, LogOut, Menu, X, Plus, Trash2, Edit } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// Chart Data (Mock)
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
const categoryData = [
  { name: 'Concerts', value: 400 },
  { name: 'Theatre', value: 300 },
  { name: 'Sports', value: 300 },
  { name: 'Exhibitions', value: 200 },
];
const COLORS = ['#8b5cf6', '#f43f5e', '#a3e635', '#0ea5e9'];

// --- Subcomponents ---

function DashboardOverview() {
  const { products, users, orders } = useStore();
  
  // Real orders if implemented, mock for now
  const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const totalRevenue = storedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold font-display text-violet-600">{totalRevenue.toLocaleString()} UZS</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Orders</div>
          <div className="text-3xl font-bold font-display">{storedOrders.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Products</div>
          <div className="text-3xl font-bold font-display">{products.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">Users</div>
          <div className="text-3xl font-bold font-display">{users.length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-[400px]">
          <h3 className="font-bold mb-6">Sales Overview</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6 h-[400px]">
          <h3 className="font-bold mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function ProductsManager() {
  const { products, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => p.title.en.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded-md object-cover" alt="" />
                  <span className="font-medium">{p.title.en}</span>
                </td>
                <td className="p-4 capitalize">{p.category}</td>
                <td className="p-4">{p.price.toLocaleString()} UZS</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-violet-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-coral-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// --- Main Admin Component ---

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/promos', icon: Tag, label: 'Promos' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Helmet><title>Admin Panel | Afisha</title></Helmet>
      <Toaster position="top-center" />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xl font-bold font-display text-violet-600">Admin</span>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400 font-bold' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <Link 
              to="/"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Asosiy saytga qaytish
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/20 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Tizimdan chiqish
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 text-right text-sm font-medium text-slate-500">
              Welcome, {user.name}
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products" element={<ProductsManager />} />
              <Route path="/orders" element={<div className="p-6 bg-white rounded-xl">Orders Management (Todo)</div>} />
              <Route path="/users" element={<div className="p-6 bg-white rounded-xl">Users Management (Todo)</div>} />
              <Route path="/promos" element={<div className="p-6 bg-white rounded-xl">Promo Codes Management (Todo)</div>} />
              <Route path="/settings" element={<div className="p-6 bg-white rounded-xl">Shop Settings (Todo)</div>} />
            </Routes>
          </main>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}
