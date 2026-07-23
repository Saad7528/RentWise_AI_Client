'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Users, Building, Sparkles, ShieldCheck, ToggleLeft, ToggleRight, 
  Trash2, Ban, UserCheck, TrendingUp, AlertCircle, BarChart3, PieChart, Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart as RechartsPie, Pie, Cell, Legend 
} from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  
  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/admin');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  // Fetch admin settings
  const { data: settingsData } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.get('/api/admin/settings');
      return res.data?.setting || { autoApproveListings: false };
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Fetch users list
  const { data: usersList = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await api.get('/api/admin/users');
      return res.data?.users || [];
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Fetch properties moderation list
  const { data: propertiesList = [], isLoading: propsLoading } = useQuery({
    queryKey: ['adminProperties'],
    queryFn: async () => {
      const res = await api.get('/api/admin/properties');
      return res.data?.properties || [];
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Fetch analytics stats
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/api/admin/analytics');
      return res.data || null;
    },
    enabled: !!user && user.role === 'ADMIN',
  });

  // Toggle settings mutation
  const toggleSettingsMutation = useMutation({
    mutationFn: async (newValue: boolean) => {
      const res = await api.put('/api/admin/settings', { autoApproveListings: newValue });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      setSuccess('সিস্টেম সেটিংস সফলভাবে আপডেট হয়েছে!');
      setTimeout(() => setSuccess(''), 2000);
    },
    onError: () => {
      setError('সেটিংস আপডেট ব্যর্থ হয়েছে।');
      setTimeout(() => setError(''), 3000);
    },
  });

  // Toggle block user mutation
  const blockUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/api/admin/users/${id}/block`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSuccess(data.message || 'ইউজার স্ট্যাটাস পরিবর্তন সফল হয়েছে!');
      setTimeout(() => setSuccess(''), 2000);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSuccess('ইউজার অ্যাকাউন্ট ডিলিট করা হয়েছে।');
      setTimeout(() => setSuccess(''), 2000);
    },
  });

  // Approve listing mutation
  const approveListingMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/api/properties/${id}`, { status: 'APPROVED' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSuccess('লিস্টিংটি সফলভাবে এপ্রুভ করা হয়েছে।');
      setTimeout(() => setSuccess(''), 2000);
    },
  });

  // Reject listing mutation
  const rejectListingMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/api/properties/${id}`, { status: 'REJECTED' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSuccess('লিস্টিংটি রিজেক্ট করা হয়েছে।');
      setTimeout(() => setSuccess(''), 2000);
    },
  });

  // Delete listing mutation
  const deleteListingMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/properties/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProperties'] });
      queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] });
      setSuccess('বিজ্ঞপ্তিটি সফলভাবে মুছে ফেলা হয়েছে।');
      setTimeout(() => setSuccess(''), 2000);
    },
  });

  // Chart Data preparation
  const categoryChartData = analytics?.categoryStats || [];
  const monthlyChartData = analytics?.monthlyStats || [];

  // Colors for Pie Chart slices
  const COLORS = ['#0f766e', '#059669', '#f97316', '#a855f7', '#64748b'];

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-muted">
        Checking Admin Permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Control Room</span>
            <h1 className="text-3xl font-black text-foreground mt-1">অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড</h1>
            <p className="text-muted text-sm mt-1">সিস্টেম সেটিংস, প্রোপার্টি মডারেশন ও ইউজার অ্যাক্সেস কন্ট্রোল করুন।</p>
          </div>

          {/* Auto Approve Toggle Switch */}
          <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-xl">
            <span className="text-xs font-bold text-foreground">Auto-Approve Listings:</span>
            <button
              onClick={() => toggleSettingsMutation.mutate(!settingsData?.autoApproveListings)}
              className="text-primary cursor-pointer hover:scale-105 transition-transform"
            >
              {settingsData?.autoApproveListings ? (
                <ToggleRight className="h-9 w-9 text-primary" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-muted" />
              )}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Statistical Summary Cards */}
        {!analyticsLoading && analytics?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
              <Users className="h-5 w-5 text-primary mb-2" />
              <span className="text-3xl font-black text-foreground block">{analytics.summary.totalUsers}</span>
              <span className="text-xs text-muted font-bold mt-1 block">নিবন্ধিত ইউজার</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
              <Building className="h-5 w-5 text-secondary mb-2" />
              <span className="text-3xl font-black text-foreground block">{analytics.summary.totalProperties}</span>
              <span className="text-xs text-muted font-bold mt-1 block">সর্বমোট প্রোপার্টি</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
              <Clock className="h-5 w-5 text-accent mb-2" />
              <span className="text-3xl font-black text-foreground block">{analytics.summary.pendingProperties}</span>
              <span className="text-xs text-muted font-bold mt-1 block">রিভিউ পেন্ডিং বাসা</span>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mb-2" />
              <span className="text-3xl font-black text-foreground block">{analytics.summary.rentedProperties}</span>
              <span className="text-xs text-muted font-bold mt-1 block">ভাড়া হয়ে গেছে (Rented)</span>
            </div>
          </div>
        )}

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart 1: Area Listing Chart (2 Columns width) */}
          <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl">
            <h3 className="font-extrabold text-sm text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
              লিস্টিং ও ইউজার অ্যাক্টিভিটি ট্রেন্ড (বিগত ৬ মাস)
            </h3>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="listings" name="নতুন লিস্টিং" stroke="#0f766e" fillOpacity={1} fill="url(#colorListings)" />
                  <Area type="monotone" dataKey="activity" name="ইউজার অ্যাক্টিভিটি" stroke="#059669" fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Pie Chart */}
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="font-extrabold text-sm text-foreground mb-4 flex items-center gap-2">
              <PieChart className="h-4.5 w-4.5 text-secondary" />
              ক্যাটাগরি অনুযায়ী প্রোপার্টির অনুপাত
            </h3>
            
            <div className="w-full h-80 flex items-center justify-center">
              {categoryChartData.length > 0 && categoryChartData.some((c: any) => c.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} layout="horizontal" verticalAlign="bottom" align="center" />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-xs text-muted">অ্যানালিসিস করার মতো প্রোপার্টি ডাটা নেই</div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Lists section: 2 Tabs/Tables (Properties, Users) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Properties Moderation Table (2/3 width) */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">প্রোপার্টি মডারেশন তালিকা ({propertiesList.length})</h3>
            </div>
            
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-border text-[10px] font-bold text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3">বাসা ও ঠিকানা</th>
                    <th className="px-5 py-3">ভাড়া (BDT)</th>
                    <th className="px-5 py-3">স্ট্যাটাস</th>
                    <th className="px-5 py-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {propertiesList.map((item: any) => (
                    <tr key={item._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10">
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <span className="font-bold text-foreground block truncate">{item.title}</span>
                        <span className="text-[10px] text-muted block truncate mt-0.5">{item.address}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-foreground">৳{item.rentAmount.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[9px] ${
                          item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          item.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <Link href={`/rentals/${item._id}`} className="text-primary hover:underline font-bold mr-2">
                          View
                        </Link>
                        {item.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => approveListingMutation.mutate(item._id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[9px] cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectListingMutation.mutate(item._id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded text-[9px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteListingMutation.mutate(item._id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer inline-flex align-middle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Management List (1/3 width) */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50 dark:bg-slate-900">
              <h3 className="font-bold text-sm text-foreground">ইউজার কন্ট্রোল ও ওভারসাইট ({usersList.length})</h3>
            </div>
            
            <div className="divide-y divide-border overflow-y-auto max-h-[400px]">
              {usersList.map((usr: any) => (
                <div key={usr._id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={usr.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + usr.name}
                      alt={usr.name}
                      className="h-8 w-8 rounded-full border border-border"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-foreground leading-tight">{usr.name}</h4>
                      <span className="text-[10px] text-muted block mt-0.5">{usr.email}</span>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-muted px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
                        {usr.role}
                      </span>
                    </div>
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-1.5">
                    {usr.role !== 'ADMIN' && (
                      <>
                        {/* Block/Unblock toggle */}
                        <button
                          onClick={() => blockUserMutation.mutate(usr._id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                            usr.isBlocked
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'text-muted border-border hover:bg-slate-100 hover:text-red-500'
                          }`}
                          title={usr.isBlocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                        >
                          {usr.isBlocked ? <Ban className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => {
                            if (confirm(`${usr.name}-এর অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করতে চান?`)) {
                              deleteUserMutation.mutate(usr._id);
                            }
                          }}
                          className="p-1.5 text-muted border border-border hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="ডিলিট ইউজার"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
