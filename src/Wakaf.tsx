import React, { useEffect, useMemo, useState } from 'react';
import RatingStars from './components/RatingStars';
import { ChevronRight, Check, Users, Award, Shield, BookOpen, ChevronLeft, User, Phone, Mail, Wallet } from 'lucide-react';

type Testi = { id:number; name:string; role:string; rating:number; content:string };

const formatNumber = (n:number) => n.toLocaleString('id-ID');

const Counter: React.FC<{ target:number; label:string }> = ({ target, label }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const tick = (t:number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.floor(target * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
      <p className="text-2xl md:text-3xl font-extrabold text-emerald-700">{formatNumber(val)}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

const Wakaf: React.FC = () => {
  const genEventId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const readUtm = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('first_utm_v1') || '{}') as Record<string,string>; } catch { return {}; }
  };

  useEffect(() => {
    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
      fb('track', 'ViewContent', {
        content_name: 'Wakaf Al-Qur\'an Kharisma',
        content_category: 'donation',
      });
    }
  }, []);
  const testi: Testi[] = useMemo(() => ([
    { id:1, name:'Siti Nurhaliza', role:'Ibu Rumah Tangga, Jakarta', rating:5, content:'Saya wakafkan 5 mushaf untuk pesantren di Aceh. Alhamdulillah, saya dapat notifikasi foto santri yang menerimanya. Rasanya senang sekali bisa berkontribusi.' },
    { id:2, name:'Muhammad Faisal', role:'Mahasiswa, Bandung', rating:4.5, content:'Saya wakafkan 1 mushaf tiap bulan. Ini cara saya beramal rutin tanpa harus keluar rumah. Semoga jadi amal jariyah yang tak putus.' },
    { id:3, name:'Ustaz Arifin', role:"Guru Qur'an, Surabaya", rating:5, content:'Wakaf Quran Kharisma sangat membantu kami di pesantren. Santri jadi lebih semangat belajar tajwid karena mushafnya jelas dan nyaman.' },
  ]), []);
  const [page, setPage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'wakaf' | 'permintaan'>('wakaf');
  useEffect(() => {
    try { localStorage.setItem('wakaf_active_tab', activeTab); } catch {}
  }, [activeTab]);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [requestedCount, setRequestedCount] = useState<number | ''>('');
  const [picName, setPicName] = useState('');
  const [orgWa, setOrgWa] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ADMIN_CONTACTS = [
    { name: 'Admin Pondok', phone: '6287879713808' },
    { name: 'Admin Mas Nizar', phone: '6282221025449' },
  ];
  const [selectedAdmin, setSelectedAdmin] = useState<string>(ADMIN_CONTACTS[0].phone);
  const isOnlineNow = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utcMs + 7 * 3600000);
    const h = wib.getHours();
    return h >= 6 && h < 22;
  };
  const [hash, setHash] = useState<string>(typeof window !== 'undefined' ? window.location.hash : '#');
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const pageSize = 1;
  const total = Math.ceil(testi.length / pageSize);
  const visible = testi.slice(page * pageSize, page * pageSize + pageSize);
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const selectPackage = (nominal:number) => {
    setAmount(String(nominal));
    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
      fb('track', 'AddToCart', {
        content_name: 'Wakaf Al-Qur\'an Kharisma',
        content_category: 'donation',
        value: nominal,
        currency: 'IDR',
      });
    }
    setTimeout(()=>{
      const el = document.getElementById('wakaf-form');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };
  const buildWaMessage = () => {
    const lines = [
      "Assalamu'alaikum, saya ingin konfirmasi wakaf Al-Qur'an.",
      fullName ? `Nama: ${fullName}` : undefined,
      whatsapp ? `WhatsApp: ${whatsapp}` : undefined,
      email ? `Email: ${email}` : undefined,
      amount ? `Nominal: Rp ${amount}` : undefined,
      notes ? `Catatan: ${notes}` : undefined,
      '',
      'Saya telah transfer ke BSI 7777 177 995 a.n. Pondok Abdurrahman bin Auf.',
      '',
      'Saya akan mengirimkan bukti transfer di chat ini 🙏',
      'Mohon konfirmasi setelah bukti transfer diterima.'
    ].filter(Boolean).join('\n');
    const utm = readUtm();
    const utmStr = Object.keys(utm).length ? `\nUTM: ${Object.entries(utm).filter(([k])=>k.startsWith('utm_')).map(([k,v])=>`${k}=${v}`).join('&')}` : '';
    return lines + utmStr;
  };
  const waText = buildWaMessage();
  const normalizePhone = (s: string) => {
    const d = s.replace(/\D/g, '');
    if (d.startsWith('62')) return d;
    if (d.startsWith('0')) return '62' + d.slice(1);
    return '62' + d;
  };
  const buildRequestWaText = () => {
    const lines = [
      'Assalamu\'alaikum, ada pengajuan Permintaan Wakaf Mushaf baru:',
      '',
      `Nama Lembaga: ${orgName}`,
      `Jenis Lembaga: ${orgType}`,
      `Alamat Lengkap: ${orgAddress}`,
      `Jumlah Mushaf Diminta: ${typeof requestedCount === 'number' ? requestedCount : ''}`,
      `Penanggung Jawab: ${picName}`,
      `WhatsApp PIC: ${normalizePhone(orgWa)}`,
      orgEmail ? `Email: ${orgEmail}` : undefined,
      `Alasan: ${reason}`,
      '',
      '— dikirim dari halaman Permintaan Wakaf Al-Qur\'an Kharisma'
    ].filter(Boolean).join('\n');
    return lines;
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const isValidDonasi = () => {
    const nameOk = fullName.trim().length > 1;
    const waOk = /^08\d{8,}$/.test(whatsapp.replace(/\D/g, ''));
    return nameOk && waOk;
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isValidDonasi()) {
      alert('Mohon lengkapi Nama dan nomor WhatsApp yang valid (mulai 08).');
      return;
    }
    const amt = Number(amount || 0);
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'wakaf',
          name: fullName,
          whatsapp: normalizePhone(whatsapp),
          email,
          amount: amt,
          note: notes,
        }),
      });
    } catch {}

    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
      const leadEventId = genEventId();
      fb('track', 'Lead', {
        content_name: 'Wakaf Al-Qur\'an Kharisma',
        content_category: 'donation',
        value: amt,
        currency: 'IDR',
      }, { eventID: leadEventId });

      const contactEventId = genEventId();
      fb('track', 'Contact', {
        content_category: 'donation',
        value: amt,
        currency: 'IDR',
      }, { eventID: contactEventId });

      fb('trackCustom', 'WhatsAppClick', {
        source: 'wakaf_confirm',
        value: amt,
        currency: 'IDR',
      });
    }
    setTimeout(() => { openWhatsApp(); }, 150);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${selectedAdmin}?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
    
    // Reset form
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setAmount('');
    setNotes('');
  };
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Thank you page state: show standalone thank-you view
  if (hash.startsWith('#/wakaf/permintaan/terima-kasih')) {
    return (
      <div className="min-h-screen">
        <section className="pt-28 md:pt-36 pb-12" style={{ backgroundColor: '#E8F5E9' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Terima Kasih telah Mengajukan Permohonan Wakaf!</h1>
            <p className="mt-4 text-gray-700">Tim kami akan segera menghubungi Anda via WhatsApp dalam <b>3–5 hari kerja</b>.
              Semoga Al-Qur’an Kharisma menjadi wasilah kebaikan bagi santri dan jamaah di lembaga Anda.</p>
            <p className="mt-2 text-sm text-gray-600">📱 Pastikan nomor WhatsApp Anda aktif — karena kami akan menghubungi Anda untuk verifikasi.</p>
            <div className="mt-6">
              <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: '#2E7D32' }}
                onMouseEnter={(e)=>{ (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1B5E20'; }}
                onMouseLeave={(e)=>{ (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2E7D32'; }}
              >
                ← Kembali ke Beranda
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="pt-24 md:pt-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('wakaf'); try { localStorage.setItem('wakaf_active_tab','wakaf'); } catch {} }}
              className={[
                'px-6 py-3 rounded-t-xl font-semibold transition',
                activeTab === 'wakaf' ? 'bg-[#E8F5E9] border-b-[3px] border-b-[#2E7D32] text-[#0F2A1C]' : 'bg-white hover:bg-[#F1F8E9] text-[#0F2A1C]'
              ].join(' ')}
            >
              Wakaf Sekarang
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('permintaan'); try { localStorage.setItem('wakaf_active_tab','permintaan'); } catch {} }}
              className={[
                'px-6 py-3 rounded-t-xl font-semibold transition',
                activeTab === 'permintaan' ? 'bg-[#E8F5E9] border-b-[3px] border-b-[#2E7D32] text-[#0F2A1C]' : 'bg-white hover:bg-[#F1F8E9] text-[#0F2A1C]'
              ].join(' ')}
            >
              Permintaan Wakaf
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'wakaf' ? (
      <>
      <section className="relative pt-8 md:pt-10 pb-12 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">Jangan Tunda, Sebarkan Cahaya Tilawah Hari Ini!</h1>
            <p className="mt-4 text-base md:text-lg text-gray-700">Setiap detik yang Anda tunda, bisa jadi peluang hilang bagi santri yang menanti mushaf ini. Dengan satu klik, Anda sudah membuka pintu kebaikan yang tak terbatas.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#" onClick={(e)=>{e.preventDefault(); scrollToId('wakaf-form');}} className="btn-primary text-base py-3 inline-flex items-center justify-center">Mulai Wakaf Sekarang <ChevronRight className="ml-2 w-5 h-5"/></a>
              <a href="#" onClick={(e)=>{e.preventDefault(); scrollToId('wakaf-cara');}} className="btn-secondary text-base py-3 inline-flex items-center justify-center">Lihat Cara Kerja Wakaf</a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Counter target={12487} label="Mushaf Terwakafkan"/>
              <Counter target={217} label="Pesantren & Masjid"/>
              <Counter target={3892} label="Santri Terbantu"/>
            </div>
          </div>
          <div>
            <div className="rounded-xl overflow-hidden shadow-xl border bg-white">
              <img
                src="/wakaf/tinified/wakaf-cover1.jpg"
                alt="Penyerahan mushaf ke santri"
                className="w-full h-auto object-cover aspect-[4/3]"
                loading="eager"
                width={1200}
                height={900}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pengumuman Penyaluran */}
      <section className="py-6 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-white border border-emerald-100 p-5 md:p-6 shadow-sm">
            <p className="text-emerald-800 font-semibold">Alhamdulillah…</p>
            <p className="text-gray-700 mt-1">Jazakumullahu khairan katsīran kepada seluruh Bapak/Ibu Donatur yang telah berpartisipasi dalam Program Wakaf Al-Qur’an.</p>
            <p className="mt-3 text-gray-900 font-semibold">Sebanyak <span className="text-emerald-700">110 mushaf Al-Qur’an</span> telah tersalurkan ke beberapa tempat di wilayah Cirebon.</p>
            <p className="mt-2 text-gray-600 text-sm">Semoga setiap huruf yang dibaca menjadi amal jariyah yang terus mengalir hingga hari akhir. Aamiin 🤲🏻😊</p>
          </div>
        </div>
      </section>

      {/* Mengapa */}
      <section id="wakaf-mengapa" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-2xl md:text-3xl">Bukan Hanya Donasi — Ini Investasi Akhirat yang Nyata</h2>
          <p className="section-subtitle text-base md:text-lg">Al-Qur'an Kharisma hadir dengan tajwid berwarna dan terjemahan yang memandu setiap langkah membaca Anda.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border hover:shadow-md transition">
              <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mb-4"><MessageCircleIcon/></div>
              <h3 className="font-semibold text-gray-900 mb-1">Tajwid Berwarna</h3>
              <p className="text-gray-600 text-sm">Sistem warna memandu bacaan dengan benar</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-md transition">
              <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mb-4"><BookOpen className="w-7 h-7 text-emerald-700"/></div>
              <h3 className="font-semibold text-gray-900 mb-1">Terjemah 15 Baris</h3>
              <p className="text-gray-600 text-sm">Memudahkan memahami makna ayat-ayat</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-md transition">
              <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mb-4"><Shield className="w-7 h-7 text-emerald-700"/></div>
              <h3 className="font-semibold text-gray-900 mb-1">Kualitas Premium</h3>
              <p className="text-gray-600 text-sm">Kertas HVS tebal, tidak mudah robek</p>
            </div>
            <div className="bg-white p-6 rounded-xl border hover:shadow-md transition">
              <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mb-4"><Award className="w-7 h-7 text-emerald-700"/></div>
              <h3 className="font-semibold text-gray-900 mb-1">Standar Kemenag RI</h3>
              <p className="text-gray-600 text-sm">Mengikuti standar resmi Kementerian Agama</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="wakaf-cara" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-2xl md:text-3xl">Setiap Rupiah Anda, Langsung Sampai ke Tangan Santri</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title:'Anda Berwakaf', desc:'Donasi Anda dikumpulkan dan dikelola secara transparan.', icon:<Users className="w-7 h-7 text-emerald-700"/> },
              { title:'Kami Distribusikan', desc:'Mushaf dikirim ke pesantren, TPQ, atau masjid mitra di seluruh Indonesia.', icon:<TruckIcon/> },
              { title:'Santri Menerima & Belajar', desc:'Santri menggunakan Al-Qur’an Kharisma untuk tilawah, hafalan, dan memperbaiki tajwid.', icon:<BookOpen className="w-7 h-7 text-emerald-700"/> },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-3" aria-hidden>{s.icon}</div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">Dari 1 Mushaf = 1 Santri bisa tilawah dengan benar selama ±5 tahun</div>
          <div className="mt-6 max-w-2xl mx-auto bg-white border rounded-xl p-4 italic text-emerald-900/90">
            “Alhamdulillah, sejak dapat wakaf Quran Kharisma, santri kami lebih percaya diri baca Al-Qur’an di depan guru.” — <b>Ustaz Ahmad</b>, Pesantren Darul Falah, Jawa Tengah
          </div>
        </div>
      </section>

      {/* Dampak */}
      <section id="wakaf-dampak" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-2xl md:text-3xl">Lihat Sendiri, Bagaimana Wakaf Anda Mengubah Hidup Santri</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Counter target={12487} label="Mushaf Terwakafkan"/>
            <Counter target={217} label="Pesantren & Masjid"/>
            <Counter target={3892} label="Santri Pemula Terbantu"/>
          </div>
          <div className="mt-8">
            <div className="rounded-xl overflow-hidden border bg-white">
              <video
                src="/wakaf/wakaf-cover.mp4"
                className="w-full h-auto object-cover aspect-[16/9]"
                controls
                playsInline
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Santri di Pondok Modern Gresik menerima wakaf Quran Kharisma minggu lalu.</p>
            <div className="text-center mt-4">
              <a href="#/galeri-wakaf" onClick={(e)=>{e.preventDefault(); window.location.hash = '#/galeri-wakaf';}} className="btn-secondary">Lihat Galeri Penyaluran Wakaf</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni Wakif */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title text-2xl md:text-3xl">Testimoni Wakif: “Saya Merasa Ikut Menyebarkan Cahaya Ilmu”</h2>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            {visible.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{t.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t.role}</p>
                  </div>
                  <RatingStars value={t.rating} />
                </div>
                <p className="mt-3 text-gray-700 text-sm md:text-base">“{t.content}”</p>
              </div>
            ))}
            <div className="flex justify-center items-center gap-2 md:gap-3 mt-5">
              <button type="button" onClick={(e)=>{e.preventDefault(); setPage((p)=>Math.max(0,p-1));}} disabled={page===0} className={`w-9 h-9 md:w-10 md:h-10 rounded-full border shadow-sm ${page===0?'text-gray-300 cursor-not-allowed':'text-gray-600 hover:bg-gray-50 active:bg-emerald-600 active:text-white'}`} aria-label="Sebelumnya">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5"/>
              </button>
              {Array.from({length: total}).map((_,i)=>(
                <button type="button" key={i} onClick={(e)=>{e.preventDefault(); setPage(i);}} className={`min-w-[28px] md:min-w-[36px] h-8 md:h-9 px-2 md:px-3 rounded-full text-xs md:text-sm font-medium border ${i===page?'bg-emerald-600 text-white border-emerald-600':'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}>{i+1}</button>
              ))}
              <button type="button" onClick={(e)=>{e.preventDefault(); setPage((p)=>Math.min(total-1,p+1));}} disabled={page===total-1} className={`w-9 h-9 md:w-10 md:h-10 rounded-full border shadow-sm ${page===total-1?'text-gray-300 cursor-not-allowed':'text-gray-600 hover:bg-gray-50 active:bg-emerald-600 active:text-white'}`} aria-label="Berikutnya">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5"/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Wakaf */}
      <section id="wakaf-paket" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Pilih Nominal Sesuai Kemampuan — Semua Bernilai Sama di Sisi Allah</h2>
          <div className="grid md:grid-cols-4 gap-4 md:gap-6">
            <div className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition`}>
              <p className="font-semibold text-gray-900">Paket Santri</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">Rp 297.000</p>
              <p className="text-sm text-gray-600 mt-1">1 Mushaf untuk 1 Santri</p>
              <ul className="text-sm text-gray-700 mt-3 space-y-1">
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Sertifikat Wakaf Digital</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Nama dicantumkan di halaman Para Wakif</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Notifikasi foto penyaluran via WhatsApp</li>
              </ul>
              <button onClick={()=>selectPackage(297000)} className="btn-primary mt-4 inline-flex items-center">Wakaf Sekarang <ChevronRight className="ml-2 w-5 h-5"/></button>
            </div>
            <div className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition ring-2 ring-emerald-500/20`}>
              <p className="font-semibold text-gray-900">Paket Kelas</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">Rp 1.485.000</p>
              <p className="text-sm text-gray-600 mt-1">5 Mushaf untuk 1 Kelas Tilawah</p>
              <ul className="text-sm text-gray-700 mt-3 space-y-1">
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Sertifikat Wakaf Digital</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Nama dicantumkan di halaman Para Wakif</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Notifikasi foto penyaluran via WhatsApp</li>
              </ul>
              <button onClick={()=>selectPackage(1485000)} className="btn-primary mt-4 inline-flex items-center">Wakaf Sekarang <ChevronRight className="ml-2 w-5 h-5"/></button>
            </div>
            <div className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition`}>
              <p className="font-semibold text-gray-900">Paket Pesantren</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">Rp 5.940.000</p>
              <p className="text-sm text-gray-600 mt-1">20 Mushaf untuk 1 Pesantren Kecil</p>
              <ul className="text-sm text-gray-700 mt-3 space-y-1">
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Sertifikat Wakaf Digital</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Nama dicantumkan di halaman Para Wakif</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Notifikasi foto penyaluran via WhatsApp</li>
              </ul>
              <button onClick={()=>selectPackage(5940000)} className="btn-primary mt-4 inline-flex items-center">Wakaf Sekarang <ChevronRight className="ml-2 w-5 h-5"/></button>
            </div>
            <div className={`rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition`}>
              <p className="font-semibold text-gray-900">Paket Bebas</p>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">Sesuai Keinginan</p>
              <p className="text-sm text-gray-600 mt-1">Tulis nominal sendiri</p>
              <ul className="text-sm text-gray-700 mt-3 space-y-1">
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Sertifikat Wakaf Digital</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Nama dicantumkan di halaman Para Wakif</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5"/> Notifikasi foto penyaluran via WhatsApp</li>
              </ul>
              <button onClick={()=>selectPackage(Number(amount||0))} className="btn-primary mt-4 inline-flex items-center">Isi Nominal di Form <ChevronRight className="ml-2 w-5 h-5"/></button>
            </div>
          </div>
        </div>
      </section>

       {/* Transparansi */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Kami Komitmen Transparan — Setiap Donasi Dilaporkan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-5 flex items-center gap-3"><Award className="w-6 h-6 text-emerald-700"/><div><p className="font-semibold">Rekomendasi Ulama</p><p className="text-sm text-gray-600">Dukungan tim ulama internal</p></div></div>
            <div className="bg-white rounded-xl border p-5 flex items-center gap-3"><BookOpen className="w-6 h-6 text-emerald-700"/><div><p className="font-semibold">Standar Kemenag RI</p><p className="text-sm text-gray-600">Rasm Utsmani sesuai standar</p></div></div>
            <div className="bg-white rounded-xl border p-5 flex items-center gap-3"><Shield className="w-6 h-6 text-emerald-700"/><div><p className="font-semibold">Laporan Bulanan</p><p className="text-sm text-gray-600">Dipublikasi di website & grup WA</p></div></div>
            <div className="bg-white rounded-xl border p-5 flex items-center gap-3"><Users className="w-6 h-6 text-emerald-700"/><div><p className="font-semibold">Garansi</p><p className="text-sm text-gray-600">Uang kembali jika tidak sampai</p></div></div>
          </div>
        </div>
      </section>

      {/* Form Donasi */}
      <section id="wakaf-form" className="section-padding bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="section-title">Silakan Isi Data Diri Anda — Kami Akan Proses Wakaf Anda dengan Cepat & Aman</h2>
          <form className="bg-white rounded-2xl border p-5 shadow-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <div className="mt-1 relative">
                  <User className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Muhammad Faisal (untuk sertifikat wakaf)"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Aktif</label>
                <div className="mt-1 relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="faisal@gmail.com (untuk notifikasi & e-sertifikat)"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                <div className="mt-1 relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="081234567890 (untuk konfirmasi & update penyaluran)"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nominal Wakaf</label>
                <div className="mt-1 relative">
                  <Wallet className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Tulis nominal wakaf (contoh: 297000)"/>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700">Catatan (opsional)</label>
              <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Contoh: ‘Untuk santri di Aceh’, ‘Doakan keluarga saya’, dll"></textarea>
            </div>
            
            <div className="mt-4 border rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">Transfer ke Rekening Resmi Pondok Digital Quran Aba</p>
              <div className="mt-2 grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="font-semibold text-gray-900">Bank Syariah Indonesia (BSI)</p>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs text-gray-500">No. Rekening</p>
                  <p className="font-semibold text-gray-900">7777 177 995</p>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs text-gray-500">Atas Nama</p>
                  <p className="font-semibold text-gray-900">Pondok Abdurrahman bin Auf</p>
                </div>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-600">Tombol Aksi</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { navigator.clipboard.writeText('BSI 7777 177 995 a.n. Pondok Abdurrahman bin Auf'); setCopied(true); setTimeout(()=>setCopied(false), 1500); }}
                    className="btn-secondary"
                  >
                    {copied ? 'Tersalin ✓' : '📋 Salin Nomor Rekening'}
                  </button>
                </div>
              </div>
              <ul className="mt-3 text-xs text-gray-600 space-y-1">
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2"/> Pembayaran akan diproses maksimal 24 jam setelah konfirmasi.</li>
                <li className="flex"><Check className="w-4 h-4 text-emerald-600 mr-2"/> Semua transaksi tercatat dan dilaporkan secara transparan.</li>
              </ul>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Pilih admin tujuan:</p>
              <div className="grid grid-cols-2 gap-2">
                {ADMIN_CONTACTS.map((adm) => {
                  const online = isOnlineNow();
                  const active = selectedAdmin===adm.phone;
                  return (
                    <button
                      key={adm.phone}
                      type="button"
                      onClick={() => setSelectedAdmin(adm.phone)}
                      className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{adm.name}</span>
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
            <a href={`https://wa.me/${selectedAdmin}?text=${encodeURIComponent(waText)}`} onClick={handleConfirm} target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 w-full py-3 text-lg text-center inline-block">🌿 Konfirmasi Pembayaran via WhatsApp — Proses Cepat & Aman</a>
            <div className="mt-3 flex justify-center">
              <a href="#" onClick={(e)=>{e.preventDefault(); window.location.hash = '#';}} className="btn-secondary inline-flex items-center">
                ← Kembali ke Beranda
              </a>
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">Silakan transfer ke rekening di atas, lalu klik tombol untuk konfirmasi agar tim kami memproses penyaluran.</p>
          </form>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white border rounded-xl p-3"><Award className="w-4 h-4 text-emerald-700"/> Rekomendasi Ulama</div>
            <div className="flex items-center gap-2 bg-white border rounded-xl p-3"><BookOpen className="w-4 h-4 text-emerald-700"/> Standar Kemenag RI</div>
            <div className="flex items-center gap-2 bg-white border rounded-xl p-3"><Shield className="w-4 h-4 text-emerald-700"/> Garansi Uang Kembali</div>
            <div className="flex items-center gap-2 bg-white border rounded-xl p-3"><Users className="w-4 h-4 text-emerald-700"/> Transparansi Laporan</div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6 italic">“Barangsiapa yang menunjuki kepada kebaikan, maka dia akan mendapatkan pahala seperti pahala orang yang mengerjakannya.” — HR. Muslim</p>
        </div>
      </section>
      </>
      ) : (
      <>
        <section className="pt-8 md:pt-10 pb-10" style={{ backgroundColor: '#E8F5E9' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">Ajukan Permohonan Wakaf Mushaf Al-Qur’an Kharisma</h1>
            <p className="mt-3 text-base md:text-lg text-gray-700 max-w-3xl">Untuk pesantren, TPQ, masjid, komunitas, atau lembaga pendidikan yang membutuhkan mushaf berkualitas tinggi untuk santri dan jamaah.</p>
            <p className="mt-2 text-sm text-gray-600 italic">Setiap permohonan akan diverifikasi dan diprioritaskan berdasarkan kebutuhan, keterjangkauan lokasi, dan ketersediaan donasi.</p>
          </div>
        </section>
        <section className="py-10 bg-white">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl border p-5 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Lembaga</label>
                  <input value={orgName} onChange={(e)=>setOrgName(e.target.value)} placeholder="Pesantren Darul Qur’an" className="mt-1 w-full border rounded-lg px-3 py-2" />
                  {errors.orgName && <p className="text-xs text-rose-600 mt-1">{errors.orgName}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Jenis Lembaga</label>
                  <select value={orgType} onChange={(e)=>setOrgType(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 bg-white">
                    <option value="">Pilih jenis</option>
                    <option>Pesantren</option>
                    <option>TPQ</option>
                    <option>Masjid</option>
                    <option>Sekolah Islam</option>
                    <option>Komunitas</option>
                    <option>Lainnya</option>
                  </select>
                  {errors.orgType && <p className="text-xs text-rose-600 mt-1">{errors.orgType}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                  <textarea value={orgAddress} onChange={(e)=>setOrgAddress(e.target.value)} placeholder="Jl. Raya Cirebon No. 123, Kab. Cirebon, Jawa Barat 45153" className="mt-1 w-full border rounded-lg px-3 py-2 h-24" />
                  {errors.orgAddress && <p className="text-xs text-rose-600 mt-1">{errors.orgAddress}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Jumlah Mushaf yang Diminta</label>
                  <input type="number" value={requestedCount} onChange={(e)=> setRequestedCount(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full border rounded-lg px-3 py-2" />
                  {errors.requestedCount && <p className="text-xs text-rose-600 mt-1">{errors.requestedCount}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Penanggung Jawab</label>
                  <input value={picName} onChange={(e)=>setPicName(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
                  {errors.picName && <p className="text-xs text-rose-600 mt-1">{errors.picName}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nomor WhatsApp Aktif</label>
                  <input type="tel" inputMode="numeric" pattern="[0-9]*" autoComplete="tel" value={orgWa} onChange={(e)=>setOrgWa(e.target.value)} placeholder="081234567890" className="mt-1 w-full border rounded-lg px-3 py-2" />
                  {errors.orgWa && <p className="text-xs text-rose-600 mt-1">{errors.orgWa}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email (Opsional)</label>
                  <input type="email" value={orgEmail} onChange={(e)=>setOrgEmail(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Alasan Permohonan</label>
                  <textarea value={reason} onChange={(e)=>setReason(e.target.value)} placeholder="Jelaskan kondisi lembaga, jumlah santri, kebutuhan mushaf, dll." className="mt-1 w-full border rounded-lg px-3 py-2 h-28" />
                  {errors.reason && <p className="text-xs text-rose-600 mt-1">{errors.reason}</p>}
                </div>
                
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-white"
                  style={{ backgroundColor: '#2E7D32' }}
                  onClick={() => {
                    const errs: Record<string,string> = {};
                    if (!orgName.trim()) errs.orgName = 'Wajib diisi';
                    if (!orgType) errs.orgType = 'Pilih salah satu';
                    if (!orgAddress.trim()) errs.orgAddress = 'Wajib diisi';
                    const cnt = typeof requestedCount === 'number' ? requestedCount : 0;
                    if (!requestedCount || cnt < 1) errs.requestedCount = 'Jumlah mushaf harus ≥ 1';
                    if (!picName.trim()) errs.picName = 'Wajib diisi';
                    if (!/^08\d{8,}$/.test(orgWa.replace(/\D/g,''))) errs.orgWa = 'Nomor WA harus dimulai 08 dan valid';
                    if (!reason.trim()) errs.reason = 'Wajib diisi';
                    setErrors(errs);
                    if (Object.keys(errs).length === 0) {
                      const text = buildRequestWaText();
                      const url = `https://wa.me/${selectedAdmin}?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                      setTimeout(() => { window.location.hash = '#/wakaf/permintaan/terima-kasih'; }, 300);
                    }
                  }}
                  onMouseEnter={(e)=>{ (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1B5E20'; }}
                  onMouseLeave={(e)=>{ (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2E7D32'; }}
                >
                  Kirim Permohonan
                </button>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Pilih admin tujuan:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ADMIN_CONTACTS.map((adm) => {
                      const online = isOnlineNow();
                      const active = selectedAdmin===adm.phone;
                      return (
                        <button
                          key={adm.phone}
                          type="button"
                          onClick={() => setSelectedAdmin(adm.phone)}
                          className={`w-full border rounded-lg px-3 py-2 text-sm font-semibold transition text-left ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{adm.name}</span>
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
              </div>
            </div>
          </div>
        </section>
      </>
      )}

    </div>
  );
};

const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-700"><path d="M7 7h10v2H7zm0 4h7v2H7z"/><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
);
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-emerald-700"><path d="M3 4h13v10H3z"/><path d="M16 8h4l1 3v3h-5z"/><circle cx="7" cy="17" r="2"/><circle cx="18" cy="17" r="2"/></svg>
);

export default Wakaf;
