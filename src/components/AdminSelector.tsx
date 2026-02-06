import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ADMIN_CONTACTS } from '../data/constants';
import { isOnlineNow } from '../utils/helpers';

export type AdminSelectorProps = {
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
                <div className={`${theme === 'dark' ? 'inline-block rounded-xl border border-white/20 bg-white/10 px-4 py-3' : ''}`}>
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    {subtitle && <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>{subtitle}</p>}
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
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0 overflow-hidden relative">
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

export default AdminSelector;
