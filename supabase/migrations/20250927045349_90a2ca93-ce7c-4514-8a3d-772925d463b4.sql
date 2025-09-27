-- Add additional courses with unique course codes
INSERT INTO courses (course_code, course_name, college, department, degree_type, duration_years, credit_hours, fee_structure, eligibility_criteria, seat_capacity, available_seats) VALUES
('CS302', 'Database Management', 'College of Arts and Sciences', 'Computer Science', 'bachelor', 4, 3, '{"tuition": 12000, "lab_fee": 500, "books": 800}', 'CS201 prerequisite', 80, 28),
('CS402', 'Advanced Software Engineering', 'College of Arts and Sciences', 'Computer Science', 'bachelor', 4, 4, '{"tuition": 12000, "lab_fee": 500, "books": 800}', 'Junior standing', 75, 22),
('CS502', 'Artificial Intelligence', 'College of Arts and Sciences', 'Computer Science', 'master', 2, 3, '{"tuition": 15000, "lab_fee": 600, "books": 900}', 'Bachelor in CS or related field', 50, 18),
('BIO202', 'Cell Biology', 'College of Arts and Sciences', 'Biology', 'bachelor', 4, 3, '{"tuition": 11000, "lab_fee": 700, "books": 600}', 'BIO101 prerequisite', 100, 43),
('BIO302', 'Biochemistry', 'College of Arts and Sciences', 'Biology', 'bachelor', 4, 4, '{"tuition": 11000, "lab_fee": 700, "books": 600}', 'BIO201 prerequisite', 80, 31),
('MATH202', 'Calculus III', 'College of Arts and Sciences', 'Mathematics', 'bachelor', 4, 4, '{"tuition": 10000, "books": 500}', 'MATH201 prerequisite', 150, 72),
('MATH302', 'Differential Equations', 'College of Arts and Sciences', 'Mathematics', 'bachelor', 4, 3, '{"tuition": 10000, "books": 500}', 'MATH201 prerequisite', 100, 45),
('ME302', 'Heat Transfer', 'College of Engineering', 'Mechanical Engineering', 'bachelor', 4, 4, '{"tuition": 14000, "lab_fee": 800, "books": 700}', 'ME201 prerequisite', 120, 56),
('EE302', 'Digital Signal Processing', 'College of Engineering', 'Electrical Engineering', 'bachelor', 4, 4, '{"tuition": 14000, "lab_fee": 800, "books": 700}', 'EE201 prerequisite', 100, 41),
('CE302', 'Concrete Design', 'College of Engineering', 'Civil Engineering', 'bachelor', 4, 3, '{"tuition": 14000, "lab_fee": 800, "books": 700}', 'CE201 prerequisite', 90, 37),
('BUS302', 'Operations Management', 'School of Business', 'Business Administration', 'bachelor', 4, 3, '{"tuition": 13000, "books": 600}', 'BUS101 prerequisite', 200, 123),
('ACC302', 'Cost Accounting', 'School of Business', 'Accounting', 'bachelor', 4, 3, '{"tuition": 13000, "books": 600}', 'ACC201 prerequisite', 150, 87),
('FIN402', 'Portfolio Management', 'School of Business', 'Finance', 'bachelor', 4, 3, '{"tuition": 13000, "books": 600}', 'FIN301 prerequisite', 100, 54),
('MKT402', 'Consumer Behavior', 'School of Business', 'Marketing', 'bachelor', 4, 3, '{"tuition": 13000, "books": 600}', 'MKT301 prerequisite', 120, 68);

