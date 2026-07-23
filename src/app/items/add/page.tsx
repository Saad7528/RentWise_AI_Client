'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Plus, Image as ImageIcon, MapPin, Phone, CheckCircle2, AlertCircle, Trash2, Mic, MicOff } from 'lucide-react';

// Dynamically import MapPicker with SSR disabled to avoid Leaflet window errors
const MapPicker = dynamic(() => import('@/components/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-72 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xs text-muted animate-pulse">Loading Map...</div>,
});

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Family' | 'Bachelor Allowed' | 'Sublet' | 'Hostel' | 'Commercial Office'>('Family');
  const [rentAmount, setRentAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [address, setAddress] = useState('');
  const [isBachelorAllowed, setIsBachelorAllowed] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  
  // Map states (Default Dhaka coordinates)
  const [latitude, setLatitude] = useState(23.7808875);
  const [longitude, setLongitude] = useState(90.4228516);

  // Image states
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Status states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  const isListeningRef = React.useRef(isListening);
  const [aiProposal, setAiProposal] = useState<{
    title: string;
    description: string;
    rentAmount?: number;
    bedrooms?: number;
    bathrooms?: number;
  } | null>(null);
  const [interimText, setInterimText] = useState('');
  const interimTextRef = React.useRef('');

  // Sync ref with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    interimTextRef.current = interimText;
  }, [interimText]);

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      // Flush any leftover interim words to avoid losing final spoken words on stop
      if (interimTextRef.current.trim()) {
        setDescription((prev) => {
          const cleanPrev = prev.trim();
          return cleanPrev + (cleanPrev ? ' ' : '') + interimTextRef.current.trim();
        });
      }
      setInterimText('');
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("আপনার ব্রাউজারে স্পিচ-টু-টেক্সট সাপোর্ট করে না। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true; // Enable live real-time feedback
      rec.lang = 'bn-BD'; // Support Bangla speech dictation

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        // Safe timeout delay of 300ms to allow browser to release the microphone before restarting
        if (isListeningRef.current) {
          setTimeout(() => {
            try {
              if (isListeningRef.current) {
                rec.start();
              }
            } catch (e) {
              console.error("Auto-restart failed:", e);
            }
          }, 300);
        } else {
          setIsListening(false);
          setInterimText('');
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        if (e.error === 'not-allowed') {
          alert("মাইক্রোফোন ব্যবহারের অনুমতি দিন।");
          setIsListening(false);
          setInterimText('');
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
          setDescription((prev) => {
            const cleanPrev = prev.trim();
            return cleanPrev + (cleanPrev ? ' ' : '') + finalTranscript.trim();
          });
          setInterimText('');
        } else {
          setInterimText(currentInterim);
        }
      };

      try {
        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/items/add');
    }
  }, [user, loading, router]);

  // Set landlord phone number by default if available
  useEffect(() => {
    if (user && user.phone) {
      setContactPhone(user.phone);
    }
  }, [user]);

  // Handle local image file uploads and conversion to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError('');
    if (imagesBase64.length + files.length > 3) {
      setError('সর্বোচ্চ ৩টি ইমেজ আপলোড করা যাবে।');
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('শুধুমাত্র ইমেজ ফাইল সিলেক্ট করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagesBase64((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add web URL image to list
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImageUrls((prev) => [...prev, imageUrlInput]);
    setImageUrlInput('');
  };

  // Remove image from arrays
  const removeBase64Image = (index: number) => {
    setImagesBase64((prev) => prev.filter((_, idx) => idx !== index));
  };
  const removeUrlImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Call AI Assistant endpoint
  const handleAiGenerate = async () => {
    // If no voice description draft is provided and fields are empty, show validation error
    if (!description.trim() && (!rentAmount || !address)) {
      setError('এআই ডেসক্রিপশন জেনারেট করতে প্রথমে ভাড়া ও ঠিকানা প্রদান করুন অথবা ডেসক্রিপশন বক্সে কিছু ভয়েসে বলুন।');
      return;
    }

    try {
      setAiGenerating(true);
      setError('');
      
      const payload = {
        title: title || undefined,
        rentAmount: rentAmount ? Number(rentAmount) : undefined,
        category,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        address: address || undefined,
        isBachelorAllowed,
        description: description || undefined,
        imagesBase64: imagesBase64.length > 0 ? imagesBase64 : undefined,
      };

      const res = await api.post('/api/ai/generate', payload);

      if (res.data) {
        setAiProposal({
          title: res.data.title,
          description: res.data.description,
          rentAmount: res.data.extractedSpecs?.rentAmount,
          bedrooms: res.data.extractedSpecs?.bedrooms,
          bathrooms: res.data.extractedSpecs?.bathrooms,
        });
        setSuccess('এআই লিস্টিং সংক্রান্ত কিছু তথ্য প্রস্তাব করেছে। নিচে রিভিউ করে "প্রয়োগ করুন" বাটনে ক্লিক করুন!');
      }
    } catch (err: any) {
      console.error(err);
      setError('এআই সার্ভিস কানেক্ট করতে ব্যর্থ হয়েছে। অনুগ্রহ করে নিশ্চিত করুন যে সার্ভার সচল আছে এবং Gemini API Key কনফিগার করা আছে।');
    } finally {
      setAiGenerating(false);
    }
  };

  // Handle main form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rentAmount || !address || !contactPhone || !description) {
      setError('অনুগ্রহ করে সবগুলো প্রয়োজনীয় ঘর পূরণ করুন।');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Combine base64 images and web URLs
      const allImages = [...imageUrls, ...imagesBase64];

      const payload = {
        title,
        description,
        rentAmount: Number(rentAmount),
        deposit: Number(deposit || 0),
        category,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        isBachelorAllowed,
        address,
        latitude,
        longitude,
        images: allImages,
        contactPhone,
      };

      const res = await api.post('/api/properties', payload);

      if (res.data) {
        setSuccess(res.data.message || 'বাসাটি সফলভাবে যোগ করা হয়েছে!');
        setTimeout(() => {
          router.push('/items/manage');
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'প্রোপার্টি যোগ করতে ত্রুটি হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-muted">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 mx-auto max-w-5xl w-full px-4">
        
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Post Ad</span>
          <h1 className="text-3xl font-extrabold text-foreground mt-1">নতুন বাসা ভাড়ার বিজ্ঞাপন দিন</h1>
          <p className="text-muted text-sm mt-1">বাসার সঠিক তথ্য এবং ছবি দিয়ে দ্রুত টেন্যান্টদের সাথে যোগাযোগ করুন।</p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex gap-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Col 1 & 2: Primary Fields */}
          <div className="lg:col-span-2 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-foreground pb-2 border-b border-border">বাসার বিবরণ ও তথ্য</h2>
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">বিজ্ঞাপনের শিরোনাম (Title) *</label>
              <input
                type="text"
                placeholder="উদা: ৩ বেডের সুপরিসর ফ্ল্যাট ভাড়া দেওয়া হবে ধানমন্ডিতে"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
              />
            </div>

            {/* Grid for Rent, Deposit, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">মাসিক ভাড়া (BDT) *</label>
                <input
                  type="number"
                  placeholder="উদা: ২৫০০০"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">সিকিউরিটি ডিপোজিট (BDT)</label>
                <input
                  type="number"
                  placeholder="উদা: ৫০০০"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">ক্যাটাগরি *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Family">Family</option>
                  <option value="Bachelor Allowed">Bachelor Allowed</option>
                  <option value="Sublet">Sublet</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Commercial Office">Commercial Office</option>
                </select>
              </div>
            </div>

            {/* Grid for Bedrooms, Bathrooms, Bachelor switch, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">বেডরুম সংখ্যা *</label>
                  <input
                    type="number"
                    min="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">বাথরুম সংখ্যা *</label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">যোগাযোগের মোবাইল নম্বর *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted" />
                  <input
                    type="tel"
                    placeholder="উদা: 017XXXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">বাসার পুরো ঠিকানা (Address) *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-accent" />
                <input
                  type="text"
                  placeholder="উদা: House 45, Road 8, Dhanmondi R/A, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            {/* Bachelor Switch Toggle */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border">
              <input
                type="checkbox"
                id="isBachelorAllowed"
                checked={isBachelorAllowed}
                onChange={(e) => setIsBachelorAllowed(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="isBachelorAllowed" className="text-xs sm:text-sm font-bold text-foreground cursor-pointer select-none">
                ব্যাচেলর ভাড়া দেওয়া যাবে (Bachelor Allowed)
              </label>
            </div>

            {/* AI Generator Helper Button & Description Area */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider">বিস্তারিত বিবরণ (Markdown Description) *</label>
                  {isListening && (
                    <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-extrabold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 animate-pulse shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                      <span>রেকর্ড হচ্ছে... বলুন</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isListening
                        ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                        : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/30'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-3.5 w-3.5 animate-pulse text-red-500" />
                        <span>ভয়েস বন্ধ করুন</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 text-primary" />
                        <span>ভয়েসে বলুন (Bangla/EN)</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating}
                    className="bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold px-3 py-1.5 rounded-lg border border-secondary/20 hover:border-secondary/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-secondary" />
                    <span>Generate Description with AI</span>
                  </button>
                </div>
              </div>

              {/* AI Proposal Card */}
              {aiProposal && (
                <div className="mb-4 p-4 bg-secondary/5 dark:bg-secondary/10 border border-secondary/20 rounded-xl space-y-3 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 border-b border-secondary/10">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      এআই প্রস্তাবিত তথ্য (AI Proposed Info)
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (aiProposal.title) setTitle(aiProposal.title);
                          if (aiProposal.description) setDescription(aiProposal.description);
                          if (aiProposal.rentAmount) setRentAmount(String(aiProposal.rentAmount));
                          if (aiProposal.bedrooms) setBedrooms(String(aiProposal.bedrooms));
                          if (aiProposal.bathrooms) setBathrooms(String(aiProposal.bathrooms));
                          setAiProposal(null);
                          setSuccess('এআই প্রস্তাবিত সকল তথ্য ফর্মে সফলভাবে প্রয়োগ করা হয়েছে!');
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>প্রয়োগ করুন (Apply)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiProposal(null)}
                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        বাতিল (Cancel)
                      </button>
                    </div>
                  </div>
                  <div className="text-xs space-y-1.5 text-foreground/80">
                    <p><strong>প্রস্তাবিত শিরোনাম:</strong> {aiProposal.title}</p>
                    {aiProposal.rentAmount ? (
                      <p><strong>প্রস্তাবিত ভাড়া:</strong> <span className="text-secondary font-bold text-sm">৳{aiProposal.rentAmount} BDT</span></p>
                    ) : null}
                    <p><strong>প্রস্তাবিত রুম সংখ্যা:</strong> {aiProposal.bedrooms} বেডরুম, {aiProposal.bathrooms} বাথরুম</p>
                    <div className="pt-1.5 border-t border-secondary/10">
                      <strong className="block mb-1 text-[11px] text-muted">ডেসক্রিপশন প্রাকদর্শন (Markdown Preview):</strong>
                      <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-border text-xs max-h-32 overflow-y-auto font-mono text-muted whitespace-pre-wrap">
                        {aiProposal.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                placeholder="বাসার বিবরণ দিন অথবা এআই রাইটার বাটন ক্লিক করে অটো-জেনারেট করুন..."
                value={description + (interimText ? (description.trim() ? ' ' : '') + interimText : '')}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setInterimText('');
                }}
                required
                rows={8}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary text-foreground font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
              >
                <Plus className="h-5 w-5" />
                <span>বিজ্ঞাপনটি প্রকাশ করুন</span>
              </button>
            </div>

          </div>

          {/* Col 3: Media Uploads & Map Picker Sidebar */}
          <div className="space-y-6">
            
            {/* Map Picker Sidebar */}
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-accent" />
                লোকেশন ম্যাপে চিহ্নিত করুন
              </h3>
              <p className="text-[11px] text-muted">
                ম্যাপে সঠিক স্থানে ক্লিক করুন। এটি ইউজারদের আপনার বাসাটি খুঁজে পেতে সহজ করবে।
              </p>
              
              <MapPicker lat={latitude} lng={longitude} onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }} />

              {/* Coordinates display */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-border">
                <div>
                  <span className="block font-bold">Latitude:</span>
                  <span className="font-mono">{latitude.toFixed(6)}</span>
                </div>
                <div>
                  <span className="block font-bold">Longitude:</span>
                  <span className="font-mono">{longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* Media Upload Sidebar */}
            <div className="bg-card border border-border p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <ImageIcon className="h-4.5 w-4.5 text-primary" />
                বাসার ছবি যুক্ত করুন
              </h3>
              <p className="text-[11px] text-muted">
                ১-৩টি ছবি দিন। ইমেজ এআই বিশ্লেষণের কাজে ব্যবহার হবে।
              </p>

              {/* Local File Input */}
              <div className="relative border border-dashed border-border hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-900">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Plus className="h-6 w-6 text-muted mx-auto mb-2" />
                <span className="text-xs font-semibold text-foreground block">ছবি সিলেক্ট করুন</span>
                <span className="text-[10px] text-muted block mt-1">PNG, JPG (সর্বোচ্চ ৩টি)</span>
              </div>

              {/* Web URL Input Option */}
              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-muted uppercase">অথবা ইমেজের ওয়েভ লিংক দিন</span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-xs focus:outline-none text-foreground"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-slate-200 dark:bg-slate-800 text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Image Previews */}
              {(imagesBase64.length > 0 || imageUrls.length > 0) && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-muted uppercase">নির্বাচিত ছবিসমূহ</span>
                  <div className="grid grid-cols-3 gap-2">
                    
                    {/* Base64 Uploads previews */}
                    {imagesBase64.map((img, idx) => (
                      <div key={'b64-' + idx} className="relative h-16 w-full border border-border rounded-lg overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="B64 preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeBase64Image(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* URL Image previews */}
                    {imageUrls.map((url, idx) => (
                      <div key={'url-' + idx} className="relative h-16 w-full border border-border rounded-lg overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="URL preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUrlImage(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                  </div>
                </div>
              )}

            </div>

          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}
