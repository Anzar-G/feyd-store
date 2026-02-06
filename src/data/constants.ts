
export const PRODUCT_PRICING: Record<string, { price: string; bonus?: string | string[] }> = {
    'Sebelum Aku Tiada': { price: 'Rp 157.000' },
    'Melawan Kemustahilan': { price: 'Rp 249.000', bonus: 'Bonus Video Motivasi Spesial Dewa Eka Prayoga senilai Rp 300.000' },
    'Titik Balik': { price: 'Rp 147.000' },
    'Al-Qur’an Kharisma': {
        price: 'Rp 297.000', bonus: [
            'WA Grup Indonesia Bisa Mengaji',
            'Bimbingan Mengaji 1 Bulan',
            'Buku Saku Dzikir',
            'E-book Premium',
        ]
    },
};

export const AUTHOR_AVATARS: Record<string, string> = {
    'Dewa Eka Prayoga': '/images/dewa.png',
    'Asma Nadia': '/images/nadia.webp',
    'Arafat': '/images/arafat.webp',
};

export const AUTHOR_STATS: Record<string, { books: string; readers: string }> = {
    'Dewa Eka Prayoga': { books: '70+', readers: '3–5 juta' },
    'Asma Nadia': { books: '100+', readers: '20–30 juta' },
    'Arafat': { books: '1–3', readers: '500–10.000' },
};

export const AUTHOR_BIOS: Record<string, string[]> = {
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

export const CONTACT = {
    whatsapp: "https://wa.me/6287879713808?text=" + encodeURIComponent("Assalamu’alaikum, saya tertarik memesan Al-Qur’an Kharisma. Mohon informasi lebih lanjut mengenai ketersediaan dan proses pemesanan. Terima kasih."),
    shopee: "#",
    tokopedia: "#",
} as const;

export const ADMIN_CONTACTS = [
    {
        name: 'Admin Pondok',
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

export const PRICE_MAP_NUMERIC: Record<string, number> = {
    'Sebelum Aku Tiada': 157000,
    'Melawan Kemustahilan': 249000,
    'Titik Balik': 147000,
    'Al-Qur’an Kharisma': 297000,
};
