export type Testimonial = {
    id: number;
    name: string;
    role: string;
    rating: number;
    content: string;
    avatar: string;
    avatarUrl?: string; // some have specific image urls
};

export const TESTIMONIALS: Testimonial[] = [
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
            'Sejak pakai Al-Qur’an berwarna tajwid ini, bacaannya jadi lebih tenang dan lancar. Warna-warna-nya bantu banget buat tahu kapan harus panjang, berhenti, atau dengung. Jadi lebih semangat tilawah tiap hari 😇',
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