-- Add comprehensive announcements
INSERT INTO announcements (title, content, priority, target_audience, expires_at) VALUES
('Fall 2024 Semester Registration Now Open', 'Students can now register for Fall 2024 courses through the student portal. Priority registration begins March 15th for seniors, followed by juniors on March 20th. Please meet with your academic advisor before registering.', 'high', 'students', '2024-04-15 23:59:59'),
('New Research Grant Opportunities Available', 'The Office of Research announces new NSF grant opportunities totaling $2.5M for STEM research projects. Faculty members are encouraged to submit proposals by the April 30th deadline.', 'high', 'faculty', '2024-04-30 23:59:59'),
('Campus WiFi Maintenance Schedule', 'IT Services will perform network maintenance on March 25th from 2:00 AM to 6:00 AM. WiFi connectivity may be intermittent during this period. We apologize for any inconvenience.', 'normal', 'all', '2024-03-26 06:00:00'),
('Library Extended Hours During Finals', 'The main library will extend operating hours during finals week (May 6-12). New hours: Monday-Thursday 7:00 AM - 2:00 AM, Friday 7:00 AM - 8:00 PM, Saturday 9:00 AM - 6:00 PM, Sunday 10:00 AM - 2:00 AM.', 'normal', 'students', '2024-05-12 23:59:59'),
('Faculty Development Workshop Series', 'Join us for a series of professional development workshops focusing on innovative teaching methods and research collaboration. Sessions run every Thursday in April at the Faculty Center.', 'normal', 'faculty', '2024-04-30 23:59:59'),
('Spring Career Fair - March 28th', 'Connect with over 150 employers at our Spring Career Fair in the Student Union. Bring multiple copies of your resume and dress professionally. Pre-registration recommended.', 'high', 'students', '2024-03-28 17:00:00'),
('Parking Permit Renewal Deadline', 'Student and faculty parking permits expire on May 31st. Renewal applications are now available online. Early renewal discount available until April 15th.', 'normal', 'all', '2024-05-31 23:59:59'),
('New Student Orientation Volunteer Applications', 'We are seeking enthusiastic students to serve as orientation leaders for incoming freshmen. Applications due April 1st. Leadership experience and stipend provided.', 'normal', 'students', '2024-04-01 23:59:59'),
('Research Symposium Call for Abstracts', 'Submit your research abstracts for the Annual Undergraduate Research Symposium on April 26th. Cash prizes awarded for outstanding presentations. Submission deadline: March 30th.', 'normal', 'students', '2024-03-30 23:59:59'),
('Campus Safety Alert System Test', 'The university will test the emergency notification system on March 22nd at 10:00 AM. You will receive test messages via text, email, and campus speakers. No action is required.', 'high', 'all', '2024-03-22 11:00:00');

-- Add comprehensive academic calendar events
INSERT INTO academic_calendar (title, description, start_date, end_date, event_type, is_important) VALUES
('Spring Semester Begins', 'First day of classes for Spring 2024 semester', '2024-01-22', '2024-01-22', 'academic', true),
('Last Day to Add/Drop Classes', 'Final deadline for course registration changes', '2024-02-05', '2024-02-05', 'deadline', true),
('Presidents Day Holiday', 'University closed - no classes', '2024-02-19', '2024-02-19', 'holiday', false),
('Spring Break', 'No classes scheduled - university open', '2024-03-25', '2024-03-29', 'break', false),
('Last Day to Withdraw', 'Final deadline to withdraw from courses with W grade', '2024-04-12', '2024-04-12', 'deadline', true),
('Finals Week', 'Final examinations for Spring 2024 semester', '2024-05-06', '2024-05-12', 'exam', true),
('Spring Commencement', 'Graduation ceremony for Spring 2024 graduates', '2024-05-18', '2024-05-18', 'ceremony', true),
('Summer Session I Begins', 'First summer session starts', '2024-05-28', '2024-05-28', 'academic', false),
('Independence Day Holiday', 'University closed', '2024-07-04', '2024-07-04', 'holiday', false),
('Summer Session I Ends', 'Last day of first summer session', '2024-06-28', '2024-06-28', 'academic', false),
('Summer Session II Begins', 'Second summer session starts', '2024-07-01', '2024-07-01', 'academic', false),
('Summer Session II Ends', 'Last day of second summer session', '2024-08-09', '2024-08-09', 'academic', false),
('Fall Semester Registration Opens', 'Priority registration begins for Fall 2024', '2024-03-15', '2024-04-30', 'registration', true),
('New Student Orientation', 'Orientation for incoming freshmen and transfer students', '2024-08-19', '2024-08-23', 'orientation', true),
('Fall Semester Begins', 'First day of classes for Fall 2024 semester', '2024-08-26', '2024-08-26', 'academic', true),
('Labor Day Holiday', 'University closed - no classes', '2024-09-02', '2024-09-02', 'holiday', false),
('Midterm Exams', 'Midterm examination period', '2024-10-14', '2024-10-18', 'exam', false),
('Thanksgiving Break', 'No classes - university closed Thursday and Friday', '2024-11-28', '2024-11-29', 'holiday', false),
('Last Day of Classes', 'Final day of instruction for Fall 2024', '2024-12-06', '2024-12-06', 'academic', true),
('Finals Week Fall', 'Final examinations for Fall 2024 semester', '2024-12-09', '2024-12-13', 'exam', true),
('Winter Commencement', 'Graduation ceremony for Fall 2024 graduates', '2024-12-20', '2024-12-20', 'ceremony', true),
('Research Proposal Deadline', 'Deadline for submitting research proposals for next fiscal year', '2024-02-15', '2024-02-15', 'deadline', true),
('Graduate School Application Deadline', 'Final deadline for graduate school applications for Fall admission', '2024-03-01', '2024-03-01', 'deadline', true),
('Scholarship Application Deadline', 'Deadline for merit-based scholarship applications', '2024-01-31', '2024-01-31', 'deadline', true);

