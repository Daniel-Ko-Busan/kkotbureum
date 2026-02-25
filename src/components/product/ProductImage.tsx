'use client';

import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="aspect-square bg-bg-secondary relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-bg-secondary animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
