import { fireEvent, render, screen } from '@testing-library/react';
import BackToTop from '@/components/BackToTop/BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation();
  });

  it('renders without crashing', () => {
    render(<BackToTop />);
    expect(screen.getByLabelText('Back to top')).toBeInTheDocument();
  });

  it('is hidden by default (scrollY < 400)', () => {
    render(<BackToTop />);
    const btn = screen.getByLabelText('Back to top');
    expect(btn.className).not.toContain('back-to-top--visible');
  });

  it('becomes visible when scrolled past 400', () => {
    render(<BackToTop />);
    fireEvent.scroll(window, { target: { scrollY: 500 } });
    const btn = screen.getByLabelText('Back to top');
    expect(btn.className).toContain('back-to-top--visible');
  });

  it('remains hidden when scrollY is exactly 400', () => {
    render(<BackToTop />);
    fireEvent.scroll(window, { target: { scrollY: 400 } });
    const btn = screen.getByLabelText('Back to top');
    expect(btn.className).not.toContain('back-to-top--visible');
  });

  it('scrolls to top when clicked', () => {
    render(<BackToTop />);
    fireEvent.click(screen.getByLabelText('Back to top'));
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('removes scroll listener on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<BackToTop />);
    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
