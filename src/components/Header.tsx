import { useState, useEffect } from 'react';
import { Menu, X, Search, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import SearchDialog from './SearchDialog';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
interface FeaturedCourse {
  title: string;
  href: string;
}

interface NavItem {
  id: string;
  parent_id: string | null;
  title: string;
  href: string | null;
  position: number;
  is_active: boolean;
  menu_location: string;
  icon: string | null;
}

interface MenuItem {
  title: string;
  href?: string;
  items?: MenuItem[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [featuredPrograms, setFeaturedPrograms] = useState<FeaturedCourse[]>([]);
  const [dynamicNav, setDynamicNav] = useState<NavItem[]>([]);
  const [useDynamicNav, setUseDynamicNav] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('course_name, degree_type, slug')
          .eq('is_active', true)
          .eq('featured', true)
          .order('course_name')
          .limit(6);

        if (error) throw error;

        const courses = (data || [])
          .filter(course => course.slug)
          .map(course => ({
            title: `${course.degree_type} in ${course.course_name}`,
            href: `/programs/${course.slug}`
          }));

        setFeaturedPrograms(courses);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      }
    };

    const fetchDynamicNavigation = async () => {
      try {
        const { data, error } = await supabase
          .from('site_navigation')
          .select('*')
          .eq('is_active', true)
          .eq('menu_location', 'main')
          .order('position');

        if (error) throw error;
        
        if (data && data.length > 0) {
          setDynamicNav(data);
          setUseDynamicNav(true);
        }
      } catch (error) {
        console.error('Error fetching navigation:', error);
      }
    };

    fetchFeaturedCourses();
    fetchDynamicNavigation();
  }, []);

  // Build dynamic menu structure from flat nav items
  const buildMenuFromNav = (navItems: NavItem[]): MenuItem[] => {
    const rootItems = navItems.filter(n => !n.parent_id);
    
    const buildChildren = (parentId: string): MenuItem[] => {
      return navItems
        .filter(n => n.parent_id === parentId)
        .sort((a, b) => a.position - b.position)
        .map(item => {
          const children = buildChildren(item.id);
          return {
            title: item.title,
            href: item.href || undefined,
            items: children.length > 0 ? children : undefined
          };
        });
    };

    return rootItems
      .sort((a, b) => a.position - b.position)
      .map(item => {
        const children = buildChildren(item.id);
        return {
          title: item.title,
          href: item.href || undefined,
          items: children.length > 0 ? children : undefined
        };
      });
  };

  // Fallback hardcoded menu data
  const hardcodedMenuData: MenuItem[] = [
    {
      title: "About NSCU",
      items: [
        {title: "History & Mission", href: "/about/history-mission"},
        {title: "Leadership", href: "/about/leadership"},
        {title: "Accreditation", href: "/about/accreditation"},
        {title: "Transparency Portal", href: "/transparency"},
        {title: "Fast Facts", href: "/home/fast-facts"},
        {title: "Campus Map", href: "/about/campus-map"},
        {title: "Sustainability", href: "/about/sustainability"},
        {title: "Diversity & Inclusion", href: "/about/diversity-inclusion"}
      ]
    },
    {
      title: "Academics",
      items: [
        {title: "PhD Programs", href: "/academics/phd-programs"},
        {
          title: "Colleges & Schools",
          items: [
            {title: "School of Arts", href: "/academics/school-arts"},
            {title: "School of Science", href: "/academics/school-science"},
            {title: "College of Engineering", href: "/academics/college-engineering"},
            {title: "School of Business", href: "/academics/school-business"},
            {title: "College of Health Sciences", href: "/academics/college-health-sciences"},
            {title: "School of Medicine", href: "/academics/school-medicine"},
            {title: "School of Law", href: "/academics/school-law"},
            {title: "College of Education", href: "/academics/college-education"}
          ]
        },
        {
          title: "Featured Programs",
          items: featuredPrograms.length > 0 
            ? [...featuredPrograms, {title: "View All Programs", href: "/academics/course-catalog"}]
            : [{title: "View All Programs", href: "/academics/course-catalog"}]
        },
        {
          title: "Academic Resources",
          items: [
            {title: "Course Catalog", href: "/academics/course-catalog"},
            {title: "Academic Calendar", href: "/academics/academic-calendar"}
          ]
        }
      ]
    },
    {
      title: "Admissions & Aid",
      items: [
        {title: "Undergraduate Admissions", href: "/admissions/undergraduate"},
        {title: "Graduate Admissions", href: "/admissions/graduate"},
        {title: "International Admissions", href: "/admissions/international"},
        {title: "Transfer Admissions", href: "/admissions/transfer"},
        {title: "Financial Aid", href: "/admissions/financial-aid"},
        {title: "Campus Tours", href: "/admissions/tours"}
      ]
    },
    {
      title: "Student Experience",
      items: [
        {
          title: "Campus Life",
          items: [
            {title: "Housing & Dining", href: "/student-life/housing"},
            {title: "Student Organizations", href: "/student-life/organizations"},
            {title: "Campus Recreation", href: "/student-life/recreation"},
            {title: "Greek Life", href: "/campus-life/greek-life"}
          ]
        },
        {
          title: "Student Services",
          items: [
            {title: "Health & Wellness", href: "/student-life/health-wellness"},
            {title: "Career Services", href: "/student-life/career-services"},
            {title: "Academic Support", href: "/services/writing-center"},
            {title: "Disability Services", href: "/services/disability-services"}
          ]
        }
      ]
    },
    {
      title: "Research & Innovation",
      items: [
        {title: "Research Office", href: "/research/office"},
        {title: "Undergraduate Research", href: "/research/undergraduate"},
        {title: "Core Facilities", href: "/research/core-facilities"},
        {title: "Funding Opportunities", href: "/research/funding"},
        {title: "Technology Transfer", href: "/research/technology-transfer"}
      ]
    },
    {
      title: "Global Campus",
      items: [
        {title: "International Programs", href: "/international/programs"},
        {title: "Collaborations", href: "/international/collaborations"},
        {title: "NSCU Affiliation", href: "/affiliation/nscu-affiliation"},
        {
          title: "Global Campuses",
          items: [
            {title: "Full-Fledged Colleges", href: "/colleges/full-fledged"},
            {title: "Offshore Colleges", href: "/colleges/offshore"},
            {title: "Study Centers", href: "/colleges/study-centers"}
          ]
        }
      ]
    },
    {
      title: "Alumni & Community",
      items: [
        {title: "Alumni Association", href: "/alumni/association"},
        {title: "Alumni Benefits", href: "/alumni/benefits"},
        {title: "Alumni Events", href: "/alumni/events"},
        {title: "Career Networking", href: "/alumni/career-networking"},
        {title: "Give Back", href: "/alumni/give-back"},
        {title: "News & Events", href: "/news/university-news"},
        {title: "Press Releases", href: "/news/press-releases"}
      ]
    }
  ];

  // Use dynamic nav if available, otherwise fallback to hardcoded
  const menuData = useDynamicNav ? buildMenuFromNav(dynamicNav) : hardcodedMenuData;

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <Link to="/student-life/organizations" className="hover:text-accent transition-colors">Students</Link>
              <Link to="/about/leadership" className="hover:text-accent transition-colors">Faculty</Link>
              <Link to="/alumni/association" className="hover:text-accent transition-colors">Alumni</Link>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://www.gchea.org/verification" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Verification</a>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-accent transition-colors">
                    <span>nCore</span>
                    <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hover:text-accent transition-colors">nCore</Link>
              )}
              <Link to="/academics/academic-calendar" className="hover:text-accent transition-colors">Calendar</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/3dc31e79-5bd0-461f-a8f1-30c173bb258a.png" 
                alt="NSCU Delaware USA Logo - The New States Continental University" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {menuData.map((menu, index) => (
                  <NavigationMenuItem key={index}>
                    {menu.items && menu.items.length > 0 ? (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium text-primary hover:text-accent">
                          {menu.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-6 md:w-[500px] lg:w-[700px] lg:grid-cols-2">
                            {menu.items.map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="space-y-3">
                                {item.items ? (
                                  <>
                                    <h4 className="text-sm font-semibold text-primary border-b pb-2">
                                      {item.title}
                                    </h4>
                                    <div className="space-y-1">
                                      {item.items.map((subItem: any, subIndex: number) => (
                                        <NavigationMenuLink key={subIndex} asChild>
                                          <Link
                                            to={subItem.href || "#"}
                                            className={cn(
                                              "block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            )}
                                          >
                                            {subItem.title}
                                          </Link>
                                        </NavigationMenuLink>
                                      ))}
                                    </div>
                                  </>
                                ) : (
                                  <NavigationMenuLink asChild>
                                    <Link
                                      to={item.href || "#"}
                                      className={cn(
                                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      )}
                                    >
                                      <div className="text-sm font-medium leading-none">{item.title}</div>
                                    </Link>
                                  </NavigationMenuLink>
                                )}
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          to={menu.href || "#"}
                          className="text-sm font-medium text-primary hover:text-accent px-3 py-2"
                        >
                          {menu.title}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search, Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {menuData.map((item, index) => (
                <div key={index} className="space-y-2">
                  {item.items && item.items.length > 0 ? (
                    <>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <div className="pl-4 space-y-2">
                        {item.items.map((subItem: any, subIndex: number) => (
                          <div key={subIndex}>
                            {subItem.items ? (
                              <div className="space-y-1">
                                <h4 className="text-sm font-medium text-gray-700">{subItem.title}</h4>
                                <div className="pl-3 space-y-1">
                                  {subItem.items.map((subSubItem: any, subSubIndex: number) => (
                                    <Link
                                      key={subSubIndex}
                                      to={subSubItem.href || "#"}
                                      className="block text-sm text-muted-foreground hover:text-accent transition-colors"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subSubItem.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                to={subItem.href || "#"}
                                className="block text-sm text-muted-foreground hover:text-accent transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href || "#"}
                      className="block font-semibold text-primary hover:text-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Header;
