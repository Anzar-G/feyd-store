import React, { useEffect } from 'react';

export type AnalyticsProps = {
  measurementId: string;
};

const Analytics: React.FC<AnalyticsProps> = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return;

    // Avoid duplicate injection
    if (!document.getElementById('ga-gtag')) {
      const script = document.createElement('script');
      script.id = 'ga-gtag';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }

    if (!(window as any).dataLayer) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function gtag(){ (window as any).dataLayer.push(arguments); };
    }

    // Init
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', measurementId);
  }, [measurementId]);

  return null;
};

export default Analytics;
