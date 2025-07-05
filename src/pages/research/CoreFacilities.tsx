
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, Zap, Beaker, Database } from 'lucide-react';

const CoreFacilities = () => {
  return (
    <PageLayout 
      title="Core Facilities" 
      description="State-of-the-art shared research infrastructure and instrumentation"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Research Infrastructure</h2>
            <p className="text-gray-600 mb-4">
              Our core facilities provide researchers with access to cutting-edge instrumentation 
              and expertise that would be prohibitively expensive for individual laboratories. 
              These shared resources accelerate discovery and foster collaboration.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-uw-purple text-white rounded-lg">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm">Core Facilities</div>
              </div>
              <div className="text-center p-4 bg-uw-gold text-uw-purple rounded-lg">
                <div className="text-2xl font-bold">850</div>
                <div className="text-sm">Annual Users</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Microscope className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">Advanced Imaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Electron microscopy, confocal, and super-resolution imaging
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Database className="h-4 w-4 mr-2" />
                <CardTitle className="text-sm font-medium">High-Performance Computing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Supercomputing cluster with 5,000+ cores available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Available Facilities</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Microscope className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Imaging Center</h3>
              <p className="text-sm text-gray-600">Advanced microscopy and visualization</p>
            </div>
            <div className="text-center">
              <Beaker className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Mass Spectrometry</h3>
              <p className="text-sm text-gray-600">Proteomics and metabolomics analysis</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Materials Characterization</h3>
              <p className="text-sm text-gray-600">X-ray diffraction and spectroscopy</p>
            </div>
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-3 text-uw-purple" />
              <h3 className="font-semibold mb-2">Genomics Core</h3>
              <p className="text-sm text-gray-600">DNA sequencing and bioinformatics</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CoreFacilities;