-- Add sample students with correct exam_format values
INSERT INTO students (name, dob, father_name, mother_name, address, course_name, specialization, exam_format, cgpa) VALUES
('Alexandra Thompson', '2002-03-15', 'Robert Thompson', 'Jennifer Thompson', '123 Oak Street, Springfield, IL 62701', 'Bachelor of Science in Computer Science', 'Software Engineering', 'Semester', 3.75),
('Marcus Johnson', '2001-11-22', 'David Johnson', 'Maria Johnson', '456 Pine Avenue, Chicago, IL 60601', 'Bachelor of Science in Biology', 'Pre-Medicine', 'Semester', 3.82),
('Emily Chen', '2002-07-08', 'Wei Chen', 'Li Chen', '789 Maple Drive, Naperville, IL 60540', 'Bachelor of Business Administration', 'Finance', 'Year', 3.65),
('Jordan Williams', '2001-09-30', 'Michael Williams', 'Sarah Williams', '321 Elm Street, Peoria, IL 61601', 'Bachelor of Engineering', 'Mechanical Engineering', 'Semester', 3.91),
('Isabella Rodriguez', '2002-05-12', 'Carlos Rodriguez', 'Ana Rodriguez', '654 Cedar Lane, Rockford, IL 61101', 'Bachelor of Arts in English Literature', 'Creative Writing', 'Year', 3.58),
('Ethan Davis', '2001-12-03', 'James Davis', 'Michelle Davis', '987 Birch Road, Champaign, IL 61820', 'Bachelor of Science in Mathematics', 'Applied Mathematics', 'Semester', 3.89),
('Sophia Martinez', '2002-04-25', 'Jose Martinez', 'Carmen Martinez', '147 Willow Way, Aurora, IL 60505', 'Bachelor of Science in Nursing', 'Pediatric Nursing', 'Semester', 3.73),
('Noah Anderson', '2001-08-17', 'Eric Anderson', 'Lisa Anderson', '258 Spruce Street, Joliet, IL 60435', 'Bachelor of Fine Arts', 'Graphic Design', 'Year', 3.61),
('Ava Taylor', '2002-01-09', 'Brian Taylor', 'Amy Taylor', '369 Poplar Place, Evanston, IL 60201', 'Bachelor of Science in Psychology', 'Clinical Psychology', 'Year', 3.77),
('Liam Brown', '2001-10-14', 'Christopher Brown', 'Jessica Brown', '741 Hickory Hill, Decatur, IL 62521', 'Bachelor of Science in Chemistry', 'Biochemistry', 'Semester', 3.84),
('Emma Wilson', '2002-06-18', 'Mark Wilson', 'Susan Wilson', '852 Cedar Avenue, Springfield, IL 62703', 'Bachelor of Science in Physics', 'Theoretical Physics', 'Semester', 3.92),
('William Garcia', '2001-04-07', 'Antonio Garcia', 'Rosa Garcia', '963 Pine Street, Chicago, IL 60602', 'Bachelor of Arts in History', 'American History', 'Year', 3.67),
('Olivia Miller', '2002-12-01', 'John Miller', 'Patricia Miller', '741 Maple Lane, Naperville, IL 60541', 'Bachelor of Science in Environmental Science', 'Conservation Biology', 'Year', 3.78),
('James Smith', '2001-08-25', 'Robert Smith', 'Mary Smith', '159 Oak Drive, Peoria, IL 61602', 'Bachelor of Music', 'Performance', 'Semester', 3.55),
('Charlotte Jones', '2002-02-14', 'David Jones', 'Linda Jones', '357 Elm Avenue, Rockford, IL 61102', 'Bachelor of Social Work', 'Clinical Social Work', 'Year', 3.71),
('Michael Davis', '2001-06-12', 'Thomas Davis', 'Karen Davis', '741 Cedar Street, Springfield, IL 62704', 'Bachelor of Science in Information Technology', 'Cybersecurity', 'Semester', 3.63),
('Sarah Wilson', '2002-09-03', 'William Wilson', 'Rebecca Wilson', '852 Pine Road, Chicago, IL 60603', 'Bachelor of Arts in Political Science', 'Public Administration', 'Year', 3.71),
('Daniel Martinez', '2001-01-28', 'Miguel Martinez', 'Elena Martinez', '963 Oak Lane, Naperville, IL 60542', 'Bachelor of Science in Mechanical Engineering', 'Automotive Engineering', 'Semester', 3.88),
('Jessica Anderson', '2002-11-16', 'Steven Anderson', 'Christine Anderson', '147 Elm Drive, Peoria, IL 61603', 'Bachelor of Science in Nursing', 'Mental Health Nursing', 'Semester', 3.69),
('Christopher Taylor', '2001-04-22', 'Richard Taylor', 'Nancy Taylor', '258 Maple Avenue, Rockford, IL 61103', 'Bachelor of Business Administration', 'International Business', 'Year', 3.74);