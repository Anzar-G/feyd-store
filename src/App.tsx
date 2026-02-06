import React, { useEffect, useState, useMemo } from 'react';
import { useCart } from './hooks/useCart';
import { readUtm, captureFirstUtm } from './utils/helpers';
import { getCartTotalQty } from './utils/cart';

// Components
import Analytics from './components/Analytics';
import SplashScreen from './components/SplashScreen';
import SEO from './components/SEO';
import StickyBottomCTA from './components/StickyBottomCTA';
import LiveOrderFeed from './components/LiveOrderFeed';
import CustomerServiceChat from './components/CustomerServiceChat';
import { HeaderWakaf, HeaderGaleri } from './components/Headers';
import InstallPWA from './components/InstallPWA';

// Pages
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import QuickOrderQuranPage from './pages/QuickOrderQuranPage';
import WaitlistAdminPage from './pages/AdminPage';
import WakafPage from './pages/WakafPage'; // Renamed import
import GaleriWakafPage from './pages/GaleriWakafPage'; // Renamed import

const CART_KEY = 'cart_v1'; // Should match utils/cart CONST

const App: React.FC = () => {
  // Capture UTM on load
  useEffect(() => { captureFirstUtm(); }, []);

  // Global State
  const [route, setRoute] = useState<string>('#');
  const [showSplash, setShowSplash] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalQty, add: addToCart } = useCart();
  const [cartCount, setCartCount] = useState(totalQty);

  // Sync cartCount with hook (although hook handles it, App needs it for some legacy props maybe? 
  // Actually, header components in Pages use useCart directly now, except headers in App.tsx if any.
  // HeaderWakaf checks props but doesn't use cartCount.
  // But let's keep it synced just in case.
  useEffect(() => { setCartCount(totalQty); }, [totalQty]);


  // Sticky CTA Logic
  const [showStickyCta, setShowStickyCta] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
      if (window.scrollY > 400 && route === '#' || route.startsWith('#/produk/')) {
        // Logic for sticky CTA visibility could be refined
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [route]);

  // Route Handling
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#');
    window.addEventListener('hashchange', onHash);
    onHash(); // initial
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const fb = (window as any).fbq;
    if (typeof fb === 'function') fb('track', 'PageView');
  }, [route]);


  // Routing Logic Helpers
  const isWakaf = route.startsWith('#/wakaf');
  const isGaleri = route.startsWith('#/galeri-wakaf');
  const isKeranjang = route.startsWith('#/keranjang');
  const isPesanQuran = route.startsWith('#/pesan-quran');
  const isWaitlist = route.startsWith('#/pilih-admin');
  const productSlug = useMemo(() => {
    if (route.startsWith('#/produk/')) {
      return route.replace('#/produk/', '') as 'melawan-kemustahilan' | 'sebelum-aku-tiada' | 'titik-balik';
    }
    return null;
  }, [route]);
  const isProduk = Boolean(productSlug);
  const isLP = !isWakaf && !isGaleri && !isKeranjang && !isPesanQuran && !isWaitlist && !isProduk;

  // Handlers
  const handleAddToCart = (payload: any) => {
    addToCart(payload);
    // Toast handled in ProductPage or wherever called?
    // App.tsx used to handle global toast. If pages call this function via prop, we need toast here?
    // ProductPage in src/pages uses `onAddToCart` prop passed from App?
    // Let's check ProductPage definition. It accepts `onAddToCart`.
    // So we need definitions here.
  };

  // We need to pass onAddToCart to ProductPage which expects it.
  // And implement the toast here or inside the hook/context. 
  // Ideally context. But let's keep it simple: App handles it if passed down.

  const renderContent = () => {
    if (isKeranjang) {
      return (
        <>
          <SEO title="Keranjang Belanja" description="Selesaikan pesanan Anda." url="https://feyd-store.vercel.app/#/keranjang" />
          <CartPage cartCount={cartCount} setCartCount={setCartCount} />
        </>
      );
    }
    if (isPesanQuran) {
      return (
        <>
          <SEO title="Pesan Al-Qur'an Kharisma" description="Formulir pemesanan cepat." url="https://feyd-store.vercel.app/#/pesan-quran" />
          <QuickOrderQuranPage />
        </>
      );
    }
    if (isWaitlist) {
      return (
        <>
          <SEO title="Daftar Tunggu Promo" description="Daftar tunggu promo." url="https://feyd-store.vercel.app/#/pilih-admin" />
          <WaitlistAdminPage />
        </>
      );
    }
    if (isWakaf) {
      return (
        <>
          <SEO title="Wakaf Al-Qur'an" description="Program wakaf." url="https://feyd-store.vercel.app/#/wakaf" />
          <WakafPage />
        </>
      );
    }
    if (isGaleri) {
      return (
        <>
          <SEO title="Galeri Penyaluran" description="Dokumentasi penyaluran." url="https://feyd-store.vercel.app/#/galeri-wakaf" />
          <GaleriWakafPage />
        </>
      );
    }
    if (productSlug === 'melawan-kemustahilan') {
      return (
        <>
          <SEO title="Melawan Kemustahilan" description="Novel inspiratif." image="https://feyd-store.vercel.app/images/melawan-kemustahilan.jpg" url="https://feyd-store.vercel.app/#/produk/melawan-kemustahilan" />
          <ProductPage
            slug="melawan-kemustahilan"
            title="Melawan Kemustahilan"
            author="Dewa Eka Prayoga"
            tagline="Menguji Keimanan, Menjemput Keajaiban"
            cover="/images/melawan-kemustahilan.jpg"
            synopsis={[
              'Dalam hidup, ada saat-saat kita merasa terjepit...', 'Melalui kisah nyata dan refleksi spiritual...'
            ]}
            testimonial={{ quote: 'Buku ini datang tepat saat saya di PHK. Membacanya bikin saya bangkit lagi.', by: 'Rudi, Bandung' }}
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
          />
        </>
      );
    }
    if (productSlug === 'sebelum-aku-tiada') {
      return (
        <>
          <SEO title="Sebelum Aku Tiada" description="Kumpulan surat dan refleksi." image="https://feyd-store.vercel.app/images/sebelum-aku-tiada.jpg" url="https://feyd-store.vercel.app/#/produk/sebelum-aku-tiada" />
          <ProductPage
            slug="sebelum-aku-tiada"
            title="Sebelum Aku Tiada"
            author="Asma Nadia"
            tagline="Surat-Surat dari Gaza"
            cover="/images/sebelum-aku-tiada.jpg"
            synopsis={['Dalam kesunyian paling jujur...', 'Setiap halaman adalah doa...']}
            testimonial={{ quote: 'Saya menangis di halaman 12. Buku ini mengingatkan kita: hidup ini berharga.', by: 'Siti, Yogyakarta' }}
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
          />
        </>
      );
    }
    if (productSlug === 'titik-balik') {
      return (
        <>
          <SEO title="Titik Balik" description="Buku refleksi harian." image="https://feyd-store.vercel.app/images/titik-balik.jpg" url="https://feyd-store.vercel.app/#/produk/titik-balik" />
          <ProductPage
            slug="titik-balik"
            title="Titik Balik"
            author="Arafat"
            tagline="Ada 365 Hari Dalam Setahun..."
            cover="/images/titik-balik.jpg"
            synopsis={['Setiap hari adalah kesempatan memulai kembali...', 'Refleksi ringan namun dalam...']}
            testimonial={{ quote: 'Buku ini seperti sahabat yang mengingatkan dengan lembut.', by: 'Andi, Surabaya' }}
            cartCount={cartCount}
            onAddToCart={handleAddToCart}
          />
        </>
      );
    }

    // Default Landing Page
    return (
      <LandingPage />
    );
  };

  const handleSmoothNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  return (
    <div className={`min-h-screen text-gray-800`}>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Analytics & Global */}
      <Analytics measurementId="G-K7L6K9P8Z1" />

      {/* Header for NON-LP/Product pages. LP and ProductPage have internal headers (or none). 
            Wakaf and Galeri need headers.
        */}
      {isWakaf && <HeaderWakaf isLP={isLP} isGaleri={isGaleri} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isScrolled={isScrolled} />}
      {isGaleri && <HeaderGaleri isLP={isLP} isGaleri={isGaleri} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} isScrolled={isScrolled} />}

      <main>
        {renderContent()}
      </main>

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

      {/* Overlays */}
      {showStickyCta && !showSplash && (
        <StickyBottomCTA
          show={showStickyCta}
          onClose={() => setShowStickyCta(false)}
          onBuy={() => handleSmoothNav('#harga')}
        />
      )}
      <LiveOrderFeed route={route} productName={productSlug || undefined} />
      <CustomerServiceChat route={route} productName={productSlug || undefined} />
      <InstallPWA />
    </div>
  );
};

export default App;
