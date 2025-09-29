import { render } from '@testing-library/react';
import Experience from './Experience';

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

describe('Experience', () => {
  it('renders without crashing', () => {
    render(<Experience />);
  });
});
