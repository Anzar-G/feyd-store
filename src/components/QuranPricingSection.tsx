import React from 'react';
import { Check, MessageCircle, Clock, ChevronRight } from 'lucide-react';

const QuranPricingSection: React.FC = () => {
    return (
        <section className="mt-12">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] md:text-xs font-semibold uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Kenapa harga Rp 297.000 itu wajar?
                    </div>
                    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
                        Bukan Sekadar Mushaf, tapi Sistem Belajar Lengkap
                    </h2>
                    <div className="mt-4 text-sm md:text-base text-gray-700 leading-relaxed space-y-3">
                        <p>
                            Dengan harga Rp 297.000, Anda tidak hanya mendapatkan Al-Qur’an Kharisma secara fisik, tetapi juga akses ke
                            komunitas, bimbingan, dan materi pendukung yang membantu Anda <span className="font-semibold">istiqamah membaca Al-Qur’an dengan benar</span>.
                        </p>
                        <p>
                            Jika dibandingkan dengan sekali makan di luar atau biaya hiburan seharian, investasi ini jauh lebih kecil —
                            namun manfaatnya, insyaAllah, bisa Anda rasakan <span className="font-semibold">setiap hari dan menjadi amal jariyah</span>.
                        </p>
                        <p className="text-xs text-gray-500 border-t pt-3 mt-2">
                            *Detail harga dan tombol pemesanan sudah tersedia di CTA utama di atas. Bagian ini membantu Anda melihat
                            bahwa harga tersebut sebanding dengan seluruh manfaat yang Anda terima.
                        </p>
                    </div>
                </div>
                <div className="space-y-5">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-emerald-800 tracking-wide uppercase flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Apa saja yang Anda dapatkan?
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-800">
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-600" />
                                <div>
                                    <span className="font-semibold">WA Grup Indonesia Bisa Mengaji</span>
                                    <span className="block text-xs text-gray-600">Komunitas belajar aktif, saling mengingatkan dalam kebaikan.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-600" />
                                <div>
                                    <span className="font-semibold">Bimbingan Mengaji 1 Bulan</span>
                                    <span className="block text-xs text-gray-600">Pendampingan, bukan sekadar beli mushaf lalu dibiarkan.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-600" />
                                <div>
                                    <span className="font-semibold">Buku Saku Dzikir</span>
                                    <span className="block text-xs text-gray-600">Teman dzikir harian yang ringkas dan mudah dibawa.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 text-emerald-600" />
                                <div>
                                    <span className="font-semibold">E-book Premium</span>
                                    <span className="block text-xs text-gray-600">Materi tambahan eksklusif untuk memperbaiki bacaan dan pemahaman.</span>
                                </div>
                            </li>
                        </ul>
                        <p className="mt-4 text-sm italic text-emerald-900">
                            “Ini bukan sekadar Al-Qur’an — ini paket lengkap transformasi membaca Anda.”
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <MessageCircle className="w-4 h-4 text-emerald-600" />
                            Testimoni di sekitar harga
                        </div>
                        <div className="mt-3 space-y-3 text-sm text-gray-700">
                            <p className="italic">
                                “Awalnya saya kira mahal. Tapi ternyata dapat grup WA, bimbingan, buku saku, dan e-book. Rp 297.000 terasa murah banget kalau lihat bonusnya.”
                                <span className="block mt-1 text-xs text-gray-500">— Muhammad Faqih, Santri</span>
                            </p>
                            <p className="italic">
                                “Berasa beli paket belajar, bukan cuma beli mushaf. Worth it banget.”
                                <span className="block mt-1 text-xs text-gray-500">— Nizar, Karyawan</span>
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            Promo terbatas, waktu terbaik untuk mulai memperbaiki bacaan adalah hari ini.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuranPricingSection;
