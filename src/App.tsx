  import React, { useEffect, useMemo, useRef, useState } from 'react';
  import Wakaf from './Wakaf';
  import RatingStars from './components/RatingStars';
  import GaleriWakaf from './GaleriWakaf';
  import {
    Menu,
    X,
    ChevronRight,
    Check,
    Star,
    ChevronLeft,
    MessageCircle,
    BookOpen,
    Award,
    Shield,
    Truck,
    Clock,
    User,
    ShoppingBag,
    Phone,
    Store,
    Users,
    GraduationCap,
    Briefcase,
    ArrowRight,
    ShoppingCart,
  } from 'lucide-react';
  import SeoHead from './components/SeoHead';
  import ResponsiveImage from './components/ResponsiveImage';
  import { useCart as useCartHook } from './hooks/useCart';
  import SkeletonCard from './components/SkeletonCard';
  import Analytics from './components/Analytics';

  // Types
  type Testimonial = {
    id: number;
    name: string;
    role: string;
    rating: number;
    content: string;
    avatar: string;
    avatarUrl?: string;
  };

  // ============================================
  // ADMIN SELECTOR COMPONENT
  // ============================================
  type AdminSelectorProps = {
    message: string;
    title?: string;
    subtitle?: string;
    variant?: 'horizontal' | 'vertical';
    theme?: 'light' | 'dark';
  };

  const AdminSelector: React.FC<AdminSelectorProps> = ({
    message,
    title = 'Hubungi Admin Kami',
    subtitle = 'Pilih admin untuk konsultasi dan pemesanan',
    variant = 'horizontal',
    theme = 'light',
  }) => {
    const online = isOnlineNow();
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <div className={`${theme==='dark' ? 'inline-block rounded-xl border border-white/20 bg-white/10 px-4 py-3' : ''}`}>
            <h3 className={`text-lg font-semibold ${theme==='dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            {subtitle && <p className={`text-sm mt-1 ${theme==='dark' ? 'text-white/80' : 'text-gray-600'}`}>{subtitle}</p>}
          </div>
        </div>
        <div className={`grid gap-3 ${variant === 'horizontal' ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
          {ADMIN_CONTACTS.map((admin) => (
            <a
              key={admin.phone}
              href={`https://wa.me/${admin.phone}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-100 bg-white hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                {admin.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-600 truncate">{admin.role}</p>
                <div className={`flex items-center gap-1 text-xs mt-1 ${online ? 'text-emerald-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>{online ? 'Online' : 'Offline — balas di jam kerja'}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  // Halaman Keranjang
  const CartPage: React.FC<{ cartCount: number; setCartCount: (n:number)=>void }> = ({ cartCount, setCartCount }) => { captureFirstUtm();
    const { items, totalQty, setQty, remove: removeItem } = useCartHook();
    const [name, setName] = useState('');
    const [wa, setWa] = useState('');
    const [note, setNote] = useState('');

    useEffect(()=>{ window.scrollTo({ top: 0, behavior: 'auto' }); }, []);

    const inc = (slug:string) => { const q = (items.find(i=>i.slug===slug)?.qty||0)+1; setQty(slug, q); };
    const dec = (slug:string) => { const q = (items.find(i=>i.slug===slug)?.qty||0)-1; setQty(slug, q); };
    const remove = (slug:string) => { removeItem(slug); };

    useEffect(() => { setCartCount(totalQty); }, [totalQty, setCartCount]);

    const normalizeWa = (s:string) => {
      const d = s.replace(/\D/g,'');
      if (d.startsWith('62')) return d;
      if (d.startsWith('0')) return '62'+d.slice(1);
      return '62'+d;
    };

    const priceMap: Record<string, number> = {
      'Sebelum Aku Tiada': 157000,
      'Melawan Kemustahilan': 249000,
      'Titik Balik': 147000,
      'Al-Qur’an Kharisma': 297000,
    };
    const formatRupiah = (n:number) => `Rp ${n.toLocaleString('id-ID')}`;

    const total = items.reduce((s,it)=> s + (priceMap[it.title]||0) * it.qty, 0);

    const buildMessage = () => {
      const utm = readUtm();
      const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k])=>k.startsWith('utm_')).map(([k,v])=>`${k}=${v}`).join('&')}` : '';
      const lines = [
        'Assalamu’alaikum, saya ingin memesan:',
        '',
        ...items.map(it => `- ${it.title}: ${it.qty} pcs`),
        '',
        `Estimasi total: ${formatRupiah(total)} (belum termasuk ongkir)`,
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

    const canCheckout = name.trim().length>1 && /\d{10,}/.test(wa.replace(/\D/g,'')) && items.length>0;

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
      } catch {}
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
          num_items: items.reduce((s,it)=>s+it.qty,0),
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
          num_items: items.reduce((s,it)=>s+it.qty,0),
          content_type: 'product',
          currency: 'IDR',
          value: total,
        });
        fb2('track', 'Contact', {
          content_type: 'product',
          num_items: items.reduce((s,it)=>s+it.qty,0),
          value: total,
          currency: 'IDR',
        });
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
      } catch {}
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
          num_items: items.reduce((s,it)=>s+it.qty,0),
          content_type: 'product',
          currency: 'IDR',
          value: total,
        });
        fb('track', 'AddPaymentInfo', {
          content_ids: items.map(it => it.slug),
          contents: items.map(it => ({ id: it.slug, quantity: it.qty })),
          num_items: items.reduce((s,it)=>s+it.qty,0),
          content_type: 'product',
          currency: 'IDR',
          value: total,
        });
        fb('track', 'Contact', {
          content_type: 'product',
          num_items: items.reduce((s,it)=>s+it.qty,0),
          value: total,
          currency: 'IDR',
        });
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
                    <img src={it.cover} alt={it.title} className="w-16 h-20 object-cover rounded" loading="lazy" />
                    <div className="flex-1 min-w-[180px]">
                      <p className="font-semibold text-gray-900">{it.title}</p>
                      <p className="text-sm text-gray-600">Harga: {formatRupiah(priceMap[it.title]||0)}</p>
                      <div className="mt-2 inline-flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                        <button onClick={()=>dec(it.slug)} className="px-2 py-0.5 rounded bg-white border">-</button>
                        <input value={it.qty} onChange={(e)=> { const val = Number(e.target.value)||1; setQty(it.slug, val); }} className="w-14 text-center border rounded bg-white" />
                        <button onClick={()=>inc(it.slug)} className="px-2 py-0.5 rounded bg-white border">+</button>
                      </div>
                    </div>
                    <div className="ml-auto text-right flex flex-col items-end gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-semibold">{formatRupiah((priceMap[it.title]||0) * it.qty)}</p>
                      </div>
                      {/* Tombol Hapus untuk mobile (ditaruh di bawah subtotal) */}
                      <button onClick={()=>remove(it.slug)} className="text-rose-600 text-sm font-semibold md:hidden">Hapus</button>
                    </div>
                    {/* Tombol Hapus untuk desktop tetap di sisi kanan */}
                    <button onClick={()=>remove(it.slug)} className="hidden md:inline-block text-rose-600 text-sm font-semibold">Hapus</button>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border p-5 h-max">
                <h2 className="font-semibold text-gray-900">Data Pemesan</h2>
                <div className="mt-3 space-y-2">
                  <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded px-3 py-2" />
                  <input value={wa} onChange={(e)=>setWa(e.target.value)} placeholder="Nomor WhatsApp (contoh: 081234567890)" className="w-full border rounded px-3 py-2" />
                  <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Catatan (opsional)" className="w-full border rounded px-3 py-2 h-20" />
                </div>
                <div className="mt-3 border-t pt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total Estimasi</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Belum termasuk ongkos kirim.</p>
                </div>
                <div className="mt-4">
                  {canCheckout ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2 text-center">Pilih admin untuk checkout:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ADMIN_CONTACTS.map((admin) => {
                          const online = isOnlineNow();
                          return (
                            <a
                              key={admin.phone}
                              href={buildMessage().replace('6287879713808', admin.phone)}
                              onClick={(e) => handleCheckoutForAdmin(admin.phone, e)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                            >
                              <Phone className="w-5 h-5" />
                              <span className="text-xs">{admin.name.replace('Admin ', '')}</span>
                              <span className={`text-[10px] font-normal flex items-center gap-1 ${online ? 'text-emerald-100' : 'text-white/70'}`} title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-300 animate-pulse' : 'bg-white/50'}`}></span>
                                {online ? 'Online' : 'Offline — balas di jam kerja'}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => alert('Lengkapi nama, nomor WhatsApp yang valid, dan pastikan keranjang tidak kosong.')}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Lengkapi Data Dulu
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  };

  // Halaman Pesan Quran (form khusus)
  const QuickOrderQuranPage: React.FC = () => { captureFirstUtm();
    const [qty, setQty] = useState<number>(1);
    const [name, setName] = useState('');
    const [wa, setWa] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState<string>(ADMIN_CONTACTS[0]?.phone || '6287879713808');
    useEffect(()=>{ window.scrollTo({ top: 0, behavior: 'auto' }); }, []);
    const normalizeWa = (s:string) => { const d=s.replace(/\D/g,''); if(d.startsWith('62')) return d; if(d.startsWith('0')) return '62'+d.slice(1); return '62'+d; };
    const formatRupiah = (n:number) => `Rp ${n.toLocaleString('id-ID')}`;
    const price = 297000;
    const total = price * Math.max(1, qty);
    const canSend = name.trim().length>1 && /\d{10,}/.test(wa.replace(/\D/g,'')) && address.trim().length>5;
    const buildMessage = () => {
      const utm = readUtm();
      const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k])=>k.startsWith('utm_')).map(([k,v])=>`${k}=${v}`).join('&')}` : '';
      const lines = [
        'Assalamu’alaikum, saya ingin memesan Al-Qur’an Kharisma, apakah masih tersedia?:',
        `Jumlah: ${Math.max(1, qty)} pcs`,
        `Harga satuan: ${formatRupiah(price)}`,
        `Estimasi total: ${formatRupiah(total)} (belum termasuk ongkir)`,
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
            <button type="button" onClick={() => { if (window.history.length>1) window.history.back(); else window.location.hash = '#'; }} aria-label="Kembali" className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800">
              <ChevronLeft className="w-5 h-5" /> <span className="font-semibold">Kembali</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pesan Al-Qur’an Kharisma</h1>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <img src="/cover.jpg" alt="Al-Qur’an Kharisma" className="w-16 h-20 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-900">Al-Qur’an Kharisma</p>
                  <p className="text-sm text-gray-600">Harga: {formatRupiah(price)}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded px-2 py-1 w-max">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-2 py-0.5 rounded bg-white border">-</button>
                <input value={qty} onChange={(e)=> setQty(Math.max(1, Math.min(999, Number(e.target.value)||1)))} className="w-14 text-center border rounded bg-white" />
                <button onClick={()=>setQty(q=>Math.min(999,q+1))} className="px-2 py-0.5 rounded bg-white border">+</button>
              </div>
              <div className="text-sm text-gray-600">Subtotal: <span className="font-semibold text-gray-900">{formatRupiah(total)}</span></div>
            </div>
            <div className="bg-white rounded-xl border p-5 h-max">
              <h2 className="font-semibold text-gray-900">Data Pemesan</h2>
              <div className="mt-3 space-y-2">
                <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama Lengkap" className="w-full border rounded px-3 py-2" />
                <input value={wa} onChange={(e)=>setWa(e.target.value)} placeholder="Nomor WhatsApp (contoh: 081234567890)" className="w-full border rounded px-3 py-2" />
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Alamat lengkap (jalan, kecamatan, kota)" className="w-full border rounded px-3 py-2" />
                <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Catatan (opsional)" className="w-full border rounded px-3 py-2 h-20" />
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Total Estimasi</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Belum termasuk ongkos kirim.</p>
              </div>
              {/* Admin selection within form */}
              <div className="mt-3">
                <p className="text-sm text-gray-700 font-medium mb-2">Pilih admin tujuan:</p>
                <div className="grid grid-cols-2 gap-2">
                  {ADMIN_CONTACTS.map((admin) => {
                    const online = isOnlineNow();
                    const active = selectedAdmin===admin.phone;
                    return (
                      <button
                        key={admin.phone}
                        type="button"
                        onClick={() => setSelectedAdmin(admin.phone)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{admin.name.replace('Admin ','')}</span>
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
                onClick={(e)=>{ if(!canSend){ e.preventDefault(); alert('Lengkapi nama, nomor WA valid, dan alamat.'); return; } const fb=(window as any).fbq; if(typeof fb==='function'){ const q=Math.max(1, qty); fb('track','InitiateCheckout',{ content_ids: ['quran-kharisma'], contents: [{ id: 'quran-kharisma', quantity: q }], num_items: q, content_type:'product', currency:'IDR', value: total }); fb('track','AddPaymentInfo',{ content_ids: ['quran-kharisma'], contents: [{ id: 'quran-kharisma', quantity: q }], num_items: q, content_type:'product', currency:'IDR', value: total }); fb('track','Contact',{content_name:'Al-Qur’an Kharisma', content_type:'product', value: total, currency:'IDR'}); } }}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold ${canSend? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
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

  // Harga novel dan bonus
  const PRODUCT_PRICING: Record<string, { price: string; bonus?: string }> = {
    'Sebelum Aku Tiada': { price: 'Rp 157.000' },
    'Melawan Kemustahilan': { price: 'Rp 249.000', bonus: 'Bonus Video Motivasi Spesial Dewa Eka Prayoga senilai Rp 300.000' },
    'Titik Balik': { price: 'Rp 147.000' },
    'Al-Qur’an Kharisma': { price: 'Rp 297.000' },
  };

  const buildProductWaLink = (title: string) => {
    const info = PRODUCT_PRICING[title];
    const text = `Assalamu’alaikum, saya ingin memesan ${title}${info ? ` (${info.price})` : ''}. Mohon informasi cara pemesanan.`;
    return `https://wa.me/6287879713808?text=${encodeURIComponent(text)}`;
  };

  type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
  };

  // Cart (localStorage based)
  type CartItem = { slug: string; title: string; cover: string; qty: number };
  const CART_KEY = 'cart_items_v1';
  const safeJsonParse = <T,>(s: string, fallback: T): T => { try { return JSON.parse(s) as T; } catch { return fallback; } };
  const readCart = (): CartItem[] => safeJsonParse<CartItem[]>(typeof window !== 'undefined' ? (localStorage.getItem(CART_KEY) || '[]') : '[]', []);
  const writeCart = (items: CartItem[]) => { if (typeof window !== 'undefined') localStorage.setItem(CART_KEY, JSON.stringify(items)); };
  const getCartTotalQty = () => readCart().reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  const addCartItem = (item: CartItem) => {
    const cart = readCart();
    const i = cart.findIndex(c => c.slug === item.slug);
    if (i >= 0) cart[i].qty = Math.min(999, (cart[i].qty || 0) + item.qty);
    else cart.push({ ...item, qty: Math.min(999, item.qty) });
    writeCart(cart);
    return cart;
  };
  const setCartQty = (slug: string, qty: number) => {
    const cart = readCart().map(c => c.slug === slug ? { ...c, qty: Math.max(0, Math.min(999, qty)) } : c).filter(c => c.qty > 0);
    writeCart(cart); return cart;
  };
  const removeCartItem = (slug: string) => { writeCart(readCart().filter(c => c.slug !== slug)); };

  // Product page types
  type ProductProps = {
    slug: 'melawan-kemustahilan' | 'sebelum-aku-tiada' | 'titik-balik';
    title: string;
    author: string;
    tagline: string;
    cover: string; // path in public/images
    synopsis: string[];
    notes?: string;
    testimonial?: { quote: string; by: string };
    cartCount?: number;
    onAddToCart?: (payload: { slug: string; title: string; cover: string; qty: number }) => void;
  };

  type NavItem = { name: string; href: string };

  // Intersection Observer helper
  const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
      const node = ref.current;
      if (!node) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      }, options ?? { threshold: 0.15 });

      observer.observe(node);
      return () => observer.disconnect();
    }, [options]);

    return { ref, inView } as const;
  };

  // Contact and marketplace links
  const CONTACT = {
    whatsapp: "https://wa.me/6287879713808?text=" + encodeURIComponent("Assalamu’alaikum, saya tertarik memesan Al-Qur’an Kharisma. Mohon informasi lebih lanjut mengenai ketersediaan dan proses pemesanan. Terima kasih."),
    shopee: "#",
    tokopedia: "#",
  } as const;

  // ============================================
  // ADMIN CONTACTS CONFIGURATION
  // ============================================
  const ADMIN_CONTACTS = [
    {
      name: 'Admin Ustd Abdillah',
      phone: '6287879713808',
      avatar: 'MN',
      role: 'Pemesanan & Konsultasi',
      status: 'online',
    },
    {
      name: 'Admin Mas Nizar',
      phone: '6282221025449',
      avatar: 'AF',
      role: 'Wakaf & Informasi Produk',
      status: 'online',
    },
  ];
  const isOnlineNow = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utcMs + 7 * 3600000); // UTC+7
    const h = wib.getHours();
    return h >= 6 && h < 22;
  };

  // UTM helpers (persist first-touch)
  const UTM_KEY = 'first_utm_v1';
  const captureFirstUtm = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utm = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].reduce((acc, k) => {
      const v = params.get(k);
      if (v) (acc as any)[k] = v;
      return acc;
    }, {} as Record<string,string>);
    if (Object.keys(utm).length > 0 && !localStorage.getItem(UTM_KEY)) {
      localStorage.setItem(UTM_KEY, JSON.stringify({ ...utm, ts: Date.now(), path: window.location.pathname + window.location.hash }));
    }
  };
  const readUtm = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(UTM_KEY) || '{}') as Record<string,string>; } catch { return {}; }
  };

  const openWaInterest = (productTitle: string, name?: string, wa?: string, email?: string) => {
    const message = `Assalamu’alaikum, saya tertarik dengan buku ${productTitle}. Mohon informasikan saat tersedia. Nama: ${name ?? '-'}, WA: ${wa ?? '-'}${email ? `, Email: ${email}` : ''}`;
    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
      fb('track', 'Lead', { content_name: productTitle, content_category: 'interest' });
    }
    window.open(`https://wa.me/6287879713808?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Foto penulis (public/images)
  const AUTHOR_AVATARS: Record<string, string> = {
    'Dewa Eka Prayoga': '/images/dewa.png',
    'Asma Nadia': '/images/nadia.webp',
    'Arafat': '/images/arafat.webp',
  };

  // Statistik penulis (diambil dari data.csv)
  const AUTHOR_STATS: Record<string, { books: string; readers: string }> = {
    'Dewa Eka Prayoga': { books: '70+', readers: '3–5 juta' },
    'Asma Nadia': { books: '100+', readers: '20–30 juta' },
    'Arafat': { books: '1–3', readers: '500–10.000' },
  };

  // Biografi penulis
  const AUTHOR_BIOS: Record<string, string[]> = {
    'Dewa Eka Prayoga': [
      'Penulis Best Seller Nasional & Pelatih Pengembangan Diri',
      'Dewa Eka Prayoga adalah penulis best seller nasional yang karyanya telah menginspirasi ratusan ribu pembaca di Indonesia. Dikenal lewat buku-buku pengembangan diri bernuansa spiritual seperti “Jangan Mati Sebelum Menikah” dan “Melawan Kemustahilan”, ia menggabungkan prinsip keimanan dengan strategi praktis untuk menghadapi tantangan hidup.',
      'Sebagai founder komunitas literasi dan mentor bagi ribuan penulis muda, Dewa percaya bahwa setiap kisah bisa jadi wasilah kebaikan — asal ditulis dengan kejujuran dan niat tulus. Karyanya tidak hanya dibaca, tapi menggerakkan: dari keraguan menuju keyakinan, dari keputusasaan menuju harapan.',
      '“Menulis bukan soal hebat — tapi soal berani memulai.”',
    ],
    'Asma Nadia': [
      'Penulis Legendaris & Pendiri Forum Lingkar Pena',
      'Asma Nadia adalah salah satu penulis paling berpengaruh dalam sastra Islami Indonesia. Sebagai pendiri Forum Lingkar Pena (FLP) — komunitas penulis Muslim terbesar di Asia — ia telah membuka jalan bagi ribuan penulis muda untuk menyebarkan nilai-nilai kebaikan lewat pena.',
      'Karyanya seperti “Assalamu’alaikum Beijing”, “Rumah Tanpa Jendela”, dan “Sebelum Aku Tiada” menyentuh isu kemanusiaan, perjuangan, dan keimanan dengan kelembutan yang menggugah hati. Ia juga dikenal aktif dalam gerakan kemanusiaan, termasuk dukungan untuk Palestina — yang menjadi inspirasi utama di balik novel terbarunya.',
      '“Pena adalah senjata damai untuk mengubah dunia.”',
    ],
    'Arafat': [
      'Da’i Muda, Penulis Refleksi Spiritual, & Pengajar Al-Qur’an',
      'Ustadz Arafat adalah da’i muda yang dikenal karena kemampuannya menyampaikan pesan spiritual dengan bahasa yang sederhana, relevan, dan menyentuh jiwa. Aktif mengajar Al-Qur’an dan tajwid di berbagai pesantren dan komunitas, ia melihat bahwa banyak orang butuh teman untuk merenung — bukan hanya guru untuk menghafal.',
      'Dari pengalamannya mendampingi santri, remaja, dan orang tua, lahir buku “Titik Balik” — kumpulan refleksi harian yang mengajak pembaca berhenti sejenak, mengevaluasi hidup, dan memilih jalan yang lebih bermakna. Tulisannya bukan untuk dibaca sekali, tapi untuk dijadikan teman setia dalam perjalanan hidup.',
      '“Hari ini bisa jadi biasa... atau jadi titik balik yang mengubah segalanya.”',
    ],
  };

  const ProductPage: React.FC<ProductProps> = ({ slug, title, author, tagline, cover, synopsis, notes, testimonial, cartCount = 0, onAddToCart }) => {
    const [name, setName] = useState('');
    const [wa, setWa] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [qty, setQty] = useState<number>(1);
    const [coverLoaded, setCoverLoaded] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<string>(ADMIN_CONTACTS[0]?.phone || '6287879713808');
    // derive price number for JSON-LD
    const priceStr = PRODUCT_PRICING[title]?.price || 'Rp 0';
    const priceNum = Number((priceStr.match(/\d+/g) || []).join('') || 0);
    const canQuickOrder = name.trim().length>1 && /\d{10,}/.test((wa||'').replace(/\D/g,'')) && address.trim().length>5;
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
              <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="flex items-center gap-3" aria-label="Kembali ke Beranda">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-10 md:h-12 w-auto" />
                  <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-8 md:h-10 w-auto" />
                </div>
              </a>
              <nav className="hidden md:flex items-center gap-2">
                <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="px-3 py-2 rounded-full font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50">Beranda</a>
                <a href={`#/produk/${slug}`} onClick={(e)=>{e.preventDefault(); window.location.hash = `#/produk/${slug}`;}} className="px-3 py-2 rounded-full font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50">Produk</a>
                <a href="#/wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/wakaf';}} className="px-3 py-2 rounded-full font-semibold bg-emerald-700 text-white hover:bg-emerald-800">Wakaf</a>
                <button type="button" onClick={()=>{ window.location.hash = '#/keranjang'; }} className="relative inline-flex items-center px-3 py-2 rounded-full text-gray-700 hover:text-emerald-700 hover:bg-emerald-50" aria-label="Keranjang">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>
                  )}
                </button>
              </nav>
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={()=>{ window.location.hash = '#/keranjang'; }}
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
                <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#'; setMenuOpen(false);}} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Beranda</a>
                <a href={`#/produk/${slug}`} onClick={(e)=>{e.preventDefault(); window.location.hash = `#/produk/${slug}`; setMenuOpen(false);}} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50">Produk</a>
                <a href="#/wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/wakaf'; setMenuOpen(false);}} className="px-3 py-2 rounded-lg text-white bg-emerald-700">Wakaf</a>
                <button type="button" onClick={()=>{ setMenuOpen(false); window.location.hash = '#/keranjang'; }} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 text-left">Keranjang</button>
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
                    className="w-[20rem] md:w-[24rem] h-auto object-cover transform group-hover:scale-[1.01] transition"
                    loading="lazy"
                    onLoad={() => setCoverLoaded(true)}
                  />
                  <div className="absolute top-2 right-2 z-10 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow">Ready Stock</div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{title}</h1>
                <p className="mt-2 text-[#4A6741] font-semibold italic">{tagline}</p>
                <p className="mt-4 text-gray-700">Ditulis oleh <span className="font-semibold">{author}</span>, penulis best seller yang karyanya telah menginspirasi ribuan pembaca.</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {synopsis.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
              ))}
              {notes && (
                <div className="mt-2 text-emerald-800 bg-emerald-50 px-4 py-3 rounded-lg text-sm">{notes}</div>
              )}
              <div className="mt-4">
                <p className="text-sm text-[#e8f5e9]">Pilih admin untuk pemesanan:</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {ADMIN_CONTACTS.map((admin) => (
                    <a
                      key={admin.phone}
                      href={`https://wa.me/${admin.phone}?text=${encodeURIComponent(`Assalamu'alaikum, saya ingin memesan ${title}${PRODUCT_PRICING[title] ? ` (${PRODUCT_PRICING[title].price})` : ''}. Mohon informasi cara pemesanan.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#4A6741] font-semibold shadow"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">{admin.name.replace('Admin ', '')}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="mt-12 bg-[#4A6741]/10 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Tentang Penulis</h3>
                  <p className="mt-2 text-[#4A6741] font-semibold">{author}</p>
                  {AUTHOR_BIOS[author] ? (
                    <div className="mt-3 space-y-3 text-gray-700">
                      {AUTHOR_BIOS[author].map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-700">Penulis best seller dengan karya yang menginspirasi ribuan pembaca. Gaya menulis yang jujur dan menyentuh hati menghadirkan pengalaman baca yang reflektif.</p>
                  )}
                  <div className="mt-4 flex gap-8">
                    <div>
                      <div className="text-[#4A6741] font-extrabold text-xl">{(AUTHOR_STATS[author]?.books) || '-'}</div>
                      <div className="text-gray-500 text-sm">Buku Terbit</div>
                    </div>
                    <div>
                      <div className="text-[#4A6741] font-extrabold text-xl">{(AUTHOR_STATS[author]?.readers) || '-'}</div>
                      <div className="text-gray-500 text-sm">Estimasi Pembaca</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full shadow flex items-center justify-center overflow-hidden">
                    {AUTHOR_AVATARS[author] ? (
                      <>
                        {!avatarLoaded && <div className="w-full h-full"><SkeletonCard lines={1} className="h-full" /></div>}
                        <ResponsiveImage
                          src={AUTHOR_AVATARS[author]}
                          alt={`Foto ${author}`}
                          className={`w-full h-full object-cover ${author === 'Asma Nadia' ? 'object-[50%_25%]' : 'object-center'}`}
                          loading="lazy"
                          onLoad={() => setAvatarLoaded(true)}
                        />
                      </>
                    ) : (
                      <User className="w-14 h-14 text-[#4A6741]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            {testimonial && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Testimoni Pembaca</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-gray-700 italic">“{testimonial.quote}”</p>
                    <p className="mt-2 text-sm text-gray-500">— {testimonial.by}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-gray-700 italic">“Buku ini menguatkan saya untuk kembali bangkit di masa sulit.”</p>
                    <p className="mt-2 text-sm text-gray-500">— Pembaca, Indonesia</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Pembelian via WhatsApp + Keranjang */}
            <div className="mt-12 rounded-2xl p-6 md:p-8 bg-[#4A6741] text-white">
              <h2 className="text-2xl font-bold">Pesan Sekarang via WhatsApp</h2>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-lg opacity-90">Harga</span>
                <span className="text-3xl font-extrabold">{PRODUCT_PRICING[title]?.price || '-'}</span>
              </div>
              {PRODUCT_PRICING[title]?.bonus && (
                <p className="mt-2 text-sm bg-white/10 rounded-lg px-3 py-2">{PRODUCT_PRICING[title]?.bonus}</p>
              )}
              <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 w-max">
                  <button type="button" aria-label="Kurangi" onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-2 py-1 rounded bg-white/20">-</button>
                  <input value={qty} onChange={(e)=>setQty(Math.max(1, Math.min(999, Number(e.target.value)||1)))} type="number" min={1} max={999} className="w-16 text-center bg-transparent outline-none" />
                  <button type="button" aria-label="Tambah" onClick={()=>setQty(q=>Math.min(999,q+1))} className="px-2 py-1 rounded bg-white/20">+</button>
                </div>
                <button
                  type="button"
                  onClick={() => { onAddToCart?.({ slug, title, cover, qty }); }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-[#4A6741] font-semibold shadow"
                >
                  Tambah ke Keranjang
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 text-sm text-white/90">🔖 Produk dari Tim yang Sama dengan Al-Qur’an Kharisma</div>

              <div className="mt-6 bg-white/10 rounded-2xl p-4 md:p-5">
                <div className="font-semibold text-white">Pesan Cepat</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nama lengkap" className="w-full rounded-lg px-3 py-2 bg-white text-gray-900 outline-none" />
                  <input value={wa} onChange={(e)=>setWa(e.target.value)} placeholder="Nomor WhatsApp" className="w-full rounded-lg px-3 py-2 bg-white text-gray-900 outline-none" />
                  <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Alamat lengkap" className="w-full rounded-lg px-3 py-2 bg-white text-gray-900 outline-none" />
                </div>
                <div className="mt-3">
                  <p className="text-sm text-white/90 font-medium mb-2">Pilih admin tujuan:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ADMIN_CONTACTS.map((admin) => {
                      const online = isOnlineNow();
                      const active = selectedAdmin===admin.phone;
                      return (
                        <button
                          key={admin.phone}
                          type="button"
                          onClick={() => setSelectedAdmin(admin.phone)}
                          className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-white text-[#4A6741] border-white' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{admin.name.replace('Admin ','')}</span>
                            <span className={`text-[10px] font-normal inline-flex items-center gap-1 ${online ? (active ? 'text-emerald-600' : 'text-emerald-100') : 'text-white/70'}`} title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? (active ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300 animate-pulse') : 'bg-white/50'}`}></span>
                              {online ? 'Online' : 'Offline — balas di jam kerja'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={!canQuickOrder}
                    onClick={async ()=>{
                      try {
                        const total = priceNum * Math.max(1, qty);
                        await fetch('/api/order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            source: 'quick-order',
                            slug,
                            title,
                            qty,
                            total,
                            name,
                            whatsapp: wa,
                            address,
                            utm: readUtm(),
                          }),
                        });
                      } catch {}
                      const msgLines = [
                        `Assalamu’alaikum, saya ingin memesan ${title}.`,
                        `Jumlah: ${Math.max(1, qty)}`,
                        `Nama: ${name}`,
                        `WhatsApp: ${wa}`,
                        `Alamat: ${address}`,
                        `Total estimasi: Rp ${ (priceNum * Math.max(1, qty)).toLocaleString('id-ID') } (belum ongkir)`,
                        `\nSaya akan mengirimkan bukti transfer setelah pembayaran.`,
                      ].join('\n');
                      const fb = (window as any).fbq;
                      if (typeof fb === 'function') {
                        const qtyNow = Math.max(1, qty);
                        const val = priceNum * qtyNow;
                        fb('track', 'AddPaymentInfo', {
                          currency: 'IDR',
                          value: val,
                          items: [{ item_id: slug, item_name: title, price: priceNum, quantity: qtyNow }],
                        });
                        fb('track', 'Contact', { content_name: title, content_ids: [slug], content_type: 'product', currency: 'IDR', value: val });
                      }
                      window.open(`https://wa.me/${selectedAdmin}?text=${encodeURIComponent(msgLines)}`, '_blank');
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold ${canQuickOrder? 'bg-white text-[#4A6741] hover:bg-gray-100' : 'bg-white/40 text-white/70 cursor-not-allowed'}`}
                  >
                    Kirim Pemesanan via WhatsApp
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          
        </main>
      </div>
    );
  };

  const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
    const { ref, inView } = useInView();
    return (
      <div
        ref={ref}
        style={{ transitionDelay: `${Math.min(delay, 700)}ms` }}
        className={[
          'transform transition-all duration-700',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          className || ''
        ].join(' ').trim()}
      >
        {children}
      </div>
    );
  };

  const App: React.FC = () => {
    useEffect(()=>{ captureFirstUtm(); },[]);
    const GA_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-YN5SV4C5CT';
    const track = (name: string, params?: Record<string, any>) => {
      const g = (window as any).gtag;
      if (typeof g === 'function') g('event', name, params || {});
    };
    useEffect(() => {
      const onHash = () => {
        const fb = (window as any).fbq;
        if (typeof fb === 'function') fb('track', 'PageView');
        const g = (window as any).gtag;
        if (typeof g === 'function') g('event', 'page_view', { page_location: window.location.href });
      };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, []);
    useEffect(() => {
      const fired = {25:false,50:false,75:false,100:false} as Record<number, boolean>;
      const onScroll = () => {
        const h = document.documentElement;
        const max = (h.scrollHeight - h.clientHeight) || 1;
        const pct = Math.min(100, Math.round((h.scrollTop / max) * 100));
        const fb = (window as any).fbq;
        [25,50,75,100].forEach(p => {
          if (!fired[p] && pct >= p) {
            fired[p] = true;
            if (typeof fb === 'function') fb('trackCustom', 'ScrollDepth', { percent: p });
          }
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll as any);
    }, []);
    // ... rest of the code remains the same ...
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [showSplash, setShowSplash] = useState(true);
    const [splashExit, setSplashExit] = useState(false);
    const [showStickyCta, setShowStickyCta] = useState(true);
    const [countdown, setCountdown] = useState<{days:number; hours:number; minutes:number; seconds:number}>({days:0,hours:0,minutes:0,seconds:0});
    const [currentPage, setCurrentPage] = useState(0);
    const [route, setRoute] = useState<string>(typeof window !== 'undefined' ? window.location.hash || '#' : '#');
    const [cartCount, setCartCount] = useState<number>(typeof window !== 'undefined' ? getCartTotalQty() : 0);
    const handleAddToCart = (payload: { slug: string; title: string; cover: string; qty: number }) => {
      addCartItem(payload);
      setCartCount(getCartTotalQty());
      // GA4 add_to_cart
      const priceStr = PRODUCT_PRICING[payload.title]?.price || 'Rp 0';
      const priceNum = Number((priceStr.match(/\d+/g) || []).join('') || 0);
      track('add_to_cart', {
        currency: 'IDR',
        value: priceNum * payload.qty,
        items: [{ item_id: payload.slug, item_name: payload.title, price: priceNum, quantity: payload.qty }],
      });
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
      // Toast: mobile = compact pill, desktop = with CTA
      try {
        const id = 'cart-toast';
        let el = document.getElementById(id) as HTMLDivElement | null;
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640; // treat <640px as mobile
        if (!el) {
          el = document.createElement('div');
          el.id = id;
          el.setAttribute('role', 'status');
          el.setAttribute('aria-live', 'polite');
          el.style.position = 'fixed';
          el.style.left = '50%';
          el.style.transform = 'translate(-50%, 10px)';
          el.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 18px)';
          el.style.zIndex = '9999';
          el.style.opacity = '0';
          el.style.transition = 'opacity 180ms ease, transform 180ms ease';
          document.body.appendChild(el);
          requestAnimationFrame(() => {
            el!.style.opacity = '1';
            el!.style.transform = 'translate(-50%, 0)';
          });
        }

        // reset content and base styles per mode
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
          // Compact pill text-only
          const span = document.createElement('span');
          span.textContent = text;
          span.style.display = 'block';
          span.style.padding = '10px 16px';
          span.style.fontWeight = '700';
          span.style.fontSize = '14px';
          span.style.textAlign = 'center';
          span.style.lineHeight = '1.3';
          el.appendChild(span);
        } else {
          // Desktop with CTA button
          const wrap = document.createElement('div');
          wrap.style.display = 'flex';
          wrap.style.alignItems = 'center';
          wrap.style.justifyContent = 'center';
          wrap.style.gap = '10px';
          wrap.style.padding = '12px 14px';

          const span = document.createElement('span');
          span.textContent = text;
          span.style.display = 'inline-block';
          span.style.fontWeight = '600';
          span.style.fontSize = '14px';

          const btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = 'Lihat Keranjang';
          btn.style.background = '#4A6741';
          btn.style.color = '#fff';
          btn.style.border = '0';
          btn.style.borderRadius = '9999px';
          btn.style.padding = '8px 12px';
          btn.style.fontWeight = '700';
          btn.style.fontSize = '13px';
          btn.style.whiteSpace = 'nowrap';
          btn.style.boxShadow = '0 8px 18px rgba(74,103,65,0.35)';
          btn.style.cursor = 'pointer';
          btn.onclick = () => {
            window.location.hash = '#/keranjang';
            el?.remove();
          };

          wrap.appendChild(span);
          wrap.appendChild(btn);
          el.appendChild(wrap);
        }

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { (navigator as any).vibrate?.(15); } catch {}
        }
        clearTimeout((window as any).__cartToastTimer);
        (window as any).__cartToastTimer = window.setTimeout(() => {
          if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, 10px)';
            setTimeout(() => el?.remove(), 180);
          }
        }, 2200);
      } catch {}
    };
    // Route helpers must be declared before effects that depend on them
    const isLP = !route.startsWith('#/wakaf') && !route.startsWith('#/galeri-wakaf') && !route.startsWith('#/keranjang') && !route.startsWith('#/pesan-quran');
    const isWakaf = route.startsWith('#/wakaf');
    const isGaleri = route.startsWith('#/galeri-wakaf');
    const isKeranjang = route.startsWith('#/keranjang');
    const isPesanQuran = route.startsWith('#/pesan-quran');

    useEffect(() => {
      const onScroll = () => setIsScrolled(window.scrollY > 24);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
      const onHash = () => setRoute(window.location.hash || '#');
      const onStorage = (e: StorageEvent) => { if (e.key === CART_KEY) setCartCount(getCartTotalQty()); };
      window.addEventListener('hashchange', onHash);
      window.addEventListener('storage', onStorage);
      return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('storage', onStorage); };
    }, []);

    // Scroll ke atas setiap kali berpindah halaman (route berubah)
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const fb = (window as any).fbq;
      if (typeof fb === 'function') {
        fb('track', 'PageView');
      }
    }, [route]);

    // Splash screen once on initial load (with exit animation)
    useEffect(() => {
      const t1 = setTimeout(() => setSplashExit(true), 1800); // start exit after 1.8s
      const t2 = setTimeout(() => setShowSplash(false), 2400); // remove after exit ~0.6s
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    // Countdown to a target promo date (example: 5 Nov 2025 23:59:59 local time)
    useEffect(() => {
      const target = new Date('2025-11-05T23:59:59');
      const tick = () => {
        const now = new Date();
        const diff = Math.max(0, target.getTime() - now.getTime());
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff / (1000*60*60)) % 24);
        const m = Math.floor((diff / (1000*60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setCountdown({days:d, hours:h, minutes:m, seconds:s});
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, []);

    const promoActive = (countdown.days + countdown.hours + countdown.minutes + countdown.seconds) > 0;
    const [selectedWaitAdmin, setSelectedWaitAdmin] = useState<string>(ADMIN_CONTACTS[0].phone);
    const selectedWaitAdminObj = useMemo(() => ADMIN_CONTACTS.find(a => a.phone === selectedWaitAdmin), [selectedWaitAdmin]);
    const waitlistMessage = useMemo(() => {
      const label = (selectedWaitAdminObj?.name || 'Admin').replace('Admin ', '');
      return `Assalamu’alaikum, saya tertarik promo Al-Qur’an Kharisma. Tolong infokan saat promo buka lagi ya ${label}. InsyaAllah saya langsung order. Terima kasih 😊`;
    }, [selectedWaitAdminObj]);

    const navItems: NavItem[] = useMemo(() => ([
      { name: 'Masalah', href: '#masalah' },
      { name: 'Solusi', href: '#solusi' },
      { name: 'Fitur', href: '#fitur' },
      { name: 'Testimoni', href: '#testimoni' },
      { name: 'Harga', href: '#harga' },
    ]), []);

    // Section in-view state for LP navbar highlight
    const [activeSection, setActiveSection] = useState<string | null>(null);
    useEffect(() => {
      if (!isLP) return;
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const ids = ['masalah','solusi','fitur','testimoni','harga'];
      const els = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);
      if (els.length === 0) return;

      if (!('IntersectionObserver' in window)) {
        setActiveSection(null);
        return;
      }

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
    }, [isLP]);

    const testimonials: Testimonial[] = [
      {
        id: 1,
        name: 'Muhammad Faqih',
        role: 'Santri Pesantren',
        rating: 4.5,
        content:
          "Al-Qur’an Kharisma benar-benar istimewa. Desainnya elegan, tulisannya jelas dan nyaman dibaca, bahkan ada panduan tajwid warna-warni yang sangat membantu. Saya merasa lebih semangat mengaji setiap harinya. Cocok banget untuk hadiah atau dipakai pribadi. Mantap!",
        avatar: 'MF',
      },
      {
        id: 2,
        name: 'Muhammad Abriel',
        role: 'Santri Pesantren',
        rating: 5,
        content:
          "Sejak pakai Al-Qur’an tajwid berwarna ini, bacaan jadi lebih mudah dan terarah. Setiap warna jelas menuntun cara baca—tahan, dengung, atau panjang. Tulisannya nyaman dipandang, nggak bikin lelah. Alhamdulillah, kini lebih yakin dan semangat perbaiki tajwid tiap hari!",
        avatar: 'MA',
      },
      {
        id: 3,
        name: 'Abaikeun',
        role: 'Mahasiswa',
        rating: 4.0,
        content:
          "sungguh berterima kasih kepada pabrik yang telah membuat kharisma Quran ini, saya jadi bener bener terbantu, kenapa? karena fitur nya lengkap, ada tajwid berwarna, terjemahan, dan metode cara menghafal yang mudah",
        avatar: 'A',
      },
      {
        id: 4,
        name: 'Muhammad Tamma',
        role: 'Santri Pesantren',
        rating: 4.5,
        content:
          'Alhamdulillah, sejak pakai Al-Qur’an Kharisma, belajar tajwid jadi lebih mudah dan menyenangkan. Warna-warna hukum bacaan membantu saya cepat pahami idgham, ikhfa, dan mad. Tampilannya jelas, bikin fokus saat murojaah, dan kini saya lebih percaya diri baca di depan guru dan teman. Bagi saya, ini bukan cuma mushaf—tapi sahabat belajar yang memudahkan perbaikan bacaan.',
        avatar: 'MT',
      },
      {
        id: 5,
        name: 'Ibrahim Abdillah',
        role: 'Santri Pesantren',
        rating: 4.0,
        content:
          'Sejak pakai Al-Qur’an Kharisma, bacaan saya jadi lebih lancar dan tepat. Tajwid berwarna sangat mudah dipahami—bahkan untuk pemula—ditambah desain elegan, kertas nyaman, terjemah, dan asbabun nuzul yang memperdalam pemahaman. Bukan cuma mushaf, tapi guru tajwid dalam genggaman. Alhamdulillah, setiap bacaan terasa lebih tenang dan dekat dengan-Nya.',
        avatar: 'IA',
      },
      {
        id: 6,
        name: 'Muhammad Nizar',
        role: 'Santri Pesantren',
        rating: 4.5,
        content:
          'Sejak pakai Al-Qur’an Kharisma, bacaan saya jauh lebih percaya diri dan tepat. Tajwid warnanya bikin gampang bedain hukum bacaan—nggak pusing lagi saat tilawah. Desainnya estetik, kertasnya lembut di mata, dan ada terjemah plus asbabun nuzul yang bikin ngerti konteks ayat. Bukan cuma mushaf biasa, tapi teman belajar yang selalu mengingatkan cara membaca dengan benar. Alhamdulillah, setiap baca, rasanya lebih khusyuk dan nyaman di hati.',
        avatar: 'MN',
        avatarUrl: '/muhammad-nizar.jpg',
      },
      {
        id: 7,
        name: 'Putri aliani',
        role: 'Mahasiswi',
        rating: 4.5,
        content:
          'Sejak pakai Al-Qur’an berwarna tajwid ini, bacaannya jadi lebih tenang dan lancar. Warna-warnanya bantu banget buat tahu kapan harus panjang, berhenti, atau dengung. Jadi lebih semangat tilawah tiap hari 😇',
        avatar: 'PA',
      },
      {
        id: 8,
        name: 'Muhammad Iqbal',
        role: 'Karyawan',
        rating: 4.0,
        content:
          'Dulu sering bingung pas baca, takut salah panjang pendeknya. Sekarang lebih pede karena warnanya jelas banget. Desainnya juga cantik, bikin pengen buka terus 💖',
        avatar: 'MI',
      },
      {
        id: 9,
        name: 'Dede Anya',
        role: 'Pelajar',
        rating: 4.5,
        content:
          'Nggak nyangka, ternyata warna tajwid itu ngaruh banget! Jadi lebih cepat hafal cara bacanya. Cocok banget buat yang masih belajar kayak aku, nggak bikin pusing 😍',
        avatar: 'DA',
      },
      {
        id: 10,
        name: 'Mas Rehan',
        role: 'Guru',
        rating: 4.0,
        content:
          'Al-Qur’an ini bener-bener ngebantu aku istiqamah tilawah. Hurufnya jelas, warnanya lembut di mata, dan tiap baca rasanya tenang banget. Worth it pokoknya!',
        avatar: 'MR',
      },
      {
        id: 11,
        name: 'Mas Dimas',
        role: 'Orang Tua',
        rating: 5.0,
        content:
          'Anak saya jadi lebih rajin baca karena warna-warni tajwidnya menarik. Sekalian belajar hukum bacaan juga. Seneng banget lihat dia makin cinta sama Al-Qur’an 💕',
        avatar: 'MD',
      },
      {
        id: 12,
        name: 'Ahmad',
        role: 'Santri, Pondok Pesantren Al-Ikhlas, Jawa Timur',
        rating: 4.5,
        content:
          'Alhamdulillah, sejak pakai Quran Kharisma, bacaan saya jadi lebih lancar. Tajwid warnanya bikin gampang bedain hukum bacaan!',
        avatar: 'A',
      },
      {
        id: 13,
        name: 'Siti',
        role: 'Ibu Rumah Tangga, Bandung',
        rating: 5,
        content:
          "Anak saya jadi semangat ngaji sejak punya Quran Kharisma. Katanya, ‘Mama, ini mushafnya kayak punya guru ngaji!’",
        avatar: 'S',
      },
      {
        id: 14,
        name: 'Ustaz Fauzi',
        role: 'Pengajar Tahfidz, Yogyakarta',
        rating: 5,
        content:
          'Saya rekomendasikan Quran Kharisma ke semua santri. Desainnya membantu mereka fokus dan tidak cepat lelah.',
        avatar: 'UF',
      },
      {
        id: 15,
        name: 'Rina',
        role: 'Mahasiswa, Jakarta',
        rating: 4.5,
        content:
          'Dulu takut salah baca di depan teman. Sekarang, berani jadi imam! Terima kasih Quran Kharisma.',
        avatar: 'R',
      },
      {
        id: 16,
        name: 'Hafizh',
        role: 'Usia 10 Tahun, Surabaya',
        rating: 4.5,
        content:
          'Aku hafal Juz 30 lebih cepat pakai Quran Kharisma. Warnanya bikin aku nggak bingung!',
        avatar: 'H',
      },
      {
        id: 17,
        name: 'Bu Lina',
        role: 'Guru TPQ, Semarang',
        rating: 5,
        content:
          'Kertasnya tebal, nggak tembus, dan nyaman dibaca. Santri saya jadi betah muroja’ah berjam-jam.',
        avatar: 'BL',
      },
      {
        id: 18,
        name: 'Dinda',
        role: 'Content Creator, Bali',
        rating: 4.5,
        content:
          'Feed Instagram saya jadi lebih estetik pakai visual Quran Kharisma. Banyak yang tanya, ‘Ini mushaf apa?’',
        avatar: 'D',
      },
      {
        id: 19,
        name: 'Pak Ridwan',
        role: 'Orang Tua, Medan',
        rating: 5,
        content:
          'Saya wakafkan 5 mushaf untuk pesantren. Alhamdulillah, dapat foto santri yang menerimanya. Rasanya bahagia sekali.',
        avatar: 'PR',
      },
      {
        id: 20,
        name: 'Nabila',
        role: 'Santriwati, Aceh',
        rating: 4.5,
        content:
          'Tajwid warnanya jelas banget. Bahkan untuk pemula seperti saya, langsung paham cara bacanya.',
        avatar: 'N',
      },
      {
        id: 21,
        name: 'Ustazah Aisyah',
        role: 'Pengajar, Makassar',
        rating: 5,
        content:
          'Quran Kharisma jadi alat ajar favorit saya. Santri lebih cepat paham idgham, ikhfa, dan mad.',
        avatar: 'UA',
      },
      {
        id: 22,
        name: 'Fikri',
        role: 'Mahasiswa Tahfidz, Bogor',
        rating: 5,
        content:
          'Desainnya elegan, kertasnya premium. Ini mushaf yang layak diwariskan ke anak cucu.',
        avatar: 'F',
      },
      {
        id: 23,
        name: 'Ibu Dewi',
        role: 'Pemilik Usaha, Malang',
        rating: 4.5,
        content:
          'Saya beli untuk anak dan suami. Sekarang, kami tilawah bareng tiap malam. Hatinya jadi tenang.',
        avatar: 'ID',
      },
      {
        id: 24,
        name: 'Zahra',
        role: 'Usia 12 Tahun, Palembang',
        rating: 4.5,
        content:
          "Dulu sering salah baca ‘qalqalah’. Sekarang, nggak pernah salah lagi! Terima kasih Quran Kharisma.",
        avatar: 'Z',
      },
      {
        id: 25,
        name: 'Kyai Hamid',
        role: 'Pengasuh Pesantren, Cirebon',
        rating: 5,
        content:
          'Mushaf ini sesuai standar Kemenag dan mudah dipahami. Kami gunakan untuk santri pemula.',
        avatar: 'KH',
      },
      {
        id: 26,
        name: 'Rizky',
        role: 'Freelancer, Jakarta',
        rating: 4.5,
        content:
          'Saya beli sebagai hadiah pernikahan. Pasangan saya senang banget — katanya mushaf paling indah yang pernah dia punya.',
        avatar: 'R',
      },
      {
        id: 27,
        name: 'Salsa',
        role: 'Santri, Lampung',
        rating: 4.5,
        content:
          'Terjemah per katanya bikin saya paham makna ayat. Tilawah jadi lebih khusyuk.',
        avatar: 'S',
      },
      {
        id: 28,
        name: 'Pak Joko',
        role: 'Guru Ngaji, Solo',
        rating: 5,
        content:
          'Saya bandingkan dengan 5 mushaf tajwid lain. Quran Kharisma paling jelas dan nyaman.',
        avatar: 'PJ',
      },
      {
        id: 29,
        name: 'Mira',
        role: 'Ibu Muda, Depok',
        rating: 4.5,
        content:
          'Anak saya jadi nggak rewel saat ngaji. Katanya, ‘Mushaf ini warnanya lucu, Bun!’',
        avatar: 'M',
      },
      {
        id: 30,
        name: 'Hafizh Muda',
        role: 'Usia 9 Tahun, Bandung',
        rating: 4.5,
        content:
          'Aku hafal Surah Ar-Rahman dalam 2 minggu! Quran Kharisma bikin hafalan jadi mudah.',
        avatar: 'HM',
      },
      {
        id: 31,
        name: 'Ustaz Rudi',
        role: 'Da’i Muda, Pontianak',
        rating: 5,
        content:
          'Saya bawa Quran Kharisma saat ceramah. Jemaah sering minta rekomendasi. Ini mushaf yang menginspirasi.',
        avatar: 'UR',
      },
    ];

    // Map role string to a representative icon for avatar fallback
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
        icon: <Shield className="w-8 h-8 text-emerald-600" aria-hidden />,
        title: 'Cover Hardcover Eksklusif',
        description: 'Desain elegan dengan kualitas cover yang kuat dan berkelas.',
      },
      {
        icon: <Truck className="w-8 h-8 text-emerald-600" aria-hidden />,
        title: 'Pengiriman Aman',
        description: 'Dikemas rapi dengan perlindungan maksimal hingga sampai di tangan Anda.',
      },
    ];

    

    const pageSize = 3;
    const totalPages = Math.ceil(testimonials.length / pageSize) || 1;
    const visibleTestimonials = useMemo(() => {
      const start = currentPage * pageSize;
      return testimonials.slice(start, start + pageSize);
    }, [currentPage, testimonials]);

    const nextTestimonial = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
    const prevTestimonial = () => setCurrentPage((p) => Math.max(p - 1, 0));
    const preserveScroll = (cb: () => void) => {
      const y = window.scrollY;
      cb();
      // Lock scroll position across layout reflows
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, left: 0, behavior: 'auto' });
        });
      });
      setTimeout(() => {
        window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      }, 120);
    };

    // Lock scroll relative to testimonials container to avoid jumping on mobile
    const testiContainerRef = useRef<HTMLDivElement | null>(null);
    const preserveScrollToTesti = (cb: () => void) => {
      const top = ((testiContainerRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY) || window.scrollY;
      cb();
      requestAnimationFrame(() => {
        window.scrollTo({ top, left: 0, behavior: 'auto' });
        requestAnimationFrame(() => window.scrollTo({ top, left: 0, behavior: 'auto' }));
      });
      setTimeout(() => window.scrollTo({ top, left: 0, behavior: 'auto' }), 120);
    };

    const handleSmoothNav = (href: string) => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    };

    const productSlug = useMemo(() => {
      if (route.startsWith('#/produk/')) {
        return route.replace('#/produk/', '') as 'melawan-kemustahilan' | 'sebelum-aku-tiada' | 'titik-balik';
      }
      return null;
    }, [route]);

    const isProduk = Boolean(productSlug);

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
                {cartCount > 0 && (<span className="absolute -top-1 -right-1 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>)}
              </button>
              <a href="#harga" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#harga'); }} className="btn-primary !py-2 whitespace-nowrap">Pesan Sekarang</a>
              <a href="#/wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/wakaf'; }} className="inline-flex items-center font-medium px-3 py-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 whitespace-nowrap">Wakaf</a>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <button type="button" onClick={() => { window.location.hash = '#/keranjang'; }} className="relative inline-flex items-center p-2 rounded-full text-emerald-700 hover:bg-emerald-50" aria-label="Keranjang">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (<span className="absolute -top-0.5 -right-0.5 bg-[#4CAF50] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">{cartCount}</span>)}
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
                {cartCount > 0 && (<span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] rounded-full bg-[#4CAF50] text-white px-1">{cartCount}</span>)}
              </button>
              <a href="#/wakaf" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); window.location.hash = '#/wakaf'; setIsMenuOpen(false); }} className="text-center inline-flex items-center justify-center font-semibold px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm ring-1 ring-emerald-800/20">Wakaf</a>
            </div>
          </div>
        )}
      </header>
    );

    const HeaderWakaf = (
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-white'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="flex items-center gap-2" aria-label="Kembali ke Beranda">
              <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-10 md:h-12 lg:h-14 w-auto" />
              <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-10 md:h-12 lg:h-14 w-auto" />
            </a>
            <nav className="hidden md:flex items-center gap-2">
              <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className={`px-3 py-2 rounded-full font-medium ${isLP ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Beranda</a>
              <a href="#/galeri-wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/galeri-wakaf';}} className={`px-3 py-2 rounded-full font-medium ${isGaleri ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Galeri Penyaluran</a>
            </nav>
            <button className="md:hidden text-gray-700" aria-label="Toggle menu" onClick={() => setIsMenuOpen((v) => !v)}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
    );

    const HeaderGaleri = (
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${isScrolled ? 'bg-white/90 backdrop-blur shadow-sm' : 'bg-white'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="flex items-center gap-3" aria-label="Kembali ke Beranda">
              <img src="/logo.png" alt="Logo Al-Qur'an Kharisma" className="h-12 md:h-14 lg:h-16 w-auto" />
              <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-12 md:h-14 lg:h-16 w-auto ml-1" />
            </a>
            <nav className="hidden md:flex items-center gap-2">
              <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className={`px-3 py-2 rounded-full font-medium ${isLP ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Beranda</a>
              <a href="#/galeri-wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/galeri-wakaf';}} className={`px-3 py-2 rounded-full font-medium ${isGaleri ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'}`}>Galeri Penyaluran</a>
            </nav>
            <button className="md:hidden" aria-label="Toggle menu" onClick={() => setIsMenuOpen((v) => !v)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    );

    return (
      <div className={`min-h-screen text-gray-800`}>
        {showSplash && (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className={`flex flex-col items-center justify-center text-center transform transition-all duration-500 ${splashExit ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-black">Tech Provider</p>
                  <img src="/logo.png" alt="Tech Provider" className="mt-1 h-16 md:h-24 lg:h-28 w-auto animate-zoom-in drop-shadow" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-black">Brand Owner</p>
                  <img src="/logo-aba.png" alt="Brand Owner" className="mt-1 h-12 md:h-16 lg:h-20 w-auto animate-fade-in" />
                </div>
              </div>
              <p className="mt-4 text-sm md:text-base text-emerald-700/90 animate-pulse" aria-live="polite">Halaman sedang dimuat…</p>
            </div>
          </div>
        )}
        {/* Header */}
        {isProduk ? null : (isLP ? HeaderLP : isWakaf ? HeaderWakaf : HeaderGaleri)}

        <main>
          {isKeranjang ? (
            <CartPage cartCount={cartCount} setCartCount={setCartCount} />
          ) : isPesanQuran ? (
            <QuickOrderQuranPage />
          ) : productSlug === 'melawan-kemustahilan' ? (
            <ProductPage
              slug="melawan-kemustahilan"
              title="Melawan Kemustahilan"
              author="Dewa Eka Prayoga"
              tagline="Menguji Keimanan, Menjemput Keajaiban"
              cover="/images/melawan-kemustahilan.jpg"
              synopsis={[
                'Dalam hidup, ada saat-saat kita merasa terjepit, hampir menyerah, dan bertanya: “Apakah ini akhirnya?” Buku ini adalah teman setia di masa sulit — mengingatkan bahwa di balik setiap kemustahilan, ada keajaiban yang menunggu mereka yang tetap percaya.',
                'Melalui kisah nyata dan refleksi spiritual, Melawan Kemustahilan mengajakmu untuk tidak menyerah, terus berdoa, dan yakin bahwa Allah selalu punya rencana indah — bahkan saat kau tak melihatnya.'
              ]}
              testimonial={{ quote: 'Buku ini datang tepat saat saya di PHK. Membacanya bikin saya bangkit lagi. Terima kasih, Kang Dewa!', by: 'Rudi, Bandung' }}
              cartCount={cartCount}
              onAddToCart={handleAddToCart}
            />
          ) : productSlug === 'sebelum-aku-tiada' ? (
            <ProductPage
              slug="sebelum-aku-tiada"
              title="Sebelum Aku Tiada"
              author="Asma Nadia"
              tagline="Surat-Surat dari Gaza"
              cover="/images/sebelum-aku-tiada.jpg"
              synopsis={[
                'Dalam kesunyian paling jujur, manusia bertemu dirinya sendiri. Sebelum Aku Tiada adalah undangan untuk berhenti sebentar — menata ulang arah, memeluk luka, dan kembali beriman pada takdir yang baik.',
                'Setiap halaman adalah doa yang ditulis dengan tinta air mata — namun menguatkan, bukan melemahkan.'
              ]}
              testimonial={{ quote: 'Saya menangis di halaman 12. Buku ini mengingatkan kita: hidup ini berharga, dan setiap kata bisa jadi amal.', by: 'Siti, Yogyakarta' }}
              cartCount={cartCount}
              onAddToCart={handleAddToCart}
            />
          ) : productSlug === 'titik-balik' ? (
            <ProductPage
              slug="titik-balik"
              title="Titik Balik"
              author="Arafat"
              tagline="Ada 365 Hari Dalam Setahun..."
              cover="/images/titik-balik.jpg"
              synopsis={[
                'Setiap hari adalah kesempatan memulai kembali. Titik Balik mengajakmu menata ulang hidup — perlahan, tanpa membenci masa lalu.',
                'Refleksi ringan namun dalam, cocok untuk dibaca setiap pagi sebagai pengingat bahwa Allah selalu membuka pintu pulang.'
              ]}
              testimonial={{ quote: 'Buku ini seperti sahabat yang mengingatkan dengan lembut.', by: 'Andi, Surabaya' }}
              cartCount={cartCount}
              onAddToCart={handleAddToCart}
            />
          ) : route.startsWith('#/wakaf') ? (
            <Wakaf />
          ) : route.startsWith('#/galeri-wakaf') ? (
            <GaleriWakaf />
          ) : (
          <>
          {/* Hero */}
          <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Logo watermark */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <img
                src="/logo.png"
                alt=""
                className="hidden md:block absolute -right-20 -top-16 opacity-10 saturate-0 blur-[1px] w-[280px] lg:w-[360px] animate-float-slow"
              />
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
                      <img
                        src="/cover.jpg"
                        alt="Gambar produk Al-Qur'an Kharisma"
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-[3/4] animate-float-slow"
                      />
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
              <div className="rounded-xl border border-emerald-100 bg-white p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-emerald-800">
              </div>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: <MessageCircle className="w-10 h-10 text-emerald-600" aria-hidden />,
                    title: 'Sulit membedakan hukum tajwid',
                    desc: 'Antara ghunnah, qalqalah, dan lainnya sering tertukar saat membaca.'
                  },
                  {
                    icon: <BookOpen className="w-10 h-10 text-emerald-600" aria-hidden />,
                    title: 'Khawatir salah pelafalan',
                    desc: 'Kurang yakin dengan makhraj dan sifat huruf saat tilawah.'
                  },
                  {
                    icon: <Clock className="w-10 h-10 text-emerald-600" aria-hidden />,
                    title: 'Memakan waktu untuk memahami',
                    desc: 'Butuh waktu lama untuk memahami makna ayat demi ayat.'
                  },
                  {
                    icon: <User className="w-10 h-10 text-emerald-600" aria-hidden />,
                    title: 'Tidak yakin bacaan sendiri',
                    desc: 'Tidak ada yang mengoreksi, sehingga ragu saat membaca.'
                  },
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

          {/* Solution */}
          <section id="solusi" className="section-padding bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
              <Reveal>
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Solusi Terbaik
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Al-Qur'an Kharisma: Solusi Membaca dengan Benar dan Mudah
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Sistem tajwid warna memandu bacaan, terjemah per kata memperjelas makna, membuat proses belajar lebih cepat dan tepat.
                  </p>
                  <div className="space-y-3 mb-6">
                    {[
                      'Tajwid warna memudahkan identifikasi hukum bacaan',
                      'Terjemah 15 baris Kemenag RI',
                      'Panduan tajwid praktis untuk pemula hingga mahir',
                      'Kualitas cetak premium, nyaman untuk tilawah lama',
                      'Cover & kertas high quality',
                    ].map((t, i) => (
                      <div className="flex items-start" key={i}>
                        <Check className="w-5 h-5 text-emerald-200 mr-2 mt-0.5" />
                        <p className="text-gray-700">{t}</p>
                      </div>
                    ))}
                  </div>
                  <a href="#fitur" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); handleSmoothNav('#fitur'); }} className="btn-primary inline-flex items-center">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 w-5 h-5" />
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
                      <img
                        src="/before.jpeg"
                        alt="Contoh mushaf tanpa tajwid warna"
                        loading="lazy"
                        className="mx-auto rounded shadow-inner object-cover aspect-[3/4]"
                      />
                      <p className="mt-2 text-sm text-gray-500">Sulit membedakan hukum tajwid</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <img
                        src="/after.jpeg"
                        alt="Contoh mushaf dengan tajwid warna"
                        loading="lazy"
                        className="mx-auto rounded shadow-inner object-cover aspect-[3/4]"
                      />
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
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition hover:-translate-y-1">
                      <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mb-4" aria-hidden>
                        {f.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{f.title}</h3>
                      <p className="text-gray-600">{f.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimoni" className="section-padding bg-gray-50">
            <div ref={testiContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 [overflow-anchor:none]">
              <Reveal>
                <h2 className="section-title">Apa Kata Mereka yang Sudah Merasakan Manfaatnya</h2>
                <p className="section-subtitle">Testimoni realistis dari berbagai kalangan pembaca.</p>
              </Reveal>
              <div className="relative">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {visibleTestimonials.map((t, idx) => (
                    <Reveal key={t.id} delay={idx * 80}>
                      <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100`}>
                        <div className="flex items-center mb-4">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt={`Foto ${t.name}`}
                              loading="lazy"
                              className="w-12 h-12 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mr-3" aria-hidden>
                              {getRoleIcon(t.role) ?? (
                                <span className="text-emerald-700 font-semibold">{t.avatar}</span>
                              )}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{t.name}</p>
                            <p className="text-sm text-gray-500">{t.role}</p>
                          </div>
                        </div>
                        <RatingStars value={t.rating} />
                        <p className="mt-3 text-gray-700">“{t.content}”</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                {/* Desktop pagination: full numeric */}
                <div className="hidden md:flex justify-center items-center gap-3 md:gap-4 mt-4 md:mt-3">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).blur(); preserveScrollToTesti(prevTestimonial); }}
                    aria-label="Sebelumnya"
                    disabled={currentPage === 0}
                    aria-disabled={currentPage === 0}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full border shadow-sm focus:outline-none flex items-center justify-center transition ${
                      currentPage === 0
                        ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 active:bg-emerald-600 active:text-white'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).blur(); preserveScrollToTesti(() => setCurrentPage(i)); }}
                      aria-label={`Halaman ${i + 1}`}
                      className={`min-w-[40px] h-10 px-3 rounded-full text-sm md:text-base font-medium border transition ${
                        i === currentPage
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).blur(); preserveScrollToTesti(nextTestimonial); }}
                    aria-label="Berikutnya"
                    disabled={currentPage === totalPages - 1}
                    aria-disabled={currentPage === totalPages - 1}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full border shadow-sm focus:outline-none flex items-center justify-center transition ${
                      currentPage === totalPages - 1
                        ? 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 active:bg-emerald-600 active:text-white'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile pagination: compact with indicator */}
                <div className="flex md:hidden items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).blur(); preserveScroll(prevTestimonial); }}
                    aria-label="Sebelumnya"
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${currentPage === 0 ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 active:bg-emerald-600 active:text-white'}`}
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); (e.currentTarget as HTMLButtonElement).blur(); preserveScroll(nextTestimonial); }}
                    aria-label="Berikutnya"
                    disabled={currentPage === totalPages - 1}
                    className={`px-4 py-2 rounded-full border text-sm font-medium ${currentPage === totalPages - 1 ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 active:bg-emerald-600 active:text-white'}`}
                  >
                    Berikutnya
                  </button>
                </div>
                {/* CTA bawah testimoni dihapus sesuai permintaan */}
              </div>
            </div>
          </section>

          {/* CTA Final */}
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
                      <span>
                        Promo berakhir dalam: {countdown.days}h {countdown.hours}j {countdown.minutes}m {countdown.seconds}d
                      </span>
                    </div>
                  ) : (
                    <div className="bg-white/15 text-white px-3 py-1 rounded-full">
                      Promo telah berakhir
                    </div>
                  )}
                </div>
                <p className="mt-3 text-center text-lg opacity-90">Dapatkan Al-Qur'an Kharisma hari ini dan rasakan perbedaannya.</p>
                <p className="mt-1 text-center text-sm opacity-90">
                  Ingin berkontribusi?
                  {' '}
                  <a href="#/wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/wakaf';}} className="text-white font-semibold text-base underline decoration-2 underline-offset-4 inline-flex items-center gap-1 px-1 rounded hover:bg-white/15">
                    Wakaf Al-Qur’an Kharisma
                    <ChevronRight className="w-4 h-4" />
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
                          <span className="mt-1 inline-block bg-gold-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                            Hemat Rp 53.000
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold mb-2">Bonus:</p>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-start"><Check className="w-4 h-4 text-emerald-200 mr-2 mt-0.5" /> WA grup Indonesia Bisa Mengaji</li>
                            <li className="flex items-start"><Check className="w-4 h-4 text-emerald-200 mr-2 mt-0.5" /> Bimbingan mengaji 1 bulan</li>
                            <li className="flex items-start"><Check className="w-4 h-4 text-emerald-200 mr-2 mt-0.5" /> Buku saku dzikir</li>
                            <li className="flex items-start"><Check className="w-4 h-4 text-emerald-200 mr-2 mt-0.5" /> E-book premium</li>
                          </ul>
                          <p className="text-xs text-emerald-100 mt-2">Promo terbatas hingga akhir bulan</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center md:text-left col-span-3">
                          <p className="text-sm opacity-80">Harga Normal</p>
                          <p className="text-4xl font-extrabold">Rp 350.000</p>
                          <p className="text-xs text-emerald-100 mt-2">Promo saat ini tidak aktif</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Primary action buttons */}
                  <div className="mt-6 grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart({ slug: 'quran-kharisma', title: "Al-Qur’an Kharisma", cover: '/cover.jpg', qty: 1 });
                      }}
                      className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-3 px-4 rounded-full flex items-center justify-center shadow transition-transform hover:animate-hover-bounce"
                      aria-label="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" /> Tambah ke Keranjang
                    </button>
                    {promoActive ? (
                      <button
                        type="button"
                        onClick={() => { window.location.hash = '#/pesan-quran'; }}
                        className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-3 px-4 rounded-full flex items-center justify-center transition-transform hover:animate-hover-bounce"
                        aria-label="Isi Form & Pesan via WhatsApp"
                      >
                        <Phone className="w-5 h-5 mr-2" /> Isi Form & Pesan via WhatsApp
                      </button>
                    ) : (
                      <div>
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          {ADMIN_CONTACTS.map((adm) => {
                            const online = isOnlineNow();
                            const active = selectedWaitAdmin===adm.phone;
                            return (
                              <button
                                key={adm.phone}
                                type="button"
                                onClick={() => setSelectedWaitAdmin(adm.phone)}
                                className={`w-full border rounded-full px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-white text-emerald-700 border-white' : 'bg-white/20 text-white border-white/40 hover:bg-white/30'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{adm.name.replace('Admin ','')}</span>
                                  <span className={`text-[10px] font-normal inline-flex items-center gap-1 ${online ? (active ? 'text-emerald-600' : 'text-emerald-100') : 'text-white/70'}`} title={online ? undefined : 'Admin akan merespons esok pagi mulai 06:00 WIB'}>
                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${online ? (active ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-300 animate-pulse') : 'bg-white/50'}`}></span>
                                    {online ? 'Online' : 'Offline — balas di jam kerja'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <a
                          href={`https://wa.me/${selectedWaitAdmin}?text=${encodeURIComponent(waitlistMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-emerald-700 hover:bg-gray-100 font-semibold py-3 px-4 rounded-full flex items-center justify-center transition-transform hover:animate-hover-bounce"
                          aria-label="Daftar Tunggu Promo"
                        >
                          <Phone className="w-5 h-5 mr-2" /> Daftar Tunggu Promo Berikutnya
                        </a>
                      </div>
                    )}
                    <div className="relative group">
                      <a
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()}
                        aria-disabled="true"
                        title="Belum tersedia"
                        className="bg-emerald-50 text-emerald-900 font-semibold py-3 px-4 rounded-full flex items-center justify-center opacity-60 cursor-not-allowed"
                        aria-label="Shopee segera hadir"
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" /> Segera Hadir
                      </a>
                      <div role="tooltip" className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        Channel ini segera hadir
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-admin selector removed as requested */}

                  {/* Marketplace Buttons - Keep Below */}
                 

                  <div className="mt-6 grid grid-cols-3 gap-3 text-emerald-100 text-sm">
                    <div className="flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> Garansi uang kembali</div>
                    <div className="flex items-center justify-center gap-2"><Truck className="w-4 h-4" /> Pengiriman aman</div>
                    <div className="flex items-center justify-center gap-2"><Award className="w-4 h-4" /> Kualitas terbaik</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
          
          {/* Koleksi Inspiratif Kami (LP) */}
          <section id="koleksi" className="section-padding bg-[#FDFBF8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                <h2 className="section-title">Temukan Koleksi Inspiratif Kami</h2>
                <p className="section-subtitle">Selain Al-Qur’an Kharisma, kami juga menyajikan novel-novel penuh makna yang menyentuh jiwa.</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6">
                {[{
                  title: 'Melawan Kemustahilan',
                  tagline: 'Menguji Keimanan, Menjemput Keajaiban',
                  cover: '/images/melawan-kemustahilan.jpg',
                  href: '#/produk/melawan-kemustahilan'
                }, {
                  title: 'Sebelum Aku Tiada',
                  tagline: 'Surat-Surat dari Gaza',
                  cover: '/images/sebelum-aku-tiada.jpg',
                  href: '#/produk/sebelum-aku-tiada'
                }, {
                  title: 'Titik Balik',
                  tagline: 'Ada 365 Hari Dalam Setahun...',
                  cover: '/images/titik-balik.jpg',
                  href: '#/produk/titik-balik'
                }].map((p) => (
                  <Reveal key={p.title}>
                    <a href={p.href} onClick={(e)=>{e.preventDefault(); window.location.hash = p.href;}} className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 overflow-hidden">
                      <div className="aspect-[4/3] bg-gray-100">
                        <img src={p.cover} alt={`Sampul ${p.title}`} className="w-full h-full object-cover" />
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

          {/* Footer */}
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid md:grid-cols-3 gap-8 items-start">
                <div>
                  <div className="collab-logos flex items-center gap-4">
                    <img src="/logo.png" alt="Developer" className="h-10 md:h-12 w-auto" />
                    <img src="/logo-aba.png" alt="Pondok Digital Quran Aba" className="h-10 md:h-12 w-auto" />
                  </div>
                  <p className="mt-3 font-bold text-emerald-700 text-xl">Al-Qur'an Kharisma</p>
                  <p className="mt-2 text-sm text-gray-600">Tajwid berwarna & terjemahan untuk memudahkan Anda membaca Al-Qur'an dengan benar.</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Kontak</p>
                  <p className="text-sm text-gray-600">Email: pondokdigitalpreneur@gmail.com</p>
                  <p className="text-sm text-gray-600">WhatsApp: 0878-7971-3808</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Ikuti Kami</p>
                  <div className="mt-2 flex items-center gap-6 md:gap-8">
                    <a href="https://www.instagram.com/pondokabdurrahmanbinauf/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
                        <path fill="#E1306C" stroke="#E1306C" strokeWidth={0.75} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28-.073 1.688-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="https://www.tiktok.com/@pondokaba" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="transition hover:opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden className="bi bi-tiktok text-black">
                        <path stroke="currentColor" strokeWidth={0.75} d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                      </svg>
                    </a>
                    <a href="https://www.youtube.com/@masjidabbacirebon" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition hover:opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
                        <path fill="#FF0000" stroke="#FF0000" strokeWidth={0.75} d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-xs text-gray-500"> 2024 Kharisma Quran. All rights reserved.</div>
            </div>
          </footer>
          </>
          )}
        </main>

        {/* Bottom Meta: Tech Provider & Brand Owner */}
        <div className="border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-black">Tech Provider:</span>
                <img src="/logo.png" alt="Tech Provider" className="h-6 w-auto" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-black">Brand Owner:</span>
                <img src="/logo-aba.png" alt="Brand Owner" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        {showStickyCta && !showSplash && (
          <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:bottom-6 z-50">
            <div className="bg-emerald-600 text-white rounded-full shadow-xl px-4 py-3 md:py-3.5 flex items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="" className="hidden md:block h-6 w-auto opacity-90" aria-hidden />
                <span className="text-sm md:text-base font-semibold">Al-Qur'an Kharisma — Rp 297.000</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowStickyCta(false)} aria-label="Tutup" className="bg-white/15 hover:bg-white/25 rounded-full p-1.5 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default App;
