import { renderHook } from '@testing-library/react';
import useAnalytics from '@/hooks/useAnalytics';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let mockObserverCallback: ObserverCallback | null = null;

describe('useAnalytics', () => {
  beforeAll(() => {
    window.gtag = jest.fn();
    class MockIntersectionObserver {
      constructor(callback: ObserverCallback) {
        mockObserverCallback = callback;
      }
      root = null;
      rootMargin = '';
      thresholds = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    global.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call gtag for trackEvent', () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackEvent('test_action', {
      category: 'test_cat',
      label: 'test_label',
    });
    expect(window.gtag).toHaveBeenCalledWith('event', 'test_action', {
      event_category: 'test_cat',
      event_label: 'test_label',
    });
  });

  it('should call gtag for trackButtonClick', () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackButtonClick('myButton');
    expect(window.gtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'button',
      event_label: 'myButton',
    });
  });

  it('should call gtag for trackSectionView', () => {
    const { result } = renderHook(() => useAnalytics());
    result.current.trackSectionView('about');
    expect(window.gtag).toHaveBeenCalledWith('event', 'view_section', {
      event_category: 'section',
      event_label: 'about',
    });
  });

  it('should not throw if gtag is not defined', () => {
    const savedGtag = window.gtag;
    delete window.gtag;
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackEvent('test')).not.toThrow();
    window.gtag = savedGtag;
  });

  describe('initScrollTracking', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, 'innerHeight', {
        value: 1000,
        writable: true,
        configurable: true,
      });
    });

    it('should track scroll depth at each milestone', () => {
      renderHook(() => useAnalytics());
      jest.clearAllMocks();

      const docHeight = 2000 - 1000;

      const scrollTo = (pct: number) => {
        window.scrollY = (pct / 100) * docHeight;
        window.dispatchEvent(new Event('scroll'));
      };

      scrollTo(25);
      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '25%',
      });

      scrollTo(50);
      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '50%',
      });

      scrollTo(75);
      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '75%',
      });

      scrollTo(100);
      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '100%',
      });
    });

    it('should not re-track already tracked milestones', () => {
      renderHook(() => useAnalytics());
      jest.clearAllMocks();

      const docHeight = 2000 - 1000;
      window.scrollY = (30 / 100) * docHeight;
      window.dispatchEvent(new Event('scroll'));

      expect(window.gtag).toHaveBeenCalledTimes(1);
      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '25%',
      });

      window.scrollY = (60 / 100) * docHeight;
      window.dispatchEvent(new Event('scroll'));

      expect(window.gtag).toHaveBeenCalledWith('event', 'scroll_depth', {
        event_category: 'engagement',
        event_label: '50%',
      });
    });
  });

  describe('section view tracking', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      mockObserverCallback = null;
    });

    it('should call trackSectionView when a section becomes visible', () => {
      document.body.innerHTML =
        '<section id="about"></section><section id="skills"></section>';

      renderHook(() => useAnalytics());
      jest.clearAllMocks();

      expect(mockObserverCallback).not.toBeNull();

      mockObserverCallback?.([
        { isIntersecting: true, target: { id: 'about' } as unknown as Element },
      ]);

      expect(window.gtag).toHaveBeenCalledWith('event', 'view_section', {
        event_category: 'section',
        event_label: 'about',
      });
    });

    it('should not call trackSectionView for non-intersecting sections', () => {
      document.body.innerHTML = '<section id="about"></section>';

      renderHook(() => useAnalytics());
      jest.clearAllMocks();

      mockObserverCallback?.([
        {
          isIntersecting: false,
          target: { id: 'about' } as unknown as Element,
        },
      ]);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });
});
