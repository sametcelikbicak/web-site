import { render, screen } from '@testing-library/react';
import EducationPage from '@/pages/EducationPage';

const mockTrackSectionView = jest.fn();

jest.mock('@/hooks/useAnalytics', () => ({
  __esModule: true,
  default: () => ({
    trackSectionView: mockTrackSectionView,
    trackEvent: jest.fn(),
    trackButtonClick: jest.fn(),
  }),
}));

beforeAll(() => {
  class MockIntersectionObserver {
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('EducationPage', () => {
  it('renders title and subtitle', () => {
    render(<EducationPage />);
    expect(screen.getByText('education.title')).toBeInTheDocument();
    expect(screen.getByText('education.subtitle')).toBeInTheDocument();
  });

  it('tracks section view on mount', () => {
    render(<EducationPage />);
    expect(mockTrackSectionView).toHaveBeenCalledWith('education_page');
  });

  it('renders all education entries', () => {
    const { container } = render(<EducationPage />);
    expect(container.querySelectorAll('.education-row')).toHaveLength(3);
  });

  it('renders GPA for each entry', () => {
    const { container } = render(<EducationPage />);
    const grades = container.querySelectorAll('.entry-grade');
    expect(grades).toHaveLength(3);
    expect(grades[0].textContent).toContain('GPA:');
  });

  it('renders timeline dots', () => {
    const { container } = render(<EducationPage />);
    expect(container.querySelectorAll('.timeline-dot')).toHaveLength(3);
  });

  it('renders first dot as active', () => {
    const { container } = render(<EducationPage />);
    const dots = container.querySelectorAll('.timeline-dot');
    expect(dots[0].className).toContain('dot-active');
  });

  it('renders school names from translation', () => {
    const { container } = render(<EducationPage />);
    expect(container.querySelectorAll('.entry-school').length).toBeGreaterThan(
      0
    );
  });
});
