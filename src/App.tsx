import { useTranslation } from 'react-i18next';
import About from './components/About';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Profile from './components/Profile';
import Projects from './components/Projects';
import './i18n';
import { useState } from 'react';


function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl min-h-[90vh] bg-white shadow-none flex flex-col overflow-hidden p-6 sm:p-10">
        <div className="self-end mb-4 relative">
          <button
            className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none"
            aria-label="Select language"
            onClick={() => setShowDropdown((prev) => !prev)}
            style={{ fontSize: '1.5rem' }}
          >🌐</button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col">
              <button
                onClick={() => { changeLanguage('tr'); setShowDropdown(false); }}
                className={`p-2 flex items-center gap-2 hover:bg-gray-100 ${i18n.language === 'tr' ? 'font-bold' : ''}`}
                aria-label="Türkçe"
              >🇹🇷 <span>Türkçe</span></button>
              <button
                onClick={() => { changeLanguage('en'); setShowDropdown(false); }}
                className={`p-2 flex items-center gap-2 hover:bg-gray-100 ${i18n.language === 'en' ? 'font-bold' : ''}`}
                aria-label="English"
              >🇬🇧 <span>English</span></button>
            </div>
          )}
        </div>
        <div>{t('helloWorld')}</div>
        <Header />
        <main className="px-2 sm:px-8 flex flex-1 justify-center py-12">
          <div className="w-full flex flex-col max-w-4xl flex-1 gap-16 mx-auto">
            <Profile />
            <About />
            <Experience />
            <Projects />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}


export default App;
