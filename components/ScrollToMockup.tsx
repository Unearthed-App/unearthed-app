"use client";

import { useEffect } from 'react';

export function ScrollToMockup() {
  useEffect(() => {
    const shouldScroll =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('scroll') === 'mobile-mockup';

    if (!shouldScroll) return;

    // Small delay to ensure everything is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById('mobile-mockup');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}
