import { fireEvent, render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

let shouldThrow = true;
const Boom = () => {
  if (shouldThrow) throw new Error('kaboom');
  return <p>rendered after retry</p>;
};

const renderBoundary = () =>
  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );

describe('ErrorBoundary', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    shouldThrow = true;
    // React logs the caught error; keep the test output readable.
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => errorSpy.mockRestore());

  it('renders children when nothing throws', () => {
    shouldThrow = false;
    renderBoundary();
    expect(screen.getByText('rendered after retry')).toBeInTheDocument();
  });

  it('shows the fallback instead of a blank page when a child throws', () => {
    renderBoundary();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // jest.setup loads the real English bundle (PR #104), so that is what renders.
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Something went wrong'
    );
  });

  it('logs the error with its component stack', () => {
    renderBoundary();
    expect(errorSpy).toHaveBeenCalledWith(
      'Unhandled render error',
      expect.any(Error),
      expect.any(String)
    );
  });

  it('retry re-renders the children', () => {
    renderBoundary();
    shouldThrow = false; // the retry succeeds, as a re-fetched chunk would
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('rendered after retry')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('retry stays on the fallback when the error persists', () => {
    renderBoundary();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
