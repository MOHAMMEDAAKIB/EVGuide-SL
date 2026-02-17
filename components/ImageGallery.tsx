'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  vehicleName: string;
}

export default function ImageGallery({ images, vehicleName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Filter out empty strings
  const validImages = images.filter((img) => img.trim() !== '');
  const displayImages = validImages.length > 0 ? validImages : ['/placeholder-vehicle.png'];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    } else if (touchEnd - touchStart > 50) {
      goToPrevious();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative h-96 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-emerald-50 to-teal-50 dark:border-slate-700 dark:from-slate-800 dark:to-emerald-900/30"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={displayImages[currentIndex]}
          alt={`${vehicleName} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition duration-500"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />

        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/30 via-transparent to-transparent" />

        {/* Navigation Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 transition hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 transition hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition ${
                  index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                index === currentIndex
                  ? 'border-emerald-600 dark:border-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${vehicleName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          {currentIndex + 1} / {displayImages.length}
        </p>
      )}
    </div>
  );
}
