
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedPrograms from '@/components/FeaturedPrograms';
import StatsSection from '@/components/StatsSection';
import CampusLife from '@/components/CampusLife';
import ResearchExcellence from '@/components/ResearchExcellence';
import VirtualTour from '@/components/VirtualTour';
import AlumniStories from '@/components/AlumniStories';
import StudentTestimonials from '@/components/StudentTestimonials';
import AdmissionsInfo from '@/components/AdmissionsInfo';
import NewsEvents from '@/components/NewsEvents';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedPrograms />
      <StatsSection />
      <CampusLife />
      <ResearchExcellence />
      <VirtualTour />
      <AlumniStories />
      <StudentTestimonials />
      <AdmissionsInfo />
      <NewsEvents />
      <Footer />
    </div>
  );
};

export default Index;
