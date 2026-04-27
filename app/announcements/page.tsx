"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { getBackendBaseUrl } from "@/libs/api/baseUrl";

function FcShop(props: React.SVGProps<SVGSVGElement>) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 48 48" enableBackground="new 0 0 48 48" height="1em" width="1em" {...props}><rect x={5} y={19} fill="#CFD8DC" width={38} height={19} /><rect x={5} y={38} fill="#B0BEC5" width={38} height={4} /><rect x={27} y={24} fill="#455A64" width={12} height={18} /><rect x={9} y={24} fill="#E3F2FD" width={14} height={11} /><rect x={10} y={25} fill="#1E88E5" width={12} height={9} /><path fill="#90A4AE" d="M36.5,33.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S37,36.3,37,36v-2C37,33.7,36.8,33.5,36.5,33.5z" /><g fill="#558B2F"><circle cx={24} cy={19} r={3} /><circle cx={36} cy={19} r={3} /><circle cx={12} cy={19} r={3} /></g><path fill="#7CB342" d="M40,6H8C6.9,6,6,6.9,6,8v3h36V8C42,6.9,41.1,6,40,6z" /><rect x={21} y={11} fill="#7CB342" width={6} height={8} /><polygon fill="#7CB342" points="37,11 32,11 33,19 39,19" /><polygon fill="#7CB342" points="11,11 16,11 15,19 9,19" /><g fill="#FFA000"><circle cx={30} cy={19} r={3} /><path d="M45,19c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3L45,19z" /><circle cx={18} cy={19} r={3} /><path d="M3,19c0,1.7,1.3,3,3,3s3-1.3,3-3s-1.3-3-3-3L3,19z" /></g><g fill="#FFC107"><polygon points="32,11 27,11 27,19 33,19" /><polygon points="42,11 37,11 39,19 45,19" /><polygon points="16,11 21,11 21,19 15,19" /><polygon points="6,11 11,11 9,19 3,19" /></g></svg>;
}

function GrAnnounce(props: React.SVGProps<SVGSVGElement>) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path fill="none" stroke="currentColor" strokeWidth={2} d="M11,15 C14,15 19,19 19,19 L19,3 C19,3 14,7 11,7 C11,7 11,15 11,15 Z M5,15 L8,23 L12,23 L9,15 M19,14 C20.657,14 22,12.657 22,11 C22,9.343 20.657,8 19,8 M11,19 C11.9999997,18.9999994 14,18 14,16 M2,11 C2,7.88888889 3.7912,7 6,7 L11,7 L11,15 L6,15 C3.7912,15 2,14.1111111 2,11 Z" /></svg>;
}

function AiOutlineEdit(props: React.SVGProps<SVGSVGElement>) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" height="1em" width="1em" {...props}><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></svg>;
}

function MdDeleteForever(props: React.SVGProps<SVGSVGElement>) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
}

//Annoucement Page
interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    shop?: { _id: string; name: string; picture?: string; };
}

interface Shop {
    _id: string;
    name: string;
    picture?: string;
}

