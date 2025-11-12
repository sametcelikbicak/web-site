import { render } from '@testing-library/react';
import Skills from '@/components/Skills/Skills';

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

describe('Skills', () => {
  it('renders without crashing', () => {
    render(<Skills />);
  });
});
