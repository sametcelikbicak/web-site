import { render } from '@testing-library/react';
import Education from '@/components/Education/Education';

beforeAll(() => {
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

describe('Education', () => {
  it('renders without crashing', () => {
    render(<Education />);
  });
});
