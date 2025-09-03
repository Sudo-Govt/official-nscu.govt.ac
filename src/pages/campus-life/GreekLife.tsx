import PageLayout from '@/components/PageLayout';
import { useSEO } from '@/hooks/useSEO';
import { Users, Heart, Trophy, Calendar, GraduationCap, HandHeart } from 'lucide-react';

const GreekLife = () => {
  useSEO({
    title: "Greek Life - Fraternities & Sororities | NSCU Delaware", 
    description: "Join Greek life at NSCU Delaware. Explore fraternities and sororities offering brotherhood, sisterhood, leadership, service, and lifelong friendships.",
    keywords: "Greek life, fraternities, sororities, brotherhood, sisterhood, leadership, community service, NSCU Delaware"
  });

  return (
    <PageLayout 
      title="Greek Life" 
      description="Building lifelong bonds through brotherhood, sisterhood, and service"
    >

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">25 Organizations</h3>
              <p className="text-gray-600">Fraternities and sororities to choose from</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <HandHeart className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">10,000+ Hours</h3>
              <p className="text-gray-600">Community service annually</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <GraduationCap className="h-12 w-12 text-uw-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-uw-purple mb-2">Higher GPA</h3>
              <p className="text-gray-600">Greek members exceed campus average</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Why Join Greek Life?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Lifelong Friendships</h3>
                    <p className="text-gray-600">Build lasting bonds with like-minded individuals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Leadership Development</h3>
                    <p className="text-gray-600">Gain valuable leadership experience and skills</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HandHeart className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Community Service</h3>
                    <p className="text-gray-600">Make a positive impact in the community</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Academic Support</h3>
                    <p className="text-gray-600">Study groups and academic mentoring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-uw-gold mt-1" />
                  <div>
                    <h3 className="font-semibold">Professional Network</h3>
                    <p className="text-gray-600">Connect with alumni across various industries</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-uw-purple mb-6">Greek Organizations</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Fraternities</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Alpha Phi Alpha</div>
                    <div>Kappa Alpha Psi</div>
                    <div>Omega Psi Phi</div>
                    <div>Phi Beta Sigma</div>
                    <div>Sigma Alpha Chi</div>
                    <div>Tau Kappa Epsilon</div>
                    <div>Theta Chi</div>
                    <div>Sigma Nu</div>
                    <div>Pi Kappa Alpha</div>
                    <div>Lambda Chi Alpha</div>
                    <div>Sigma Chi</div>
                    <div>Beta Theta Pi</div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-uw-purple mb-4">Sororities</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Alpha Kappa Alpha</div>
                    <div>Delta Sigma Theta</div>
                    <div>Zeta Phi Beta</div>
                    <div>Sigma Gamma Rho</div>
                    <div>Alpha Chi Omega</div>
                    <div>Chi Omega</div>
                    <div>Delta Delta Delta</div>
                    <div>Gamma Phi Beta</div>
                    <div>Kappa Delta</div>
                    <div>Phi Mu</div>
                    <div>Pi Beta Phi</div>
                    <div>Alpha Phi</div>
                    <div>Kappa Kappa Gamma</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-uw-purple mb-8 text-center">Recruitment & Membership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Calendar className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Fall Recruitment</h3>
                <p className="text-gray-600 text-sm">September 15-30</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Calendar className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Spring Recruitment</h3>
                <p className="text-gray-600 text-sm">February 1-15</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <GraduationCap className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Requirements</h3>
                <p className="text-gray-600 text-sm">2.5 minimum GPA</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                <Users className="h-10 w-10 text-uw-gold mx-auto mb-4" />
                <h3 className="font-semibold text-uw-purple mb-2">Information</h3>
                <p className="text-gray-600 text-sm">Greek Life Office</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GreekLife;