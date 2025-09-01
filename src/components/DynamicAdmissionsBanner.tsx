import { Calendar, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmissionsInfo } from '@/hooks/useAdmissionsInfo';

interface DynamicAdmissionsBannerProps {
  variant?: 'hero' | 'news' | 'compact';
  showCTA?: boolean;
}

const DynamicAdmissionsBanner = ({ 
  variant = 'hero', 
  showCTA = true 
}: DynamicAdmissionsBannerProps) => {
  const admissionsInfo = useAdmissionsInfo();

  if (variant === 'hero') {
    return (
      <div className="bg-gradient-to-r from-uw-purple to-uw-dark text-white py-8 px-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-6 w-6 text-uw-gold" />
          <Badge 
            className="bg-uw-gold text-uw-dark font-semibold px-3 py-1"
          >
            {admissionsInfo.semester} {admissionsInfo.year}
          </Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {admissionsInfo.title}
        </h2>
        <p className="text-lg text-gray-200 mb-4 max-w-2xl">
          {admissionsInfo.newsText}
        </p>
        <p className="text-sm text-uw-gold font-medium mb-6">
          <Calendar className="h-4 w-4 inline mr-1" />
          {admissionsInfo.deadlineText}
        </p>
        {showCTA && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              className="bg-uw-gold hover:bg-uw-gold/90 text-uw-dark font-semibold"
            >
              Apply Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-uw-purple"
            >
              Learn More
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'news') {
    return (
      <Card className="border-l-4 border-l-uw-purple hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-uw-purple/10 rounded-full p-2 mt-1">
              <BookOpen className="h-5 w-5 text-uw-purple" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-uw-purple/10 text-uw-purple">
                  Admissions Update
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-uw-purple mb-2">
                {admissionsInfo.title}
              </h3>
              <p className="text-gray-600 mb-2">
                {admissionsInfo.newsText}
              </p>
              <p className="text-sm text-uw-gold font-medium">
                {admissionsInfo.deadlineText}
              </p>
              {showCTA && (
                <Button 
                  size="sm" 
                  className="mt-3 bg-uw-purple hover:bg-uw-purple/90"
                >
                  Apply Today
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-uw-purple/5 border border-uw-purple/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-uw-purple" />
          <div className="flex-1">
            <h4 className="font-semibold text-uw-purple text-sm">
              {admissionsInfo.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {admissionsInfo.deadlineText}
            </p>
          </div>
          {showCTA && (
            <Button size="sm" variant="outline" className="text-xs">
              Apply
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default DynamicAdmissionsBanner;