export default function AnnouncementPage() {
    const { data: session } = useSession();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [shops, setShops] = useState<Shop[]>([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedShopId, setSelectedShopId] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

    const isAuthorized = session?.user?.role === 'admin' || session?.user?.role === 'shopowner';
    const isShopOwner = session?.user?.role === 'shopowner';
    const API_BASE_URL = `${getBackendBaseUrl()}/api/v1/announcements`;
    const SHOPS_URL = `${getBackendBaseUrl()}/api/v1/shops`;

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/all`);
      const result = await res.json();
      setAnnouncements(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const fetchMyShops = async () => {
        if (!session?.user?.token) return;
        try {
            // Admin fetches all shops, Shopowner fetches only theirs
            const url = isShopOwner ? `${SHOPS_URL}/mine` : `${SHOPS_URL}?limit=1000`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            const result = await res.json();
            if (result.success && result.data) {
                setShops(result.data);
                if (result.data.length > 0) setSelectedShopId(result.data[0]._id);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchAnnouncements();
        if (session?.user?.token) {
            fetchMyShops();
        }
    }, [session?.user?.token,]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.token) return alert("Unauthorized");

        setIsProcessing(true);
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    imageUrl,
                    // Send shop for admin OR shopowner
                    ...(selectedShopId ? { shop: selectedShopId } : {})
                }),
            });

            if (res.ok) {
                resetForm();
                fetchAnnouncements();
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาด");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!session?.user?.token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                setDeleteConfirmId(null);
                fetchAnnouncements();
            }
        } catch (err) { console.error(err); }
    };

    const startEdit = (item: Announcement) => {
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Hero Banner */}
            <div className="relative overflow-hidden border-b border-card-border">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold/5 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <div className="max-w-4xl mx-auto px-4 md:px-12 py-10 md:py-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-base">
                            📢
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                            Broadcast Center
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-text-main mb-3">
                        Announcements
                    </h1>
                    <p className="text-text-sub text-sm tracking-wide max-w-md">
                        Manage and broadcast important updates to your customers.
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                        <div className="h-[1px] w-16 bg-gradient-to-r from-accent/60 to-transparent" />
                        <span className="text-[9px] uppercase tracking-widest text-text-sub/50">
                            {announcements.length} Active {announcements.length === 1 ? 'Post' : 'Posts'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-12 py-8 md:py-12">

                {/* Create / Edit Form */}
                {isAuthorized && (
                    <div className="mb-14">
                        <form
                            onSubmit={handleSubmit}
                            className="relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-accent/20"
                        >
                            {/* Top accent bar */}
                            <div className={`h-[3px] w-full bg-gradient-to-r ${editingId ? 'from-gold/60 via-gold/30 to-transparent' : 'from-accent/60 via-accent/30 to-transparent'}`} />

                            <div className="p-4 sm:p-8">
                                {/* Form header */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${editingId ? 'bg-gold/15 border border-gold/30' : 'bg-accent/15 border border-accent/30'}`}>
                                        {editingId ? '✏️' : '✨'}
                                    </div>
                                    <div>
                                        <h2 className={`text-[11px] uppercase tracking-[0.3em] font-bold ${editingId ? 'text-gold' : 'text-accent'}`}>
                                            {editingId ? 'Editing Announcement' : 'Compose New Announcement'}
                                        </h2>
                                        <p className="text-[9px] uppercase tracking-widest text-text-sub/50 mt-0.5">
                                            {editingId ? 'Modify your existing post' : 'Create a new broadcast message'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Shop Selector (admin or shopowner with multiple shops) */}
                                    {((isShopOwner && shops.length > 1) || !isShopOwner) && !editingId && shops.length > 0 && (
                                        <div className="group relative z-20">
                                            <label className="block text-[9px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2">
                                                Target Shop *
                                            </label>
                                            
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                                                    className={`w-full flex items-center justify-between bg-background/40 border ${isShopDropdownOpen ? 'border-accent/60' : 'border-card-border'} rounded-xl px-4 py-3 text-sm text-text-main transition-all`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {selectedShopId && shops.find(s => s._id === selectedShopId)?.picture ? (
                                                            <img 
                                                                src={shops.find(s => s._id === selectedShopId)?.picture} 
                                                                alt="" 
                                                                className="w-6 h-6 rounded-full object-cover border border-card-border"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center border border-card-border">
                                                                <FcShop className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        <span>
                                                            {selectedShopId ? shops.find(s => s._id === selectedShopId)?.name : 'Select a shop...'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-text-sub/50 transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`}>
                                                        ▾
                                                    </span>
                                                </button>

                                                {isShopDropdownOpen && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setIsShopDropdownOpen(false)}
                                                        />
                                                        <div className="absolute top-full left-0 w-full mt-2 bg-card border border-card-border rounded-xl shadow-2xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                                                            {shops.map(shop => (
                                                                <button
                                                                    key={shop._id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedShopId(shop._id);
                                                                        setIsShopDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-background/50 ${selectedShopId === shop._id ? 'bg-accent/10 text-accent' : 'text-text-sub hover:text-text-main'}`}
                                                                >
                                                                    {shop.picture ? (
                                                                        <img 
                                                                            src={shop.picture} 
                                                                            alt="" 
                                                                            className="w-6 h-6 rounded-full object-cover border border-card-border"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center border border-card-border transition-colors">
                                                                            <FcShop className="w-4 h-4" />
                                                                        </div>
                                                                    )}
                                                                    <span className="text-sm truncate">{shop.name}</span>
                                                                    {selectedShopId === shop._id && (
                                                                        <span className="ml-auto text-accent text-xs">✓</span>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-[9px] text-text-sub/40 mt-1.5 tracking-wide">
                                                เลือกร้านที่ต้องการโพสต์ประกาศ
                                            </p>
                                        </div>
                                    )}

                                    {/* Title field */}
                                    <div className="group">
                                        <label className="block text-[9px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter announcement title..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-background/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-sub/40 focus:outline-none focus:border-accent/60 focus:bg-background/60 transition-all font-serif"
                                            required
                                        />
                                    </div>

                                    {/* Image URL field */}
                                    <div className="group">
                                        <label className="block text-[9px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2">
                                            Image URL <span className="text-text-sub/40 normal-case tracking-normal">(optional)</span>
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                className="flex-1 bg-background/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-sub/40 focus:outline-none focus:border-accent/60 transition-all font-mono"
                                            />
                                            {imageUrl && (
                                                <div className="w-12 h-12 rounded-lg border border-card-border overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={imageUrl}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content field */}
                                    <div className="group">
                                        <label className="block text-[9px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2">
                                            Content *
                                        </label>
                                        <textarea
                                            placeholder="Write your announcement details here..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full bg-background/40 border border-card-border rounded-xl px-4 py-3 h-36 text-sm text-text-main placeholder:text-text-sub/40 focus:outline-none focus:border-accent/60 focus:bg-background/60 transition-all resize-none leading-relaxed"
                                            required
                                        />
                                        <div className="flex justify-end mt-1">
                                            <span className="text-[9px] text-text-sub/40 font-mono">{content.length} chars</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-8 pt-6 border-t border-card-border">
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 ${editingId
                                            ? 'bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 hover:shadow-[0_8px_16px_-6px_rgba(255,215,0,0.3)]'
                                            : 'bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(255,115,0,0.5)]'
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            editingId ? '✓ Save Changes' : '+ Publish Post'
                                        )}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-6 py-3 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold border border-card-border text-text-sub hover:text-text-main hover:border-text-sub/30 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Announcements List */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-[9px] uppercase tracking-[0.5em] text-text-sub/60">
                            — Published Announcements —
                        </p>
                        {!loading && (
                            <span className="text-[9px] font-mono text-accent/50 uppercase tracking-widest">
                                {announcements.length} total
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-card/40 border border-card-border rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-40 bg-card-border/30" />
                                    <div className="p-8 space-y-3">
                                        <div className="h-4 bg-card-border/50 rounded w-2/3" />
                                        <div className="h-3 bg-card-border/30 rounded w-full" />
                                        <div className="h-3 bg-card-border/30 rounded w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-card-border rounded-2xl">
                            <div className="text-5xl mb-4 opacity-30">📭</div>
                            <p className="text-[11px] uppercase tracking-[0.4em] text-text-sub/50">No announcements yet</p>
                            {isAuthorized && (
                                <p className="text-[10px] text-text-sub/30 mt-2 tracking-wider">Create your first post above</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {announcements.map((item, index) => (
                                <article
                                    key={item._id}
                                    className="group relative bg-card/60 border border-card-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/5 hover:border-accent/30 hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />

                                    {/* Image */}
                                    {item.imageUrl && (
                                        <div className="relative w-full h-52 overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
                                                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                                        </div>
                                    )}

                                    <div className="relative p-4 sm:p-8">
                                        {/* Header row */}
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Date + Shop badge */}
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] text-text-sub/50 font-mono">
                                                        <span className="w-1 h-1 rounded-full bg-accent/50 inline-block" />
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                    {item.shop && (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-accent/20 bg-accent/5 text-[9px] uppercase tracking-widest text-accent font-bold">
                                                            {item.shop.picture && (
                                                                <img src={item.shop.picture} alt="" className="w-3 h-3 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                            )}
                                                            {item.shop.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <h2 className="text-xl md:text-2xl font-serif font-semibold text-text-main group-hover:text-accent transition-colors duration-300 leading-snug tracking-wide">
                                                    {item.title}
                                                </h2>
                                            </div>

                                            {/* Action buttons */}
                                            {isAuthorized && (
                                                <div className="flex gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 sm:translate-x-4 sm:group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-gold/10 text-gold hover:bg-gold/25 px-4 py-2 rounded-xl border border-gold/20 hover:border-gold/40 transition-all font-bold hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                                                    >
                                                        <AiOutlineEdit className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(item._id)}
                                                        className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all font-bold hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                                                    >
                                                        <MdDeleteForever className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="relative pl-5 border-l-[3px] border-card-border/50 group-hover:border-accent/40 transition-colors duration-500 mt-2">
                                            <p className="text-text-sub text-sm leading-relaxed whitespace-pre-wrap">
                                                {item.content}
                                            </p>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className="mt-6 pt-4 border-t border-card-border/50 flex items-center justify-between">
                                            <span className="text-[8px] uppercase tracking-[0.4em] text-text-sub/30 font-mono">
                                                ID: {item._id.slice(-8)}
                                            </span>
                                            <div className="h-[1px] w-12 bg-gradient-to-l from-accent/20 to-transparent" />
                                        </div>
                                    </div>

                                    {/* Delete confirm overlay */}
                                    {deleteConfirmId === item._id && (
                                        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10 rounded-2xl">
                                            <MdDeleteForever className="w-12 h-12 text-red-500/80 drop-shadow-lg" />
                                            <p className="text-sm text-text-main font-serif">Delete this announcement?</p>
                                            <p className="text-[10px] uppercase tracking-widest text-text-sub/60">This action cannot be undone</p>
                                            <div className="flex gap-3 mt-2">
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="px-6 py-2.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] uppercase tracking-[0.3em] rounded-xl font-bold hover:bg-red-500/30 transition-all"
                                                >
                                                    Confirm Delete
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="px-6 py-2.5 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.3em] rounded-xl hover:text-text-main transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
