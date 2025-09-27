import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchablePages = [
    { title: 'College of Arts & Sciences', path: '/academics/college-arts-sciences', category: 'Academics' },
    { title: 'College of Engineering', path: '/academics/college-engineering', category: 'Academics' },
    { title: 'School of Business', path: '/academics/school-business', category: 'Academics' },
    { title: 'School of Medicine', path: '/academics/school-medicine', category: 'Academics' },
    { title: 'School of Law', path: '/academics/school-law', category: 'Academics' },
    { title: 'Undergraduate Admissions', path: '/admissions/undergraduate', category: 'Admissions' },
    { title: 'Graduate Admissions', path: '/admissions/graduate', category: 'Admissions' },
    { title: 'International Admissions', path: '/admissions/international', category: 'Admissions' },
    { title: 'Financial Aid', path: '/admissions/financial-aid', category: 'Admissions' },
    { title: 'Campus Tours', path: '/admissions/tours', category: 'Admissions' },
    { title: 'Apply Now', path: '/admissions/apply', category: 'Admissions' },
    { title: 'Housing & Dining', path: '/student-life/housing', category: 'Student Life' },
    { title: 'Student Organizations', path: '/student-life/organizations', category: 'Student Life' },
    { title: 'Career Services', path: '/student-life/career-services', category: 'Student Life' },
    { title: 'Health & Wellness', path: '/student-life/health-wellness', category: 'Student Life' },
    { title: 'Campus Recreation', path: '/student-life/recreation', category: 'Student Life' },
    { title: 'Arts & Culture', path: '/student-life/artsculture', category: 'Student Life' },
    { title: 'Research Office', path: '/research/office', category: 'Research' },
    { title: 'Undergraduate Research', path: '/research/undergraduate', category: 'Research' },
    { title: 'Funding Opportunities', path: '/research/funding', category: 'Research' },
    { title: 'Alumni Association', path: '/alumni/association', category: 'Alumni' },
    { title: 'Career Networking', path: '/alumni/career-networking', category: 'Alumni' },
    { title: 'Alumni Events', path: '/alumni/events', category: 'Alumni' },
    { title: 'Libraries', path: '/services/libraries', category: 'Services' },
    { title: 'IT Help Desk', path: '/services/it-help-desk', category: 'Services' },
    { title: 'Disability Services', path: '/services/disability-services', category: 'Services' },
    { title: 'MyNSCU Portal', path: '/portal/mynscu', category: 'Portal' },
    { title: 'Student Dashboard', path: '/dashboard', category: 'Portal' },
    { title: 'Site Map', path: '/sitemap', category: 'Navigation' }
  ];

  const filteredResults = searchablePages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = () => {
    onOpenChange(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search NSCU Website
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search for pages, programs, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            autoFocus
          />

          {searchTerm && (
            <div className="max-h-96 overflow-y-auto">
              {filteredResults.length > 0 ? (
                <div className="space-y-2">
                  {filteredResults.map((result, index) => (
                    <Link
                      key={index}
                      to={result.path}
                      onClick={handleItemClick}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{result.title}</h3>
                        <p className="text-sm text-gray-500">{result.category}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No results found for "{searchTerm}"</p>
                  <p className="text-sm mt-2">Try searching for academics, admissions, student life, or research</p>
                </div>
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="py-8">
              <h3 className="font-medium mb-4">Popular Searches</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Admissions', 'Student Life', 'Academics', 'Research', 'Campus Tours', 'MyNSCU'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;