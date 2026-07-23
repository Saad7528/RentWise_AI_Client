'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard, PropertyData } from '@/components/PropertyCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Search, Sparkles, Building, Users, Star, HelpCircle, ShieldCheck, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Fetch 4 featured properties for home page
  const { data, isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: async () => {
      const res = await api.get('/api/properties?limit=4');
      return res.data;
    },
  });

  const featuredList: PropertyData[] = data?.properties || [];

  // Navigate on normal search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rentals?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/rentals');
    }
  };

  // Navigate on AI search submit
  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiSearchQuery.trim()) {
      router.push(`/rentals?aiQuery=${encodeURIComponent(aiSearchQuery)}`);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const categories = [
    { name: 'Family', count: '১২০+ টি বাসা', desc: 'পরিবারের জন্য আরামদায়ক ফ্ল্যাট', path: '/rentals?category=Family' },
    { name: 'Bachelor Allowed', count: '৮৫+ টি বাসা', desc: 'ব্যাচেলরদের জন্য উপযুক্ত ফ্ল্যাট ও সাবলেট', path: '/rentals?category=Bachelor+Allowed' },
    { name: 'Sublet', count: '৫০+ টি বাসা', desc: 'শেয়ার্ড ফ্যামিলি ফ্ল্যাট রুম', path: '/rentals?category=Sublet' },
    { name: 'Hostel', count: '৪০+ টি সিট', desc: 'ছাত্র/কর্মজীবীদের হোস্টেল ও মেস', path: '/rentals?category=Hostel' },
    { name: 'Commercial Office', count: '২৫+ টি স্পেস', desc: 'ব্যবসার জন্য রেডি অফিস ও দোকান', path: '/rentals?category=Commercial+Office' }
  ];

  const faqData = [
    { q: 'এআই সার্চ রেকমেন্ডেশন কিভাবে কাজ করে?', a: 'আমাদের প্ল্যাটফর্মে আপনি সাধারণ ভাষায় টাইপ করতে পারেন যেমন: "ধানমন্ডিতে গ্যাসের সুবিধা সহ ২০ হাজারের মধ্যে ২ বেডরুমের বাসা"। আমাদের Gemini এআই প্রম্পটটি এনালাইসিস করে ডাটাবেজ থেকে সঠিক বাসাগুলো খুঁজে বের করবে এবং আপনার জন্য কেন এটি সেরা তা বুঝিয়ে দেবে।' },
    { q: 'প্রোপার্টি অ্যাড করার সময় এআই রাইটার কী করে?', a: 'আপনি যখন বাসার বেসিক তথ্য (রুম সংখ্যা, লোকেশন, ভাড়া) দেবেন এবং ছবি আপলোড করবেন, এআই লিস্টিং অ্যাসিস্ট্যান্ট নিজে থেকেই একটি আকর্ষণীয় টাইটেল এবং চমৎকার বর্ণনা (Markdown description) লিখে দেবে।' },
    { q: 'অ্যাডমিন অটো-এপ্রুভাল সেটিংস কী?', a: 'এটি অ্যাডমিনদের জন্য একটি সিস্টেম সেটিংস। এটি চালু থাকলে ল্যান্ডলর্ডের পোস্ট করা নতুন বাসাগুলো সরাসরি লাইভ হয়ে যাবে। আর বন্ধ থাকলে অ্যাডমিন রিভিউ করার পর লাইভ হবে।' },
    { q: 'হোয়াটসঅ্যাপ ও সরাসরি কলের সুবিধা কীভাবে কাজ করে?', a: 'প্রতিটি বাসা বা প্রোপার্টির ডিটেইলস পেজে সরাসরি কল বাটন এবং ওয়ান-ক্লিক হোয়াটসঅ্যাম্প বাটন থাকবে। এতে কোন থার্ড পার্টি ছাড়াই টেন্যান্ট ও ল্যান্ডলর্ড একে অপরের সাথে সরাসরি যোগাযোগ করতে পারবেন।' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* SECTION 1: HERO SMART SEARCH SECTION */}
      <section className="relative w-full h-[65vh] min-h-[450px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b border-border">
        {/* Background micro-animation graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,118,110,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-4xl px-4 text-center z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Property Search Platform
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            সহজ উপায়ে খুঁজে নিন আপনার <span className="text-primary">পছন্দের বাসা</span>
          </h1>
          <p className="text-muted text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            বাংলাদেশের একমাত্র প্ল্যাটফর্ম যেখানে এআই (AI) দিয়ে সরাসরি মেসেজের মতো টাইপ করে আপনার সুবিধাজনক ফ্ল্যাট বা সিট খুঁজে পেতে পারেন।
          </p>

          {/* Standard Search Bar Overlay */}
          <div className="glass p-2.5 rounded-2xl shadow-lg border border-border/80 max-w-2xl mx-auto mb-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-card rounded-xl border border-border">
                <Search className="h-5 w-5 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="এলাকা বা বাসার নাম দিয়ে খুঁজুন... (উদা: Dhanmondi, Mirpur)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none placeholder:text-muted/60"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Search Properties</span>
              </button>
            </form>
          </div>

          {/* Intelligent AI Prompt Search Line */}
          <form onSubmit={handleAiSearchSubmit} className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 w-full px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all">
              <Sparkles className="h-4 w-4 text-secondary shrink-0" />
              <input
                type="text"
                placeholder="এআই সার্চ: 'ধানমন্ডিতে ১৫ হাজারের মধ্যে ব্যাচেলর বাসা'"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none placeholder:text-muted/80"
              />
              <button type="submit" className="text-xs font-bold text-secondary hover:text-secondary-hover shrink-0 cursor-pointer">
                AI Find &rarr;
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 2: FEATURED LISTINGS */}
      <section className="py-16 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Feature Listings</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">ভেরিফাইড নতুন টু-লেটসমূহ</h2>
            </div>
            <button
              onClick={() => router.push('/rentals')}
              className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 group cursor-pointer"
            >
              <span>সবগুলো বাসা দেখুন</span>
              <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          </div>

          {isLoading ? (
            <SkeletonLoader count={4} />
          ) : featuredList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredList.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <Building className="h-10 w-10 text-muted mx-auto mb-3" />
              <p className="text-muted text-sm">বর্তমানে কোনো বাসা যুক্ত নেই।</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: RENTAL CATEGORIES */}
      <section className="py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse Categories</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">প্রয়োজন অনুযায়ী বাসা খুঁজুন</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => router.push(cat.path)}
                className="bg-card border border-border p-6 rounded-xl hover:border-primary/30 transition-all text-center flex flex-col items-center group cursor-pointer hover:shadow-sm"
              >
                <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all mb-4">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{cat.name}</h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-muted font-medium px-2 py-0.5 rounded-full mb-2">
                  {cat.count}
                </span>
                <p className="text-[11px] text-muted line-clamp-2">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PLATFORM HIGHLIGHTS & SAFETY RULES */}
      <section className="py-16 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Highlights */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Why Choose Us</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">RentWise AI প্ল্যাটফর্মের বিশেষত্ব</h2>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                আমাদের প্ল্যাটফর্ম বাসা খোঁজার প্রচলিত জটিলতা দূর করতে কৃত্রিম বুদ্ধিমত্তা (AI) ব্যবহার করে।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl flex gap-3">
                  <Sparkles className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-foreground">AI Listing Copy</h3>
                    <p className="text-xs text-muted mt-1">সহজ তথ্যে আকর্ষক মার্কেটিং ডেসক্রিপশন জেনারেট করে।</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl flex gap-3">
                  <Sparkles className="h-6 w-6 text-secondary shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-foreground">AI Natural Search</h3>
                    <p className="text-xs text-muted mt-1">বাংলা ও ইংলিশ প্রম্পটের মাধ্যমে সরাসরি সার্চ ও ফিল্টারিং।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Rules Accordion */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border border-border rounded-2xl">
              <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2 mb-6">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                নিরাপদ টু-লেট খোঁজার নিয়মাবলী
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-muted">
                <li className="flex gap-2">
                  <span className="font-bold text-primary">১.</span>
                  <span><strong>সরাসরি বাসা ভিজিট করুন:</strong> ভাড়ার চুক্তি করার আগে সশরীরে বাসা পরিদর্শন করুন এবং কাগজের ডকুমেন্ট নিশ্চিত করুন।</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">২.</span>
                  <span><strong>অগ্রিম টাকা লেনদেনে সতর্কতা:</strong> ল্যান্ডলর্ডের সাথে সরাসরি কথা এবং আইডি কার্ড চেক না করে অগ্রিম বুকিং ফি প্রদান করবেন না।</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">৩.</span>
                  <span><strong>ভাড়া চুক্তিনামা:</strong> প্রতিটি ভাড়ার জন্য লিখিত চুক্তিনামা ব্যবহার করুন এবং এলাকার স্থানীয় নিরাপত্তা আইন মেনে চলুন।</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-primary">৪.</span>
                  <span><strong>রিপোর্ট অপশন:</strong> কোনো ফেক লিস্টিং বা প্রতারণামূলক অ্যাকাউন্ট দেখলে সাথে সাথে আমাদের সাপোর্ট টিমে রিপোর্ট করুন।</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE PLATFORM METRICS */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Realtime Stats</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">লাইভ প্ল্যাটফর্ম পরিসংখ্যান</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl hover:shadow-sm transition-all">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <span className="text-3xl font-black text-foreground block">৫,০০০+</span>
              <span className="text-xs text-muted font-semibold mt-1 block">নিবন্ধিত ইউজার</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl hover:shadow-sm transition-all">
              <Building className="h-8 w-8 text-secondary mx-auto mb-2" />
              <span className="text-3xl font-black text-foreground block">১,২০০+</span>
              <span className="text-xs text-muted font-semibold mt-1 block">অ্যাক্টিভ টু-লেট</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl hover:shadow-sm transition-all">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <span className="text-3xl font-black text-foreground block">৳ ১৫ লক্ষ+</span>
              <span className="text-xs text-muted font-semibold mt-1 block">ভাড়া লেনদেন রেফারেল</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl hover:shadow-sm transition-all">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
              <span className="text-3xl font-black text-foreground block">১০,০০০+</span>
              <span className="text-xs text-muted font-semibold mt-1 block">এআই কুয়েরি প্রসেসড</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-16 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">ইউজারদের অভিজ্ঞতা</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <p className="text-muted text-xs leading-relaxed italic">
                  "ব্যাচেলর বাসা খুঁজতে গিয়ে ঢাকা শহরে অনেক ঘুরতে হয়েছে। কিন্তু RentWise AI প্ল্যাটফর্মে জাস্ট 'Dhanmondi bachelor allowed flat' লিখে সার্চ দিতেই ২ মিনিটে ৩টি ভেরিফাইড বাসা পেয়ে গেছি। অসাধারণ এআই টেকনোলজি!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=tanvir" alt="Tanvir" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-foreground">তানভীর হাসান</h4>
                  <span className="text-[10px] text-muted">ছাত্র, ঢাকা বিশ্ববিদ্যালয়</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <p className="text-muted text-xs leading-relaxed italic">
                  "আমার ধানমন্ডির ফ্ল্যাটটি ভাড়ার জন্য পোস্ট করার সময় এআই অটোমেটিক আকর্ষণীয় টাইটেল ও বিবরণ লিখে দিয়েছে। আমাকে কোনো কষ্ট করে লেখালেখি করতে হয়নি। আর সরাসরি হোয়াটসঅ্যাপ বাটনের কারণে টেন্যান্টরা দ্রুত যোগাযোগ করছে।"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=karim" alt="Karim" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-foreground">করিম উদ্দিন আহমেদ</h4>
                  <span className="text-[10px] text-muted">প্রোপার্টি ওনার / বাড়িওয়ালা</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl relative flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <p className="text-muted text-xs leading-relaxed italic">
                  "আমি চ্যাটে জাস্ট লিখেছিলাম '২ বেডরুমের ফ্যামিলি বাসা উইথ গ্যাস মিরপুরে'। এআই মঙ্গোডিবি থেকে সরাসরি ফিল্টার করে রেকমেন্ডেশন যুক্তি সহ বাসাগুলোর ডিটেইলস কার্ড ওপেন করে দিয়েছে। ইট ফিলস লাইক ম্যাজিক!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=maliha" alt="Maliha" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-foreground">মালিহা চৌধুরী</h4>
                  <span className="text-[10px] text-muted">সফ্টওয়্যার ইঞ্জিনিয়ার</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ & NEWSLETTER ACCORDION */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-foreground cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-primary font-bold text-lg shrink-0 ml-4">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
