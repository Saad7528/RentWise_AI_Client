'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('অনুগ্রহ করে প্রয়োজনীয় ঘরগুলো পূরণ করুন।');
      return;
    }

    setSending(true);
    setError('');
    
    // Simulate sending message
    setTimeout(() => {
      setSuccess('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSending(false);
      
      // Clear alert after 4 seconds
      setTimeout(() => setSuccess(''), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 mx-auto max-w-5xl w-full px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Get In Touch</span>
          <h1 className="text-4xl font-extrabold text-foreground mt-1">যোগাযোগ করুন</h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-md mx-auto">
            আপনার কোনো প্রশ্ন, অভিযোগ বা প্ল্যাটফর্ম সংক্রান্ত মতামত থাকলে আমাদের মেসেজ দিন।
          </p>
        </div>

        {/* Form and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details sidebar (5 Columns) */}
          <div className="md:col-span-5 bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-foreground">যোগাযোগের ঠিকানা</h2>
            <p className="text-xs text-muted leading-relaxed">
              সরাসরি অফিসে যোগাযোগ করতে পারেন অথবা ইমেইলের মাধ্যমে আমাদের সাথে ২৪/৭ যুক্ত থাকতে পারেন।
            </p>

            <ul className="space-y-4 text-xs sm:text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">অফিস লোকেশন:</strong>
                  <span>ধানমন্ডি ৮/এ, ঢাকা ১২০৯, বাংলাদেশ</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">ফোন নাম্বার:</strong>
                  <a href="tel:+8801712345678" className="hover:text-primary transition-colors">+880 1712-345678</a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">ইমেইল এড্রেস:</strong>
                  <a href="mailto:support@rentwise.ai" className="hover:text-primary transition-colors">support@rentwise.ai</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form card (7 Columns) */}
          <div className="md:col-span-7 bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-foreground">মেসেজ পাঠান</h2>

            {/* Alert banners */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-600 rounded-xl text-xs flex gap-2">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-emerald-600 rounded-xl text-xs flex gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">আপনার নাম *</label>
                <input
                  type="text"
                  placeholder="e.g. Asif Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">ইমেইল এড্রেস *</label>
                  <input
                    type="email"
                    placeholder="e.g. asif@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">বিষয় (Subject)</label>
                  <input
                    type="text"
                    placeholder="e.g. প্রোপার্টি লিস্টিং হেল্প"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">বার্তাসমূহ *</label>
                <textarea
                  placeholder="এখানে আপনার মেসেজটি লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55 pt-3"
              >
                <Send className="h-4 w-4" />
                <span>মেসেজটি পাঠান</span>
              </button>
            </form>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
