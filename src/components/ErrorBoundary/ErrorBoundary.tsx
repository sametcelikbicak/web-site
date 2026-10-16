import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './ErrorBoundary.css';

/**
 * Without this, a throw anywhere in the tree unmounts the whole app and the
 * visitor gets a blank page with no way back. The retry matters because the
 * most common render throw on this site is a lazy chunk that failed to load,
 * and that succeeds on the next attempt.
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <Fallback onRetry={() => this.setState({ error: null })} />;
  }
}

const Fallback = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="error-fallback" role="alert">
      <p className="error-fallback-code" aria-hidden="true">
        500
      </p>
      <h1 className="error-fallback-title">{t('errorBoundary.title')}</h1>
      <p className="error-fallback-text">{t('errorBoundary.text')}</p>
      <button type="button" className="error-fallback-retry" onClick={onRetry}>
        {t('errorBoundary.retry')}
      </button>
    </div>
  );
};

export default ErrorBoundary;
