'use client';

declare global {
  interface Window {
    google?: any;
  }
}

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Home, Sparkles, LogIn, ShieldAlert, Chrome, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginDemo, refreshUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load Google GIS script
  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('google-gsi-script')) {
      initializeGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializeGoogleButton();
    };
  }, []);

  const initializeGoogleButton = () => {
    if (window.google) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '686079964181-sd96omj0gqdj9b70ccm6udgtd92hjvk2.apps.googleusercontent.com';
      
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn-container'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: 382,
          shape: 'rectangular',
          text: 'signin_with',
          locale: 'bn'
        }
      );
    }
  };

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setSubmitting(true);
      setError('');
      
      const res = await api.post('/api/auth/google', { credential: response.credential });
      
      if (res.data && res.data.user) {
        await refreshUser();
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      }
    } catch (err: any) {
      console.error('Google Auth login failed:', err);
      setError('গুগল সাইন-ইন প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  // If already logged in, redirect to manage page or home page
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  // Handle manual credentials form submit
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      // Standard credentials login can fall back to demo accounts since credentials aren't set
      if (email.includes('landlord')) {
        await loginDemo('landlord');
      } else if (email.includes('admin')) {
        await loginDemo('admin');
      } else {
        await loginDemo('tenant');
      }
      router.refresh();
    } catch (err: any) {
      setError('লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল চেক করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  // Perform demo login trigger
  const handleDemoLogin = async (role: 'landlord' | 'tenant' | 'admin') => {
    try {
      setSubmitting(true);
      setError('');
      
      // Auto-fill values in form for visual indicator
      if (role === 'landlord') {
        setEmail('demo.landlord@rentwise.com');
        setPassword('••••••••');
      } else if (role === 'admin') {
        setEmail('demo.admin@rentwise.com');
        setPassword('••••••••');
      } else {
        setEmail('demo.tenant@rentwise.com');
        setPassword('••••••••');
      }

      await loginDemo(role);
      
      // Force refresh user context
      await refreshUser();
      
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError('ডেমো লগইন প্রসেস করতে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(15,118,110,0.08),rgba(255,255,255,0))]" />
        
        <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Home className="h-7 w-7 text-primary" />
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              RentWise<span className="text-accent">AI</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-foreground">অ্যাকাউন্টে লগইন করুন</h2>
          <p className="text-xs text-muted mt-1.5">আপনার বিবরণ দিয়ে ড্যাশবোর্ডে প্রবেশ করুন</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex gap-2 items-start">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider">পাসওয়ার্ড</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
            </div>
            <input
              type="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
          >
            <LogIn className="h-4 w-4" />
            <span>লগইন করুন</span>
          </button>
        </form>

        {/* Social / Google Login (Required) */}
        <div className="relative flex items-center justify-center mb-5">
          <hr className="w-full border-border" />
          <span className="absolute bg-card px-3 text-xs text-muted uppercase tracking-widest font-bold">Or</span>
        </div>

        {/* Google Native OAuth Button Container */}
        <div className="flex justify-center mb-6 w-full" id="google-signin-btn-container"></div>

        {/* Demo Fast Login Area */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border border-border rounded-xl space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted block text-center">
            মূল্যায়ন করতে দ্রুত ডেমো লগইন করুন
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('landlord')}
              type="button"
              disabled={submitting}
              className="bg-card hover:bg-primary/5 border border-border hover:border-primary text-[10px] font-bold py-2 rounded-lg text-foreground transition-all cursor-pointer disabled:opacity-55 text-center leading-tight"
            >
              Demo Landlord
            </button>
            <button
              onClick={() => handleDemoLogin('tenant')}
              type="button"
              disabled={submitting}
              className="bg-card hover:bg-secondary/5 border border-border hover:border-secondary text-[10px] font-bold py-2 rounded-lg text-foreground transition-all cursor-pointer disabled:opacity-55 text-center leading-tight"
            >
              Demo Tenant
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              type="button"
              disabled={submitting}
              className="bg-card hover:bg-accent/5 border border-border hover:border-accent text-[10px] font-bold py-2 rounded-lg text-foreground transition-all cursor-pointer disabled:opacity-55 text-center leading-tight"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          নতুন ইউজার?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-muted bg-slate-50 dark:bg-slate-950">
        Loading Login System...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
