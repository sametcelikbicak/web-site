import useAnalytics from './useAnalytics';
import { renderHook } from '@testing-library/react';

describe('useAnalytics', () => {
  beforeAll(() => {
    // Mock gtag on window
    window.gtag = jest.fn();
    // Mock IntersectionObserver
    class MockIntersectionObserver {
      root = null;
      rootMargin = '';
      thresholds = [];
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    global.IntersectionObserver = MockIntersectionObserver;
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
    // Remove gtag
    delete window.gtag;
    const { result } = renderHook(() => useAnalytics());
    expect(() => result.current.trackEvent('test')).not.toThrow();
  });
});
