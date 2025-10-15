import { useEffect } from 'react';
import { ThemeProvider } from '@/theme';
import '@/i18n';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Profile from '@/components/Profile/Profile';
import About from '@/components/About/About';
import Experience from '@/components/Experience/Experience';
import Skills from '@/components/Skills/Skills';
import Projects from '@/components/Projects/Projects';
import Footer from '@/components/Footer/Footer';

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
                  <Profile />
                  <About />
                  <Experience />
                  <Skills />
                  <Projects />
                  <Footer />
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
