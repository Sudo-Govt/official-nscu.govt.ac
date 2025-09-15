-- Add remaining master's and PhD programs
INSERT INTO courses (course_name, course_code, college, department, degree_type, duration_years, fee_structure, intake_months, eligibility_criteria, seat_capacity, available_seats) VALUES

-- School of Business Studies - Master and PhD Programs
('Master of Business Administration', 'MBA-001', 'School of Business Studies', 'Business Administration', 'master', 2, '{"tuition": 180000, "registration": 8000, "examination": 15000}', '{1,7}', 'Bachelor degree with 60% marks', 80, 80),
('PhD in Business Administration', 'PHD-BA-001', 'School of Business Studies', 'Business Administration', 'phd', 4, '{"tuition": 240000, "registration": 15000, "examination": 25000}', '{1,7}', 'Master degree with 65% marks', 25, 25),
('Master of Commerce', 'MCOM-001', 'School of Business Studies', 'Commerce', 'master', 2, '{"tuition": 120000, "registration": 6000, "examination": 10000}', '{1,7}', 'Bachelor in Commerce or related field', 60, 60),
('PhD in Commerce', 'PHD-COM-001', 'School of Business Studies', 'Commerce', 'phd', 4, '{"tuition": 200000, "registration": 12000, "examination": 20000}', '{1,7}', 'Master in Commerce with research aptitude', 20, 20),
('Master of Accounting & Finance', 'MAF-001', 'School of Business Studies', 'Accounting & Finance', 'master', 2, '{"tuition": 150000, "registration": 7000, "examination": 12000}', '{1,7}', 'Bachelor in Accounting/Finance/Commerce', 50, 50),
('PhD in Accounting & Finance', 'PHD-AF-001', 'School of Business Studies', 'Accounting & Finance', 'phd', 4, '{"tuition": 220000, "registration": 13000, "examination": 22000}', '{1,7}', 'Master in Accounting/Finance with research', 15, 15),

-- School of Computer Science - Master and PhD Programs  
('Master of Computer Applications', 'MCA-001', 'School of Computer Science', 'Computer Applications', 'master', 2, '{"tuition": 140000, "registration": 6000, "examination": 11000}', '{1,7}', 'Bachelor in Computer Science/IT/related field', 80, 80),
('PhD in Computer Applications', 'PHD-CA-001', 'School of Computer Science', 'Computer Applications', 'phd', 4, '{"tuition": 250000, "registration": 15000, "examination": 25000}', '{1,7}', 'Master in Computer Applications with research', 20, 20),
('Master of Artificial Intelligence', 'MAI-001', 'School of Computer Science', 'Artificial Intelligence', 'master', 2, '{"tuition": 200000, "registration": 8000, "examination": 15000}', '{1,7}', 'Bachelor in CS/IT/Engineering with AI exposure', 40, 40),
('PhD in Artificial Intelligence', 'PHD-AI-001', 'School of Computer Science', 'Artificial Intelligence', 'phd', 4, '{"tuition": 300000, "registration": 18000, "examination": 30000}', '{1,7}', 'Master in AI/ML/CS with strong research background', 15, 15),
('Master of Data Science', 'MDS-001', 'School of Computer Science', 'Data Science', 'master', 2, '{"tuition": 180000, "registration": 7500, "examination": 14000}', '{1,7}', 'Bachelor in Mathematics/Statistics/CS/Engineering', 50, 50),
('PhD in Data Science', 'PHD-DS-001', 'School of Computer Science', 'Data Science', 'phd', 4, '{"tuition": 280000, "registration": 16000, "examination": 28000}', '{1,7}', 'Master in Data Science/Statistics with research', 12, 12),

