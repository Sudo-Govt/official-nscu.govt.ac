import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAcademicNavigation, AcademicNavFaculty } from '@/hooks/useAcademicNavigation';

interface AcademicMegaMenuProps {
  onNavigate?: () => void;
}

export function AcademicMegaMenu({ onNavigate }: AcademicMegaMenuProps) {
  const { faculties, loading } = useAcademicNavigation();
  const [hoveredFaculty, setHoveredFaculty] = useState<string | null>(null);

  const handleClick = () => {
    onNavigate?.();
  };

  // Memoize the active faculty to prevent unnecessary recalculations
  const activeFaculty = useMemo(() => 
    faculties.find(f => f.id === hoveredFaculty),
    [faculties, hoveredFaculty]
  );

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading academic programs...
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] max-w-[700px]">
      {/* Column 1: Static links + Faculties */}
      <div className="w-64 border-r bg-muted/30 p-2 overflow-y-auto max-h-[400px]">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Links</p>
        </div>
        <Link
          to="/academics/course-catalog"
          onClick={handleClick}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Course Catalog
        </Link>
        <Link
          to="/academics/phd-programs"
          onClick={handleClick}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <GraduationCap className="h-4 w-4" />
          PhD Programs
        </Link>
        <Link
          to="/academics/academic-calendar"
          onClick={handleClick}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Calendar className="h-4 w-4" />
          Academic Calendar
        </Link>

        <div className="my-3 border-t" />

        <div className="mb-2 px-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Faculties & Schools</p>
        </div>
        
        {faculties.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">No faculties available</p>
        ) : (
          faculties.map((faculty) => (
            <div
              key={faculty.id}
              onMouseEnter={() => setHoveredFaculty(faculty.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                hoveredFaculty === faculty.id 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent/50"
              )}
            >
              <Link 
                to={`/faculty/${faculty.slug}`} 
                onClick={handleClick}
                className="flex-1 truncate flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{faculty.name}</span>
              </Link>
              {faculty.departments.length > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Column 2: Departments (shown when faculty is hovered) - click goes to department page with degree blocks */}
      {activeFaculty && activeFaculty.departments.length > 0 && (
        <div className="w-72 bg-background p-2 overflow-y-auto max-h-[400px]">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Departments
            </p>
            <p className="text-xs text-muted-foreground truncate">{activeFaculty.name}</p>
          </div>
          
          {activeFaculty.departments.map((dept) => {
            // Count total courses across all levels
            const totalCourses = 
              dept.coursesByLevel.certificate.length +
              dept.coursesByLevel.undergraduate.length +
              dept.coursesByLevel.postgraduate.length +
              dept.coursesByLevel.doctoral.length;
            
            return (
              <Link
                key={dept.id}
                to={`/department/${dept.slug}`}
                onClick={handleClick}
                className="flex items-center justify-between px-3 py-2.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <span className="truncate">{dept.name}</span>
                {totalCourses > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full group-hover:bg-accent-foreground/10">
                    {totalCourses} programs
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
