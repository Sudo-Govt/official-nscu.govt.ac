-- Add new courses with unique codes
INSERT INTO courses (course_code, course_name, college, department, degree_type, duration_years, credit_hours, fee_structure, eligibility_criteria, seat_capacity, available_seats) VALUES
('CHEM202', 'Analytical Chemistry', 'College of Arts and Sciences', 'Chemistry', 'bachelor', 4, 4, '{"tuition": 11500, "lab_fee": 900, "books": 650}', 'General Chemistry prerequisite', 90, 45),
('PHYS302', 'Quantum Mechanics', 'College of Arts and Sciences', 'Physics', 'bachelor', 4, 4, '{"tuition": 12000, "lab_fee": 600, "books": 750}', 'Advanced Physics prerequisite', 60, 28),
('ECON202', 'Microeconomics', 'School of Business', 'Economics', 'bachelor', 4, 3, '{"tuition": 11500, "books": 500}', 'Introduction to Economics', 120, 67),
('STAT302', 'Statistical Analysis', 'College of Arts and Sciences', 'Statistics', 'bachelor', 4, 3, '{"tuition": 10500, "books": 600}', 'Calculus I prerequisite', 100, 54),
('ART202', 'Digital Art and Design', 'School of Arts', 'Fine Arts', 'bachelor', 4, 3, '{"tuition": 13000, "lab_fee": 400, "books": 300}', 'Art fundamentals', 80, 42),
('MUS302', 'Music Theory Advanced', 'School of Arts', 'Music', 'bachelor', 4, 3, '{"tuition": 12500, "books": 400}', 'Music Theory II', 50, 23),
('GEOL202', 'Earth Sciences', 'College of Arts and Sciences', 'Geology', 'bachelor', 4, 4, '{"tuition": 11000, "lab_fee": 800, "books": 700}', 'General Science courses', 70, 38),
('ANTH202', 'Cultural Anthropology', 'College of Arts and Sciences', 'Anthropology', 'bachelor', 4, 3, '{"tuition": 10000, "books": 450}', 'Introduction to Anthropology', 90, 51),
('PHIL302', 'Ethics and Moral Philosophy', 'College of Arts and Sciences', 'Philosophy', 'bachelor', 4, 3, '{"tuition": 9800, "books": 400}', 'Introduction to Philosophy', 80, 44),
('LING202', 'Linguistics Fundamentals', 'College of Arts and Sciences', 'Linguistics', 'bachelor', 4, 3, '{"tuition": 10200, "books": 450}', 'English Literature background', 60, 32);

-- Add more announcements
INSERT INTO announcements (title, content, priority, target_audience) VALUES
('International Study Abroad Fair', 'Explore study abroad opportunities at our annual fair featuring programs from over 30 countries. Representatives from partner universities will be available to answer questions.', 'normal', 'students'),
('Alumni Networking Event', 'Join us for an evening of networking with successful alumni from various industries. Light refreshments will be provided. RSVP required by Friday.', 'normal', 'students'),
('Faculty Research Showcase', 'Annual faculty research showcase highlighting groundbreaking work across all departments. Poster presentations and research demonstrations. Open to all university community.', 'normal', 'all'),
('Student Mental Health Week', 'A week dedicated to mental health awareness with workshops, counseling sessions, and stress management activities. Free participation for all students.', 'high', 'students'),
('Technology Upgrade Notice', 'All lecture halls will receive new audio-visual equipment upgrades during winter break. Training sessions for faculty will be scheduled in January.', 'normal', 'faculty');

-- Add more academic calendar events
INSERT INTO academic_calendar (title, description, start_date, end_date, event_type, is_important) VALUES
('Research Conference 2024', 'Annual university research conference with presentations from faculty and graduate students', '2024-04-15', '2024-04-17', 'conference', false),
('Alumni Reunion Weekend', 'Class reunion weekend with campus tours, networking events, and celebration dinner', '2024-10-04', '2024-10-06', 'ceremony', false),
('Student Awards Ceremony', 'Recognition ceremony for outstanding student achievements and scholarships', '2024-04-25', '2024-04-25', 'ceremony', false),
('Faculty Senate Retreat', 'Annual faculty retreat for strategic planning and professional development', '2024-08-05', '2024-08-07', 'workshop', false),
('International Education Week', 'Celebration of international education with cultural events and presentations', '2024-11-18', '2024-11-22', 'cultural', false);

