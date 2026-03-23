-- ─── 1. Instructors table (Optional, but useful for richer data) ───────────────
CREATE TABLE IF NOT EXISTS instructors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 2. Seed instructors ──────────────────────────────────────────────────────
INSERT IGNORE INTO instructors (id, name, bio, avatar_url) VALUES
(1, 'Dr. Angela Yu',       'Lead instructor with 10+ years teaching Python, Web Dev & iOS.', 'https://i.pravatar.cc/80?img=47'),
(2, 'Mosh Hamedani',       'Software engineer & programming teacher. Founder of Code with Mosh.','https://i.pravatar.cc/80?img=12'),
(3, 'Navin Reddy',         'Java & Android expert, popular Indian programming instructor.',    'https://i.pravatar.cc/80?img=33'),
(4, 'Abdul Bari',          'Algorithm specialist, author of Mastering Data Structures & Algorithms.','https://i.pravatar.cc/80?img=7'),
(5, 'Andrew Ng',           'Co-founder of Coursera & Google Brain. Leading AI/ML researcher.','https://i.pravatar.cc/80?img=52'),
(6, 'Traversy Media',      'Brad Traversy — full-stack web dev tutorials for all levels.',    'https://i.pravatar.cc/80?img=68'),
(7, 'Hitesh Choudhary',    'CTO & JavaScript/Python educator. Chai aur Code author.',         'https://i.pravatar.cc/80?img=15'),
(8, 'Kunal Kushwaha',      'DevOps & Java educator, community builder.',                      'https://i.pravatar.cc/80?img=25');

-- ─── 3. Add columns to subjects ──────────────────────────────────────────────
-- Using independent ALTER TABLE statements
ALTER TABLE subjects ADD COLUMN instructor_name VARCHAR(100) DEFAULT NULL;
ALTER TABLE subjects ADD COLUMN total_lessons INT DEFAULT 0;
ALTER TABLE subjects ADD COLUMN duration_hours DECIMAL(5,1) DEFAULT 0;

-- ─── 4. Update existing courses with instructor names ─────────────────────────
UPDATE subjects SET instructor_name = 'Dr. Angela Yu',   total_lessons = 42, duration_hours = 38.5 WHERE id = 20;
UPDATE subjects SET instructor_name = 'Navin Reddy',     total_lessons = 55, duration_hours = 24.0 WHERE id = 21;
UPDATE subjects SET instructor_name = 'Navin Reddy',     total_lessons = 55, duration_hours = 24.0 WHERE id = 22;
UPDATE subjects SET instructor_name = 'Mosh Hamedani',   total_lessons = 38, duration_hours = 19.5 WHERE id = 23;
UPDATE subjects SET instructor_name = 'Traversy Media',  total_lessons = 28, duration_hours = 15.0 WHERE id = 34;
UPDATE subjects SET instructor_name = 'Hitesh Choudhary',total_lessons = 52, duration_hours = 31.0 WHERE id = 35;
UPDATE subjects SET instructor_name = 'Traversy Media',  total_lessons = 33, duration_hours = 17.5 WHERE id = 36;
UPDATE subjects SET instructor_name = 'Kunal Kushwaha',  total_lessons = 45, duration_hours = 26.0 WHERE id = 37;
UPDATE subjects SET instructor_name = 'Andrew Ng',       total_lessons = 60, duration_hours = 54.0 WHERE id = 38;

