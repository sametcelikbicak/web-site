const PROFILE_IMAGE = "https://avatars.githubusercontent.com/u/5312741?s=400&u=c94aaea8002d28b4a487d6d11a7bc784abe60ff6&v=4";

const PROJECTS = [
  {
    title: 'Enum2Array',
    description: 'A function to help converting enums to an array. Define an enum then use this function to convert that enum to an array.',
    image: 'https://raw.githubusercontent.com/sametcelikbicak/enum2array/81a91637434dc2d11eac821c589dea7a8a79d1e8/assets/enum2array.svg',
  },
  {
    title: 'TSCI CLI',
    description: 'TypeScript CLI for creating HTML & CSS & TypeScript project with different bundlers.',
    image: 'https://raw.githubusercontent.com/sametcelikbicak/tsci/refs/heads/main/assets/tsci.jpeg',
  },
  {
    title: 'Storage Function',
    description: 'A function to manipulate browser storages. Such as store a key value pair to session or local storage, getting key value pairs from local or session storage.You can check all available functions for more details.',
    image: 'https://raw.githubusercontent.com/sametcelikbicak/storage-function/0b679da3eac7a09d471b4eaa3b741a978cba74a8/assets/storage-function.svg',
  },
];

function App() {

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="w-full max-w-6xl min-h-[90vh] bg-white shadow-none flex flex-col overflow-hidden p-6 sm:p-10">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-b-[#243647] px-2 sm:px-8 py-4">
          <div className="flex items-center gap-3 text-text-primary">
            <div className="w-10 h10">
              <img src="./public/sc.png" alt="Logo" />
            </div>
            <h2 className="text-text-primary text-xl font-bold leading-tight">Samet ÇELİKBIÇAK</h2>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="#about">About</a>
              <a className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="#experience">Experience</a>
              <a className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors" href="#projects">Projects</a>
            </nav>
          </div>
        </header>
        {/* Main Content */}
        <main className="px-2 sm:px-8 flex flex-1 justify-center py-12">
          <div className="w-full flex flex-col max-w-4xl flex-1 gap-16 mx-auto">
            {/* Profile Section */}
            <section className="flex flex-col items-center text-center gap-6">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-40 w-40 border-4 border-solid border-white dark:border-[#243647] shadow-lg" style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)', backgroundImage: `url('${PROFILE_IMAGE}')` }}></div>
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-text-primary text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">Samet ÇELİKBIÇAK</h1>
                <p className="text-text-secondary text-lg sm:text-xl font-normal leading-normal">Principal Software Specialist</p>
              </div>
            </section>
            {/* About Section */}
            <section className="scroll-mt-20 text-left" id="about">
              <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-6">About</h2>
              <p className="text-text-secondary text-base sm:text-lg font-normal leading-relaxed">
                I have 17+ years of working as a Senior Software Developer with extensive experience in software development, including object oriented programming, patterns, principles, software methodologies with various development tools, web (front-end & back-end) and android(xamarin) applications. I am using technical and analytical skills to problem solve both independently, as well as part of a group. I worked with Angular, TypeScript, C#, HTML, CSS and JavaScript technologies last six years before 2024, nowadays working Principal Frontend Developer.
              </p>
            </section>
            {/* Experience Section */}
            <section className="scroll-mt-20 text-left" id="experience">
              <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">Experience</h2>
              <div className="flex flex-col gap-8">
                <div className="flex gap-4 sm:gap-6">
                  <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">💼</div>
                  <div className="flex-1">
                    <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">Etiya</p>
                    <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">Principal Software Specialist • 2024 - Present</p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">💼</div>
                  <div className="flex-1">
                    <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">VirtuDev</p>
                    <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">Team Lead • 2018 - 2024</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Projects Section */}
            <section className="scroll-mt-20 text-left" id="projects">
              <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECTS.map((project) => (
                  <div key={project.title} className="flex flex-col gap-4 bg-white rounded-lg overflow-hidden transition-shadow duration-300">
                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover" style={{ backgroundImage: `url('${project.image}')` }}></div>
                    <div className="p-4 flex flex-col">
                      <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">{project.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* Footer Section */}
            <footer className="mt-12 text-center text-text-secondary text-sm border-t border-gray-200 pt-6">
              &copy; {new Date().getFullYear()} Samet ÇELİKBIÇAK. All rights reserved.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
