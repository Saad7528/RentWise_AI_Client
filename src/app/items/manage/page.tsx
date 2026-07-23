'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PropertyData } from '@/components/PropertyCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Eye, Trash2, Home, Power, HelpCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ManageListingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  
  // Modal & feedback states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if logged out
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/items/manage');
    }
  }, [user, loading, router]);

  // Fetch landlord's listings
  const { data: listings = [], isLoading } = useQuery<PropertyData[]>({
    queryKey: ['myProperties'],
    queryFn: async () => {
      const res = await api.get('/api/properties/my-listings');
      return res.data?.properties || [];
    },
    enabled: !!user,
  });

  // Toggle status mutation (RENTED vs APPROVED)
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === 'RENTED' ? 'APPROVED' : 'RENTED';
      const res = await api.put(`/api/properties/${id}`, { status: newStatus });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      setSuccess(data.message || 'স্ট্যাটাস আপডেট সফল হয়েছে!');
      setTimeout(() => setSuccess(''), 2000);
    },
    onError: () => {
      setError('স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।');
      setTimeout(() => setError(''), 3000);
    },
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/properties/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      setSuccess('বিজ্ঞাপনটি সফলভাবে ডিলিট করা হয়েছে।');
      setDeleteTargetId(null);
      setTimeout(() => setSuccess(''), 2000);
    },
    onError: () => {
      setError('বিজ্ঞাপনটি ডিলিট করতে সমস্যা হয়েছে।');
      setDeleteTargetId(null);
      setTimeout(() => setError(''), 3000);
    },
  });

  const handleToggleStatus = (id: string, currentStatus: string) => {
    if (currentStatus === 'PENDING' || currentStatus === 'REJECTED') {
      setError('শুধুমাত্র অ্যাপ্রুভড বাসাগুলো রেন্টেড বা এভেইলেবল মার্ক করা যাবে।');
      setTimeout(() => setError(''), 3000);
      return;
    }
    toggleStatusMutation.mutate({ id, currentStatus });
  };

  const confirmDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId);
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

      <main className="flex-1 py-12 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Landlord Panel</span>
            <h1 className="text-3xl font-extrabold text-foreground mt-1">আমার বিজ্ঞাপনের তালিকা</h1>
            <p className="text-muted text-sm mt-1">আপনার পোস্ট করা টু-লেট এবং ভাড়ার স্ট্যাটাস এখান থেকে নিয়ন্ত্রণ করুন।</p>
          </div>
          <Link
            href="/items/add"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>নতুন বাসা যোগ করুন</span>
          </Link>
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
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Listings Table / Grid */}
        {isLoading ? (
          <SkeletonLoader count={4} />
        ) : listings.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-xs font-bold text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">বাসার নাম ও ঠিকানা</th>
                    <th className="px-6 py-4">ভাড়া (BDT)</th>
                    <th className="px-6 py-4">ক্যাটাগরি</th>
                    <th className="px-6 py-4">স্ট্যাটাস</th>
                    <th className="px-6 py-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {listings.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                      {/* Title & Address */}
                      <td className="px-6 py-4 max-w-sm">
                        <span className="font-bold text-foreground block truncate">{item.title}</span>
                        <span className="text-xs text-muted block truncate mt-0.5">{item.address}</span>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(item.rentAmount)}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-muted font-medium px-2.5 py-1 rounded-md">
                          {item.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-semibold ${
                          item.status === 'APPROVED' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' :
                          item.status === 'RENTED' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' :
                          item.status === 'REJECTED' ? 'bg-red-50 dark:bg-red-950/20 text-red-600' :
                          'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                        }`}>
                          {item.status === 'APPROVED' ? <CheckCircle className="h-3.5 w-3.5" /> : 
                           item.status === 'RENTED' ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        {/* View Link */}
                        <Link
                          href={`/rentals/${item._id}`}
                          className="inline-flex p-2 text-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all border border-transparent"
                          title="বিজ্ঞাপনটি দেখুন"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Link>

                        {/* Rented Toggle */}
                        <button
                          onClick={() => handleToggleStatus(item._id, item.status)}
                          className={`inline-flex p-2 rounded-lg border border-transparent transition-all cursor-pointer ${
                            item.status === 'RENTED' 
                              ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20' 
                              : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                          title={item.status === 'RENTED' ? 'এভেইলেবল মার্ক করুন' : 'রেন্টেড মার্ক করুন'}
                        >
                          <Power className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(item._id)}
                          className="inline-flex p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all border border-transparent"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Home className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">কোনো বিজ্ঞাপন খুঁজে পাওয়া যায়নি</h3>
            <p className="text-sm text-muted max-w-sm mx-auto mb-6">
              আপনার এখনও কোনো টু-লেট বিজ্ঞাপন পোস্ট করা নেই। আজই নতুন বাসা ভাড়া দিতে বিজ্ঞাপন পোস্ট করুন।
            </p>
            <Link
              href="/items/add"
              className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              নতুন বিজ্ঞাপন যোগ করুন
            </Link>
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-foreground">বিজ্ঞপ্তিটি ডিলিট করতে চান?</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                এটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলা হবে। আপনি কি নিশ্চিত?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-foreground py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
              >
                হ্যাঁ, ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
