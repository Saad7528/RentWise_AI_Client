'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyCard, PropertyData } from '@/components/PropertyCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Search, Sparkles, Filter, SlidersHorizontal, Map, Grid, ChevronLeft, ChevronRight, X, AlertCircle, Mic, MicOff, MapPin } from 'lucide-react';

// Dynamically import properties map to prevent window undefined SSR errors
const PropertiesMap = dynamic(() => import('@/components/PropertiesMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xs text-muted animate-pulse">Loading Map Visuals...</div>,
});

// A wrapper component to safely access useSearchParams in Next.js App Router
function RentalsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [rentMin, setRentMin] = useState('');
  const [rentMax, setRentMax] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [isBachelorAllowed, setIsBachelorAllowed] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // AI Recommendation States
  const [aiInput, setAiInput] = useState('');
  const [aiQueryText, setAiQueryText] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);

  // View States
  const [showMap, setShowMap] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // District / GPS Radius Search States
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [thana, setThana] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [pinnedLat, setPinnedLat] = useState<number | null>(null);
  const [pinnedLng, setPinnedLng] = useState<number | null>(null);
  const [searchRadius, setSearchRadius] = useState('5000'); // default 5km

  const handleDivisionChange = (val: string) => {
    setDivision(val);
    setDistrict('');
    setThana('');
    setNeighborhood('');
    setIsAiMode(false);
    setPage(1);
  };

  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    setThana('');
    setNeighborhood('');
    setIsAiMode(false);
    setPage(1);
  };

  const handleThanaChange = (val: string) => {
    setThana(val);
    setNeighborhood('');
    setIsAiMode(false);
    setPage(1);
  };

  const handleNeighborhoodChange = (val: string) => {
    setNeighborhood(val);
    setIsAiMode(false);
    setPage(1);
  };

  // Voice search states
  const [isAiVoiceListening, setIsAiVoiceListening] = useState(false);
  const [interimAiText, setInterimAiText] = useState('');
  const aiVoiceRecognitionRef = React.useRef<any>(null);
  const isAiVoiceListeningRef = React.useRef(isAiVoiceListening);
  const interimAiTextRef = React.useRef(interimAiText);

  // Sync refs with states
  useEffect(() => {
    isAiVoiceListeningRef.current = isAiVoiceListening;
  }, [isAiVoiceListening]);

  useEffect(() => {
    interimAiTextRef.current = interimAiText;
  }, [interimAiText]);

  // Clean up listening on unmount
  useEffect(() => {
    return () => {
      if (aiVoiceRecognitionRef.current) {
        aiVoiceRecognitionRef.current.stop();
      }
    };
  }, []);

  const toggleAiVoiceListening = () => {
    if (isAiVoiceListening) {
      if (aiVoiceRecognitionRef.current) {
        aiVoiceRecognitionRef.current.stop();
      }
      setIsAiVoiceListening(false);
      // Flush remaining interim text
      if (interimAiTextRef.current.trim()) {
        setAiInput((prev) => {
          const cleanPrev = prev.trim();
          return cleanPrev + (cleanPrev ? ' ' : '') + interimAiTextRef.current.trim();
        });
      }
      setInterimAiText('');
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("আপনার ব্রাউজারে স্পিচ-টু-টেক্সট সাপোর্ট করে না। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'bn-BD'; // Support Bangla voice query

      rec.onstart = () => {
        setIsAiVoiceListening(true);
      };

      rec.onend = () => {
        if (isAiVoiceListeningRef.current) {
          setTimeout(() => {
            try {
              if (isAiVoiceListeningRef.current) {
                rec.start();
              }
            } catch (e) {
              console.error("Voice search restart failed:", e);
            }
          }, 300);
        } else {
          setIsAiVoiceListening(false);
          setInterimAiText('');
        }
      };

      rec.onerror = (e: any) => {
        console.error("Voice search API error:", e);
        if (e.error === 'not-allowed') {
          alert("মাইক্রোফোন ব্যবহারের অনুমতি দিন।");
          setIsAiVoiceListening(false);
          setInterimAiText('');
        }
      };

      rec.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (finalTranscript) {
          setAiInput((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev + (cleanPrev ? ' ' : '') + finalTranscript.trim();
          });
          setInterimAiText('');
        } else {
          setInterimAiText(currentInterim);
        }
      };

      try {
        rec.start();
        aiVoiceRecognitionRef.current = rec;
      } catch (err) {
        console.error("Failed to start voice search:", err);
      }
    }
  };

  // Synchronize state with URL params on load
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlAiQuery = searchParams.get('aiQuery');

    if (urlSearch) setSearch(urlSearch);
    if (urlCategory) setCategory(urlCategory);
    if (urlAiQuery) {
      setAiInput(urlAiQuery);
      setAiQueryText(urlAiQuery);
      setIsAiMode(true);
    }
  }, [searchParams]);

  // Query 1: Regular filtering query
  const { data: regularData, isLoading: isRegularLoading } = useQuery({
    queryKey: ['properties', search, category, rentMin, rentMax, bedrooms, bathrooms, isBachelorAllowed, sort, page, division, district, thana, neighborhood, pinnedLat, pinnedLng, searchRadius],
    queryFn: async () => {
      const params: any = { page, limit: 8, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (rentMin) params.rentMin = rentMin;
      if (rentMax) params.rentMax = rentMax;
      if (bedrooms) params.bedrooms = bedrooms;
      if (bathrooms) params.bathrooms = bathrooms;
      if (isBachelorAllowed) params.isBachelorAllowed = 'true';
      if (district) params.district = district;
      if (thana) params.thana = thana;
      if (neighborhood) params.neighborhood = neighborhood;
      if (pinnedLat && pinnedLng) {
        params.lat = pinnedLat;
        params.lng = pinnedLng;
        params.radius = searchRadius;
      }

      const res = await api.get('/api/properties', { params });
      return res.data;
    },
    enabled: !isAiMode,
  });

  // Query 2: AI Recommendation query
  const { data: aiData, isLoading: isAiLoading } = useQuery({
    queryKey: ['aiRecommendations', aiQueryText],
    queryFn: async () => {
      if (!aiQueryText) return null;
      const res = await api.post('/api/ai/recommend', { queryText: aiQueryText });
      
      // Update reasoning state
      if (res.data?.reasoning) {
        setAiReasoning(res.data.reasoning);
      }
      return res.data;
    },
    enabled: isAiMode && !!aiQueryText,
  });

  // Determine current active properties list
  const propertiesList: PropertyData[] = isAiMode 
    ? (aiData?.properties || []) 
    : (regularData?.properties || []);

  const totalPages = isAiMode ? 1 : (regularData?.pagination?.pages || 1);
  const isLoading = isAiMode ? isAiLoading : isRegularLoading;

  const handleAiSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInput.trim()) {
      setAiQueryText(aiInput);
      setIsAiMode(true);
      setPage(1);
      // Update URL to match search parameter
      router.push(`/rentals?aiQuery=${encodeURIComponent(aiInput)}`, { scroll: false });
    }
  };

  const handleResetAiMode = () => {
    setIsAiMode(false);
    setAiQueryText('');
    setAiInput('');
    setAiReasoning('');
    router.push('/rentals', { scroll: false });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setRentMin('');
    setRentMax('');
    setBedrooms('');
    setBathrooms('');
    setIsBachelorAllowed(false);
    setSort('newest');
    setDivision('');
    setDistrict('');
    setThana('');
    setNeighborhood('');
    setPinnedLat(null);
    setPinnedLng(null);
    setPage(1);
    handleResetAiMode();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Filter & AI Search Bar */}
      <section className="bg-card border-b border-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Regular Search Form */}
          <form onSubmit={(e) => e.preventDefault()} className="w-full md:max-w-md flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl">
              <Search className="h-4.5 w-4.5 text-muted shrink-0" />
              <input
                type="text"
                placeholder="এলাকা বা বাসার বিবরণ দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsAiMode(false);
                  setPage(1);
                }}
                className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none placeholder:text-muted/60"
              />
            </div>
            
            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden p-2.5 bg-slate-100 dark:bg-slate-900 border border-border rounded-xl text-foreground hover:text-primary transition-all cursor-pointer"
            >
              <Filter className="h-4.5 w-4.5" />
            </button>
          </form>

          {/* AI Search Form */}
          <form onSubmit={handleAiSearchSubmit} className="w-full md:max-w-lg flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-secondary/5 border border-secondary/20 hover:border-secondary/40 rounded-xl transition-all">
              <Sparkles className="h-4.5 w-4.5 text-secondary shrink-0" />
              <input
                type="text"
                placeholder="এআইকে বলুন: 'ধানমন্ডিতে গ্যাসের সুবিধাসহ ২০ হাজারের বাসা'"
                value={aiInput + (interimAiText ? (aiInput.trim() ? ' ' : '') + interimAiText : '')}
                onChange={(e) => {
                  setAiInput(e.target.value);
                  setInterimAiText('');
                }}
                className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none placeholder:text-muted/80"
              />
              
              {/* Mic Icon Trigger */}
              <button
                type="button"
                onClick={toggleAiVoiceListening}
                className={`p-1 rounded cursor-pointer shrink-0 transition-colors ${
                  isAiVoiceListening 
                    ? 'text-red-500 hover:bg-red-500/10 animate-pulse' 
                    : 'text-secondary hover:bg-secondary/10'
                }`}
                title={isAiVoiceListening ? 'ভয়েস বন্ধ করুন' : 'ভয়েসে বলুন'}
              >
                {isAiVoiceListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4 text-secondary" />
                )}
              </button>

              {isAiMode && (
                <button
                  type="button"
                  onClick={handleResetAiMode}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-muted cursor-pointer shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Ask AI
            </button>
          </form>

          {/* Map toggle desktop */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold rounded-xl border border-border cursor-pointer transition-colors"
          >
            {showMap ? <Grid className="h-4 w-4 text-primary" /> : <Map className="h-4 w-4 text-primary" />}
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Listings + Map Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
        
        {/* Left Side: Filters + Cards */}
        <main className={`lg:col-span-8 flex flex-col h-full overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 transition-all duration-300 ${
          showMap ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
        }`}>
          
          {/* AI reasoning block */}
          {isAiMode && aiReasoning && (
            <div className="mb-6 p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex gap-3 items-start animate-fade-in">
              <Sparkles className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-secondary">AI Recommendation Reasoning</span>
                <p className="text-xs text-foreground mt-1 leading-relaxed">{aiReasoning}</p>
                <button
                  onClick={handleResetAiMode}
                  className="text-[10px] font-bold text-primary hover:underline mt-2 cursor-pointer"
                >
                  &larr; সাধারণ সার্চ মোডে ফিরে যান
                </button>
              </div>
            </div>
          )}

          {/* Desktop Filters Panel */}
          <div className="hidden lg:block bg-card border border-border p-5 rounded-2xl mb-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                ফিল্টারসমূহ
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                রিসেট ফিল্টার
              </button>
            </div>
            
            {/* Row 1: Geographical cascading selectors */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-dashed border-border/60">
              {/* Division */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">বিভাগ (Division)</label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="">সকল বিভাগ</option>
                  {Object.keys(GEO_DATA).map((divKey) => (
                    <option key={divKey} value={divKey}>
                      {GEO_DATA[divKey].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">জেলা (District)</label>
                <select
                  value={district}
                  disabled={!division}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground disabled:opacity-50 cursor-pointer"
                >
                  <option value="">সকল জেলা</option>
                  {division &&
                    Object.keys(GEO_DATA[division].districts).map((distKey) => (
                      <option key={distKey} value={distKey}>
                        {GEO_DATA[division].districts[distKey].name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Thana */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">থানা (Thana)</label>
                <select
                  value={thana}
                  disabled={!district}
                  onChange={(e) => handleThanaChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground disabled:opacity-50 cursor-pointer"
                >
                  <option value="">সকল থানা</option>
                  {division && district &&
                    Object.keys(GEO_DATA[division].districts[district].thanas).map((thanaKey) => (
                      <option key={thanaKey} value={thanaKey}>
                        {GEO_DATA[division].districts[district].thanas[thanaKey].name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">মহল্লা / এলাকা</label>
                <select
                  value={neighborhood}
                  disabled={!thana}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground disabled:opacity-50 cursor-pointer"
                >
                  <option value="">সকল এলাকা</option>
                  {division && district && thana &&
                    GEO_DATA[division].districts[district].thanas[thana].neighborhoods.map((nWord) => (
                      <option key={nWord} value={nWord}>
                        {nWord}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Row 2: Specs & Sorting */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-1">
              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setIsAiMode(false);
                    setPage(1);
                  }}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Family">Family</option>
                  <option value="Bachelor Allowed">Bachelor Allowed</option>
                  <option value="Sublet">Sublet</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Commercial Office">Commercial Office</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">সর্বনিম্ন বাজেট</label>
                <input
                  type="number"
                  placeholder="Min BDT"
                  value={rentMin}
                  onChange={(e) => {
                    setRentMin(e.target.value);
                    setIsAiMode(false);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">সর্বোচ্চ বাজেট</label>
                <input
                  type="number"
                  placeholder="Max BDT"
                  value={rentMax}
                  onChange={(e) => {
                    setRentMax(e.target.value);
                    setIsAiMode(false);
                    setPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              {/* Beds */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">বেডরুম</label>
                <select
                  value={bedrooms}
                  onChange={(e) => {
                    setBedrooms(e.target.value);
                    setIsAiMode(false);
                    setPage(1);
                  }}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-[10px] font-bold text-muted uppercase mb-1">সাজানো</label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none focus:border-primary text-foreground cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Bachelor Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="bachelorCheckbox"
                checked={isBachelorAllowed}
                onChange={(e) => {
                  setIsBachelorAllowed(e.target.checked);
                  setIsAiMode(false);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="bachelorCheckbox" className="text-xs font-bold text-foreground cursor-pointer select-none">
                শুধুমাত্র ব্যাচেলর অনুমোদিত বাসা দেখান (Bachelor Allowed)
              </label>
            </div>
          </div>

          {/* Mobile Filters Dropdown (absolute overlay if active) */}
          {showFiltersMobile && (
            <div className="lg:hidden bg-card border border-border p-5 rounded-2xl mb-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">মোবাইল ফিল্টার</span>
                <button onClick={handleResetFilters} className="text-xs font-semibold text-primary hover:underline">রিসেট</button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Division */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">বিভাগ (Division)</label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
                  >
                    <option value="">সকল বিভাগ</option>
                    {Object.keys(GEO_DATA).map((divKey) => (
                      <option key={divKey} value={divKey}>
                        {GEO_DATA[divKey].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">জেলা (District)</label>
                  <select
                    value={district}
                    disabled={!division}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg disabled:opacity-50"
                  >
                    <option value="">সকল জেলা</option>
                    {division &&
                      Object.keys(GEO_DATA[division].districts).map((distKey) => (
                        <option key={distKey} value={distKey}>
                          {GEO_DATA[division].districts[distKey].name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Thana */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">থানা (Thana)</label>
                  <select
                    value={thana}
                    disabled={!district}
                    onChange={(e) => handleThanaChange(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg disabled:opacity-50"
                  >
                    <option value="">সকল থানা</option>
                    {division && district &&
                      Object.keys(GEO_DATA[division].districts[district].thanas).map((thanaKey) => (
                        <option key={thanaKey} value={thanaKey}>
                          {GEO_DATA[division].districts[district].thanas[thanaKey].name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Neighborhood */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">মহল্লা / এলাকা</label>
                  <select
                    value={neighborhood}
                    disabled={!thana}
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg disabled:opacity-50"
                  >
                    <option value="">সকল এলাকা</option>
                    {division && district && thana &&
                      GEO_DATA[division].districts[district].thanas[thana].neighborhoods.map((nWord) => (
                        <option key={nWord} value={nWord}>
                          {nWord}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setIsAiMode(false); setPage(1); }}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
                  >
                    <option value="">All Categories</option>
                    <option value="Family">Family</option>
                    <option value="Bachelor Allowed">Bachelor Allowed</option>
                    <option value="Sublet">Sublet</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Commercial Office">Commercial Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">সাজানো</label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">সর্বনিম্ন বাজেট</label>
                  <input
                    type="number"
                    placeholder="Min BDT"
                    value={rentMin}
                    onChange={(e) => { setRentMin(e.target.value); setIsAiMode(false); setPage(1); }}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase mb-1">সর্বোচ্চ বাজেট</label>
                  <input
                    type="number"
                    placeholder="Max BDT"
                    value={rentMax}
                    onChange={(e) => { setRentMax(e.target.value); setIsAiMode(false); setPage(1); }}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bachelorCheckboxMobile"
                  checked={isBachelorAllowed}
                  onChange={(e) => { setIsBachelorAllowed(e.target.checked); setIsAiMode(false); setPage(1); }}
                  className="h-4 w-4"
                />
                <label htmlFor="bachelorCheckboxMobile" className="text-xs font-semibold text-foreground">Bachelor Allowed</label>
              </div>

              <button
                onClick={() => setShowFiltersMobile(false)}
                className="w-full bg-primary text-white text-xs font-semibold py-2 rounded-xl"
              >
                ফিল্টার প্রয়োগ করুন
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {pinnedLat && pinnedLng && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-extrabold text-foreground">ম্যাপে পিন করা লোকেশনের কাছাকাছি খুঁজছেন</span>
                  <p className="text-[10px] text-muted mt-0.5">স্থানাঙ্ক: {pinnedLat.toFixed(4)}, {pinnedLng.toFixed(4)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">ব্যাসার্ধ:</span>
                  <select
                    value={searchRadius}
                    onChange={(e) => {
                      setSearchRadius(e.target.value);
                      setPage(1);
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-border rounded-lg text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="2000">২ কিমি</option>
                    <option value="5000">৫ কিমি</option>
                    <option value="10000">১০ কিমি</option>
                    <option value="20000">২০ কিমি</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    setPinnedLat(null);
                    setPinnedLng(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                >
                  পিন মুছুন
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 mt-2">
            <span className="text-[10px] sm:text-xs font-extrabold text-muted uppercase tracking-wider">
              {isAiMode ? '✨ এআই রিকমেন্ডেশন ফলাফল' : '🔍 অনুসন্ধান ফলাফল'}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-foreground bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
              {propertiesList.length > 0 
                ? `${propertiesList.length}টি প্রোপার্টি পাওয়া গেছে`
                : 'কোনো প্রোপার্টি পাওয়া যায়নি'
              }
            </span>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <SkeletonLoader count={4} />
            ) : propertiesList.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                showMap ? 'xl:grid-cols-2' : 'md:grid-cols-3 xl:grid-cols-4'
              }`}>
                {propertiesList.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
                <AlertCircle className="h-10 w-10 text-muted mx-auto mb-3" />
                <h3 className="font-bold text-foreground">কোনো বাসা পাওয়া যায়নি</h3>
                <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                  আপনার সার্চ ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন অথবা এআই প্রম্পট ব্যবহার করুন।
                </p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-primary hover:underline mt-4 cursor-pointer"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!isAiMode && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-border rounded-lg bg-card text-foreground hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-border rounded-lg bg-card text-foreground hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </main>

        {/* Right Side: Sticky Map View */}
        {showMap && (
          <aside className="lg:col-span-4 xl:col-span-4 h-[400px] lg:h-full lg:sticky lg:top-16 border-t lg:border-t-0 lg:border-l border-border bg-slate-50 dark:bg-slate-900/50">
            <PropertiesMap 
              properties={propertiesList} 
              pinnedLat={pinnedLat}
              pinnedLng={pinnedLng}
              onPinLocation={(lat, lng) => {
                setPinnedLat(lat);
                setPinnedLng(lng);
                setIsAiMode(false);
                setPage(1);
              }}
              onClearPin={() => {
                setPinnedLat(null);
                setPinnedLng(null);
              }}
            />
          </aside>
        )}

      </div>
    </div>
  );
}

// Main component with Suspense fallback required for Next.js App Router useSearchParams usage
export default function ExploreRentalsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center text-sm font-semibold text-muted">
          Loading explore page...
        </div>
      }>
        <RentalsContent />
      </Suspense>
      <Footer />
    </div>
  );
}

// Division, District, Thana and Neighborhood static cascading configuration
const GEO_DATA: {
  [division: string]: {
    name: string;
    districts: {
      [district: string]: {
        name: string;
        thanas: {
          [thana: string]: {
            name: string;
            neighborhoods: string[];
          };
        };
      };
    };
  };
} = {
  'Dhaka': {
    name: 'ঢাকা বিভাগ',
    districts: {
      'Dhaka': {
        name: 'ঢাকা জেলা',
        thanas: {
          'Dhanmondi': { name: 'ধানমন্ডি', neighborhoods: ['Dhanmondi R/A', 'Sobhanbagh'] },
          'Mirpur': { name: 'মিরপুর', neighborhoods: ['Mirpur 1', 'Mirpur 10', 'Mirpur 11', 'Mirpur 12'] },
          'Uttara': { name: 'উত্তরা', neighborhoods: ['Uttara Sector 1', 'Uttara Sector 3', 'Uttara Sector 5'] },
          'Hazaribagh': { name: 'হাজারীবাগ', neighborhoods: ['Hazaribagh Tanners', 'Jigatola'] }
        }
      }
    }
  },
  'Rangpur': {
    name: 'রংপুর বিভাগ',
    districts: {
      'Thakurgaon': {
        name: 'ঠাকুরগাঁও জেলা',
        thanas: {
          'Thakurgaon Sadar': {
            name: 'ঠাকুরগাঁও সদর',
            neighborhoods: ['Masterpara', 'Sarkarpara', 'Gobindanagar', 'Basirpara', 'Hazipara']
          }
        }
      }
    }
  }
};
