function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-b-[#243647] px-2 sm:px-8 py-4">
      <div className="flex items-center gap-3 text-text-primary">
        <div className="w-10 h10">
          <img src="./sc.png" alt="Logo" />
        </div>
        <h2 className="text-text-primary text-xl font-bold leading-tight">
          Samet ÇELİKBIÇAK
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#about"
          >
            About
          </a>
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#experience"
          >
            Experience
          </a>
          <a
            className="text-text-secondary hover:text-[var(--primary-color)] text-base font-medium leading-normal transition-colors"
            href="#projects"
          >
            Projects
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
