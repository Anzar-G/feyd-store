import React, { useEffect, useState } from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
import { useCart as useCartHook } from '../hooks/useCart';
import { ADMIN_CONTACTS, PRODUCT_PRICING, PRICE_MAP_NUMERIC } from '../data/constants';
import { captureFirstUtm, readUtm, normalizeWa, formatRupiah, isOnlineNow } from '../utils/helpers';

const CartPage: React.FC<{ cartCount: number; setCartCount: (n: number) => void }> = ({ cartCount, setCartCount }) => {
    captureFirstUtm();
    const { items, totalQty, setQty, remove: removeItem } = useCartHook();
    const [name, setName] = useState('');
    const [wa, setWa] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

    const inc = (slug: string) => { const q = (items.find(i => i.slug === slug)?.qty || 0) + 1; setQty(slug, q); };
    const dec = (slug: string) => { const q = (items.find(i => i.slug === slug)?.qty || 0) - 1; setQty(slug, q); };
    const remove = (slug: string) => { removeItem(slug); };

    useEffect(() => { setCartCount(totalQty); }, [totalQty, setCartCount]);

    const total = items.reduce((s, it) => s + (PRICE_MAP_NUMERIC[it.title] || 0) * it.qty, 0);

    const buildMessage = () => {
        const utm = readUtm();
        const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
        const bonuses = items
            .map(it => PRODUCT_PRICING[it.title]?.bonus)
            .filter(Boolean) as string[];
        const uniqueBonuses = Array.from(new Set(bonuses));
        const lines = [
            'Assalamu’alaikum, saya ingin memesan:',
            '',
            ...items.map(it => `- ${it.title}: ${it.qty} pcs`),
            '',
            `Estimasi total: ${formatRupiah(total)} (belum termasuk ongkir)`,
            uniqueBonuses.length ? '' : undefined,
            uniqueBonuses.length ? 'Bonus yang didapat:' : undefined,
            ...uniqueBonuses.map(b => `- ${b}`),
            '',
            `Nama: ${name}`,
            `WhatsApp: ${normalizeWa(wa)}`,
            note ? `Catatan: ${note}` : undefined,
            utmStr || undefined,
            '',
            'Terima kasih.'
        ].filter(Boolean).join('\n');
        return `https://wa.me/6287879713808?text=${encodeURIComponent(lines)}`;
    };

    const canCheckout = name.trim().length > 1 && /\d{10,}/.test(wa.replace(/\D/g, '')) && items.length > 0;

    const handleCheckout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!canCheckout) {
            e.preventDefault();
            alert('Lengkapi nama, nomor WhatsApp yang valid, dan pastikan keranjang tidak kosong.');
            return;
        }
        e.preventDefault();
        try {
            const payload = {
                source: 'cart',
                name,
                whatsapp: normalizeWa(wa),
                note,
                items,
                total,
                utm: readUtm(),
            };
            await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch { }
        // GA4 begin_checkout
        const g = (window as any).gtag;
        if (typeof g === 'function') {
            g('event', 'begin_checkout', {
                currency: 'IDR',
                value: total,
                items: items.map(it => ({ item_id: it.slug, item_name: it.title, quantity: it.qty }))
            });
        }
        const fb = (window as any).fbq;
        if (typeof fb === 'function') {
            fb('track', 'InitiateCheckout', {
                content_ids: items.map(it => it.slug),
                contents: items.map(it => ({ id: it.slug, quantity: it.qty })),
                num_items: items.reduce((s, it) => s + it.qty, 0),
                content_type: 'product',
                currency: 'IDR',
                value: total,
            });
        }
        const fb2 = (window as any).fbq;
        if (typeof fb2 === 'function') {
            fb2('track', 'AddPaymentInfo', {
                content_ids: items.map(it => it.slug),
                contents: items.map(it => ({ id: it.slug, quantity: it.qty })),
                num_items: items.reduce((s, it) => s + it.qty, 0),
                content_type: 'product',
                currency: 'IDR',
                value: total,
            });
            fb2('track', 'Contact', {
                content_type: 'product',
                num_items: items.reduce((s, it) => s + it.qty, 0),
                value: total,
                currency: 'IDR',
            });
            // Lead conversion on checkout via cart
            fb2('track', 'Lead', {
                content_type: 'product',
                num_items: items.reduce((s, it) => s + it.qty, 0),
                value: total,
                currency: 'IDR',
            });
            fb2('trackCustom', 'WhatsAppClick', { source: 'cart_checkout' });
        }
        const url = buildMessage();
        window.open(url, '_blank');
    };

    const handleCheckoutForAdmin = async (adminPhone: string, e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!canCheckout) {
            e.preventDefault();
            alert('Lengkapi nama, nomor WhatsApp yang valid, dan pastikan keranjang tidak kosong.');
            return;
        }
        e.preventDefault();
        try {
            const payload = {
                source: 'cart',
                name,
                whatsapp: normalizeWa(wa),
                note,
                items,
                total,
                utm: readUtm(),
            };
            await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } catch { }
        const g = (window as any).gtag;
        if (typeof g === 'function') {
            g('event', 'begin_checkout', {
                currency: 'IDR',
                value: total,
                items: items.map(it => ({ item_id: it.slug, item_name: it.title, quantity: it.qty }))
            });
        }
        const fb = (window as any).fbq;
        if (typeof fb === 'function') {
            fb('track', 'InitiateCheckout', {
                content_ids: items.map(it => it.slug),
                contents: items.map(it => ({ id: it.slug, quantity: it.qty })),
                num_items: items.reduce((s, it) => s + it.qty, 0),
                content_type: 'product',
                currency: 'IDR',
                value: total,
            });
            fb('track', 'AddPaymentInfo', {
                content_ids: items.map(it => it.slug),
                contents: items.map(it => ({ id: it.slug, quantity: it.qty })),
                num_items: items.reduce((s, it) => s + it.qty, 0),
                content_type: 'product',
                currency: 'IDR',
                value: total,
            });
            fb('track', 'Contact', {
                content_type: 'product',
                num_items: items.reduce((s, it) => s + it.qty, 0),
                value: total,
                currency: 'IDR',
            });
            // Lead conversion on checkout via cart (admin-specific)
            fb('track', 'Lead', {
                content_type: 'product',
                num_items: items.reduce((s, it) => s + it.qty, 0),
                value: total,
                currency: 'IDR',
            });
            fb('trackCustom', 'WhatsAppClick', { source: 'cart_checkout_admin' });
        }
        const url = buildMessage().replace('6287879713808', adminPhone);
        window.open(url, '_blank');
    };

    return (
        <main className="pt-24 pb-16 min-h-screen bg-gray-50">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => { if (window.history.length > 1) { window.history.back(); } else { window.location.hash = '#'; } }}
                        aria-label="Kembali"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-semibold">Kembali</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Keranjang</h1>
                </div>
                {items.length === 0 ? (
                    <div className="mt-6 bg-white rounded-xl border p-6 text-gray-600">Keranjang kosong. Silakan tambahkan produk terlebih dahulu.</div>
                ) : (
                    <div className="mt-6 grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-3">
                            {items.map(it => (
                                <div key={it.slug} className="bg-white rounded-xl border p-4 flex flex-wrap md:flex-nowrap items-start md:items-center gap-4">
                                    <div className="w-16 h-20 flex-shrink-0 relative overflow-hidden rounded bg-gray-100">
                                        <ResponsiveImage
                                            src={it.cover}
                                            alt={it.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[180px]">
                                        <p className="font-semibold text-gray-900">{it.title}</p>
                                        <p className="text-sm text-gray-600">Harga: {formatRupiah(PRICE_MAP_NUMERIC[it.title] || 0)}</p>
                                        <div className="mt-2 inline-flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                                            <button onClick={() => dec(it.slug)} className="px-2 py-0.5 rounded bg-white border">-</button>
                                            <input aria-label="Jumlah" value={it.qty} onChange={(e) => { const val = Number(e.target.value) || 1; setQty(it.slug, val); }} className="w-14 text-center border rounded bg-white" />
                                            <button onClick={() => inc(it.slug)} className="px-2 py-0.5 rounded bg-white border">+</button>
                                        </div>
                                    </div>
                                    <div className="ml-auto text-right flex flex-col items-end gap-2">
                                        <div>
                                            <p className="text-sm text-gray-500">Subtotal</p>
                                            <p className="font-semibold">{formatRupiah((PRICE_MAP_NUMERIC[it.title] || 0) * it.qty)}</p>
                                        </div>
                                        {/* Tombol Hapus untuk mobile */}
                                        <button onClick={() => remove(it.slug)} className="text-rose-600 text-sm font-semibold md:hidden">Hapus</button>
                                    </div>
                                    {/* Tombol Hapus untuk desktop */}
                                    <button onClick={() => remove(it.slug)} className="hidden md:inline-block text-rose-600 text-sm font-semibold">Hapus</button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-xl border p-5 h-max">
                            <h2 className="font-semibold text-gray-900">Data Pemesan</h2>
                            <div className="mt-3 space-y-2">
                                <input id="customer-name" aria-label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded px-3 py-2" />
                                <input id="customer-wa" aria-label="Nomor WhatsApp" type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="Nomor WhatsApp (contoh: 081234567890)" className="w-full border rounded px-3 py-2" />
                                <textarea id="customer-note" aria-label="Catatan" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan (opsional)" className="w-full border rounded px-3 py-2 h-20" />
                            </div>
                            <div className="mt-3 border-t pt-3">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Total Estimasi</span>
                                    <span className="font-semibold text-gray-900">{formatRupiah(total)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Belum termasuk ongkos kirim.</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2 text-center">Pilih admin untuk checkout:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ADMIN_CONTACTS.map((admin) => {
                                        const online = isOnlineNow();
                                        const base = canCheckout
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed';
                                        return (
                                            <a
                                                key={admin.phone}
                                                href={buildMessage().replace('6287879713808', admin.phone)}
                                                onClick={(e) => handleCheckoutForAdmin(admin.phone, e)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl font-semibold transition ${base}`}
                                            >
                                                <Phone className="w-5 h-5" />
                                                <span className="text-xs">{admin.name}</span>
                                                <span className={`text-[10px] font-normal flex items-center gap-1 ${canCheckout ? (online ? 'text-emerald-100' : 'text-white/70') : 'text-gray-500'}`} title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-300 animate-pulse' : 'bg-white/50'}`}></span>
                                                    {online ? 'Online' : 'Offline — balas di jam kerja'}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CartPage;
