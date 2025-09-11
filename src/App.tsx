import About from './components/About';
import Experience from './components/Experience';
import Footer from './components/Footer';
import Header from './components/Header';
import Profile from './components/Profile';
import Projects from './components/Projects';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl min-h-[90vh] bg-white shadow-none flex flex-col overflow-hidden p-6 sm:p-10">
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
