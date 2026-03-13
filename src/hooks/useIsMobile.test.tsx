import { act, renderHook } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  afterEach(() => {
    setWindowWidth(originalInnerWidth);
  });

  it('should return true if window width is less than breakpoint', () => {
    setWindowWidth(500);
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(true);
  });

  it('should return false if window width is greater than or equal to breakpoint', () => {
    setWindowWidth(1200);
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(false);
  });

  it('should update when window is resized', () => {
    setWindowWidth(1200);
    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(false);
    act(() => {
      setWindowWidth(800);
    });
    expect(result.current).toBe(true);
  });
});
