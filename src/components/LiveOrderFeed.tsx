import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { LIVE_DATA } from '../data/liveData';

type LiveOrderFeedProps = {
    route: string;
    productName?: string;
};

const LiveOrderFeed: React.FC<LiveOrderFeedProps> = ({ route, productName }) => {
    const [liveOpen, setLiveOpen] = useState(false);
    const [liveIdx, setLiveIdx] = useState(0);

    const livePool = useMemo(() => {
        const slug = route.startsWith('#/produk/') ? route.replace('#/produk/', '') : '';
        const isWakaf = route.startsWith('#/wakaf');
        const isPesanQuranRoute = route.includes('pesan-quran');
        const keywords: string[] = [];
        if (isWakaf) keywords.push('wakaf', 'Al-Qur’an Kharisma');
        if (productName) keywords.push(productName);
        if (slug.includes('quran') || isPesanQuranRoute) keywords.push('Al-Qur’an Kharisma');
        if (slug.includes('melawan-kemustahilan')) keywords.push('Melawan Kemustahilan');
        if (slug.includes('sebelum-aku-tiada')) keywords.push('Sebelum Aku Tiada');
        if (slug.includes('titik-balik')) keywords.push('Titik Balik');

        const filtered = LIVE_DATA.filter(item => keywords.some(k => item.product.toLowerCase().includes(k.toLowerCase())));
        return filtered.length ? filtered : LIVE_DATA;
    }, [route, productName]);

    useEffect(() => {
        // initial delay, then show 5s / hide
        if (!livePool.length) { setLiveOpen(false); return; }

        // Reset when pool changes deeply? 
        // Logic: show random items from pool.

        let timer: number;
        const interval = setInterval(() => {
            // Randomly pick one to show
            const idx = Math.floor(Math.random() * livePool.length);
            setLiveIdx(idx);
            setLiveOpen(true);
            timer = window.setTimeout(() => setLiveOpen(false), 5000);
        }, 15000 + Math.random() * 10000); // Show every 15-25 seconds

        // Initial show
        const initialTimer = setTimeout(() => {
            const idx = Math.floor(Math.random() * livePool.length);
            setLiveIdx(idx);
            setLiveOpen(true);
            timer = window.setTimeout(() => setLiveOpen(false), 5000);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimer);
            clearTimeout(timer);
        };
    }, [livePool]);

    return (
        <div className={`fixed right-3 top-20 md:right-6 md:top-20 z-40 transition-all duration-300 ease-out ${liveOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="max-w-[92vw] w-[240px] md:w-[320px] bg-white border border-[#e0e0e0] rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] p-2.5 md:p-3">
                <div className="flex items-start gap-2">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[#E8F5E9] text-[#27ae60] grid place-items-center text-sm md:text-base">🛒</div>
                    <div className="min-w-0">
                        <div className="text-xs md:text-sm font-semibold text-black truncate">{livePool[liveIdx]?.name} dari {livePool[liveIdx]?.city}</div>
                        <div className="text-xs md:text-sm text-black"><span className="font-medium">{livePool[liveIdx]?.action}</span> <span className="font-semibold">{livePool[liveIdx]?.product}</span></div>
                        <div className="text-[10px] md:text-xs text-[#555] mt-0.5">⏱️ {livePool[liveIdx]?.time}</div>
                        <div className="text-[10px] md:text-xs text-[#777] italic mt-1 truncate">“{livePool[liveIdx]?.quote}”</div>
                    </div>
                    <button type="button" onClick={() => setLiveOpen(false)} className="ml-auto text-gray-500 hover:text-gray-800" aria-label="Tutup">
                        <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveOrderFeed;
