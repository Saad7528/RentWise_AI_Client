'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Home, User, LogOut, ShieldAlert, PlusCircle, Settings2, HelpCircle, Sun, Moon, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, loading, loginDemo } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Link styling helper based on active path
  const linkClass = (path: string) => {
    const base = 'text-sm font-semibold transition-colors duration-200 py-2';
    const active = 'text-primary border-b-2 border-primary';
    const inactive = 'text-muted hover:text-primary';
    return pathname === path ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary shrink-0" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                RentWise<span className="text-accent">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={linkClass('/')}>Home</Link>
            <Link href="/rentals" className={linkClass('/rentals')}>Explore To-Lets</Link>
            <Link href="/about" className={linkClass('/about')}>About Us</Link>

            {user && (
              <>
                <Link href="/items/add" className={linkClass('/items/add')}>Add To-Let</Link>
                <Link href="/items/manage" className={linkClass('/items/manage')}>Manage Listings</Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className={linkClass('/admin')}>Admin Settings</Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg bg-slate-50 dark:bg-slate-900 border border-border cursor-pointer shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Info */}
                  {/* User Profile Info */}
                  <Link href="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user.name}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-primary object-cover group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-foreground leading-none group-hover:text-primary transition-colors">{user.name.split(' ')[0]}</p>
                      <span className="text-[10px] text-muted capitalize leading-none">{user.role.toLowerCase()}</span>
                    </div>
                  </Link>
                  {/* Logout Button */}
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 relative">
                  {/* Demo Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                      className="flex items-center gap-1.5 bg-card hover:bg-slate-50 dark:hover:bg-slate-900 border border-border text-foreground text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Sparkles className="h-4 w-4 text-accent animate-pulse shrink-0" />
                      <span>Demo Login</span>
                    </button>

                    {showDemoDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-fadeIn">
                        <button
                          onClick={async () => {
                            setShowDemoDropdown(false);
                            await loginDemo('tenant');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-foreground hover:bg-primary/10 transition-colors font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          👤 Tenant Login
                        </button>
                        <button
                          onClick={async () => {
                            setShowDemoDropdown(false);
                            await loginDemo('landlord');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-foreground hover:bg-primary/10 transition-colors font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          🏡 Landlord Login
                        </button>
                        <button
                          onClick={async () => {
                            setShowDemoDropdown(false);
                            await loginDemo('admin');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-foreground hover:bg-primary/10 transition-colors font-semibold flex items-center gap-2 cursor-pointer text-accent"
                        >
                          🛡️ Admin Login
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/login"
                    className="bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Sign In
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu and theme buttons */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-muted hover:text-primary transition-colors rounded-lg bg-slate-50 dark:bg-slate-900 border border-border cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-2 shadow-inner" id="mobile-menu">
          <Link
            href="/"
            onClick={toggleMenu}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/rentals"
            onClick={toggleMenu}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
          >
            <Settings2 className="h-4 w-4" />
            Explore To-Lets
          </Link>
          <Link
            href="/about"
            onClick={toggleMenu}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            About Us
          </Link>

          {user && (
            <>
              <hr className="border-border my-2" />
              <Link
                href="/profile"
                onClick={toggleMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                Edit Profile
              </Link>
              <Link
                href="/items/add"
                onClick={toggleMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Add To-Let
              </Link>
              <Link
                href="/items/manage"
                onClick={toggleMenu}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                Manage Listings
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={toggleMenu}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors text-accent"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Settings
                </Link>
              )}
            </>
          )}

          <div className="pt-4">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={toggleMenu}
                  className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>

                <div className="pt-2 border-t border-border/60">
                  <span className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2 text-center">
                    Demo Login (1-Click)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={async () => {
                        toggleMenu();
                        await loginDemo('tenant');
                        window.location.reload();
                      }}
                      className="bg-card hover:bg-slate-50 dark:hover:bg-slate-800 border border-border text-foreground text-[10px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Tenant
                    </button>
                    <button
                      onClick={async () => {
                        toggleMenu();
                        await loginDemo('landlord');
                        window.location.reload();
                      }}
                      className="bg-card hover:bg-slate-50 dark:hover:bg-slate-800 border border-border text-foreground text-[10px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Landlord
                    </button>
                    <button
                      onClick={async () => {
                        toggleMenu();
                        await loginDemo('admin');
                        window.location.reload();
                      }}
                      className="bg-card hover:bg-slate-50 dark:hover:bg-slate-800 border border-border text-accent text-[10px] font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
