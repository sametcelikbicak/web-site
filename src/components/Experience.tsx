function Experience() {
  return (
    <section className="scroll-mt-20 text-left" id="experience">
      <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-8">
        Experience
      </h2>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 sm:gap-6">
          <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">
            💼
          </div>
          <div className="flex-1">
            <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
              Etiya
            </p>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              Principal Software Specialist • 2024 - Present
            </p>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="text-[var(--primary-color)] text-xl sm:text-2xl font-bold mt-1">
            💼
          </div>
          <div className="flex-1">
            <p className="text-text-primary text-base sm:text-lg font-semibold leading-normal">
              VirtuDev
            </p>
            <p className="text-text-secondary text-sm sm:text-base font-normal leading-normal">
              Team Lead • 2018 - 2024
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
