'use client';
import { useState, useEffect } from 'react';

const banners = [
  { id: 1, src: '/banners/banner1.png', alt: 'ServiTx' },
  { id: 2, src: '/banners/banner2.png', alt: 'ServiTx' },
  { id: 3, src: '/banners/banner3.png', alt: 'ServiTx' },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const items = [...banners, banners[0]]; // clon del primero para salto invisible

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => i + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!animate) {
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [animate]);

  return (
    <div className="banner-carousel">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${index * 100}%)`, transition: animate ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
        onTransitionEnd={() => { if (index >= banners.length) { setAnimate(false); setIndex(0); } }}
      >
        {items.map((b, i) => (
          <div key={`${b.id}-${i}`} className="banner-slide"><img src={b.src} alt={b.alt} /></div>
        ))}
      </div>
      <button className="banner-arrow prev" onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}>‹</button>
      <button className="banner-arrow next" onClick={() => setIndex((i) => i + 1)}>›</button>
      <div className="banner-dots">
        {banners.map((_, i) => (
          <button key={i} className={`banner-dot ${i === index % banners.length ? 'active' : ''}`} onClick={() => setIndex(i)} />
        ))}
      </div>
    </div>
  );
}