import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ExternalLink,
  BookOpen,
  GraduationCap,
  Library,
  Archive,
  FileText,
  Search,
  Globe,
  BookMarked,
  Beaker,
  Palette,
  Briefcase,
  Wrench,
  Heart,
  Scale,
  MessageSquare,
} from 'lucide-react';

interface OpenAccessResource {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  subjects: string[];
  type: 'pdf' | 'online' | 'both';
}

const OPEN_ACCESS_RESOURCES: OpenAccessResource[] = [
  // Open Access Book Platforms
  {
    id: 'doab',
    name: 'Directory of Open Access Books (DOAB)',
    url: 'https://www.doabooks.org/',
    description: 'Peer-reviewed academic books across disciplines',
    icon: <BookOpen className="h-5 w-5" />,
    category: 'platforms',
    subjects: ['All Subjects', 'Science', 'Arts', 'Social Sciences'],
    type: 'both',
  },
  {
    id: 'oapen',
    name: 'OAPEN Library',
    url: 'https://library.oapen.org/',
    description: 'Humanities and social science scholarly books (PDF & browser)',
    icon: <Library className="h-5 w-5" />,
    category: 'platforms',
    subjects: ['Humanities', 'Social Sciences'],
    type: 'both',
  },
  {
    id: 'openresearch',
    name: 'Open Research Library',
    url: 'https://openresearchlibrary.org/',
    description: 'Global open-access academic book catalog',
    icon: <Globe className="h-5 w-5" />,
    category: 'platforms',
    subjects: ['All Subjects', 'Research'],
    type: 'online',
  },
  // Free University Textbooks
  {
    id: 'openstax',
    name: 'OpenStax (Rice University)',
    url: 'https://openstax.org/',
    description: 'Free college textbooks (science, math, economics, etc.)',
    icon: <GraduationCap className="h-5 w-5" />,
    category: 'textbooks',
    subjects: ['Science', 'Mathematics', 'Economics', 'Business'],
    type: 'both',
  },
  {
    id: 'nap',
    name: 'National Academies Press',
    url: 'https://nap.nationalacademies.org/',
    description: 'Science, engineering, health research books (free PDFs)',
    icon: <Beaker className="h-5 w-5" />,
    category: 'textbooks',
    subjects: ['Science', 'Engineering', 'Health'],
    type: 'pdf',
  },
  {
    id: 'mitocw',
    name: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/',
    description: 'Free MIT course materials including lecture notes and textbooks',
    icon: <GraduationCap className="h-5 w-5" />,
    category: 'textbooks',
    subjects: ['Engineering', 'Science', 'Mathematics', 'Computer Science'],
    type: 'online',
  },
  {
    id: 'saylor',
    name: 'Saylor Academy',
    url: 'https://www.saylor.org/',
    description: 'Free online courses with textbooks and study materials',
    icon: <BookMarked className="h-5 w-5" />,
    category: 'textbooks',
    subjects: ['Business', 'Computer Science', 'Arts', 'History'],
    type: 'online',
  },
  // Digital Archives & Public Libraries
  {
    id: 'archive',
    name: 'Internet Archive',
    url: 'https://archive.org/',
    description: 'Public-domain and open-access academic books',
    icon: <Archive className="h-5 w-5" />,
    category: 'archives',
    subjects: ['All Subjects', 'History', 'Literature'],
    type: 'both',
  },
  {
    id: 'openlibrary',
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    description: 'Borrow and read academic books online',
    icon: <Library className="h-5 w-5" />,
    category: 'archives',
    subjects: ['All Subjects'],
    type: 'online',
  },
  {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    description: 'Over 70,000 free eBooks, mostly older literary works',
    icon: <BookOpen className="h-5 w-5" />,
    category: 'archives',
    subjects: ['Literature', 'Classics', 'Philosophy'],
    type: 'both',
  },
  {
    id: 'hathitrust',
    name: 'HathiTrust Digital Library',
    url: 'https://www.hathitrust.org/',
    description: 'Millions of digitized books from research libraries worldwide',
    icon: <Library className="h-5 w-5" />,
    category: 'archives',
    subjects: ['All Subjects', 'Research'],
    type: 'online',
  },
  // Additional Academic Resources
  {
    id: 'doaj',
    name: 'Directory of Open Access Journals (DOAJ)',
    url: 'https://doaj.org/',
    description: 'Over 17,000 peer-reviewed open access journals',
    icon: <FileText className="h-5 w-5" />,
    category: 'journals',
    subjects: ['All Subjects', 'Research'],
    type: 'online',
  },
  {
    id: 'pubmed',
    name: 'PubMed Central',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/',
    description: 'Free full-text archive of biomedical and life sciences literature',
    icon: <Heart className="h-5 w-5" />,
    category: 'journals',
    subjects: ['Health', 'Medical', 'Biology'],
    type: 'pdf',
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    url: 'https://arxiv.org/',
    description: 'Open access archive for physics, math, computer science papers',
    icon: <Beaker className="h-5 w-5" />,
    category: 'journals',
    subjects: ['Physics', 'Mathematics', 'Computer Science'],
    type: 'pdf',
  },
  {
    id: 'ssrn',
    name: 'SSRN',
    url: 'https://www.ssrn.com/',
    description: 'Social Science Research Network with free working papers',
    icon: <Scale className="h-5 w-5" />,
    category: 'journals',
    subjects: ['Social Sciences', 'Law', 'Economics'],
    type: 'pdf',
  },
];

