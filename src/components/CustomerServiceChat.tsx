import React, { useState } from 'react';
import { Headphones, X } from 'lucide-react';
import { ADMIN_CONTACTS } from '../data/constants';
import { readUtm } from '../utils/helpers';

const CustomerServiceChat: React.FC<{ route: string; productName?: string }> = ({ route, productName }) => {
    const [showCs, setShowCs] = useState(false);

    return (
        <div className="fixed right-4 bottom-24 md:right-6 md:bottom-24 z-50">
            {!showCs ? (
                <button
                    type="button"
                    onClick={() => setShowCs(true)}
                    className="relative rounded-full shadow-2xl bg-white text-emerald-700 w-14 h-14 flex items-center justify-center ring-1 ring-emerald-500 ring-offset-1 ring-offset-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition"
                    aria-label="Hubungi CS"
                    title="Butuh bantuan? Chat CS"
                >
                    <span className="absolute inset-0 grid place-items-center">
                        <Headphones className="w-7 h-7 text-emerald-700" />
                    </span>
                    <img
                        src="/customer-service-logo.webp"
                        alt="Customer Service"
                        className="w-8 h-8 object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-white" aria-hidden />
                </button>
            ) : (
                <div className="w-[280px] max-w-[80vw] bg-white rounded-2xl shadow-2xl border p-3">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">Butuh Bantuan?</div>
                        <button type="button" aria-label="Tutup" onClick={() => setShowCs(false)} className="text-gray-500 hover:text-gray-800">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">Pilih admin untuk chat via WhatsApp</div>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                        {ADMIN_CONTACTS.map((adm) => {
                            const msg = (() => {
                                const utm = readUtm();
                                const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
                                const wakafTab = (() => { try { return localStorage.getItem('wakaf_active_tab') || ''; } catch { return ''; } })();
                                const isWakafPermintaan = route.startsWith('#/wakaf') && wakafTab === 'permintaan';
                                const isWakafPenyaluran = route.startsWith('#/wakaf') && wakafTab !== 'permintaan';
                                const productContext = (() => {
                                    if (route.startsWith('#/produk/')) return productName || 'Produk';
                                    if (route === '#/pesan-quran') return 'Al-Qur’an Kharisma';
                                    return undefined;
                                })();
                                const wakafContext = isWakafPermintaan ? 'permintaan wakaf Al-Qur’an' : (isWakafPenyaluran ? 'penyaluran wakaf Al-Qur’an' : undefined);
                                const productLine = productContext ? `produk ${productContext}` : undefined;
                                const topicLine = wakafContext ? wakafContext : productLine || 'produk';
                                const lines = [
                                    'Assalamu’alaikum,',
                                    'Terima kasih telah menghubungi Islamic Product Market.',
                                    'Untuk bisa membantu kamu dengan lebih baik, mohon informasikan:',
                                    '• Nama lengkapmu?',
                                    `• Pertanyaan atau kebutuhanmu seputar ${topicLine}?`,
                                    'Kami akan segera membalas dalam 24 jam — dan akan menyebut namamu saat menjawab.',
                                    'Jangan lupa, cek koleksi produk dan penawaran spesial di link bio.',
                                    'Semoga Allah memudahkan segala urusanmu.',
                                    '— Tim IPM',
                                    utmStr || undefined,
                                ].filter(Boolean).join('\n');
                                return `https://wa.me/${adm.phone}?text=${encodeURIComponent(lines)}`;
                            })();
                            return (
                                <a
                                    key={adm.phone}
                                    href={msg}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        const fb = (window as any).fbq;
                                        if (typeof fb === 'function') {
                                            fb('track', 'Lead', { content_category: 'cs_widget' });
                                            fb('track', 'Contact', { content_category: 'cs_widget' });
                                            fb('trackCustom', 'WhatsAppClick', { source: 'cs_widget' });
                                        }
                                        setShowCs(false);
                                    }}
                                    className="flex items-center justify-between gap-2 border rounded-xl px-3 py-2 hover:bg-emerald-50"
                                >
                                    <span className="font-semibold text-emerald-700">{adm.name}</span>
                                    <span className="text-xs text-gray-500">Chat</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerServiceChat;
