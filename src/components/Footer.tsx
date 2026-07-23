import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card text-foreground">
      {/* Top section: Brand & Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Desc */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary shrink-0" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                RentWise<span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              বাংলাদেশের প্রথম এআই-চালিত প্রপার্টি রেন্টাল ও রেকমেন্ডেশন প্ল্যাটফর্ম। আমরা বাসা খোঁজার প্রসেসকে করেছি সহজ, নিরাপদ এবং আধুনিক।
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary rounded-lg border border-border hover:border-primary/20 transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary rounded-lg border border-border hover:border-primary/20 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary rounded-lg border border-border hover:border-primary/20 transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted hover:text-primary rounded-lg border border-border hover:border-primary/20 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/rentals" className="text-sm text-muted hover:text-primary transition-colors">Explore To-Lets</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-primary transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Contact us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted">
                <MapPin className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                <span>ধানমন্ডি, ঢাকা ১২০৯, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted">
                <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="tel:+8801712345678" className="hover:text-primary transition-colors">+880 1712-345678</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted">
                <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="mailto:support@rentwise.ai" className="hover:text-primary transition-colors">support@rentwise.ai</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Newsletter</h3>
            <p className="text-xs text-muted mb-3">
              নতুন নতুন প্রোপার্টি অফার এবং এআই আপডেটের খবর সবার আগে পেতে আমাদের সাবস্ক্রাইব করুন।
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="আপনার ইমেইল দিন..."
                required
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border border-border focus:outline-none focus:border-primary text-foreground"
              />
              <button
                type="submit"
                className="p-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} RentWise AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
