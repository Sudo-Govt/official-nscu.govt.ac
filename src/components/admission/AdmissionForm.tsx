import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import mockDb from '@/database/mockDb';
import bcrypt from 'bcryptjs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  course_name: string;
  course_code: string;
  college: string;
  degree_type: string;
}

const AdmissionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    
    // Academic Information
    program: '',
    year_of_study: 1,
    previous_education: '',
    
    // Fee Information
    total_fees: '',
    
    // Login Credentials
    user_id: '',
    password: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, course_name, course_code, college, degree_type')
        .eq('is_active', true)
        .order('college', { ascending: true })
        .order('course_name', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `NSCU${year}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const studentId = generateStudentId();
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      
      // Create user account
      mockDb.createUser({
        user_id: formData.user_id,
        password: hashedPassword,
        email: formData.email,
        full_name: formData.full_name,
        role: 'student'
      });
      
      // Create student record
      mockDb.createStudent({
        user_id: formData.user_id,
        student_id: studentId,
        program: formData.program,
        admission_date: new Date().toISOString().split('T')[0],
        year_of_study: formData.year_of_study,
        total_fees: parseFloat(formData.total_fees),
        created_by: user?.user_id
      });

      toast({
        title: "Success",
        description: `Student admission completed successfully. Student ID: ${studentId}`
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        program: '',
        year_of_study: 1,
        previous_education: '',
        total_fees: '',
        user_id: '',
        password: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete admission. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Student Admission</CardTitle>
        <CardDescription>Complete the form below to admit a new student</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="program">Program *</Label>
                <Select value={formData.program} onValueChange={(value) => handleInputChange('program', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="" disabled>Loading courses...</SelectItem>
                    ) : (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.course_name}>
                          {course.course_name} ({course.college})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year_of_study">Year of Study</Label>
                <Select 
                  value={formData.year_of_study.toString()} 
                  onValueChange={(value) => handleInputChange('year_of_study', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="previous_education">Previous Education</Label>
                <Textarea
                  id="previous_education"
                  value={formData.previous_education}
                  onChange={(e) => handleInputChange('previous_education', e.target.value)}
                  placeholder="Enter details about previous education, grades, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Fee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_fees">Total Fees ($) *</Label>
                <Input
                  id="total_fees"
                  type="number"
                  value={formData.total_fees}
                  onChange={(e) => handleInputChange('total_fees', e.target.value)}
                  placeholder="Enter total fee amount"
                  required
                />
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user_id">User ID *</Label>
                <Input
                  id="user_id"
                  value={formData.user_id}
                  onChange={(e) => handleInputChange('user_id', e.target.value)}
                  placeholder="Create a unique user ID"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a secure password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" className="flex-1">
              Complete Admission
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdmissionForm;