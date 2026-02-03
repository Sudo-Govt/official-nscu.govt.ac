import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAcademicNavigation, AcademicNavFaculty, AcademicNavDepartment } from '@/hooks/useAcademicNavigation';

interface AcademicMegaMenuProps {
  onNavigate?: () => void;
}

export function AcademicMegaMenu({ onNavigate }: AcademicMegaMenuProps) {
  const { faculties, loading } = useAcademicNavigation();
  const [hoveredFaculty, setHoveredFaculty] = useState<string | null>(null);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);

  const degreeLevels = [
    { key: 'certificate', label: 'Certificate Programs' },
    { key: 'undergraduate', label: 'Undergraduate Programs' },
    { key: 'postgraduate', label: 'Postgraduate Programs' },
    { key: 'doctoral', label: 'Doctoral Programs' },
  ] as const;

  const handleClick = () => {
    onNavigate?.();
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading academic programs...
      </div>
    );
  }

  const activeFaculty = faculties.find(f => f.id === hoveredFaculty);
  const activeDepartment = activeFaculty?.departments.find(d => d.id === hoveredDepartment);

  return (
    <div className="flex min-h-[400px] max-w-[900px]">
      {/* Column 1: Static links + Faculties */}
      <div className="w-64 border-r bg-muted/30 p-2 overflow-y-auto max-h-[500px]">
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
              onMouseEnter={() => {
                setHoveredFaculty(faculty.id);
                setHoveredDepartment(null);
              }}
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

      {/* Column 2: Departments (shown when faculty is hovered) */}
      {activeFaculty && activeFaculty.departments.length > 0 && (
        <div className="w-64 border-r bg-background p-2 overflow-y-auto max-h-[500px]">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Departments
            </p>
            <p className="text-xs text-muted-foreground truncate">{activeFaculty.name}</p>
          </div>
          
          {activeFaculty.departments.map((dept) => (
            <div
              key={dept.id}
              onMouseEnter={() => setHoveredDepartment(dept.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
                hoveredDepartment === dept.id 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent/50"
              )}
            >
              <Link 
                to={`/department/${dept.slug}`} 
                onClick={handleClick}
                className="flex-1 truncate"
              >
                {dept.name}
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Column 3: Degree Levels (shown when department is hovered) */}
      {activeDepartment && (
        <div className="w-64 bg-background p-2 overflow-y-auto max-h-[500px]">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Programs
            </p>
            <p className="text-xs text-muted-foreground truncate">{activeDepartment.name}</p>
          </div>
          
          {degreeLevels.map(({ key, label }) => {
            const courses = activeDepartment.coursesByLevel[key];
            if (courses.length === 0) return null;
            
            return (
              <Link
                key={key}
                to={`/department/${activeDepartment.slug}/${key}`}
                onClick={handleClick}
                className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{label}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {courses.length}
                </span>
              </Link>
            );
          })}
          
          {/* Show "No programs" if all levels are empty */}
          {degreeLevels.every(({ key }) => activeDepartment.coursesByLevel[key].length === 0) && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No programs available</p>
          )}
        </div>
      )}
    </div>
  );
}
