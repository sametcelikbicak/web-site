import { useEffect, useCallback } from 'react';

type EventParams = {
  category?: string;
  label?: string;
};

// Extend the window type so TS knows about gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      action: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export default function useAnalytics() {
  // Generic event tracker
  const trackEvent = useCallback(
    (action: string, { category, label }: EventParams = {}) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
        });
      }
    },
    []
  );

  // Specific helpers
  const trackButtonClick = (label: string) => {
    trackEvent('click', { category: 'button', label });
  };

  const trackSectionView = useCallback(
    (id: string) => {
      trackEvent('view_section', { category: 'section', label: id });
    },
    [trackEvent]
  );

  const initScrollTracking = useCallback(() => {
    const scrollTracked: Record<number, boolean> = {
      25: false,
      50: false,
      75: false,
      100: false,
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      [25, 50, 75, 100].forEach((pct) => {
        if (!scrollTracked[pct] && scrollPercent >= pct) {
          trackEvent('scroll_depth', {
            category: 'engagement',
            label: `${pct}%`,
          });
          scrollTracked[pct] = true;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackEvent]);

  // Auto-init section observer + scroll tracking once
  useEffect(() => {
    const cleanupScroll = initScrollTracking();

    const sections = document.querySelectorAll<HTMLElement>('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSectionView(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      if (typeof cleanupScroll === 'function') cleanupScroll();
      observer.disconnect();
    };
  }, [initScrollTracking, trackSectionView]);

  return { trackEvent, trackButtonClick, trackSectionView };
}
