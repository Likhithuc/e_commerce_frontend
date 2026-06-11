import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
        Developed by Likhith U C
      </footer>
    </div>
  );
}
