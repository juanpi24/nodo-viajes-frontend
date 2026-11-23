import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 transition-colors">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8">
        <Outlet /> {/* Acá se renderizan las páginas hijas */}
      </main>
      <Footer />
    </div>
  );
};
