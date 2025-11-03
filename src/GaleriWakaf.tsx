import React, { useState } from 'react';
import ResponsiveImage from './components/ResponsiveImage';
import SkeletonCard from './components/SkeletonCard';

const GaleriWakaf: React.FC = () => {
  const media = [
    // images
    '/wakaf/wakaf1.jpg','/wakaf/wakaf2.jpg','/wakaf/wakaf3.jpg','/wakaf/wakaf4.jpg','/wakaf/wakaf5.jpg','/wakaf/wakaf6.jpg','/wakaf/wakaf7.jpg','/wakaf/wakaf8.jpg','/wakaf/wakaf9.jpg','/wakaf/wakaf10.jpg',
    // videos
    '/wakaf/wakaf-cover.mp4','/wakaf/wakaf-video1.mp4','/wakaf/wakaf-video2.MOV','/wakaf/wakaf-video3.MOV','/wakaf/wakaf-video4.MOV','/wakaf/wakaf-video5.mp4',
  ];

  const isVideo = (src: string) => /\.(mp4|mov)$/i.test(src);

  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Galeri Penyaluran Wakaf</h1>
        <p className="text-gray-600 mt-2">Kumpulan foto dan video dokumentasi penyaluran wakaf.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((src) => (
            <div key={src} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-2">
              <div className="rounded-lg overflow-hidden">
                {isVideo(src) ? (
                  <video src={src} className="w-full h-auto object-cover aspect-video" controls preload="metadata" playsInline />
                ) : loaded[src] ? (
                  <ResponsiveImage
                    src={src}
                    alt="Dokumentasi wakaf"
                    className="w-full h-auto object-cover aspect-square"
                    loading="lazy"
                    onLoad={() => setLoaded((m) => ({ ...m, [src]: true }))}
                  />
                ) : (
                  <div className="aspect-square">
                    <SkeletonCard lines={2} className="h-full" />
                    <ResponsiveImage
                      src={src}
                      alt="Dokumentasi wakaf"
                      className="hidden"
                      loading="lazy"
                      onLoad={() => setLoaded((m) => ({ ...m, [src]: true }))}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default GaleriWakaf;
