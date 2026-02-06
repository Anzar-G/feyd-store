import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Star, Award, MessageCircle, BookOpen, Clock, User, Check, ArrowRight, ShoppingCart, Loader, X, Menu, Users, GraduationCap, Briefcase, Phone, ShoppingBag, Shield, Truck, ChevronLeft } from 'lucide-react';
import Reveal from '../components/Reveal';
import RatingStars from '../components/RatingStars';
import ResponsiveImage from '../components/ResponsiveImage';
import QuranPricingSection from '../components/QuranPricingSection';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { TESTIMONIALS } from '../data/testimonials';
import { useCart } from '../hooks/useCart';
import { PRODUCT_PRICING } from '../data/constants';

// Feature type definition
type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const LandingPage: React.FC = () => {
    const { totalQty } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const features: Feature[] = [
        {
            icon: <MessageCircle className="w-8 h-8 text-emerald-600" aria-hidden />,
            title: 'Tajwid berwarna',
            description: 'Setiap warna mewakili hukum tajwid berbeda untuk memudahkan pelafalan yang tepat.',
        },
        {
            icon: <BookOpen className="w-8 h-8 text-emerald-600" aria-hidden />,
            title: 'Terjemah 15 Baris',
            description: 'Terjemah yang tepat membantu memahami makna tanpa kehilangan konteks.',
        },
        {
            icon: <Award className="w-8 h-8 text-emerald-600" aria-hidden />,
            title: 'Standar Kemenag RI',
            description: 'Rasm Utsmani sesuai standar Kemenag RI, akurat dan terpercaya.',
        },
        {
            icon: <Shield className="w-8 h-8 text-emerald-600" aria-hidden />,
            title: 'Kertas Premium HVS',
            description: 'Tidak mudah tembus, nyaman di mata, dan tahan lama untuk penggunaan harian.',
        },
        {
            icon: <Shield className="w-8 h-8 text-emerald-600" aria-hidden />, // Same icon as premium paper in original? Yes, Shield.
            title: 'Cover Hardcover Eksklusif',
            description: 'Desain elegan dengan kualitas cover yang kuat dan berkelas.',
        },
        {
            icon: <Truck className="w-8 h-8 text-emerald-600" aria-hidden />,
            title: 'Pengiriman Aman',
            description: 'Dikemas rapi dengan perlindungan maksimal hingga sampai di tangan Anda.',
        },
    ];

    // Countdown logic
    useEffect(() => {
        const target = new Date('2025-11-30T23:59:59');
        const tick = () => {
            const now = new Date();
            const diff = Math.max(0, target.getTime() - now.getTime());
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setCountdown({ days: d, hours: h, minutes: m, seconds: s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const promoActive = (countdown.days + countdown.hours + countdown.minutes + countdown.seconds) > 0;

    // Smooth Nav
    const handleSmoothNav = (href: string) => {
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    // Testimonial Pagination
    const pageSize = 4;
    const totalPages = Math.ceil(TESTIMONIALS.length / pageSize) || 1;
    const visibleTestimonials = useMemo(() => {
        const start = currentPage * pageSize;
        return TESTIMONIALS.slice(start, start + pageSize);
    }, [currentPage]);

    const nextTestimonial = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
    const prevTestimonial = () => setCurrentPage((p) => Math.max(p - 1, 0));

    // Helper for role icon (reused from App.tsx)
    const getRoleIcon = (role: string | undefined) => {
        const r = (role || '').toLowerCase();
        if (/(santri|santriwati)/.test(r)) return <Users className="w-6 h-6 text-emerald-700" />;
        if (/(ustaz|ustadz|ustazah|pengajar|guru)/.test(r)) return <BookOpen className="w-6 h-6 text-emerald-700" />;
        if (/(mahasiswa|tahfidz)/.test(r)) return <GraduationCap className="w-6 h-6 text-emerald-700" />;
        if (/(orang tua|ayah|ibu|orangtua)/.test(r)) return <User className="w-6 h-6 text-emerald-700" />;
        if (/(usia|tahun|anak)/.test(r)) return <User className="w-6 h-6 text-emerald-700" />;
        if (/(freelancer|content creator|pengusaha|usaha)/.test(r)) return <Briefcase className="w-6 h-6 text-emerald-700" />;
        if (/(pesantren|kyai|kyai|pengasuh)/.test(r)) return <BookOpen className="w-6 h-6 text-emerald-700" />;
        return null;
    };

    const navItems = [
        { name: 'Masalah', href: '#masalah' },
        { name: 'Solusi', href: '#solusi' },
        { name: 'Fitur', href: '#fitur' },
        { name: 'Testimoni', href: '#testimoni' },
        { name: 'Harga', href: '#harga' },
    ];

    // Active Section Spy
    const [activeSection, setActiveSection] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        const ids = ['masalah', 'solusi', 'fitur', 'testimoni', 'harga'];
        const els = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);
        if (els.length === 0) return;
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            let topMost: IntersectionObserverEntry | null = null;
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!topMost || entry.intersectionRatio > topMost.intersectionRatio) {
                        topMost = entry;
                    }
                }
            }
            if (topMost && topMost.target instanceof HTMLElement) {
                setActiveSection(`#${topMost.target.id}`);
            }
        }, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Header Component
    const HeaderLP = (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-transparent'} `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2 mr-auto shrink-0" aria-label="Beranda Al-Qur'an Kharisma">
                        <img src="/logo.png" alt="Al-Qur'an Kharisma" className="h-10 md:h-12 lg:h-14 w-auto" />
                        <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-10 md:h-12 lg:h-14 w-auto" />
                    </a>
                    <nav className="hidden md:flex items-center gap-2">
                        <button type="button" onClick={() => handleSmoothNav('#koleksi')} className="inline-flex items-center font-medium px-3 py-1 rounded-full text-emerald-700 hover:bg-emerald-50">Produk</button>
                        <button type="button" onClick={() => { window.location.hash = '#/keranjang'; }} className="relative inline-flex items-center px-3 py-1 rounded-full text-emerald-700 hover:bg-emerald-50" aria-label="Keranjang">
                            <ShoppingCart className="w-5 h-5" />
                            {totalQty > 0 && (<span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{totalQty}</span>)}
                        </button>
                        <a href="#harga" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#harga'); }} className="btn-primary !py-2 whitespace-nowrap">Pesan Sekarang</a>
                        <a href="#/wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/wakaf'; }} className="inline-flex items-center font-medium px-3 py-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 whitespace-nowrap">Wakaf</a>
                    </nav>
                    <div className="md:hidden flex items-center gap-2">
                        <button type="button" onClick={() => { window.location.hash = '#/keranjang'; }} className="relative inline-flex items-center p-2 rounded-full text-emerald-700 hover:bg-emerald-50" aria-label="Keranjang">
                            <ShoppingCart className="w-6 h-6" />
                            {totalQty > 0 && (<span className="absolute -top-0.5 -right-0.5 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{totalQty}</span>)}
                        </button>
                        <button className="text-gray-700" aria-label="Toggle menu" onClick={() => setIsMenuOpen((v) => !v)}>{isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}</button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.href;
                            return (
                                <button key={item.name} className={`text-left py-2 ${isActive ? 'bg-emerald-100 text-emerald-800 px-3 rounded-lg' : 'text-gray-700 hover:text-emerald-600'}`} onClick={() => handleSmoothNav(item.href)}>{item.name}</button>
                            );
                        })}
                        <a href="#harga" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#harga'); setIsMenuOpen(false); }} className="btn-primary text-center">Pesan Sekarang</a>
                        <button type="button" onClick={() => { window.location.hash = '#/keranjang'; setIsMenuOpen(false); }} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-emerald-700 hover:bg-emerald-50">
                            <ShoppingCart className="w-5 h-5" /> Keranjang
                            {totalQty > 0 && (<span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] rounded-full bg-[#4CAF50] text-white px-1">{totalQty}</span>)}
                        </button>
                        <a href="#/wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/wakaf'; setIsMenuOpen(false); }} className="text-center inline-flex items-center justify-center font-semibold px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm ring-1 ring-emerald-800/20">Wakaf</a>
                    </div>
                </div>
            )}
        </header>
    );

    const { add } = useCart();

    // Add to cart helper (to interact with useCart and Analytics)
    const handleAddToCart = (payload: { slug: string; title: string; cover: string; qty: number }) => {
        add(payload);

        // Analytics
        const priceStr = PRODUCT_PRICING[payload.title]?.price || 'Rp 0';
        const priceNum = Number((priceStr.match(/\d+/g) || []).join('') || 0);

        const g = (window as any).gtag;
        if (typeof g === 'function') {
            g('event', 'add_to_cart', {
                currency: 'IDR',
                value: priceNum * payload.qty,
                items: [{ item_id: payload.slug, item_name: payload.title, price: priceNum, quantity: payload.qty }],
            });
        }
        const fb = (window as any).fbq;
        if (typeof fb === 'function') {
            fb('track', 'AddToCart', {
                content_ids: [payload.slug],
                contents: [{ id: payload.slug, quantity: payload.qty, item_price: priceNum }],
                content_type: 'product',
                currency: 'IDR',
                value: priceNum * payload.qty,
            });
        }

        // Show Toast (Using DOM manipulation as in original App.tsx or use a context? keeping it simple for now or replicating the toast logic). 
        // Toast logic was in App.tsx handleAddToCart. Since we are in LandingPage, we might not have the global Toast logic if it was in App.tsx.
        // Wait, the Toast logic was inside handleAddToCart in App.tsx. I can just copy it here.
        // BUT, if I put it here, it duplicates code. 
        // Ideally, Toast should be a Context/Hook. 
        // For now I'll just copy it to ensure functionality.
        try {
            const id = 'cart-toast';
            let el = document.getElementById(id) as HTMLDivElement | null;
            const isMobile = window.innerWidth < 640;
            if (!el) {
                el = document.createElement('div');
                el.id = id;
                el.setAttribute('role', 'status');
                el.setAttribute('aria-live', 'polite');
                Object.assign(el.style, {
                    position: 'fixed', left: '50%', transform: 'translate(-50%, 10px)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)',
                    zIndex: '9999', opacity: '0', transition: 'opacity 180ms ease, transform 180ms ease'
                });
                document.body.appendChild(el);
                requestAnimationFrame(() => { el!.style.opacity = '1'; el!.style.transform = 'translate(-50%, 0)'; });
            }
            // ... styling and content logic ...
            // Simplified for brevity, reusing the existing logic.
            // Since this is getting long, I'll trust the original logic was copied if I copy-paste.
            el.innerHTML = '';
            el.style.maxWidth = isMobile ? '92vw' : '640px';
            el.style.pointerEvents = 'auto';
            el.style.borderRadius = isMobile ? '9999px' : '14px';
            el.style.boxShadow = isMobile ? '0 8px 18px rgba(0,0,0,0.25)' : '0 12px 30px rgba(0,0,0,0.25)';
            el.style.background = isMobile ? '#4A6741' : 'rgba(20,20,20,0.92)';
            el.style.border = isMobile ? '0' : '1px solid rgba(255,255,255,0.12)';
            el.style.color = '#fff';
            (el.style as any).backdropFilter = isMobile ? '' : 'saturate(120%) blur(6px)';

            const text = `${payload.qty}× “${payload.title}” ditambahkan ke keranjang`;

            if (isMobile) {
                const span = document.createElement('span');
                span.textContent = text;
                Object.assign(span.style, { display: 'block', padding: '10px 16px', fontWeight: '700', fontSize: '14px', textAlign: 'center', lineHeight: '1.3' });
                el.appendChild(span);
            } else {
                const wrap = document.createElement('div');
                Object.assign(wrap.style, { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 14px' });
                const span = document.createElement('span');
                span.textContent = text;
                Object.assign(span.style, { display: 'inline-block', fontWeight: '600', fontSize: '14px' });
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.textContent = 'Lihat Keranjang';
                Object.assign(btn.style, { background: '#4A6741', color: '#fff', border: '0', borderRadius: '9999px', padding: '8px 12px', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(74,103,65,0.35)', cursor: 'pointer' });
                btn.onclick = () => { window.location.hash = '#/keranjang'; el?.remove(); };
                wrap.appendChild(span);
                wrap.appendChild(btn);
                el.appendChild(wrap);
            }
            if (navigator.vibrate) try { navigator.vibrate(15); } catch { }

            clearTimeout((window as any).__cartToastTimer);
            (window as any).__cartToastTimer = window.setTimeout(() => {
                if (el) { el.style.opacity = '0'; el.style.transform = 'translate(-50%, 10px)'; setTimeout(() => el?.remove(), 180); }
            }, 2200);
        } catch { }
    };

    return (
        <div className="bg-[#FDFBF8]">
            <SEO
                title="Al-Qur'an Kharisma & Novel Islami Terbaik"
                description="Beli Al-Qur'an Kharisma dengan tajwid warna dan terjemahan per kata. Novel Islami inspiratif seperti Melawan Kemustahilan & Titik Balik. Pengiriman cepat & aman ke seluruh Indonesia."
                keywords="Al-Qur'an Kharisma, Novel Islami, Al-Qur'an tajwid warna, Jual Al-Qur'an online, Novel Melawan Kemustahilan, Novel Titik Balik"
                url="https://feyd-store.vercel.app"
            />
            {HeaderLP}
            {/* Hero */}
            <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-emerald-50 to-teal-50">
                {/* Logo watermark */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    <img src="/logo.png" alt="" className="hidden md:block absolute -right-20 -top-16 opacity-10 saturate-0 blur-[1px] w-[280px] lg:w-[360px] animate-float-slow" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
                    <Reveal>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-800 tracking-tight">
                                Al-Qur'an Kharisma
                            </h1>
                            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                Baca Al-Qur'an dengan Lebih Mudah dan Benar
                            </h2>
                            <p className="mt-5 text-lg text-gray-600">
                                Al-Qur'an Kharisma hadir dengan tajwid berwarna dan terjemahan yang memandu setiap langkah membaca Anda.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 md:items-center">
                                <a href="#harga" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#harga'); }} className="btn-primary text-lg py-3 flex items-center justify-center transition-transform hover:animate-hover-bounce">
                                    Pesan Sekarang
                                    <ChevronRight className="ml-2" />
                                </a>
                                <a href="#fitur" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#fitur'); }} className="btn-secondary text-lg py-3 text-center transition-transform hover:animate-hover-bounce md:self-center">
                                    Lihat Detail Fitur
                                </a>
                            </div>
                            <div className="mt-8 flex items-center gap-6">
                                <div className="flex -space-x-2" aria-hidden>
                                    {['AF', 'SA', 'RM'].map((t) => (
                                        <div key={t} className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 font-medium">
                                            {t}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-semibold">50.000+ Pembaca</p>
                                    <div className="flex items-center text-emerald-600">
                                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                                        4.9/5.0 (2.500+ ulasan)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={150}>
                        <div className="relative">
                            <div className="bg-white p-2 rounded-xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform">
                                <div className="rounded-lg overflow-hidden bg-gray-100">
                                    <img src="/cover.jpg" alt="Gambar produk Al-Qur'an Kharisma" loading="eager" fetchPriority="high" className="w-full h-auto object-cover aspect-[3/4] animate-float-slow" />
                                </div>
                            </div>
                            <div className="hidden md:block absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                                <div className="flex items-center">
                                    <div className="bg-emerald-100 p-3 rounded-full mr-3" aria-hidden>
                                        <Award className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-emerald-700">Best Seller <span className="text-gray-800">2023 - 2025</span></p>
                                        <p className="text-sm text-gray-600">Terjual 50.000+ • Dipercaya santri se-Indonesia</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Pain points (Masalah) */}
            <section id="masalah" className="py-6 bg-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <MessageCircle className="w-10 h-10 text-emerald-600" aria-hidden />, title: 'Sulit membedakan hukum tajwid', desc: 'Antara ghunnah, qalqalah, dan lainnya sering tertukar saat membaca.' },
                            { icon: <BookOpen className="w-10 h-10 text-emerald-600" aria-hidden />, title: 'Khawatir salah pelafalan', desc: 'Kurang yakin dengan makhraj dan sifat huruf saat tilawah.' },
                            { icon: <Clock className="w-10 h-10 text-emerald-600" aria-hidden />, title: 'Memakan waktu untuk memahami', desc: 'Butuh waktu lama untuk memahami makna ayat demi ayat.' },
                            { icon: <User className="w-10 h-10 text-emerald-600" aria-hidden />, title: 'Tidak yakin bacaan sendiri', desc: 'Tidak ada yang mengoreksi, sehingga ragu saat membaca.' },
                        ].map((item, idx) => (
                            <Reveal key={idx} delay={idx * 70}>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition hover:-translate-y-1">
                                    <div className="mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solusi */}
            <section id="solusi" className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
                    <Reveal>
                        <div>
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mb-4">Solusi Terbaik</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Al-Qur'an Kharisma: Solusi Membaca dengan Benar dan Mudah</h2>
                            <p className="text-lg text-gray-600 mb-6">Sistem tajwid warna memandu bacaan, terjemah per kata memperjelas makna, membuat proses belajar lebih cepat dan tepat.</p>
                            <div className="space-y-3 mb-6">
                                {['Tajwid warna memudahkan identifikasi hukum bacaan', 'Terjemah 15 baris Kemenag RI', 'Panduan tajwid praktis untuk pemula hingga mahir', 'Kualitas cetak premium, nyaman untuk tilawah lama', 'Cover & kertas high quality'].map((t, i) => (
                                    <div className="flex items-start" key={i}>
                                        <Check className="w-5 h-5 text-emerald-200 mr-2 mt-0.5" />
                                        <p className="text-gray-700">{t}</p>
                                    </div>
                                ))}
                            </div>
                            <a href="#fitur" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#fitur'); }} className="btn-primary inline-flex items-center">
                                Pelajari Lebih Lanjut <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </div>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-500">Sebelum</span>
                                <span className="text-sm font-medium text-emerald-600">Sesudah</span>
                            </div>
                            <div className="relative grid grid-cols-2 gap-3">
                                <div className="bg-gray-100 rounded-lg p-3 text-center">
                                    <img src="/before.jpeg" alt="Contoh mushaf tanpa tajwid warna" loading="lazy" className="mx-auto rounded shadow-inner object-cover aspect-[3/4]" />
                                    <p className="mt-2 text-sm text-gray-500">Sulit membedakan hukum tajwid</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                    <img src="/after.jpeg" alt="Contoh mushaf dengan tajwid warna" loading="lazy" className="mx-auto rounded shadow-inner object-cover aspect-[3/4]" />
                                    <p className="mt-2 text-sm text-gray-600">Panduan warna memudahkan pelafalan</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Features */}
            <section id="fitur" className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <h2 className="section-title">Fitur Unggulan</h2>
                        <p className="section-subtitle">Dirancang untuk pengalaman membaca yang nyaman, akurat, dan bermakna.</p>
                    </Reveal>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {features.map((f, i) => (
                            <Reveal key={i} delay={i * 60}>
                                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 hover:shadow-lg transition hover:-translate-y-1">
                                    <div className="bg-emerald-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4" aria-hidden>
                                        {f.icon}
                                    </div>
                                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">{f.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-600">{f.description}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimoni" className="section-padding bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 [overflow-anchor:none]">
                    <Reveal>
                        <h2 className="section-title">Apa Kata Mereka yang Sudah Merasakan Manfaatnya</h2>
                        <p className="section-subtitle">Testimoni realistis dari berbagai kalangan pembaca.</p>
                    </Reveal>
                    <div className="relative">
                        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                            {visibleTestimonials.map((t, idx) => (
                                <Reveal key={t.id} delay={idx * 80}>
                                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                                        <div className="flex items-center mb-3 md:mb-4">
                                            {t.avatarUrl ? (
                                                <img src={t.avatarUrl} alt={`Foto ${t.name}`} loading="lazy" className="w-12 h-12 rounded-full object-cover mr-3" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-3" aria-hidden>{getRoleIcon(t.role) ?? <span className="text-emerald-700 font-semibold">{t.avatar}</span>}</div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm md:text-base">{t.name}</p>
                                                <p className="text-xs md:text-sm text-gray-500">{t.role}</p>
                                            </div>
                                        </div>
                                        <RatingStars value={t.rating} />
                                        <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 flex-1">“{t.content.length > 220 ? `${t.content.slice(0, 217)}...` : t.content}”</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                        {/* Mobile swipeable */}
                        <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-2">
                            <div className="flex gap-3 snap-x snap-mandatory">
                                {visibleTestimonials.map((t, idx) => (
                                    <Reveal key={t.id} delay={idx * 80}>
                                        <div className="min-w-[260px] max-w-[280px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 snap-start flex flex-col">
                                            <div className="flex items-center mb-3">
                                                {t.avatarUrl ? (
                                                    <img src={t.avatarUrl} alt={`Foto ${t.name}`} loading="lazy" className="w-12 h-12 rounded-full object-cover mr-3" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-3" aria-hidden>{getRoleIcon(t.role) ?? <span className="text-emerald-700 font-semibold">{t.avatar}</span>}</div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                                    <p className="text-[11px] text-gray-500">{t.role}</p>
                                                </div>
                                            </div>
                                            <RatingStars value={t.rating} />
                                            <p className="mt-2 text-xs text-gray-700 flex-1">“{t.content.length > 220 ? `${t.content.slice(0, 217)}...` : t.content}”</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                        {/* Pagination Desktop */}
                        <div className="hidden md:flex justify-center items-center gap-3 md:gap-4 mt-4 md:mt-3">
                            <button type="button" onClick={prevTestimonial} disabled={currentPage === 0} className={`w-11 h-11 md:w-12 md:h-12 rounded-full border shadow-sm flex items-center justify-center transition ${currentPage === 0 ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`} aria-label="Sebelumnya"><ChevronLeft className="w-5 h-5" /></button>
                            <button type="button" onClick={nextTestimonial} disabled={currentPage === totalPages - 1} className={`w-11 h-11 md:w-12 md:h-12 rounded-full border shadow-sm flex items-center justify-center transition ${currentPage === totalPages - 1 ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`} aria-label="Berikutnya"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL & Harga */}
            <section id="harga" className="section-padding bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="flex items-center justify-center mb-3" aria-hidden>
                            <img src="/logo.png" alt="" className="h-8 w-auto opacity-80" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-center">Mulai Perjalanan Membaca Al-Qur'an dengan Lebih Baik</h2>
                        <div className="mt-2 flex items-center justify-center text-sm md:text-base">
                            {promoActive ? (
                                <div className="bg-white/15 text-white px-3 py-1 rounded-full flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Promo berakhir dalam: {countdown.days}h {countdown.hours}j {countdown.minutes}m {countdown.seconds}d</span>
                                </div>
                            ) : (
                                <div className="bg-white/15 text-white px-3 py-1 rounded-full">Promo telah berakhir</div>
                            )}
                        </div>
                        <p className="mt-3 text-center text-lg opacity-90">Dapatkan Al-Qur'an Kharisma hari ini dan rasakan perbedaannya.</p>
                        <p className="mt-1 text-center text-sm opacity-90">
                            Ingin berkontribusi? {' '}
                            <a href="#/wakaf" onClick={(e) => { e.preventDefault(); window.location.hash = '#/wakaf'; }} className="text-white font-semibold text-base underline decoration-2 underline-offset-4 inline-flex items-center gap-1 px-1 rounded hover:bg-white/15">
                                Wakaf Al-Qur’an Kharisma <ChevronRight className="w-4 h-4" />
                            </a>
                        </p>
                    </Reveal>

                    <Reveal delay={120}>
                        <div className="mt-8 max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                            <div className="grid md:grid-cols-3 items-end gap-6">
                                {promoActive ? (
                                    <>
                                        <div className="text-center md:text-left">
                                            <p className="text-sm opacity-80">Harga Normal</p>
                                            <p className="text-2xl font-bold line-through">Rp 350.000</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm opacity-80">Harga Spesial</p>
                                            <p className="text-4xl font-extrabold">Rp 297.000</p>
                                            <span className="mt-1 inline-block bg-gold-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">Hemat Rp 53.000</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold mb-2">Bonus Paket Belajar Mengaji</p>
                                            <p className="text-sm">WA Grup, bimbingan 1 bulan, dan materi pendukung mengaji.</p>
                                            <button type="button" onClick={() => { const el = document.getElementById('bonus-detail'); if (el) { const y = window.scrollY + el.getBoundingClientRect().top - 120; window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' }); } }} className="text-sm md:text-base text-emerald-50 mt-2 font-semibold inline-flex items-center gap-1.5 underline decoration-emerald-50/60 decoration-2 underline-offset-4">
                                                <ChevronRight className="w-3 h-3 rotate-90" />
                                                <span>Detail bonus lengkap ada di bagian bawah halaman.</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center md:text-left col-span-3">
                                        <p className="text-sm opacity-80">Harga Normal</p>
                                        <p className="text-4xl font-extrabold">Rp 350.000</p>
                                        <p className="text-xs text-emerald-100 mt-2">Promo saat ini tidak aktif</p>
                                    </div>
                                )}
                            </div>
                            {/* Primary buttons */}
                            <div className="mt-6 grid sm:grid-cols-3 gap-3 items-start">
                                <button type="button" onClick={() => handleAddToCart({ slug: 'quran-kharisma', title: "Al-Qur’an Kharisma", cover: '/cover.jpg', qty: 1 })} className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-4 px-5 min-h-[52px] rounded-full flex items-center justify-center gap-3 text-base md:text-lg transition-transform hover:animate-hover-bounce self-start" aria-label="Tambah ke Keranjang">
                                    <ShoppingCart className="w-5 h-5" /> Tambah ke Keranjang
                                </button>
                                {promoActive ? (
                                    <button type="button" onClick={() => { window.location.hash = '#/pesan-quran'; }} className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-4 px-5 min-h-[52px] rounded-full flex items-center justify-center gap-3 text-base md:text-lg transition-transform hover:animate-hover-bounce self-start" aria-label="Isi Form & Pesan via WhatsApp">
                                        <Phone className="w-5 h-5" /> Isi Form & Pesan via WhatsApp
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => { window.location.hash = '#/pilih-admin'; }} className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-4 px-5 min-h-[52px] rounded-full flex items-center justify-center gap-3 text-base md:text-lg transition-transform hover:animate-hover-bounce">
                                        <Phone className="w-5 h-5" /> Daftar Tunggu Promo Berikutnya
                                    </button>
                                )}
                                {promoActive ? (
                                    <div className="relative group self-start w-full">
                                        <a href="#" onClick={(e) => e.preventDefault()} className="w-full bg-emerald-50 text-emerald-900 font-semibold py-4 px-5 min-h-[52px] rounded-full flex items-center justify-center gap-3 text-base md:text-lg opacity-60 cursor-not-allowed">
                                            <ShoppingBag className="w-5 h-5" /> Segera Hadir
                                        </a>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => { window.location.hash = '#/pesan-quran'; }} className="w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-3 px-4 min-h-[48px] rounded-full sm:rounded-xl flex items-center justify-center gap-2 transition-transform hover:animate-hover-bounce self-start">
                                        <Phone className="w-5 h-5" /> Pesan Sekarang
                                    </button>
                                )}
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3 text-emerald-100 text-sm">
                                <div className="flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> Garansi uang kembali</div>
                                <div className="flex items-center justify-center gap-2"><Truck className="w-4 h-4" /> Pengiriman aman</div>
                                <div className="flex items-center justify-center gap-2"><Award className="w-4 h-4" /> Kualitas terbaik</div>
                            </div>
                        </div>
                    </Reveal>
                    <div id="bonus-detail" className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <QuranPricingSection />
                    </div>
                </div>
            </section>

            {/* Koleksi Inspiratif */}
            <section id="koleksi" className="section-padding bg-[#FDFBF8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <h2 className="section-title">Temukan Koleksi Inspiratif Kami</h2>
                        <p className="section-subtitle">Selain Al-Qur’an Kharisma, kami juga menyajikan novel-novel penuh makna yang menyentuh jiwa.</p>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6">
                        {[
                            { title: 'Melawan Kemustahilan', tagline: 'Menguji Keimanan, Menjemput Keajaiban', cover: '/images/melawan-kemustahilan.jpg', href: '#/produk/melawan-kemustahilan' },
                            { title: 'Sebelum Aku Tiada', tagline: 'Surat-Surat dari Gaza', cover: '/images/sebelum-aku-tiada.jpg', href: '#/produk/sebelum-aku-tiada' },
                            { title: 'Titik Balik', tagline: 'Ada 365 Hari Dalam Setahun...', cover: '/images/titik-balik.jpg', href: '#/produk/titik-balik' }
                        ].map((p) => (
                            <Reveal key={p.title}>
                                <a href={p.href} onClick={(e) => { e.preventDefault(); window.location.hash = p.href; }} className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 overflow-hidden">
                                    <div className="aspect-[4/3] bg-gray-100">
                                        <img src={p.cover} alt={`Sampul ${p.title}`} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                                            <span className="text-xs font-bold uppercase bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">Ready Stock</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">{p.tagline}</p>
                                        <div className="mt-3 inline-flex items-center gap-1 text-emerald-700 font-semibold">Lihat Detail <ChevronRight className="w-4 h-4" /></div>
                                    </div>
                                </a>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
