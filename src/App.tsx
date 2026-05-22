import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider } from '@/theme';
import '@/i18n';
import { Route, Routes } from 'react-router-dom';
import BackToTop from '@/components/BackToTop/BackToTop';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ExperiencePage = lazy(() => import('@/pages/ExperiencePage'));
const EducationPage = lazy(() => import('@/pages/EducationPage'));
const SkillsPage = lazy(() => import('@/pages/SkillsPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));

const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: '2px solid var(--color-ghost-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  return null;
};

const App = () => {
  return (
    <ThemeProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--color-bg)',
          overflowX: 'clip',
        }}
      >
        <Header />
        <main style={{ flex: 1 }}>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ThemeProvider>
  );
};

export default App;
