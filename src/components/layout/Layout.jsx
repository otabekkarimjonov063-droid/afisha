import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light dark:bg-bg-dark transition-colors duration-300 overflow-x-hidden">
      <ScrollRestoration />
      <Navbar />
      
      <main className="flex-1 pt-[104px]">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
