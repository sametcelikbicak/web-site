const PROJECTS = [
  {
    title: 'Enum2Array',
    description:
      'A function to help converting enums to an array. Define an enum then use this function to convert that enum to an array.',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/enum2array/81a91637434dc2d11eac821c589dea7a8a79d1e8/assets/enum2array.svg',
  },
  {
    title: 'TSCI CLI',
    description:
      'TypeScript CLI for creating HTML & CSS & TypeScript project with different bundlers.',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/tsci/refs/heads/main/assets/tsci.jpeg',
  },
  {
    title: 'Storage Function',
    description:
      'A function to manipulate browser storages. Such as store a key value pair to session or local storage, getting key value pairs from local or session storage.You can check all available functions for more details.',
    image:
      'https://raw.githubusercontent.com/sametcelikbicak/storage-function/0b679da3eac7a09d471b4eaa3b741a978cba74a8/assets/storage-function.svg',
  },
];

function Projects() {
  return (
    <section className="scroll-mt-20 text-left" id="projects">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="flex flex-col gap-4 bg-white rounded-lg overflow-hidden transition-shadow duration-300"
          >
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover"
              style={{ backgroundImage: `url('${project.image}')` }}
            ></div>
            <div className="p-4 flex flex-col">
              <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
                {project.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
