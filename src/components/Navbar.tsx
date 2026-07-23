'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Home, User, LogOut, ShieldAlert, PlusCircle, Settings2, HelpCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  {/* User Profile Info */}
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + user.name}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border border-primary object-cover"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-foreground leading-none">{user.name.split(' ')[0]}</p>
                      <span className="text-[10px] text-muted capitalize leading-none">{user.role.toLowerCase()}</span>
                    </div>
                  </div>
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
                <Link
                  href="/login"
                  className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
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
              <Link
                href="/login"
                onClick={toggleMenu}
                className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
