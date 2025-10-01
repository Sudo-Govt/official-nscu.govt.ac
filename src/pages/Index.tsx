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
import AnnouncementBanner from '@/components/AnnouncementBanner';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 pt-8">
        <AnnouncementBanner />
      </div>
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
