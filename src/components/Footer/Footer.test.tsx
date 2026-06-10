import { fireEvent, render } from '@testing-library/react';
import Footer from '@/components/Footer/Footer';

const mockTrackButtonClick = jest.fn();

jest.mock('@/hooks/useAnalytics', () => ({
  __esModule: true,
  default: () => ({
    trackButtonClick: mockTrackButtonClick,
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
  global.IntersectionObserver = MockIntersectionObserver;
});

beforeEach(() => {
  mockTrackButtonClick.mockClear();
});

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });

  it('calls trackButtonClick when a social link is clicked', () => {
    const { getByLabelText } = render(<Footer />);
    fireEvent.click(getByLabelText('GitHub'));
    expect(mockTrackButtonClick).toHaveBeenCalledWith('GitHub');
  });
});
