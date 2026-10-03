import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialProducts } from '@/utils/seed';

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: nextTheme };
      }),
      setTheme: (theme) => set(() => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme };
      }),

      // Auth
      user: null,
      users: [],
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      registerUser: (userData) => set((state) => ({ users: [...state.users, userData] })),

      // Cart
      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id && i.size === item.size);
        if (existing) {
          return {
            cart: state.cart.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + item.qty } : i)
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (id, size) => set((state) => ({
        cart: state.cart.filter(i => !(i.id === id && i.size === size))
      })),
      updateCartQty: (id, size, qty) => set((state) => ({
        cart: state.cart.map(i => i.id === id && i.size === size ? { ...i, qty } : i)
      })),
      clearCart: () => set({ cart: [] }),
      
      // Favorites
      favorites: [],
      toggleFavorite: (id) => set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(fId => fId !== id)
          : [...state.favorites, id]
      })),

      // Products (admin editable)
      products: initialProducts,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      // Orders (admin)
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),

      // Promo codes
      promos: [
        { code: 'WELCOME10', discount: 10, type: 'percent', limit: 100, used: 0 },
        { code: 'AFISHA20', discount: 20, type: 'percent', limit: 50, used: 0 },
        { code: 'FIRST5', discount: 5, type: 'fixed', limit: 100, used: 0 },
      ],
      addPromo: (promo) => set((state) => ({ promos: [...state.promos, promo] })),
      deletePromo: (code) => set((state) => ({
        promos: state.promos.filter(p => p.code !== code)
      }))
    }),
    {
      name: 'afisha-storage-v3',
    }
  )
);
