import { render } from '@testing-library/react';
import SocialLinks from '@/components/SocialLinks/SocialLinks';

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

describe('SocialLinks', () => {
  it('renders without crashing', () => {
    render(<SocialLinks />);
  });
});
