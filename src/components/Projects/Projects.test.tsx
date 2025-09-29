import { render } from '@testing-library/react';
import Projects from './Projects';

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

describe('Projects', () => {
  it('renders without crashing', () => {
    render(<Projects />);
  });
});
