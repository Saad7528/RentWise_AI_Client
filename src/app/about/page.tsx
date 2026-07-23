'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, ShieldCheck, Heart, User, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16 mx-auto max-w-4xl w-full px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">About Us</span>
          <h1 className="text-4xl font-extrabold text-foreground mt-1">RentWise AI কী?</h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-xl mx-auto">
            আমরা বাসা ভাড়া নেওয়ার ও দেওয়ার সনাতন জটিল প্রক্রিয়াকে আধুনিক এআই টেকনোলজির মাধ্যমে সহজ করেছি।
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          
          {/* Mission */}
          <div className="bg-card border border-border p-8 rounded-2xl space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              আমাদের লক্ষ্য (Our Mission)
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              RentWise AI-এর লক্ষ্য হলো এমন একটি নিরাপদ ও বুদ্ধিমান ডিরেক্টরি প্ল্যাটফর্ম গড়ে তোলা যেখানে ল্যান্ডলর্ড এবং টেন্যান্টরা কোনো মধ্যস্বত্বভোগী বা দালালের সাহায্য ছাড়াই সরাসরি যোগাযোগ করতে পারবেন। এআই-এর বুদ্ধিমান সাজেশনের মাধ্যমে প্রতিটি ইউজার যেন ২ মিনিটে তার মনের মতো বাসা খুঁজে নিতে পারেন, তা নিশ্চিত করাই আমাদের প্রধান উদ্দেশ্য।
            </p>
          </div>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-card border border-border p-6 rounded-2xl flex gap-3.5">
              <Sparkles className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-foreground">কৃত্রিম বুদ্ধিমত্তা সার্চ (AI Search)</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  আমাদের সার্চ ইন্টেলিজেন্স সিস্টেম প্রাকৃতিক ভাষা বুঝতে পারে। আপনি যেভাবে কথা বলেন, সেভাবেই টাইপ করে বাসা খুঁজতে পারেন।
                </p>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex gap-3.5">
              <ShieldCheck className="h-6 w-6 text-secondary shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-foreground">নিরাপদ ডিরেক্টরি (Direct Connection)</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  কোনো হিডেন চার্জ নেই। ওয়ান-ক্লিক কল এবং সরাসরি হোয়াটসঅ্যাপ বাটন যুক্ত থাকায় আপনি সেকেন্ডেই ল্যান্ডলর্ডের সাথে যুক্ত হতে পারবেন।
                </p>
              </div>
            </div>

          </div>

          {/* Team section */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-foreground">আমাদের ভ্যালু ও বিশ্বাস</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold text-foreground block">স্বচ্ছতা (Transparency)</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold text-foreground block">নিরাপত্তা (Security)</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold text-foreground block">সহজীকরণ (Simplicity)</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-xs font-bold text-foreground block">ইনোভেশন (Innovation)</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
