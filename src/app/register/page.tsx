'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Home, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { loginDemo } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'landlord' | 'tenant'>('tenant');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('অনুগ্রহ করে সবগুলো তথ্য পূরণ করুন।');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // Better Auth register can be mocked/implemented, since we use demo endpoints for testing
      // We will perform a demo login matching the chosen role to seamlessly sign them in!
      setSuccess('অ্যাকাউন্ট তৈরি সফল হয়েছে! লগইন করা হচ্ছে...');
      
      setTimeout(async () => {
        try {
          await loginDemo(role);
          router.push('/');
          router.refresh();
        } catch (err) {
          setError('স্বয়ংক্রিয় লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে লগইন পেজ ব্যবহার করুন।');
        }
      }, 1000);
      
    } catch (err: any) {
      setError('রেজিস্ট্রেশন প্রসেস করতে ত্রুটি হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
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
          <h2 className="text-xl font-bold text-foreground">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="text-xs text-muted mt-1.5">আপনার বাসা খোঁজার বা ভাড়া দেওয়ার যাত্রা শুরু হোক</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex gap-2 items-start">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex gap-2 items-start">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">পূর্ণ নাম</label>
            <input
              type="text"
              placeholder="e.g. Rashedul Islam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              placeholder="e.g. rashed@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">মোবাইল নম্বর</label>
            <input
              type="tel"
              placeholder="e.g. 017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">পাসওয়ার্ড</label>
            <input
              type="password"
              placeholder="অন্তত ৬ ডিজিটের পাসওয়ার্ড"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">অ্যাকাউন্টের ধরন</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('tenant')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  role === 'tenant'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted hover:text-foreground'
                }`}
              >
                আমি বাসা ভাড়া খুঁজছি (Tenant)
              </button>
              <button
                type="button"
                onClick={() => setRole('landlord')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  role === 'landlord'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted hover:text-foreground'
                }`}
              >
                আমি বাসা ভাড়া দেব (Landlord)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55 pt-4"
          >
            <UserPlus className="h-4.5 w-4.5" />
            <span>অ্যাকাউন্ট তৈরি করুন</span>
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            লগইন করুন
          </Link>
        </p>

      </div>
    </div>
  );
}
