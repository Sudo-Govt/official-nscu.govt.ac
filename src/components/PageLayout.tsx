
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const PageLayout = ({ children, title, description }: PageLayoutProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="bg-uw-purple py-16 relative overflow-hidden">
          {/* University Logo Background */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="/lovable-uploads/fccf3adc-c3cf-43b7-92ab-abc4bd0d5b79.png" 
              alt="NSCU University Campus Background - International Higher Education Institution"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            {description && (
              <p className="text-xl text-gray-200 max-w-3xl">{description}</p>
            )}
          </div>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