const SUBJECT_FILTERS = [
  { value: 'all', label: 'All Subjects', icon: <Globe className="h-4 w-4" /> },
  { value: 'Science', label: 'Science', icon: <Beaker className="h-4 w-4" /> },
  { value: 'Arts', label: 'Arts & Humanities', icon: <Palette className="h-4 w-4" /> },
  { value: 'Business', label: 'Commerce & Business', icon: <Briefcase className="h-4 w-4" /> },
  { value: 'Engineering', label: 'Engineering', icon: <Wrench className="h-4 w-4" /> },
  { value: 'Health', label: 'Health Sciences', icon: <Heart className="h-4 w-4" /> },
];

const OpenAccessLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredResources = OPEN_ACCESS_RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === 'all' ||
      resource.subjects.some(
        (s) => s.toLowerCase().includes(selectedSubject.toLowerCase()) || s === 'All Subjects'
      );

    const matchesCategory = activeTab === 'all' || resource.category === activeTab;

    return matchesSearch && matchesSubject && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <Badge variant="secondary" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            PDF
          </Badge>
        );
      case 'online':
        return (
          <Badge variant="outline" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            Read Online
          </Badge>
        );
      case 'both':
        return (
          <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
            <BookOpen className="h-3 w-3 mr-1" />
            PDF & Online
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Library className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Open Access Academic Library</CardTitle>
              <CardDescription className="text-base mt-1">
                Free, legal academic ebooks and textbooks from NSCU Archives & Global Universities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">✓ Legally Free:</strong> All resources are open-access and freely available under applicable licenses.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">✓ Trusted Sources:</strong> Content sourced from renowned universities, publishers, and academic institutions.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">✓ External Links:</strong> PDFs and books open on the original publisher or library website for secure access.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search open access resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedSubject === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject(filter.value)}
              className="gap-1"
            >
              {filter.icon}
              <span className="hidden sm:inline">{filter.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="platforms">Book Platforms</TabsTrigger>
          <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          <TabsTrigger value="archives">Digital Archives</TabsTrigger>
          <TabsTrigger value="journals">Journals</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Platforms Section */}
          {(activeTab === 'all' || activeTab === 'platforms') && (
            <ResourceSection
              title="Open Access Book Platforms"
              description="Curated collections of peer-reviewed academic books"
              icon={<BookOpen className="h-5 w-5" />}
              resources={filteredResources.filter((r) => r.category === 'platforms')}
              getTypeIcon={getTypeIcon}
            />
          )}

          {/* Textbooks Section */}
          {(activeTab === 'all' || activeTab === 'textbooks') && (
            <ResourceSection
              title="Free University Textbooks"
              description="Quality textbooks from leading universities and institutions"
              icon={<GraduationCap className="h-5 w-5" />}
              resources={filteredResources.filter((r) => r.category === 'textbooks')}
              getTypeIcon={getTypeIcon}
            />
          )}

          {/* Archives Section */}
          {(activeTab === 'all' || activeTab === 'archives') && (
            <ResourceSection
              title="Digital Archives & Public Libraries"
              description="Public domain and open-access digital collections"
              icon={<Archive className="h-5 w-5" />}
              resources={filteredResources.filter((r) => r.category === 'archives')}
              getTypeIcon={getTypeIcon}
            />
          )}

          {/* Journals Section */}
          {(activeTab === 'all' || activeTab === 'journals') && (
            <ResourceSection
              title="Academic Journals & Research Papers"
              description="Open access journals and research paper repositories"
              icon={<FileText className="h-5 w-5" />}
              resources={filteredResources.filter((r) => r.category === 'journals')}
              getTypeIcon={getTypeIcon}
            />
          )}
        </>
      )}

      {/* Request Book Section */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-medium">Can't find what you're looking for?</h4>
              <p className="text-sm text-muted-foreground">
                Request a book and we'll try to source it for you
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.open('mailto:library@nscu.edu?subject=Book%20Request', '_blank')}>
            Request a Book
          </Button>
        </CardContent>
      </Card>

      {/* Compliance Footer */}
      <div className="text-center text-xs text-muted-foreground p-4 border-t">
        <p>
          This library links only to legally available open-access resources.
          <br />
          Copyright remains with the original authors and publishers.
        </p>
      </div>
    </div>
  );
};

// Resource Section Component
interface ResourceSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  resources: OpenAccessResource[];
  getTypeIcon: (type: string) => React.ReactNode;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  description,
  icon,
  resources,
  getTypeIcon,
}) => {
  if (resources.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:shadow-md transition-all hover:border-primary/30 cursor-pointer group"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {resource.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {resource.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {getTypeIcon(resource.type)}
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs">
                  <ExternalLink className="h-3 w-3" />
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OpenAccessLibrary;
