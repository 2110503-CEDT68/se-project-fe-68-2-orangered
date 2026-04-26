"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
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

    const isAuthorized = session?.user?.role === 'admin' || session?.user?.role === 'shopowner';
    const isShopOwner = session?.user?.role === 'shopowner';
    const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/announcements`;
    const SHOPS_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/shops`;

    const fetchAnnouncements = async () => {
        if (!session?.user?.token) return;
        try {
            setLoading(true);
            const res = await fetch(API_BASE_URL, {
                headers: { Authorization: `Bearer ${session.user.token}` },
            });
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
        if (session?.user?.token) {
            fetchAnnouncements();
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
                    // ส่ง shop ไปด้วยถ้าเป็น shopowner และเลือกร้าน
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
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
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

            <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">

                {/* Create / Edit Form */}
                {isAuthorized && (
                    <div className="mb-14">
                        <form
                            onSubmit={handleSubmit}
                            className="relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-accent/20"
                        >
                            {/* Top accent bar */}
                            <div className={`h-[3px] w-full bg-gradient-to-r ${editingId ? 'from-gold/60 via-gold/30 to-transparent' : 'from-accent/60 via-accent/30 to-transparent'}`} />

                            <div className="p-8">
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
                                    {/* Shop Selector (shopowner only with multiple shops) */}
                                    {isShopOwner && shops.length > 1 && !editingId && (
                                        <div className="group">
                                            <label className="block text-[9px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2">
                                                Target Shop *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedShopId}
                                                    onChange={(e) => setSelectedShopId(e.target.value)}
                                                    className="w-full appearance-none bg-background/40 border border-card-border rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:border-accent/60 transition-all pr-10"
                                                    required
                                                >
                                                    {shops.map(shop => (
                                                        <option key={shop._id} value={shop._id}>
                                                            {shop.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-sub/50">
                                                    ▾
                                                </div>
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
                                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${editingId
                                            ? 'bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30'
                                            : 'bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white'
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
                                    className="group relative bg-card/50 border border-card-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-accent/20 transition-all duration-500"
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
                                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                                        </div>
                                    )}

                                    <div className="relative p-8">
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
                                                <h2 className="text-xl font-serif font-semibold text-text-main group-hover:text-accent transition-colors duration-300 leading-snug">
                                                    {item.title}
                                                </h2>
                                            </div>

                                            {/* Action buttons */}
                                            {isAuthorized && (
                                                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="text-[9px] uppercase tracking-widest bg-gold/10 text-gold hover:bg-gold/25 px-4 py-2 rounded-lg border border-gold/20 transition-all font-bold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(item._id)}
                                                        className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20 transition-all font-bold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <p className="text-text-sub text-sm leading-relaxed whitespace-pre-wrap">
                                            {item.content}
                                        </p>

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
                                            <div className="text-3xl">🗑️</div>
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