-- Add sample students with proper format (fixed escaping)
INSERT INTO students (name, dob, father_name, mother_name, address, course_name, specialization, exam_format, cgpa) VALUES
('Rachel Green', '2002-05-20', 'Leonard Green', 'Sandra Green', '321 Broadway Street, New York, NY 10001', 'Bachelor of Science in Environmental Science', 'Climate Studies', 'Semester', 3.85),
('Ross Geller', '2001-10-18', 'Jack Geller', 'Judy Geller', '456 Central Park West, New York, NY 10025', 'Master of Science in Paleontology', 'Vertebrate Paleontology', 'Year', 3.92),
('Monica Bing', '2002-04-22', 'Jack Geller', 'Judy Geller', '495 Grove Street, New York, NY 10014', 'Bachelor of Arts in Culinary Arts', 'French Cuisine', 'Semester', 3.78),
('Chandler Bing', '2001-04-08', 'Charles Bing', 'Nora Tyler Bing', '495 Grove Street, New York, NY 10014', 'Bachelor of Business Administration', 'Statistical Analysis', 'Year', 3.66),
('Joey Tribbiani', '2002-01-09', 'Giuseppe Tribbiani', 'Gloria Tribbiani', '19 Grove Street, New York, NY 10014', 'Bachelor of Fine Arts', 'Acting and Theater', 'Semester', 3.45),
('Phoebe Buffay', '2001-02-16', 'Frank Buffay Sr.', 'Lily Buffay', '5 Morton Street, New York, NY 10014', 'Bachelor of Arts in Music', 'Singer-Songwriter', 'Year', 3.72),
('Harry Potter', '2002-07-31', 'James Potter', 'Lily Potter', '4 Privet Drive, Little Whinging, Surrey', 'Bachelor of Arts in Defense Studies', 'Dark Arts Defense', 'Semester', 3.89),
('Hermione Granger', '2001-09-19', 'Mr. Granger', 'Mrs. Granger', '12 Heathgate, Hampstead Garden Suburb, London', 'Bachelor of Science in Library Science', 'Magical Research', 'Year', 4.0),
('Ron Weasley', '2002-03-01', 'Arthur Weasley', 'Molly Weasley', 'The Burrow, Ottery St Catchpole, Devon', 'Bachelor of Arts in Strategic Studies', 'Tactical Planning', 'Semester', 3.67),
('Luna Lovegood', '2002-02-13', 'Xenophilius Lovegood', 'Pandora Lovegood', 'Rook House, near Ottery St Catchpole, Devon', 'Bachelor of Science in Natural Sciences', 'Cryptozoology', 'Year', 3.81),
('Neville Longbottom', '2002-07-30', 'Frank Longbottom', 'Alice Longbottom', '12 Grimmauld Place, London', 'Bachelor of Science in Botany', 'Herbology', 'Semester', 3.75),
('Ginny Weasley', '2003-08-11', 'Arthur Weasley', 'Molly Weasley', 'The Burrow, Ottery St Catchpole, Devon', 'Bachelor of Arts in Sports Management', 'Quidditch Studies', 'Year', 3.83),
('Draco Malfoy', '2002-06-05', 'Lucius Malfoy', 'Narcissa Malfoy', 'Malfoy Manor, Wiltshire', 'Bachelor of Business Administration', 'Corporate Strategy', 'Semester', 3.71),
('Severus Snape Jr.', '2001-01-09', 'Tobias Snape', 'Eileen Prince', '19 Spinners End, Cokeworth', 'Bachelor of Science in Chemistry', 'Potion Making', 'Year', 3.95),
('Minerva McGonagall Jr.', '2002-10-04', 'Robert McGonagall Jr.', 'Isobel Ross', '15 Highland Street, Scotland', 'Bachelor of Arts in Education', 'Transfiguration Studies', 'Semester', 3.91);

-- Add language courses
INSERT INTO courses (course_code, course_name, college, department, degree_type, duration_years, credit_hours, fee_structure, eligibility_criteria, seat_capacity, available_seats) VALUES
('SPAN202', 'Intermediate Spanish', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Spanish completion', 75, 41),
('FREN202', 'Intermediate French', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary French completion', 70, 38),
('GERM202', 'Intermediate German', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary German completion', 65, 32),
('JAPN202', 'Intermediate Japanese', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Japanese completion', 60, 29),
('CHIN202', 'Intermediate Chinese', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Chinese completion', 55, 25),
('ITAL202', 'Intermediate Italian', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Italian completion', 50, 22),
('ARAB202', 'Intermediate Arabic', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Arabic completion', 45, 18),
('RUSS202', 'Intermediate Russian', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Russian completion', 40, 15),
('PORT202', 'Intermediate Portuguese', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Portuguese completion', 35, 12),
('KORE202', 'Intermediate Korean', 'College of Arts and Sciences', 'Modern Languages', 'bachelor', 4, 3, '{"tuition": 9500, "books": 350}', 'Elementary Korean completion', 30, 8);