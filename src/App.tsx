import About from './components/About';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Profile from './components/Profile';
import Projects from './components/Projects';

import { ThemeProvider } from './theme';
import './i18n';

function App() {
  return (
    <ThemeProvider>
      <Header />
      <div className="w-full min-h-[90vh] main-bg shadow-none flex flex-col overflow-hidden p-6">
        <main className="px-2 sm:px-8 justify-center pt-12 pb-4 w-full flex flex-col max-w-4xl flex-1 gap-16 mx-auto">
          <Profile />
          <About />
          <Experience />
          <Projects />
          <Footer />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
