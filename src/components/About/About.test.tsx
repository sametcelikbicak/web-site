import { render } from '@testing-library/react';
import About from '@/components/About/About';

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

describe('About', () => {
  it('renders without crashing', () => {
    render(<About />);
  });
});
