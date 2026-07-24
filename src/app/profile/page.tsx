'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { User, Phone, MapPin, Camera, Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load existing user data into form states
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setImage(user.image || '');
      setPreviewUrl(user.image || '');
    }
  }, [user]);

  // Handle Image File Input (Convert to Base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('ইমেজ সাইজ ২ মেগাবাইটের কম হতে হবে');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setPreviewUrl(base64String);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('আপনার নাম অবশ্যই লিখতে হবে');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      await updateProfile({
        name,
        phone,
        address,
        image
      });

      setSuccessMsg('আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
      
      // Auto clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted hover:text-primary mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>পেছনে ফিরে যান</span>
        </button>

        {/* Profile Card Container */}
        <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          {/* Header Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/80 to-accent/80 relative"></div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 sm:px-12 sm:pb-12 relative">
            {/* Profile Avatar Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 mb-8 relative z-10">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full border-4 border-card overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + name}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 p-2 bg-primary hover:bg-primary-hover text-white rounded-full cursor-pointer shadow-md hover:scale-105 transition-all"
                  title="নতুন ছবি আপলোড করুন"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center sm:text-left mt-2 sm:mt-8">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{user.name}</h1>
                <p className="text-xs sm:text-sm text-muted">{user.email}</p>
                <span className="inline-block mt-2 text-[10px] sm:text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full capitalize">
                  {user.role.toLowerCase()} Account
                </span>
              </div>
            </div>

            {/* Notification Messages */}
            {successMsg && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 text-sm font-semibold animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 p-4 rounded-xl mb-6 text-sm font-semibold animate-fadeIn">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-muted" htmlFor="profile-name">
                  পূর্ণ নাম (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted/80" />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="আপনার নাম লিখুন"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border focus:border-primary px-10 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-muted" htmlFor="profile-phone">
                  মোবাইল নম্বর (Phone Number)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted/80" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: +৮৮০১xxxxxxxxx"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border focus:border-primary px-10 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-bold text-muted" htmlFor="profile-address">
                  ঠিকানা/ধাম (Address)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted/80" />
                  <textarea
                    id="profile-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="আপনার পূর্ণ ঠিকানা বা ধাম লিখুন"
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border focus:border-primary pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Form Action */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Save className="h-4.5 w-4.5" />
                <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'প্রোফাইল সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
