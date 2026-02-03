import React from 'react';
import { usePerspective } from '@/context/PerspectiveContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PerspectiveBanner = () => {
  const { perspectiveUser, isInPerspectiveMode, exitPerspective } = usePerspective();

  if (!isInPerspectiveMode || !perspectiveUser) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5" />
          <span className="font-medium">Perspective Mode:</span>
          <span>Viewing as <strong>{perspectiveUser.full_name}</strong></span>
          <Badge variant="secondary">
            {perspectiveUser.role.replace('_', ' ')}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="secondary"
          onClick={exitPerspective}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Perspective
        </Button>
      </div>
    </div>
  );
};

export default PerspectiveBanner;
