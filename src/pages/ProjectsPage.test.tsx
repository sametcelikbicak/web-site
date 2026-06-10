import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsPage from '@/pages/ProjectsPage';

const mockTrackSectionView = jest.fn();
const mockTrackButtonClick = jest.fn();

jest.mock('@/hooks/useAnalytics', () => ({
  __esModule: true,
  default: () => ({
    trackSectionView: mockTrackSectionView,
    trackButtonClick: mockTrackButtonClick,
    trackEvent: jest.fn(),
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

describe('ProjectsPage', () => {
  it('renders title and subtitle', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('projects.title')).toBeInTheDocument();
    expect(screen.getByText('projects.subtitle')).toBeInTheDocument();
  });

  it('tracks section view on mount', () => {
    render(<ProjectsPage />);
    expect(mockTrackSectionView).toHaveBeenCalledWith('projects_page');
  });

  it('renders all 6 project cards', () => {
    const { container } = render(<ProjectsPage />);
    expect(container.querySelectorAll('.project-card')).toHaveLength(6);
  });

  it('renders project images', () => {
    render(<ProjectsPage />);
    const images = document.querySelectorAll('.project-image');
    expect(images).toHaveLength(6);
  });

  it('renders project descriptions from translation', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('projects.subtitle')).toBeInTheDocument();
  });

  it('tracks click on project card', () => {
    render(<ProjectsPage />);
    const links = document.querySelectorAll('.project-card');
    fireEvent.click(links[0]);
    expect(mockTrackButtonClick).toHaveBeenCalledWith('Project: enum2array');
  });
});
