// Academic Course Management Types
// New Hierarchy: Faculty -> Department -> Course

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  departments?: Department[];
}

export interface Department {
  id: string;
  faculty_id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  faculty?: Faculty;
}

export interface AcademicCourse {
  id: string;
  department_id: string;
  name: string;
  course_code: string;
  slug: string;
  duration_months: number;
  total_credits: number;
  start_date?: string;
  end_date?: string;
  short_description?: string;
  long_description?: string;
  thumbnail_image_url?: string;
  is_active: boolean;
  is_visible_on_website: boolean;
  enrollment_status: 'open' | 'closed' | 'coming_soon';
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Subject {
  id: string;
  course_id: string;
  name: string;
  subject_code: string;
  credits: number;
  semester?: number;
  order_index: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  topic_code: string;
  order_index: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  topic_id: string;
  name: string;
  lesson_code: string;
  content?: string;
  video_url?: string;
  order_index: number;
  estimated_duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author?: string;
  volume?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  book_code: string;
  cover_image_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseBook {
  id: string;
  course_id: string;
  book_id: string;
  is_required: boolean;
  created_at: string;
  book?: LibraryBook;
}

export interface AcademicStudent {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_number: string;
  enrollment_date: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  course?: AcademicCourse;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  is_completed: boolean;
  completion_date?: string;
  progress_percentage: number;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
  lesson?: Lesson;
}

// Extended types for UI
// New hierarchy: Faculty -> Department -> Course
export interface CourseWithHierarchy extends AcademicCourse {
  department: Department & { faculty: Faculty };
  subjects: (Subject & { topics: (Topic & { lessons: Lesson[] })[] })[];
  books: CourseBook[];
}

export interface StudentProgressSummary {
  totalLessons: number;
  completedLessons: number;
  completionProgress: number;
  timeProgress: number;
  overallProgress: number;
}
