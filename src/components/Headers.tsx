import React, { useState } from 'react';
import { ChevronLeft, Menu, X } from 'lucide-react';

type HeaderProps = {
    isLP: boolean;
    isGaleri: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (v: boolean) => void;
    isScrolled: boolean;
};

export const HeaderWakaf: React.FC<HeaderProps> = ({ isLP, isGaleri, isMenuOpen, setIsMenuOpen, isScrolled }) => {
    return (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-white'} `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className="flex items-center gap-2" aria-label="Kembali ke Beranda">
                        <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-10 md:h-12 lg:h-14 w-auto" />
                        <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-10 md:h-12 lg:h-14 w-auto" />
                    </a>
                    <nav className="hidden md:flex items-center gap-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className={`px-3 py-2 rounded-full font-medium ${isLP ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Beranda</a>
                        <a href="#/galeri-wakaf" onClick={(e) => { e.preventDefault(); window.location.hash = '#/galeri-wakaf'; }} className={`px-3 py-2 rounded-full font-medium ${isGaleri ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Galeri Penyaluran</a>
                    </nav>
                    <button className="md:hidden text-gray-700" aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
                        <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#'; setIsMenuOpen(false); }} className={`px-3 py-2 rounded-lg ${isLP ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-emerald-50'}`}>Beranda</a>
                        <a href="#/galeri-wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/galeri-wakaf'; setIsMenuOpen(false); }} className={`px-3 py-2 rounded-lg ${isGaleri ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-emerald-50'}`}>Galeri Penyaluran</a>
                    </div>
                </div>
            )}
        </header>
    );
};

export const HeaderGaleri: React.FC<HeaderProps> = ({ isLP, isMenuOpen, setIsMenuOpen, isScrolled }) => {
    return (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-white'} `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#/wakaf'; }} aria-label="Kembali" className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800">
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-semibold hidden sm:inline">Kembali</span>
                        </button>
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className="flex items-center gap-3" aria-label="Beranda">
                            <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-12 md:h-14 lg:h-16 w-auto" />
                            <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-12 md:h-14 lg:h-16 w-auto ml-1" />
                        </a>
                    </div>
                    <nav className="hidden md:flex items-center gap-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className={`px-3 py-2 rounded-full font-medium ${isLP ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Beranda</a>
                        <a href="#/wakaf" onClick={(e) => { e.preventDefault(); window.location.hash = '#/wakaf'; }} className="px-3 py-2 rounded-full font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50">Wakaf</a>
                    </nav>
                    <button className="md:hidden" aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
                        <a href="#/wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/wakaf'; setIsMenuOpen(false); }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Wakaf</a>
                        <a href="#" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#'; setIsMenuOpen(false); }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Beranda</a>
                    </div>
                </div>
            )}
        </header>
    );
};
