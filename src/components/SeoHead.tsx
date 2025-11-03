import React, { useEffect } from 'react';

export type SeoHeadProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  product?: {
    name: string;
    description?: string;
    image?: string;
    sku?: string;
    brand?: string;
    offers?: { price: number; priceCurrency?: string; availability?: string };
  };
};

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, image, url, product }) => {
  useEffect(() => {
    if (title) document.title = title;

    const metaDesc = ensureMeta('description');
    if (description) metaDesc.setAttribute('content', description);

    setOg('og:title', title || '');
    setOg('og:description', description || '');
    if (image) setOg('og:image', image);
    if (url) setOg('og:url', url);

    // JSON-LD Product schema (client-side inject)
    let ldTag: HTMLScriptElement | null = document.getElementById('ld-product') as HTMLScriptElement | null;
    if (ldTag) ldTag.remove();
    if (product) {
      const jsonLd = buildProductJsonLd(product, url);
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'ld-product';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('ld-product');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, [title, description, image, url, JSON.stringify(product)]);

  return null;
};

function ensureMeta(name: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  return el!;
}

function setOg(property: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function buildProductJsonLd(product: SeoHeadProps['product'], url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name,
    description: product?.description,
    image: product?.image ? [product.image] : undefined,
    sku: product?.sku,
    brand: product?.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: product?.offers
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: product.offers.priceCurrency || 'IDR',
          price: product.offers.price,
          availability: product.offers.availability || 'https://schema.org/InStock',
        }
      : undefined,
  } as const;
}

export default SeoHead;
