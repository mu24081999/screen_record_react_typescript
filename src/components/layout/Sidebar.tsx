import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Library, Settings, LogOut, Camera, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div 
      className={clsx(
        'relative flex h-screen flex-col border-r transition-all duration-300',
        'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Camera className="h-6 w-6 flex-shrink-0 text-gray-900 dark:text-white" />
          <span className={clsx(
            "text-xl font-semibold transition-all duration-300 text-gray-900 dark:text-white",
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
          )}>
            ScreenCast
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200',
                isActive 
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle and Logout */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        <Button
          variant="outline"
          className={clsx(
            "w-full gap-2",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </Button>
        <Button
          variant="outline"
          className={clsx(
            "w-full gap-2",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}