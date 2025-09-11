const PROFILE_IMAGE =
  'https://avatars.githubusercontent.com/u/5312741?s=400&u=c94aaea8002d28b4a487d6d11a7bc784abe60ff6&v=4';

function Profile() {
  return (
    <section className="flex flex-col items-center text-center gap-6">
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-40 w-40 border-4 border-solid border-white dark:border-[#243647] shadow-lg"
        style={{
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
          backgroundImage: `url('${PROFILE_IMAGE}')`,
        }}
      ></div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-text-primary text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">
          Samet ÇELİKBIÇAK
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl font-normal leading-normal">
          Principal Software Specialist
        </p>
      </div>
    </section>
  );
}

export default Profile;
