import React from 'react';
import { X } from 'lucide-react';

type StickyBottomCTAProps = {
    show: boolean;
    onClose: () => void;
    onBuy: () => void;
};

const StickyBottomCTA: React.FC<StickyBottomCTAProps> = ({ show, onClose, onBuy }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 z-50">
            <div className="bg-emerald-600 text-white rounded-full shadow-xl px-4 py-3 md:py-3.5 flex items-center justify-between gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="text-xs md:text-sm font-semibold opacity-90">Al-Qur'an Kharisma</span>
                    <span className="text-sm md:text-base font-bold">Rp 297.000</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                        type="button"
                        onClick={onBuy}
                        className="inline-flex items-center justify-center px-4 py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold bg-white text-emerald-700 hover:bg-emerald-50 active:scale-[0.99] transition-transform min-w-[120px]"
                    >
                        Beli Sekarang
                    </button>
                    <button onClick={onClose} aria-label="Tutup" className="bg-white/15 hover:bg-white/25 rounded-full p-2 transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyBottomCTA;
