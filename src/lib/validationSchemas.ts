import { z } from 'zod';

// Contact form validation
export const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  subject: z.string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z.string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
});

// Login form validation
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long')
});

// Password change validation
export const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Admission form validation
export const admissionSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters'),
  
  lastName: z.string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters'),
  
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (use international format)')
    .max(20, 'Phone number is too long'),
  
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)')
    .refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 16 && age <= 100;
    }, 'Applicant must be between 16 and 100 years old'),
  
  address: z.string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  
  country: z.string()
    .trim()
    .min(2, 'Country is required')
    .max(100, 'Country name is too long'),
  
  program: z.string()
    .trim()
    .min(1, 'Please select a program'),
  
  previousEducation: z.string()
    .trim()
    .max(1000, 'Previous education details are too long')
    .optional()
});

// User management validation (admin)
export const userManagementSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters'),
  
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  role: z.enum(['student', 'faculty', 'admin', 'agent', 'alumni'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  
  phone: z.string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),
  
  department: z.string()
    .trim()
    .max(100, 'Department name is too long')
    .optional()
});

// Email composition validation
export const emailSchema = z.object({
  to: z.string()
    .trim()
    .email('Invalid recipient email address')
    .max(255, 'Email address is too long'),
  
  cc: z.string()
    .trim()
    .refine((val) => {
      if (!val) return true;
      const emails = val.split(',').map(e => e.trim());
      return emails.every(email => z.string().email().safeParse(email).success);
    }, 'One or more CC email addresses are invalid')
    .optional()
    .or(z.literal('')),
  
  subject: z.string()
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  
  body: z.string()
    .trim()
    .min(1, 'Email body cannot be empty')
    .max(10000, 'Email body is too long')
});

// Course management validation
export const courseSchema = z.object({
  courseName: z.string()
    .trim()
    .min(3, 'Course name must be at least 3 characters')
    .max(200, 'Course name must be less than 200 characters'),
  
  courseCode: z.string()
    .trim()
    .min(2, 'Course code must be at least 2 characters')
    .max(20, 'Course code must be less than 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Course code must contain only uppercase letters, numbers, and hyphens'),
  
  credits: z.number()
    .int('Credits must be a whole number')
    .min(1, 'Credits must be at least 1')
    .max(12, 'Credits cannot exceed 12'),
  
  department: z.string()
    .trim()
    .min(2, 'Department name is required')
    .max(100, 'Department name is too long'),
  
  description: z.string()
    .trim()
    .max(2000, 'Description is too long')
    .optional()
});