-- ─── 5. Add more courses (using instructor_id = 1 to satisfy foreign key) ─────
INSERT INTO subjects (title, description, instructor_id, instructor_name, category, thumbnail_url, slug, level, price, is_published, language, total_lessons, duration_hours)
VALUES
('HTML & CSS for Beginners', 'Build beautiful websites from scratch. Learn HTML5 structure, CSS3 styling, Flexbox, Grid, and responsive design principles.', 1, 'Traversy Media', 'Web Development', 'https://img.youtube.com/vi/hu-q2zYwEYs/maxresdefault.jpg', 'html-css-beginners', 'Beginner', 0, 1, 'English', 36, 18.5),
('JavaScript Complete Course', 'Master JavaScript from zero to hero. ES6+, DOM manipulation, async/await, fetch API, and modern JS patterns.', 1, 'Hitesh Choudhary', 'Programming', 'https://img.youtube.com/vi/sscX432bMZo/maxresdefault.jpg', 'javascript-complete', 'Intermediate', 0, 1, 'English', 64, 48.0),
('React 18 — Build Modern UIs', 'Learn React from scratch: components, hooks, React Router, state management with Redux, and deploying to production.', 1, 'Dr. Angela Yu', 'Frontend Development', 'https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg', 'react-18-modern', 'Intermediate', 0, 1, 'English', 47, 35.0),
('Node.js & Express Backend', 'Build scalable REST APIs with Node.js, Express, and MongoDB. Authentication with JWT, file uploads, and full deployment.', 1, 'Mosh Hamedani', 'Backend Development', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 'nodejs-express-api', 'Intermediate', 0, 1, 'English', 39, 28.0),
('SQL & MySQL Bootcamp', 'From SELECT basics to advanced joins, subqueries, stored procedures, triggers, and database design.', 1, 'Abdul Bari', 'Database', 'https://img.youtube.com/vi/7S_tz1z_5bA/maxresdefault.jpg', 'sql-mysql-bootcamp', 'Beginner', 0, 1, 'English', 44, 22.5),
('Data Science with Python', 'Explore data with NumPy, Pandas, Matplotlib, and Seaborn. Build machine learning models with Scikit-Learn.', 1, 'Andrew Ng', 'Data Science', 'https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg', 'data-science-python', 'Intermediate', 0, 1, 'English', 58, 42.0),
('TypeScript Crash Course', 'Add strong typing to your JavaScript. Types, interfaces, generics, decorators, and integration with React/Node.', 1, 'Mosh Hamedani', 'Programming', 'https://img.youtube.com/vi/d56mG7DezGs/maxresdefault.jpg', 'typescript-crash-course', 'Intermediate', 0, 1, 'English', 24, 12.0),
('Docker & Kubernetes DevOps', 'Containerize applications with Docker, orchestrate with Kubernetes, set up CI/CD pipelines, and cloud deployment.', 1, 'Kunal Kushwaha', 'DevOps', 'https://img.youtube.com/vi/umXgKS4wDzI/maxresdefault.jpg', 'docker-kubernetes', 'Advanced', 0, 1, 'English', 51, 38.5),
('C Programming Hero', 'Master the foundation of all computing. Pointers, memory management, data structures, and system programs.', 1, 'Abdul Bari', 'Programming', 'https://img.youtube.com/vi/KJgsSFOSQv0/maxresdefault.jpg', 'c-programming-hero', 'Beginner', 0, 1, 'English', 40, 20.0),
('Git & GitHub Mastery', 'Track your code with Git, collaborate on GitHub. Branching, merging, pull requests, and open source contribution.', 1, 'Traversy Media', 'DevTools', 'https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg', 'git-github-mastery', 'Beginner', 0, 1, 'English', 20, 6.5);

-- ─── 6. Enrollments table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_watched_at TIMESTAMP NULL,
  watch_seconds INT DEFAULT 0,
  UNIQUE KEY unique_enrollment (user_id, subject_id)
);

-- ─── 7. Lesson progress table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  subject_id INT NOT NULL,
  watch_percent INT DEFAULT 0,
  is_completed TINYINT(1) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_id, lesson_id)
);

-- ─── 8. Seed some fake progress for user 1 ────────────────────────────────────
-- Enrolling user 1 in a few courses
INSERT IGNORE INTO enrollments (user_id, subject_id, enrolled_at) VALUES
(1, 20, NOW()), (1, 23, NOW()), (1, 35, NOW());

-- Adding some progress
INSERT IGNORE INTO lesson_progress (user_id, lesson_id, subject_id, is_completed) VALUES
(1, 101, 20, 1), (1, 102, 20, 1), (1, 103, 20, 0),
(1, 201, 23, 1), (1, 202, 23, 1), (1, 203, 23, 1),
(1, 301, 35, 1);
