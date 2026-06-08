import ExpertiseCards from '@/components/ExpertiseCards/ExpertiseCards';
import Hero from '@/components/Hero/Hero';
import StatsSection from '@/components/StatsSection/StatsSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-hero-stats">
        <Hero>
          <StatsSection />
        </Hero>
      </div>
      <hr className="divider" />
      <ExpertiseCards />
    </div>
  );
};

export default HomePage;
