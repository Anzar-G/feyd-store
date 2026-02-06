import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setExit(true), 1800);
        const t2 = setTimeout(() => onFinish(), 2400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className={`flex flex-col items-center justify-center text-center transform transition-all duration-500 ${exit ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
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
    );
};

export default SplashScreen;
