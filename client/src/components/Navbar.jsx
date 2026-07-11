import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Gift, Heart, Sun, Moon } from 'lucide-react';
import useStore from '../store/useStore';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout, cart } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 bg-white/80 dark:bg-[#0F090E]/85 backdrop-blur-md border-b border-gray-100 dark:border-brand-gold/10">
      {/* Top Promotional Bar */}
      <div className="bg-brand-purple dark:bg-[#20101C] text-white text-xs py-2.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2 border-b border-brand-gold/20">
        <Gift className="h-3.5 w-3.5 text-brand-gold animate-bounce" />
        <span className="text-[10px] sm:text-xs">
          Flat Rs.1100 OFF on Making charges above Rs.20,000! Use Code:{' '}
          <span className="text-brand-gold font-bold">MK1100</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="h-9 w-auto text-brand-purple dark:text-brand-gold group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-semibold tracking-[0.2em] text-brand-purple dark:text-white flex items-center gap-1.5 transition-colors">
              <span className="font-light">nazara</span>
              <span className="text-brand-gold text-xs font-bold border-l border-brand-purple dark:border-brand-gold/40 pl-2">
                DIAMONDS
              </span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-semibold text-brand-darkText dark:text-gray-300">
            <Link
              to="/"
              className={`transition-colors py-2 relative ${
                isActive('/') ? 'text-brand-gold' : 'hover:text-brand-gold'
              }`}
            >
              Home
              {isActive('/') && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold" />
              )}
            </Link>
            <Link
              to="/products"
              className={`transition-colors py-2 relative ${
                isActive('/products') ? 'text-brand-gold' : 'hover:text-brand-gold'
              }`}
            >
              Products
              {isActive('/products') && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold" />
              )}
            </Link>
            <Link
              to="/customize"
              className={`transition-colors py-2 relative ${
                isActive('/customize') ? 'text-brand-gold' : 'hover:text-brand-gold'
              }`}
            >
              Customize
              {isActive('/customize') && (
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold" />
              )}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-gold dark:hover:text-brand-gold transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-brand-purple/20"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Admin Panel Button */}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-brand-gold/10 text-brand-gold px-3.5 py-2 rounded-full font-bold border border-brand-gold/20 hover:bg-brand-gold/20 transition-all"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Wishlist Link */}
            {user && (
              <Link
                to="/wishlist"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold transition-colors"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* User Account Account/Profile */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400 font-medium">Welcome,</p>
                  <p className="text-xs font-semibold text-brand-purple dark:text-white truncate max-w-[100px]">{user.name}</p>
                </Link>
                <Link
                  to="/profile"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold transition-colors sm:hidden"
                  title="My Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold transition-colors"
                title="Login / Register"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-brand-gold transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-brand-purple">
                  {cartItemsCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}
