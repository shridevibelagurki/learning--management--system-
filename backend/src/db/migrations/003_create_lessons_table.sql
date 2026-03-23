-- ─── 1. Lessons table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  video_url VARCHAR(255) NOT NULL,
  duration_minutes INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- ─── 2. Seed lessons for Python (Subject ID 20) ──────────────────────────────
INSERT INTO lessons (subject_id, title, video_url, duration_minutes, order_index) VALUES
(20, 'Introduction to Python', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 15, 1),
(20, 'Setting up Environment', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 10, 2),
(20, 'Variables and Data Types', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 25, 3),
(20, 'Control Flow (If/Else)', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 20, 4),
(20, 'Loops in Python', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 30, 5);

-- ─── 3. Seed lessons for Java (Subject ID 22) ────────────────────────────────
INSERT INTO lessons (subject_id, title, video_url, duration_minutes, order_index) VALUES
(22, 'Java Overview', 'https://www.youtube.com/watch?v=eIrMb66zuxc', 12, 1),
(22, 'JVM Architecture', 'https://www.youtube.com/watch?v=eIrMb66zuxc', 18, 2),
(22, 'Object Oriented Programming', 'https://www.youtube.com/watch?v=eIrMb66zuxc', 45, 3),
(22, 'Inheritance and Polymorphism', 'https://www.youtube.com/watch?v=eIrMb66zuxc', 35, 4);

-- ─── 4. Seed lessons for Web Development (Subject ID 34) ────────────────────
INSERT INTO lessons (subject_id, title, video_url, duration_minutes, order_index) VALUES
(34, 'HTML basics', 'https://www.youtube.com/watch?v=hu-q2zYwEYs', 10, 1),
(34, 'CSS Layouts', 'https://www.youtube.com/watch?v=hu-q2zYwEYs', 22, 2),
(34, 'Flexbox and Grid', 'https://www.youtube.com/watch?v=hu-q2zYwEYs', 28, 3),
(34, 'Responsive Web Design', 'https://www.youtube.com/watch?v=hu-q2zYwEYs', 15, 4);
