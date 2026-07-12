import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
