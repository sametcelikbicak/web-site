import { render } from '@testing-library/react';
import Skills from './Skills';

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

describe('Skills', () => {
  it('renders without crashing', () => {
    render(<Skills />);
  });
});
