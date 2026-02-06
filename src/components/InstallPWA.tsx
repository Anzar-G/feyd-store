import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (for desktop largely, but also checking standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            if (!isStandalone) {
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setIsVisible(false);
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, so clear it
        setDeferredPrompt(null);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible || isInstalled) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in-up">
            <div className="bg-white/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Install Feyd Store App</h3>
                    <p className="text-xs text-gray-600">Akses lebih cepat & hemat kuota. Install sekarang!</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 px-4 text-xs font-bold"
                    >
                        <Download size={16} />
                        Install
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

};

export default InstallPWA;
