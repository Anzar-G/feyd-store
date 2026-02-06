import React, { useEffect, useState } from 'react';
import { ShoppingCart, X, Menu, Star, ChevronLeft } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import ResponsiveImage from '../components/ResponsiveImage';
import SkeletonCard from '../components/SkeletonCard';
import { ADMIN_CONTACTS, PRODUCT_PRICING } from '../data/constants';

type ProductProps = {
    slug: 'melawan-kemustahilan' | 'sebelum-aku-tiada' | 'titik-balik';
    title: string;
    author: string;
    tagline: string;
    cover: string;
    synopsis: string[];
    notes?: string;
    testimonial?: { quote: string; by: string };
    cartCount?: number;
    onAddToCart?: (payload: { slug: string; title: string; cover: string; qty: number }) => void;
};

const ProductPage: React.FC<ProductProps> = ({ slug, title, author, tagline, cover, synopsis, notes, testimonial, cartCount = 0, onAddToCart }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [coverLoaded, setCoverLoaded] = useState(false);

    // derive price number for JSON-LD
    const priceStr = PRODUCT_PRICING[title]?.price || 'Rp 0';
    const priceNum = Number((priceStr.match(/\d+/g) || []).join('') || 0);

    useEffect(() => {
        // GA4 view_item
        const g = (window as any).gtag;
        if (typeof g === 'function') {
            g('event', 'view_item', {
                currency: 'IDR',
                value: priceNum,
                items: [{ item_id: slug, item_name: title, price: priceNum, quantity: 1 }],
            });
        }
        const fb = (window as any).fbq;
        if (typeof fb === 'function') {
            fb('track', 'ViewContent', {
                content_ids: [slug],
                contents: [{ id: slug }],
                content_name: title,
                content_type: 'product',
                currency: 'IDR',
                value: priceNum,
            });
        }
    }, [slug, title, priceNum]);

    return (
        <div className="min-h-screen bg-[#FDFBF8]">
            <SeoHead
                title={`${title} — Al-Qur’an Kharisma`}
                description={tagline}
                image={cover}
                url={typeof window !== 'undefined' ? window.location.href : undefined}
                product={{
                    name: title,
                    description: synopsis?.[0],
                    image: cover,
                    brand: 'Al-Qur’an Kharisma',
                    offers: { price: priceNum, priceCurrency: 'IDR', availability: 'https://schema.org/InStock' },
                }}
            />
            {/* Header Produk (self-contained) */}
            <header className={`fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className="flex items-center gap-3" aria-label="Kembali ke Beranda">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-10 md:h-12 w-auto" />
                                <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-8 md:h-10 w-auto" />
                            </div>
                        </a>
                        <nav className="hidden md:flex items-center gap-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; }} className="px-3 py-2 rounded-full font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50">Beranda</a>
                            <a href={`#/produk/${slug}`} onClick={(e) => { e.preventDefault(); window.location.hash = `#/produk/${slug}`; }} className="px-3 py-2 rounded-full font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50">Produk</a>
                            <a href="#/wakaf" onClick={(e) => { e.preventDefault(); window.location.hash = '#/wakaf'; }} className="px-3 py-2 rounded-full font-semibold bg-emerald-700 text-white hover:bg-emerald-800">Wakaf</a>
                            <button type="button" onClick={() => { window.location.hash = '#/keranjang'; }} className="relative inline-flex items-center px-3 py-2 rounded-full text-gray-700 hover:text-emerald-700 hover:bg-emerald-50" aria-label="Keranjang">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>
                                )}
                            </button>
                        </nav>
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={() => { window.location.hash = '#/keranjang'; }}
                                className="relative inline-flex items-center p-2 rounded-full text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                                aria-label="Keranjang"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>
                                )}
                            </button>
                            <button className="text-gray-700" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
                                {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
                            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#'; setMenuOpen(false); }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Beranda</a>
                            <a href={`#/produk/${slug}`} onClick={(e) => { e.preventDefault(); window.location.hash = `#/produk/${slug}`; setMenuOpen(false); }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Produk</a>
                            <a href="#/wakaf" onClick={(e) => { e.preventDefault(); window.location.hash = '#/wakaf'; setMenuOpen(false); }} className="px-3 py-2 rounded-lg text-white bg-emerald-700">Wakaf</a>
                            <button type="button" onClick={() => { setMenuOpen(false); window.location.hash = '#/keranjang'; }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 text-left">Keranjang</button>
                        </div>
                    </div>
                )}
            </header>
            <main className="pt-24 pb-16">
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="flex justify-center md:justify-end">
                            <div className="relative group bg-white rounded-xl shadow-md overflow-hidden">
                                {!coverLoaded && (
                                    <div className="w-[20rem] md:w-[24rem]">
                                        <SkeletonCard lines={2} />
                                    </div>
                                )}
                                <ResponsiveImage
                                    src={cover}
                                    alt={`Sampul ${title}`}
                                    className="w-64 sm:w-72 md:w-[24rem] h-auto object-cover transform group-hover:scale-[1.01] transition"
                                    loading="eager"
                                    fetchPriority="high"
                                    onLoad={() => setCoverLoaded(true)}
                                />
                                <div className="absolute top-2 right-2 z-10 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow">Ready Stock</div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{title}</h1>
                            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold">4.9/5.0</span>
                                </div>
                                <span className="text-xs text-emerald-800/80">• 2.500+ ulasan pembaca</span>
                            </div>
                            <p className="mt-2 text-[#4A6741] font-semibold italic">{tagline}</p>
                            <p className="mt-4 text-gray-700">Ditulis oleh <span className="font-semibold">{author}</span>, penulis best seller yang karyanya telah menginspirasi ribuan pembaca.</p>

                            <div id="cta-pembelian" className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => onAddToCart?.({ slug, title, cover, qty: 1 })}
                                    className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition"
                                >
                                    Beli Sekarang - {priceStr}
                                </button>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-bold text-gray-900 mb-2">Sinopsis</h3>
                                {synopsis.map((p, i) => (
                                    <p key={i} className="text-gray-700 mb-2">{p}</p>
                                ))}
                                {notes && <p className="text-sm italic text-gray-500 mt-2">{notes}</p>}
                            </div>

                            {testimonial && (
                                <div className="mt-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <p className="italic text-gray-700">"{testimonial.quote}"</p>
                                    <p className="mt-2 text-sm font-semibold text-emerald-700">— {testimonial.by}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductPage;
