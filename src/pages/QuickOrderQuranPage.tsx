import React, { useEffect, useState } from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
import { ADMIN_CONTACTS, PRODUCT_PRICING } from '../data/constants';
import { captureFirstUtm, readUtm, normalizeWa, formatRupiah, isOnlineNow } from '../utils/helpers';

const QuickOrderQuranPage: React.FC = () => {
    captureFirstUtm();
    const [qty, setQty] = useState<number>(1);
    const [name, setName] = useState('');
    const [wa, setWa] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<string>(ADMIN_CONTACTS[0]?.phone || '6287879713808');
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

    const price = 297000;
    const bonusDesc = PRODUCT_PRICING['Al-Qur’an Kharisma']?.bonus;
    const total = price * Math.max(1, qty);
    const canSend = name.trim().length > 1 && /\d{10,}/.test(wa.replace(/\D/g, '')) && address.trim().length > 5;

    const buildMessage = () => {
        const utm = readUtm();
        const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k]) => k.startsWith('utm_')).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
        const bonusLines = Array.isArray(bonusDesc)
            ? bonusDesc.map(b => `- ${b}`)
            : (bonusDesc ? [`- ${bonusDesc}`] : []);
        const lines = [
            'Assalamu’alaikum, saya ingin memesan Al-Qur’an Kharisma, apakah masih tersedia?:',
            `Jumlah: ${Math.max(1, qty)} pcs`,
            `Harga satuan: ${formatRupiah(price)}`,
            `Estimasi total: ${formatRupiah(total)} (belum termasuk ongkir)`,
            bonusLines.length ? '' : undefined,
            bonusLines.length ? 'Bonus yang didapat:' : undefined,
            ...bonusLines,
            '',
            `Nama: ${name}`,
            `WhatsApp: ${normalizeWa(wa)}`,
            `Alamat: ${address}`,
            note ? `Catatan: ${note}` : undefined,
            utmStr || undefined,
            '',
            'Saya akan mengirimkan bukti transfer setelah pembayaran dan setelah terkonfirmasi ketersedian produk.',
        ].filter(Boolean).join('\n');
        return `https://wa.me/${selectedAdmin}?text=${encodeURIComponent(lines)}`;
    };

    return (
        <main className="pt-24 pb-16 min-h-screen bg-gray-50">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#'; }} aria-label="Kembali" className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800">
                        <ChevronLeft className="w-5 h-5" /> <span className="font-semibold">Kembali</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pesan Al-Qur’an Kharisma</h1>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4 bg-white rounded-xl border p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-20 flex-shrink-0 relative overflow-hidden rounded bg-gray-100">
                                <ResponsiveImage
                                    src="/cover.jpg"
                                    alt="Al-Qur’an Kharisma"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Al-Qur’an Kharisma</p>
                                <p className="text-sm text-gray-600">Harga: {formatRupiah(price)}</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-gray-50 rounded px-2 py-1 w-max">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-0.5 rounded bg-white border">-</button>
                            <input aria-label="Jumlah" value={qty} onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))} className="w-14 text-center border rounded bg-white" />
                            <button onClick={() => setQty(q => Math.min(999, q + 1))} className="px-2 py-0.5 rounded bg-white border">+</button>
                        </div>
                        <div className="text-sm text-gray-600">Subtotal: <span className="font-semibold text-gray-900">{formatRupiah(total)}</span></div>
                    </div>
                    <div className="bg-white rounded-xl border p-5 h-max">
                        <h2 className="font-semibold text-gray-900">Data Pemesan</h2>
                        <div className="mt-3 space-y-2">
                            <input id="order-name" aria-label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded px-3 py-2" />
                            <input id="order-wa" aria-label="Nomor WhatsApp" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="Nomor WhatsApp (contoh: 081234567890)" className="w-full border rounded px-3 py-2" />
                            <input id="order-address" aria-label="Alamat Lengkap" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap (jalan, kecamatan, kota)" className="w-full border rounded px-3 py-2" />
                            <textarea id="order-note" aria-label="Catatan" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan (opsional)" className="w-full border rounded px-3 py-2 h-20" />
                        </div>
                        <div className="mt-3 border-t pt-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Total Estimasi</span>
                                <span className="font-semibold text-gray-900">{formatRupiah(total)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Belum termasuk ongkos kirim.</p>
                        </div>
                        {/* Admin selection within form (rectangular buttons) */}
                        <div className="mt-3">
                            <p className="text-sm text-gray-700 font-medium mb-2">Pilih admin tujuan:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {ADMIN_CONTACTS.map((admin) => {
                                    const online = isOnlineNow();
                                    const active = selectedAdmin === admin.phone;
                                    return (
                                        <button
                                            key={admin.phone}
                                            type="button"
                                            onClick={() => setSelectedAdmin(admin.phone)}
                                            className={`w-full border rounded-xl px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{admin.name}</span>
                                                <span className={`text-[10px] font-normal inline-flex items-center gap-1 ${online ? (active ? 'text-emerald-100' : 'text-emerald-600') : 'text-gray-500'}`} title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-300 animate-pulse' : 'bg-gray-400'}`}></span>
                                                    {online ? 'Online' : 'Offline — balas di jam kerja'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <a
                            href={canSend ? buildMessage() : undefined}
                            onClick={(e) => {
                                if (!canSend) {
                                    e.preventDefault();
                                    alert('Lengkapi nama, nomor WA valid, dan alamat.');
                                } else {
                                    const fb = (window as any).fbq;
                                    if (typeof fb === 'function') {
                                        fb('track', 'Lead', {
                                            content_name: 'Al-Qur’an Kharisma',
                                            content_category: 'quick_order',
                                            value: total,
                                            currency: 'IDR',
                                        });
                                        fb('track', 'Contact', {
                                            content_category: 'quick_order',
                                            value: total,
                                            currency: 'IDR',
                                        });
                                        fb('trackCustom', 'WhatsAppClick', { source: 'quick_order_form' });
                                    }
                                }
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold ${canSend ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        >
                            Kirim Pemesanan via WhatsApp
                            <Phone className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default QuickOrderQuranPage;
