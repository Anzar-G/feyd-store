import React from 'react';

const Footer: React.FC = () => {
    return (
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
                                    <path fill="#E1306C" stroke="#E1306C" strokeWidth={0.75} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28-.073 1.688-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.28-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://www.tiktok.com/@pondokaba" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="transition hover:opacity-80">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden className="bi bi-tiktok text-black">
                                    <path stroke="currentColor" strokeWidth={0.75} d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@masjidabbacirebon" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition hover:opacity-80">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
                                    <path fill="#FF0000" stroke="#FF0000" strokeWidth={0.75} d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-xs text-gray-500"> 2024 Kharisma Quran. All rights reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;
