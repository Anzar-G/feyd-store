import { PRODUCT_PRICING } from '../data/constants';

export const normalizeWa = (s: string) => {
    const d = s.replace(/\D/g, '');
    if (d.startsWith('62')) return d;
    if (d.startsWith('0')) return '62' + d.slice(1);
    return '62' + d;
};

export const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export const buildProductWaLink = (title: string) => {
    const info = PRODUCT_PRICING[title];
    const base = `Assalamu’alaikum, saya ingin memesan ${title}${info ? ` (${info.price})` : ''}. Mohon informasi cara pemesanan.`;
    let withBonus = base;
    if (info?.bonus) {
        const bonusLines = Array.isArray(info.bonus) ? info.bonus.map(b => `- ${b}`).join('\n') : `- ${info.bonus}`;
        withBonus = `${base}\n\nBonus yang didapat:\n${bonusLines}`;
    }
    return `https://wa.me/6287879713808?text=${encodeURIComponent(withBonus)}`;
};

export const isOnlineNow = () => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utcMs + 7 * 3600000); // UTC+7
    const h = wib.getHours();
    return h >= 6 && h < 22;
};

// UTM helpers
const UTM_KEY = 'first_utm_v1';
export const captureFirstUtm = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].reduce((acc, k) => {
        const v = params.get(k);
        if (v) (acc as any)[k] = v;
        return acc;
    }, {} as Record<string, string>);
    if (Object.keys(utm).length > 0 && !localStorage.getItem(UTM_KEY)) {
        localStorage.setItem(UTM_KEY, JSON.stringify({ ...utm, ts: Date.now(), path: window.location.pathname + window.location.hash }));
    }
};

export const readUtm = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(UTM_KEY) || '{}') as Record<string, string>; } catch { return {}; }
};

export const openWaInterest = (productTitle: string, name?: string, wa?: string, email?: string) => {
    const message = `Assalamu’alaikum, saya tertarik dengan buku ${productTitle}. Mohon informasikan saat tersedia. Nama: ${name ?? '-'}, WA: ${wa ?? '-'}${email ? `, Email: ${email}` : ''}`;
    const fb = (window as any).fbq;
    if (typeof fb === 'function') {
        fb('track', 'Lead', { content_name: productTitle, content_category: 'interest' });
    }
    window.open(`https://wa.me/6287879713808?text=${encodeURIComponent(message)}`, '_blank');
};
