import About from './components/About';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Profile from './components/Profile';
import Projects from './components/Projects';
import './i18n';


function App() {


  return (
    <div className="w-full min-h-[90vh] bg-white shadow-none flex flex-col overflow-hidden p-6">
      <Header />
      <main className="px-2 sm:px-8 justify-center pt-12 pb-4 w-full flex flex-col max-w-4xl flex-1 gap-16 mx-auto">
        <Profile />
        <About />
        <Experience />
        <Projects />
        <Footer />
      </main>
    </div>
  );
}


export default App;
