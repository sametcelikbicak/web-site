import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div
        className="relative flex justify-center items-center"
        style={{ width: 320, height: 480 }}
      >
        {!imgLoaded && (
          <div
            className="bg-gray-200 animate-pulse rounded-lg shadow-lg absolute top-0 left-0 flex items-center justify-center"
            style={{
              width: 320,
              height: 480,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            }}
          />
        )}
        <img
          src="/sc_caricature.png"
          alt="Profile"
          className={`rounded-lg shadow-lg transition-opacity duration-300 absolute top-0 left-0 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width: 320,
            height: 480,
            objectFit: 'cover',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
          }}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-text-primary text-4xl sm:text-5xl font-bold leading-tight tracking-tighter">
          {t('profile.name')}
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl font-normal leading-normal">
          {t('profile.title')}
        </p>
      </div>
    </div>
  );
};

export default Profile;
