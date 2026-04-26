"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { getBackendBaseUrl } from "@/libs/api/baseUrl";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    imagePosition?: string;
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

    // State สำหรับฟอร์ม
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePosition, setImagePosition] = useState('center');
    const [selectedShopId, setSelectedShopId] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // State สำหรับ UI & Modal & Features
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [viewingPost, setViewingPost] = useState<Announcement | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // ระบบ Sort
    const [layout, setLayout] = useState<'list' | 'grid'>('grid'); // ระบบเลือก Layout

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
        if (!session?.user?.token || !isShopOwner) return;
        try {
            const res = await fetch(`${SHOPS_URL}/mine`, {
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
    }, [session?.user?.token]);

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
                    imagePosition,
                    ...(isShopOwner && selectedShopId ? { shop: selectedShopId } : {})
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
                setViewingPost(null);
                fetchAnnouncements();
            }
        } catch (err) { console.error(err); }
    };

    const startEdit = (item: Announcement) => {
        setEditingId(item._id);
        setTitle(item.title);
        setContent(item.content);
        setImageUrl(item.imageUrl || "");
        setImagePosition(item.imagePosition || 'center');
        setViewingPost(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setImageUrl('');
        setImagePosition('center');
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getPositionClass = (pos?: string) => {
        if (pos === 'top') return 'object-top';
        if (pos === 'bottom') return 'object-bottom';
        return 'object-center';
    };

    // การจัดการระบบ Sort
    const sortedAnnouncements = [...announcements].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Hero Banner */}
            <div className="relative overflow-hidden border-b border-card-border">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-gold/5 pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-xl shadow-lg shadow-accent/5">
                            ✨
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.5em] text-accent font-bold">
                            Registry Center
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-text-main mb-4 leading-tight">
                        Official Broadcasts
                    </h1>
                    <p className="text-text-sub text-base tracking-wide max-w-lg font-light">
                        Manage and broadcast your official communications and updates with uncompromising elegance.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">

                {/* Create / Edit Form */}
                {isAuthorized && (
                    <div className="mb-20">
                        <form
                            onSubmit={handleSubmit}
                            className="relative bg-card/60 backdrop-blur-xl border border-card-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-accent/30"
                        >
                            <div className={`h-1 w-full bg-gradient-to-r ${editingId ? 'from-gold/80 via-gold/40 to-transparent' : 'from-accent/80 via-accent/40 to-transparent'}`} />

                            <div className="p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-card-border/50">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${editingId ? 'bg-gold/10 text-gold' : 'bg-accent/10 text-accent'}`}>
                                        {editingId ? '✎' : '＋'}
                                    </div>
                                    <div>
                                        <h2 className={`text-xs uppercase tracking-[0.3em] font-bold ${editingId ? 'text-gold' : 'text-accent'}`}>
                                            {editingId ? 'Modify Record' : 'Draft New Entry'}
                                        </h2>
                                        <p className="text-[10px] uppercase tracking-widest text-text-sub/50 mt-1">
                                            {editingId ? 'Update your existing registry publication' : 'Create and publish a new broadcast message'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {isShopOwner && shops.length > 1 && !editingId && (
                                        <div className="group">
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                                                Target Organization *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedShopId}
                                                    onChange={(e) => setSelectedShopId(e.target.value)}
                                                    className="w-full appearance-none bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-sm text-text-main focus:outline-none focus:border-accent/60 transition-all pr-10"
                                                    required
                                                >
                                                    {shops.map(shop => (
                                                        <option key={shop._id} value={shop._id}>
                                                            {shop.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-sub/50">▼</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="group">
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                                            Headline *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter announcement headline..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-base text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 focus:bg-background transition-all font-serif"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div className="col-span-1 md:col-span-8 group">
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                                                Visual Asset (URL) <span className="text-text-sub/30 tracking-normal capitalize font-normal">— Optional</span>
                                            </label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="url"
                                                    placeholder="https://example.com/image.jpg"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="flex-1 bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-sm text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 transition-all font-mono"
                                                />
                                                {imageUrl && (
                                                    <div className="w-14 h-14 rounded-xl border border-card-border overflow-hidden flex-shrink-0 shadow-inner">
                                                        <img
                                                            src={imageUrl}
                                                            alt="preview"
                                                            className={`w-full h-full object-cover ${getPositionClass(imagePosition)}`}
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-1 md:col-span-4 group">
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                                                Focus Point
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={imagePosition}
                                                    onChange={(e) => setImagePosition(e.target.value)}
                                                    className="w-full appearance-none bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-sm text-text-main focus:outline-none focus:border-accent/60 transition-all pr-10"
                                                >
                                                    <option value="top">Top Aligned</option>
                                                    <option value="center">Center Centered</option>
                                                    <option value="bottom">Bottom Aligned</option>
                                                </select>
                                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-sub/50">▼</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                                            Detailed Brief *
                                        </label>
                                        <textarea
                                            placeholder="Compose your message here..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full bg-background/50 border border-card-border rounded-2xl px-5 py-4 h-48 text-sm text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 focus:bg-background transition-all resize-none leading-relaxed font-light"
                                            required
                                        />
                                        <div className="flex justify-end mt-2">
                                            <span className="text-[10px] text-text-sub/40 font-mono tracking-widest">{content.length} CHARS</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-10 pt-8 border-t border-card-border/50">
    <button
        type="submit"
        disabled={isProcessing}
        className={`relative flex items-center justify-center min-w-[180px] px-8 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-bold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group ${
            editingId
            ? 'bg-gradient-to-r from-gold to-gold/80 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] border border-gold/50 hover:-translate-y-0.5'
            : 'bg-gradient-to-r from-accent to-accent/80 text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] hover:shadow-[0_8px_25px_rgba(var(--accent-rgb),0.4)] border border-accent/50 hover:-translate-y-0.5'
        }`}
    >
        {/* เอฟเฟกต์แสงสะท้อนวิ่งผ่านปุ่มตอน Hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
        
        <span className="relative z-10 flex items-center gap-2">
            {isProcessing ? (
                <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    PROCESSING
                </>
            ) : (
                editingId ? 'Authorize Update' : 'Publish Entry'
            )}
        </span>
    </button>
    
    {editingId && (
        <button
            type="button"
            onClick={resetForm}
            className="px-8 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-bold text-text-sub border border-transparent hover:border-card-border hover:bg-card-border/10 hover:text-text-main transition-all duration-300"
        >
            Discard
        </button>
    )}
</div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Toolbar: Sort & Layout */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-card-border pb-6">
                    <div>
                        <h3 className="text-2xl font-serif text-text-main mb-1">Publications</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-text-sub/60">
                            {announcements.length} Official Records
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-text-sub/50">Order By:</span>
                            <div className="relative">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                    className="appearance-none bg-card border border-card-border rounded-full pl-4 pr-10 py-2 text-xs text-text-main font-semibold tracking-wide focus:outline-none focus:border-accent/50 transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="newest">Ascending</option>
                                    <option value="oldest">Descending</option>
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-sub text-[10px]">▼</div>
                            </div>
                        </div>

                        <div className="w-[1px] h-6 bg-card-border"></div>

                        {/* Layout Toggle */}
                        <div className="flex items-center bg-card border border-card-border rounded-full p-1 shadow-sm">
                            <button 
                                onClick={() => setLayout('grid')} 
                                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${layout === 'grid' ? 'bg-background shadow-sm text-text-main' : 'text-text-sub/40 hover:text-text-sub'}`}
                                title="Grid View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button 
                                onClick={() => setLayout('list')} 
                                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${layout === 'list' ? 'bg-background shadow-sm text-text-main' : 'text-text-sub/40 hover:text-text-sub'}`}
                                title="List View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Announcements Feed */}
                <div>
                    {loading ? (
                        <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-card/40 border border-card-border rounded-3xl overflow-hidden animate-pulse">
                                    <div className="h-56 bg-card-border/20" />
                                    <div className="p-8 space-y-4">
                                        <div className="h-5 bg-card-border/40 rounded-full w-2/3" />
                                        <div className="h-3 bg-card-border/20 rounded-full w-full" />
                                        <div className="h-3 bg-card-border/20 rounded-full w-4/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : sortedAnnouncements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-card-border/50 rounded-3xl bg-card/20">
                            <div className="w-16 h-16 mb-6 rounded-full bg-card-border/20 flex items-center justify-center text-2xl">📭</div>
                            <p className="text-xs uppercase tracking-[0.4em] text-text-sub/60 font-semibold">Registry is empty</p>
                            {isAuthorized && (
                                <p className="text-[10px] uppercase tracking-widest text-text-sub/30 mt-3">Draft your first entry above</p>
                            )}
                        </div>
                    ) : (
                        <div className={`grid gap-8 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                            {sortedAnnouncements.map((item, index) => (
                                <article
                                    key={item._id}
                                    onClick={() => setViewingPost(item)}
                                    className={`group relative cursor-pointer bg-card/40 backdrop-blur-sm border border-card-border rounded-3xl overflow-hidden hover:shadow-2xl hover:border-accent/30 transition-all duration-500 ease-out hover:-translate-y-1 ${layout === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Image */}
                                    {item.imageUrl && (
                                        <div className={`relative overflow-hidden flex-shrink-0 ${layout === 'list' ? 'w-full md:w-1/3 min-h-[240px]' : 'w-full h-60'}`}>
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className={`absolute inset-0 w-full h-full object-cover ${getPositionClass(item.imagePosition)} grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out`}
                                                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="relative p-8 flex flex-col flex-grow">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                <span className="inline-flex items-center text-[9px] uppercase tracking-[0.3em] text-text-sub/60 font-mono">
                                                    {formatDate(item.createdAt)}
                                                </span>
                                                {item.shop && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-card-border" />
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-card-border bg-background/50 text-[9px] uppercase tracking-widest text-text-sub font-bold">
                                                            {item.shop.picture && (
                                                                <img src={item.shop.picture} alt="" className="w-3.5 h-3.5 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                            )}
                                                            {item.shop.name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-serif font-medium text-text-main group-hover:text-accent transition-colors duration-300 leading-tight mb-4">
                                                {item.title}
                                            </h2>
                                            <p className="text-text-sub text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 font-light">
                                                {item.content}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-card-border/50 flex items-center justify-between">
                                            <span className="text-[9px] uppercase tracking-[0.4em] text-text-sub/40 font-mono">
                                                REF: {item._id.slice(-6)}
                                            </span>
                                            
                                            {isAuthorized ? (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                                                        className="text-[9px] uppercase tracking-widest text-gold hover:bg-gold/10 px-3 py-1.5 rounded-md transition-all font-bold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item._id); }}
                                                        className="text-[9px] uppercase tracking-widest text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-all font-bold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                                    Read Full <span className="text-lg leading-none">→</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete confirm overlay */}
                                    {deleteConfirmId === item._id && (
                                        <div onClick={(e) => e.stopPropagation()} className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-5 z-20">
                                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-xl border border-red-500/20">🗑️</div>
                                            <div className="text-center">
                                                <p className="text-lg text-text-main font-serif mb-1">Erase this record?</p>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub/60">This action is irreversible</p>
                                            </div>
                                            <div className="flex gap-3 mt-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                                    className="px-6 py-3 bg-red-500 text-white text-[10px] uppercase tracking-[0.3em] rounded-full font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all"
                                                >
                                                    Confirm Delete
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                                    className="px-6 py-3 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.3em] rounded-full hover:text-text-main hover:bg-card-border/30 transition-all"
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

            {/* FULL PAGE MODAL */}
            {viewingPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-background/60 transition-opacity">
                    <div
                        className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl shadow-black/50 border border-card-border relative animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setViewingPost(null)}
                            className="absolute top-6 right-6 bg-background/80 hover:bg-background hover:scale-110 border border-card-border text-text-main w-10 h-10 flex items-center justify-center rounded-full transition-all z-20 backdrop-blur-md shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Image */}
                        {viewingPost.imageUrl && (
                            <div className="w-full h-80 sm:h-[450px] bg-background relative">
                                <img
                                    src={viewingPost.imageUrl}
                                    alt={viewingPost.title}
                                    className={`w-full h-full object-cover ${getPositionClass(viewingPost.imagePosition)}`}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent h-full w-full pointer-events-none opacity-90"></div>
                            </div>
                        )}

                        <div className={`px-8 md:px-16 pb-16 relative z-10 ${viewingPost.imageUrl ? '-mt-32' : 'pt-16'}`}>
                            <div className="mb-10 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-6 flex-wrap">
                                    <p className="text-[10px] text-accent uppercase tracking-[0.4em] font-bold">
                                        Record • {viewingPost._id.slice(-6)}
                                    </p>
                                    {viewingPost.shop && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-card-border hidden md:block" />
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-card-border bg-background/50 text-[10px] uppercase tracking-widest text-text-sub font-bold">
                                                {viewingPost.shop.picture && (
                                                    <img src={viewingPost.shop.picture} alt="" className="w-4 h-4 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                )}
                                                {viewingPost.shop.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                <h2 className="text-4xl md:text-6xl font-serif font-medium text-text-main mb-6 leading-[1.1]">
                                    {viewingPost.title}
                                </h2>
                                <p className="text-[10px] text-text-sub/60 font-mono uppercase tracking-[0.3em] border-b border-card-border/50 pb-8 inline-block md:block">
                                    Published on {formatDate(viewingPost.createdAt)}
                                </p>
                            </div>
                            
                            <div className="max-w-none">
                                <p className="text-text-main whitespace-pre-wrap leading-[2] text-lg font-light">
                                    {viewingPost.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}