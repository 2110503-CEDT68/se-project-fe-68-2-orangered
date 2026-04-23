"use client";

import { useEffect, useState } from "react";

interface Announcement {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export default function ShopAnnouncement({ shopId }: { shopId: string }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/announcements/shop/${shopId}`);
                const result = await res.json();
                if (result.success && result.data && result.data.length > 0) {
                    setAnnouncements(result.data);
                    setIsOpen(true); // Open automatically on load if there are announcements
                }
            } catch (err) {
                console.error("Failed to fetch announcements", err);
            }
        };
        fetchAnnouncements();
    }, [shopId]);

    if (announcements.length === 0) return null;

    return (
        <>
            {/* Button to reopen popup */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed top-24 right-8 z-40 bg-accent/90 hover:bg-accent text-white px-4 py-2 rounded-full shadow-lg shadow-accent/20 text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2"
            >
                <span>🔔</span> Announcements ({announcements.length})
            </button>

            {/* Popup Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-card-border shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <div className="sticky top-0 bg-card/90 backdrop-blur-md p-4 border-b border-card-border flex justify-between items-center z-10">
                            <h2 className="text-xl font-serif text-accent uppercase tracking-widest">Shop Announcements</h2>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-text-sub hover:text-red-500 transition-colors text-2xl px-2"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {announcements.map((ann) => (
                                <div key={ann._id} className="border border-card-border rounded-xl p-6 bg-background/50">
                                    {ann.imageUrl && (
                                        <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden">
                                            <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-text-main mb-2">{ann.title}</h3>
                                    <p className="text-sm text-text-sub whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                                    <p className="text-[10px] text-text-sub/50 mt-4 uppercase tracking-widest">
                                        {new Date(ann.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
