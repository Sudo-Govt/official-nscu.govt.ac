-- Add remaining bachelor's, master's, and PhD programs
INSERT INTO courses (course_name, course_code, college, department, degree_type, duration_years, fee_structure, intake_months, eligibility_criteria, seat_capacity, available_seats) VALUES

-- School of Business Studies - Bachelor Programs
('Bachelor of Business Administration', 'BBA-001', 'School of Business Studies', 'Business Administration', 'bachelor', 4, '{"tuition": 120000, "registration": 5000, "examination": 8000}', '{1,7}', 'K12 completion with 60% marks', 100, 100),
('Bachelor of Commerce', 'BCOM-001', 'School of Business Studies', 'Commerce', 'bachelor', 3, '{"tuition": 90000, "registration": 4000, "examination": 6000}', '{1,7}', 'K12 completion with Commerce/Science/Arts', 120, 120),
('Bachelor of Accounting & Finance', 'BAF-001', 'School of Business Studies', 'Accounting & Finance', 'bachelor', 4, '{"tuition": 110000, "registration": 4500, "examination": 7000}', '{1,7}', 'K12 completion with Mathematics', 80, 80),
('Bachelor of International Business', 'BIB-001', 'School of Business Studies', 'International Business', 'bachelor', 4, '{"tuition": 140000, "registration": 5000, "examination": 8000}', '{1,7}', 'K12 completion with English proficiency', 60, 60),
('Bachelor of Marketing', 'BMKT-001', 'School of Business Studies', 'Marketing', 'bachelor', 4, '{"tuition": 115000, "registration": 4500, "examination": 7500}', '{1,7}', 'K12 completion with Business/Commerce', 90, 90),
('Bachelor of Human Resource Management', 'BHRM-001', 'School of Business Studies', 'Human Resource Management', 'bachelor', 4, '{"tuition": 118000, "registration": 4500, "examination": 7500}', '{1,7}', 'K12 completion with Social Sciences', 70, 70),

-- School of Computer Science - Bachelor Programs
('Bachelor of Computer Applications', 'BCA-001', 'School of Computer Science', 'Computer Applications', 'bachelor', 3, '{"tuition": 105000, "registration": 4000, "examination": 6500}', '{1,7}', 'K12 completion with Mathematics', 120, 120),
('Bachelor of Computer Engineering & Technology', 'BCET-001', 'School of Computer Science', 'Computer Engineering & Technology', 'bachelor', 4, '{"tuition": 150000, "registration": 6000, "examination": 10000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 80, 80),
('Bachelor of Information Technology', 'BIT-001', 'School of Computer Science', 'Information Technology', 'bachelor', 4, '{"tuition": 135000, "registration": 5000, "examination": 8500}', '{1,7}', 'K12 with Mathematics', 100, 100),
('Bachelor of Artificial Intelligence', 'BAI-001', 'School of Computer Science', 'Artificial Intelligence', 'bachelor', 4, '{"tuition": 160000, "registration": 6000, "examination": 10000}', '{1,7}', 'K12 with Mathematics and Physics', 60, 60),
('Bachelor of Data Science', 'BDS-001', 'School of Computer Science', 'Data Science', 'bachelor', 4, '{"tuition": 155000, "registration": 6000, "examination": 9500}', '{1,7}', 'K12 with Mathematics and Statistics', 70, 70),
('Bachelor of Cyber Security', 'BCYS-001', 'School of Computer Science', 'Cyber Security', 'bachelor', 4, '{"tuition": 145000, "registration": 5500, "examination": 9000}', '{1,7}', 'K12 with Mathematics and Computer Science', 50, 50),
('Bachelor of Software Engineering', 'BSE-001', 'School of Computer Science', 'Software Engineering', 'bachelor', 4, '{"tuition": 140000, "registration": 5500, "examination": 8500}', '{1,7}', 'K12 with Mathematics', 90, 90),

-- School of Engineering - Bachelor Programs  
('Bachelor of Mechanical Engineering', 'BME-001', 'School of Engineering', 'Mechanical Engineering', 'bachelor', 4, '{"tuition": 180000, "registration": 7000, "examination": 12000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 80, 80),
('Bachelor of Civil Engineering', 'BCE-001', 'School of Engineering', 'Civil Engineering', 'bachelor', 4, '{"tuition": 175000, "registration": 7000, "examination": 11500}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 90, 90),
('Bachelor of Electrical Engineering', 'BEE-001', 'School of Engineering', 'Electrical Engineering', 'bachelor', 4, '{"tuition": 185000, "registration": 7000, "examination": 12000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 70, 70),
('Bachelor of Electronics & Communication', 'BEC-001', 'School of Engineering', 'Electronics & Communication', 'bachelor', 4, '{"tuition": 170000, "registration": 6500, "examination": 11000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 85, 85),
('Bachelor of Chemical Engineering', 'BCHE-001', 'School of Engineering', 'Chemical Engineering', 'bachelor', 4, '{"tuition": 190000, "registration": 7500, "examination": 12500}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 60, 60),
('Bachelor of Aeronautical Engineering', 'BAE-001', 'School of Engineering', 'Aeronautical Engineering', 'bachelor', 4, '{"tuition": 220000, "registration": 8000, "examination": 15000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 40, 40),
('Bachelor of Automobile Engineering', 'BAUTO-001', 'School of Engineering', 'Automobile Engineering', 'bachelor', 4, '{"tuition": 195000, "registration": 7500, "examination": 13000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 50, 50),
('Bachelor of Metallurgical Engineering', 'BMET-001', 'School of Engineering', 'Metallurgical Engineering', 'bachelor', 4, '{"tuition": 185000, "registration": 7000, "examination": 12000}', '{1,7}', 'K12 with Physics, Chemistry, Mathematics', 35, 35),

-- School of Architecture - Bachelor Programs
('Bachelor of Architecture', 'BARCH-001', 'School of Architecture', 'Architecture', 'bachelor', 5, '{"tuition": 200000, "registration": 8000, "examination": 15000}', '{1,7}', 'K12 completion with portfolio and aptitude test', 50, 50),
('Bachelor of Interior Design', 'BID-001', 'School of Architecture', 'Interior Design', 'bachelor', 4, '{"tuition": 150000, "registration": 6000, "examination": 10000}', '{1,7}', 'K12 completion with portfolio', 60, 60),
('Bachelor of Urban Planning', 'BUP-001', 'School of Architecture', 'Urban Planning', 'bachelor', 4, '{"tuition": 145000, "registration": 5500, "examination": 9500}', '{1,7}', 'K12 completion with Geography/Mathematics', 40, 40),
('Bachelor of Landscape Architecture', 'BLA-001', 'School of Architecture', 'Landscape Architecture', 'bachelor', 4, '{"tuition": 155000, "registration": 6000, "examination": 10000}', '{1,7}', 'K12 completion with portfolio', 30, 30);