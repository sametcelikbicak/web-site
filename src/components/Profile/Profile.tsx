import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center gap-6">
      <img
        src="/sc_caricature.png"
        alt="Profile"
        className="max-w-xs object-cover shadow-lg"
        style={{
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        }}
      />
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
