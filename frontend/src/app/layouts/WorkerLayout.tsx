import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';
import { Home, User, Calendar, MapPin, DollarSign, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { path: '/worker', icon: Home, label: 'Dashboard' },
    { path: '/worker/bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/worker/earnings', icon: DollarSign, label: 'Earnings' },
    { path: '/worker/location', icon: MapPin, label: 'Location' },
    { path: '/worker/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/worker" className="font-bold text-xl">INSTAFF Worker</Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline">Welcome, {user?.name}</span>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-4rem)] fixed lg:sticky top-16 z-40`}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
