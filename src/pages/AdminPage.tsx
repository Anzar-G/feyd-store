import React, { useEffect, useState, useMemo } from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
import { ADMIN_CONTACTS } from '../data/constants';
import { isOnlineNow, readUtm } from '../utils/helpers';

const AdminPage: React.FC = () => {
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);
    const [selectedAdmin, setSelectedAdmin] = useState<string>(ADMIN_CONTACTS[0].phone);
    const selected = useMemo(() => ADMIN_CONTACTS.find(a => a.phone === selectedAdmin), [selectedAdmin]);
    const online = isOnlineNow();
    const message = useMemo(() => {
        const utm = readUtm();
        const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
        const lines = [
            'Assalamu’alaikum 🌱',
            'Saya ingin masuk daftar tunggu promo.',
            '➡️ Nama lengkap: ______',
            '➡️ Produk yang diminati: ______',
            'Terima kasih. 🙏',
            utmStr || undefined,
        ].filter(Boolean).join('\n');
        return lines;
    }, [selected]);

    return (
        <main className="pt-24 pb-16 min-h-screen bg-gray-50">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#'; }} aria-label="Kembali" className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800">
                        <ChevronLeft className="w-5 h-5" /> <span className="font-semibold">Kembali</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pilih Admin</h1>
                </div>
                <div className="mt-6 space-y-3">
                    {ADMIN_CONTACTS.map((adm) => {
                        const active = selectedAdmin === adm.phone;
                        return (
                            <button
                                key={adm.phone}
                                type="button"
                                onClick={() => setSelectedAdmin(adm.phone)}
                                className={`w-full bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-4 px-5 min-h-[52px] rounded-xl flex items-center justify-between transition border ${active ? 'border-emerald-600 ring-2 ring-emerald-600 bg-emerald-50' : 'border-emerald-100'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <div className="relative w-9 h-9 rounded-lg bg-emerald-100 overflow-hidden flex-shrink-0">
                                        <ResponsiveImage
                                            src={`/images/${adm.name.toLowerCase().replace(/ /g, '-')}.jpg`}
                                            alt={adm.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {!adm.avatar.includes('/') && <span className="absolute inset-0 flex items-center justify-center text-emerald-700 font-bold">{adm.avatar}</span>}
                                    </div>
                                    <span className="text-left">
                                        <span className="block font-semibold">{adm.name}</span>
                                        <span className="block text-xs text-gray-600">{adm.role}</span>
                                    </span>
                                </span>
                                <span className={`text-xs inline-flex items-center gap-1 ${online ? 'text-emerald-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                    {online ? 'Online' : 'Offline'}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <a
                    href={`https://wa.me/${selectedAdmin}?text=${encodeURIComponent(message)}`}
                    onClick={() => {
                        const fb = (window as any).fbq;
                        if (typeof fb === 'function') {
                            fb('track', 'Lead', { content_category: 'waitlist' });
                            fb('trackCustom', 'WhatsAppClick', { source: 'waitlist' });
                        }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Kirim ke {(selected?.name || 'Admin')} via WhatsApp
                    <Phone className="w-5 h-5" />
                </a>
            </section>
        </main>
    );
};

export default AdminPage;
