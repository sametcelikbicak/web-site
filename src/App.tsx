import { lazy, Suspense, useEffect } from 'react';
import { ThemeProvider } from '@/theme';
import '@/i18n';
import { Route, Routes, useLocation } from 'react-router-dom';
import About from '@/components/About/About';
import Header from '@/components/Header/Header';
import Profile from '@/components/Profile/Profile';
import { useIsMobile } from '@/hooks/useIsMobile';

const Experience = lazy(() => import('@/components/Experience/Experience'));
const Education = lazy(() => import('@/components/Education/Education'));
const Skills = lazy(() => import('@/components/Skills/Skills'));
const Projects = lazy(() => import('@/components/Projects/Projects'));
const Footer = lazy(() => import('@/components/Footer/Footer'));

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && !location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const isMobile = useIsMobile();
  return (
    <ThemeProvider>
      <Header />
      <div className="w-full min-h-[90vh] main-bg shadow-none flex flex-col overflow-hidden p-6">
        <main className="px-2 sm:px-8 justify-center pt-12 pb-4 w-full flex flex-col max-w-4xl flex-1 gap-16 mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {isMobile ? (
                      <>
                        <Profile />
                        <About />
                      </>
                    ) : (
                      <>
                        <About />
                        <Profile />
                      </>
                    )}
                  </div>
                  <Suspense fallback={null}>
                    <Experience />
                    <Education />
                    <Skills />
                    <Projects />
                    <Footer />
                  </Suspense>
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