-- School of Medical Sciences Programs
('Bachelor of Medicine & Surgery (MBBS)', 'MBBS-001', 'School of Medical Sciences', 'Medicine', 'bachelor', 6, '{"tuition": 500000, "registration": 25000, "examination": 50000}', '{1}', 'K12 with Physics, Chemistry, Biology (85% minimum)', 100, 100),
('Doctor of Medicine (MD)', 'MD-001', 'School of Medical Sciences', 'Medicine', 'doctorate', 3, '{"tuition": 600000, "registration": 30000, "examination": 60000}', '{1}', 'MBBS with internship completion', 50, 50),
('PhD in Medical Sciences', 'PHD-MED-001', 'School of Medical Sciences', 'Medical Sciences', 'phd', 4, '{"tuition": 400000, "registration": 20000, "examination": 40000}', '{1,7}', 'Master in Medical Sciences/MBBS with research', 25, 25),
('Bachelor of Dental Surgery (BDS)', 'BDS-001', 'School of Medical Sciences', 'Dental Surgery', 'bachelor', 5, '{"tuition": 400000, "registration": 20000, "examination": 40000}', '{1}', 'K12 with Physics, Chemistry, Biology (80% minimum)', 60, 60),
('Master of Dental Surgery (MDS)', 'MDS-001', 'School of Medical Sciences', 'Dental Surgery', 'master', 3, '{"tuition": 500000, "registration": 25000, "examination": 50000}', '{1}', 'BDS with internship completion', 30, 30),
('PhD in Dental Sciences', 'PHD-DENT-001', 'School of Medical Sciences', 'Dental Sciences', 'phd', 4, '{"tuition": 350000, "registration": 18000, "examination": 35000}', '{1,7}', 'MDS or equivalent with research background', 15, 15),
('Bachelor of Physiotherapy (BPT)', 'BPT-001', 'School of Medical Sciences', 'Physiotherapy', 'bachelor', 4, '{"tuition": 200000, "registration": 10000, "examination": 20000}', '{1,7}', 'K12 with Physics, Chemistry, Biology', 40, 40),
('Master of Physiotherapy (MPT)', 'MPT-001', 'School of Medical Sciences', 'Physiotherapy', 'master', 2, '{"tuition": 250000, "registration": 12000, "examination": 25000}', '{1,7}', 'BPT with internship completion', 25, 25),
('PhD in Physiotherapy', 'PHD-PHYSIO-001', 'School of Medical Sciences', 'Physiotherapy', 'phd', 4, '{"tuition": 300000, "registration": 15000, "examination": 30000}', '{1,7}', 'MPT with research experience', 10, 10),

-- School of Law Programs
('Bachelor of Laws (LLB)', 'LLB-001', 'School of Law', 'Law', 'bachelor', 3, '{"tuition": 150000, "registration": 7000, "examination": 12000}', '{1,7}', 'Bachelor degree in any discipline', 80, 80),
('Master of Laws (LLM)', 'LLM-001', 'School of Law', 'Law', 'master', 2, '{"tuition": 180000, "registration": 8000, "examination": 15000}', '{1,7}', 'LLB with 60% marks', 40, 40),
('PhD in Law', 'PHD-LAW-001', 'School of Law', 'Law', 'phd', 4, '{"tuition": 250000, "registration": 15000, "examination": 25000}', '{1,7}', 'LLM with research aptitude', 15, 15),

-- School of Education Programs
('Bachelor of Education (B.Ed)', 'BED-001', 'School of Education', 'Education', 'bachelor', 2, '{"tuition": 80000, "registration": 4000, "examination": 6000}', '{1,7}', 'Bachelor degree in any subject', 100, 100),
('Master of Education (M.Ed)', 'MED-001', 'School of Education', 'Education', 'master', 2, '{"tuition": 100000, "registration": 5000, "examination": 8000}', '{1,7}', 'B.Ed with teaching experience preferred', 60, 60),
('PhD in Education', 'PHD-EDU-001', 'School of Education', 'Education', 'phd', 4, '{"tuition": 180000, "registration": 10000, "examination": 18000}', '{1,7}', 'M.Ed with research background', 20, 20);