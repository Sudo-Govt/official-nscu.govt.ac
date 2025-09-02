
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuData = [
    {
      title: "Home",
      items: [
        {title: "Welcome Message", href: "/home/welcome"},
        {title: "Fast Facts", href: "/home/fast-facts"},
        {title: "Virtual Tour", href: "/home/virtual-tour"},
        {title: "News Ticker", href: "/home/news"},
        {title: "Emergency Alerts", href: "/home/emergency"}
      ]
    },
    {
      title: "About",
      items: [
        {title: "History & Mission", href: "/about/history-mission"},
        {title: "Leadership", href: "/about/leadership"},
        {title: "Accreditation", href: "/about/accreditation"},
        {title: "Campus Map", href: "/about/campus-map"},
        {title: "Sustainability", href: "/about/sustainability"},
        {title: "Diversity & Inclusion", href: "/about/diversity-inclusion"}
      ]
    },
    {
      title: "Academics",
      items: [
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
            {title: "College of Education", href: "/academics/college-education"},
            {title: "School of Public Health", href: "/academics/school-public-health"},
            {title: "School of Social Work", href: "/academics/school-social-work"},
            {title: "College of Veterinary Medicine", href: "/academics/college-veterinary-medicine"}
          ]
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
      title: "Admissions",
      items: [
        {title: "Undergraduate Admissions", href: "/admissions/undergraduate"},
        {title: "Graduate Admissions", href: "/admissions/graduate"},
        {title: "International Admissions", href: "/admissions/international"},
        {title: "Transfer Admissions", href: "/admissions/transfer"},
        {title: "Financial Aid", href: "/admissions/financial-aid"}
      ]
    },
    {
      title: "Student Life",
      items: [
        {title: "Housing", href: "/student-life/housing"},
        {title: "Dining", href: "/student-life/dining"},
        {title: "Health & Wellness", href: "/student-life/health-wellness"},
        {title: "Career Services", href: "/student-life/career-services"},
        {title: "Student Organizations", href: "/student-life/organizations"},
        {title: "Campus Recreation", href: "/student-life/recreation"}
      ]
    },
    {
      title: "Research",
      items: [
        {title: "Research Office", href: "/research/office"},
        {title: "Funding Opportunities", href: "/research/funding"},
        {title: "Core Facilities", href: "/research/core-facilities"},
        {title: "Technology Transfer", href: "/research/technology-transfer"}
      ]
    },
    {
      title: "Colleges",
      items: [
        {title: "Full-Fledged Colleges", href: "/colleges/full-fledged"},
        {title: "Offshore Colleges", href: "/colleges/offshore"},
        {title: "Study Centers", href: "/colleges/study-centers"}
      ]
    },
    {
      title: "Alumni",
      items: [
        {title: "Alumni Association", href: "/alumni/association"},
        {title: "Alumni Benefits", href: "/alumni/benefits"},
        {title: "Alumni Events", href: "/alumni/events"},
        {title: "Give Back", href: "/alumni/give-back"}
      ]
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-uw-purple text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <Link to="#" className="hover:text-uw-gold transition-colors">Students</Link>
              <Link to="#" className="hover:text-uw-gold transition-colors">Faculty</Link>
              <Link to="#" className="hover:text-uw-gold transition-colors">Alumni</Link>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-uw-gold transition-colors">MyNSCU</Link>
              <Link to="#" className="hover:text-uw-gold transition-colors">Libraries</Link>
              <Link to="#" className="hover:text-uw-gold transition-colors">Calendar</Link>
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
                alt="NSCU Belize Logo - Accredited International University GCHEA Approved" 
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
                    <NavigationMenuTrigger className="text-sm font-medium text-uw-purple hover:text-uw-gold">
                      {menu.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[500px] lg:w-[700px] lg:grid-cols-2">
                        {menu.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="space-y-3">
                            {item.items ? (
                              // This is a submenu category (like "Colleges & Schools")
                              <>
                                <h4 className="text-sm font-semibold text-uw-purple border-b border-gray-200 pb-2">
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
                              // Regular menu item
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
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
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
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {menuData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-uw-purple">{item.title}</h3>
                  <div className="pl-4 space-y-2">
                    {item.items.map((subItem: any, subIndex: number) => (
                      <div key={subIndex}>
                        {subItem.items ? (
                          // Submenu category for mobile
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-700">{subItem.title}</h4>
                            <div className="pl-3 space-y-1">
                              {subItem.items.map((subSubItem: any, subSubIndex: number) => (
                                <Link
                                  key={subSubIndex}
                                  to={subSubItem.href || "#"}
                                  className="block text-sm text-gray-600 hover:text-uw-gold transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subSubItem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Regular menu item for mobile
                          <Link
                            to={subItem.href || "#"}
                            className="block text-sm text-gray-600 hover:text-uw-gold transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
