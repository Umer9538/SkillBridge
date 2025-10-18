PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
	id INTEGER NOT NULL, 
	email VARCHAR(120) NOT NULL, 
	password_hash VARCHAR(128) NOT NULL, 
	role VARCHAR(20) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	profile_picture VARCHAR(255), 
	is_active BOOLEAN, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO users VALUES(1,'learner@skillbridge.com','$2b$12$5so3OnI2EmZp4aXdsXRDlek3XlKWo00TzSJF1dK0I3E3b376WUkgy','learner','Alice Johnson',NULL,1,'2025-10-12 10:11:28.302320','2025-10-12 10:11:28.302326');
INSERT INTO users VALUES(2,'john@example.com','$2b$12$bj9oS8xpp8AMli1XYiT4ruXFa8jpkPaY314uRD0f9XGdPaC2CITZ.','learner','John Doe',NULL,1,'2025-10-12 10:11:28.574253','2025-10-12 10:11:28.574259');
INSERT INTO users VALUES(3,'company@techcorp.com','$2b$12$7vWUZQzKliQLNacqkBRWjetSOWqNjwYTtzzCEOO.cLGSdqq3Qeslm','company','Sarah Smith',NULL,1,'2025-10-12 10:11:28.892183','2025-10-12 10:11:28.892189');
INSERT INTO users VALUES(4,'hr@datainc.com','$2b$12$rsmEswZ6wA8raFyvs.UmbeqaOnOWp30owtouE1yjDm2kyte8F.inK','company','Mike Chen',NULL,1,'2025-10-12 10:11:29.166796','2025-10-12 10:11:29.166822');
INSERT INTO users VALUES(5,'supervisor@university.edu','$2b$12$jW/1ZYUjEJSvwCGwWSsJ3uWI6OnIe.CCU7x8ms4rdSIOZ3Q.hjtXm','supervisor','Dr. Emily Brown',NULL,1,'2025-10-12 10:11:29.441823','2025-10-12 10:11:29.441829');
INSERT INTO users VALUES(6,'prof.davis@mit.edu','$2b$12$oCPtOfRwPnfE9Ro57syt7.deTdZ.Q6LZC46EJRoDnQdbZG1ScdHya','supervisor','Prof. David Davis',NULL,1,'2025-10-12 10:11:29.712908','2025-10-12 10:11:29.712915');
INSERT INTO users VALUES(7,'admin@skillbridge.com','$2b$12$9BTlHye7UWWvDr5Q/8qznO6dWieA4ko2bEcoGI.EKfr4Db4bCM3Ua','admin','Admin User',NULL,1,'2025-10-12 10:11:29.987489','2025-10-12 10:11:29.987495');
INSERT INTO users VALUES(8,'ahmedmubshar@gmail.com','$2b$12$NqWbO3B1Bu8/s4UReLGffeWyoL6LofHfDxQR/ggsXWc.AuVBwma2i','learner','Ahmad',NULL,1,'2025-10-12 14:19:24.806116','2025-10-12 14:19:24.806123');
CREATE TABLE learners (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	skills JSON, 
	bio TEXT, 
	portfolio_privacy VARCHAR(20), 
	phone VARCHAR(20), 
	location VARCHAR(100), 
	education JSON, 
	experience JSON, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
INSERT INTO learners VALUES(1,1,'["Python", "JavaScript", "React"]','Passionate about web development and learning new technologies.','public',NULL,'New York, USA','[{"degree": "BS Computer Science", "institution": "MIT", "year": "2022"}]',NULL);
INSERT INTO learners VALUES(2,2,'["Data Analysis", "SQL", "Python"]','Data enthusiast looking to gain practical experience.','public',NULL,'San Francisco, USA',NULL,NULL);
INSERT INTO learners VALUES(3,8,'["Full Stack Developer", "App developer"]','Software Engineer','public','03127574084','Lahore',NULL,NULL);
CREATE TABLE companies (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	company_name VARCHAR(200) NOT NULL, 
	industry VARCHAR(100), 
	description TEXT, 
	website VARCHAR(255), 
	location VARCHAR(100), 
	size VARCHAR(50), 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
INSERT INTO companies VALUES(1,3,'TechCorp Solutions','Software Development','Leading software development company specializing in web applications.','https://techcorp.example.com','San Francisco, CA','51-200');
INSERT INTO companies VALUES(2,4,'DataInc Analytics','Data Analytics','Data analytics firm helping businesses make data-driven decisions.','https://datainc.example.com','New York, NY','11-50');
CREATE TABLE supervisors (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	specialization VARCHAR(100), 
	affiliation VARCHAR(200), 
	bio TEXT, 
	expertise_areas JSON, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
INSERT INTO supervisors VALUES(1,5,'Computer Science','Stanford University','Professor of Computer Science with 15 years of teaching experience.','["Programming", "Web Development", "Data Structures"]');
INSERT INTO supervisors VALUES(2,6,'Data Science','MIT','Data Science expert passionate about teaching practical skills.','["Data Analysis", "Machine Learning", "Statistics"]');
CREATE TABLE notifications (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	type VARCHAR(50) NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	message TEXT NOT NULL, 
	link VARCHAR(255), 
	read BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);
INSERT INTO notifications VALUES(1,1,'system','Welcome to SkillBridge!','Start your learning journey by exploring our courses and tasks.','/learner/courses',0,'2025-10-12 10:11:30.026739');
INSERT INTO notifications VALUES(2,1,'course','New Course Available','Check out our new Full Stack Web Development course!','/learner/courses',0,'2025-10-12 10:11:30.026744');
INSERT INTO notifications VALUES(3,1,'task','New Tasks Posted','5 new tasks match your skills. Apply now!','/learner/tasks',0,'2025-10-12 10:11:30.026746');
INSERT INTO notifications VALUES(4,1,'task','Application Accepted!','Your application for Sales Data Analysis Dashboard has been accepted. Start working on it!','/learner/applications',0,'2025-10-12 10:11:30.027404');
CREATE TABLE messages (
	id INTEGER NOT NULL, 
	sender_id INTEGER NOT NULL, 
	receiver_id INTEGER NOT NULL, 
	subject VARCHAR(200), 
	content TEXT NOT NULL, 
	read BOOLEAN, 
	read_at DATETIME, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(sender_id) REFERENCES users (id), 
	FOREIGN KEY(receiver_id) REFERENCES users (id)
);
CREATE TABLE courses (
	id INTEGER NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	description TEXT NOT NULL, 
	category VARCHAR(50) NOT NULL, 
	difficulty VARCHAR(20) NOT NULL, 
	duration INTEGER, 
	thumbnail VARCHAR(255), 
	status VARCHAR(20), 
	prerequisites JSON, 
	learning_objectives JSON, 
	supervisor_id INTEGER NOT NULL, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(supervisor_id) REFERENCES supervisors (id)
);
INSERT INTO courses VALUES(1,'Full Stack Web Development','Learn to build modern web applications from scratch using React and Node.js. This comprehensive course covers frontend and backend development.','Programming','Intermediate',40,NULL,'published','[]','["Build responsive web interfaces with React", "Create RESTful APIs with Node.js", "Understand database design and integration", "Deploy applications to the cloud"]',1,'2025-10-12 10:11:29.994289','2025-10-12 10:11:29.994295');
INSERT INTO courses VALUES(2,'Data Analysis with Python','Master data analysis using Python, pandas, and visualization libraries. Perfect for aspiring data analysts.','Data Analysis','Beginner',30,NULL,'published','[]','["Clean and manipulate data with pandas", "Create stunning visualizations", "Perform statistical analysis", "Work with real-world datasets"]',2,'2025-10-12 10:11:29.995398','2025-10-12 10:11:29.995401');
INSERT INTO courses VALUES(3,'UX/UI Design Fundamentals','Learn the principles of user experience and interface design. Create beautiful, user-friendly designs.','UX/UI Design','Beginner',25,NULL,'published','[]','["Understand UX design principles", "Create wireframes and prototypes", "Design user interfaces in Figma", "Conduct user research"]',1,'2025-10-12 10:11:29.998564','2025-10-12 10:11:29.998572');
INSERT INTO courses VALUES(4,'Introduction to Cybersecurity','Learn the basics of cybersecurity, including network security, encryption, and ethical hacking.','Cybersecurity','Intermediate',35,NULL,'published','[]','["Understand security fundamentals", "Identify common vulnerabilities", "Implement security best practices", "Perform basic penetration testing"]',1,'2025-10-12 10:11:30.000496','2025-10-12 10:11:30.000501');
CREATE TABLE tasks (
	id INTEGER NOT NULL, 
	company_id INTEGER NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	description TEXT NOT NULL, 
	category VARCHAR(50) NOT NULL, 
	difficulty VARCHAR(20) NOT NULL, 
	skills_required JSON, 
	estimated_hours INTEGER, 
	deadline DATETIME, 
	status VARCHAR(20), 
	requirements TEXT, 
	deliverables TEXT, 
	max_applicants INTEGER, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(company_id) REFERENCES companies (id)
);
INSERT INTO tasks VALUES(1,1,'Build a Responsive Landing Page','Create a modern, responsive landing page for our new product using React and Tailwind CSS. The page should include a hero section, features section, and contact form.','Programming','Beginner','["HTML", "CSS", "React", "Tailwind CSS"]',15,'2025-11-11 10:11:30.004524','active','Must be responsive on all devices, follow our brand guidelines, and include animations.','GitHub repository with source code, deployed demo link, documentation.',5,'2025-10-12 10:11:30.006665','2025-10-12 10:11:30.006668');
INSERT INTO tasks VALUES(2,1,'API Integration Project','Integrate third-party payment API into our existing application. Need someone familiar with REST APIs and Node.js.','Programming','Intermediate','["Node.js", "JavaScript", "REST APIs", "Express"]',25,'2025-11-26 10:11:30.004669','active','Experience with payment gateways, secure coding practices, error handling.','Working integration, test cases, API documentation.',3,'2025-10-12 10:11:30.006669','2025-10-12 10:11:30.006670');
INSERT INTO tasks VALUES(3,2,'Sales Data Analysis Dashboard','Analyze our sales data from the past year and create an interactive dashboard with insights and visualizations.','Data Analysis','Intermediate','["Python", "Pandas", "Data Visualization", "SQL"]',20,'2025-11-02 10:11:30.004741','active','Experience with pandas, matplotlib/seaborn, ability to derive business insights.','Jupyter notebook with analysis, interactive dashboard, presentation of findings.',4,'2025-10-12 10:11:30.006672','2025-10-12 10:11:30.006673');
INSERT INTO tasks VALUES(4,2,'Customer Behavior Analysis','Study customer behavior patterns using our e-commerce data and provide actionable recommendations.','Data Analysis','Advanced','["Python", "Machine Learning", "Statistics", "SQL"]',30,'2025-12-11 10:11:30.004804','active','Strong statistical background, experience with customer analytics, ML knowledge.','Detailed report, predictive models, visualization dashboard.',2,'2025-10-12 10:11:30.006674','2025-10-12 10:11:30.006675');
INSERT INTO tasks VALUES(5,1,'Mobile App UI/UX Design','Design a modern, user-friendly interface for our mobile fitness tracking app.','UX/UI Design','Intermediate','["Figma", "UI Design", "UX Research", "Mobile Design"]',18,'2025-11-06 10:11:30.004867','active','Portfolio with mobile designs, proficiency in Figma, understanding of iOS/Android guidelines.','Figma design files, interactive prototype, design system documentation.',3,'2025-10-12 10:11:30.006676','2025-10-12 10:11:30.006677');
INSERT INTO tasks VALUES(6,2,'Security Audit Report','Conduct a security audit of our web application and provide a detailed report with recommendations.','Cybersecurity','Advanced','["Penetration Testing", "Security Auditing", "OWASP", "Network Security"]',35,'2025-11-21 10:11:30.004925','active','Certified in security (CEH/OSCP preferred), experience with security tools, ethical hacking skills.','Comprehensive security audit report, vulnerability assessment, remediation plan.',2,'2025-10-12 10:11:30.006678','2025-10-12 10:11:30.006679');
CREATE TABLE modules (
	id INTEGER NOT NULL, 
	course_id INTEGER NOT NULL, 
	title VARCHAR(200) NOT NULL, 
	description TEXT, 
	content_type VARCHAR(20) NOT NULL, 
	content_url VARCHAR(255), 
	content_data JSON, 
	"order" INTEGER NOT NULL, 
	duration INTEGER, 
	is_preview BOOLEAN, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(course_id) REFERENCES courses (id)
);
INSERT INTO modules VALUES(1,1,'Introduction to Web Development','Overview of modern web development technologies and tools','video','https://example.com/intro-video',NULL,1,30,1,'2025-10-12 10:11:29.996119');
INSERT INTO modules VALUES(2,1,'HTML & CSS Fundamentals','Learn the building blocks of web pages','video','https://example.com/html-css-video',NULL,2,45,0,'2025-10-12 10:11:29.996931');
INSERT INTO modules VALUES(3,1,'JavaScript Basics','Master JavaScript programming fundamentals','video','https://example.com/js-basics-video',NULL,3,60,0,'2025-10-12 10:11:29.996935');
INSERT INTO modules VALUES(4,1,'React Fundamentals','Build interactive UIs with React','video','https://example.com/react-video',NULL,4,90,0,'2025-10-12 10:11:29.996936');
INSERT INTO modules VALUES(5,1,'Backend with Node.js','Create server-side applications','video','https://example.com/nodejs-video',NULL,5,75,0,'2025-10-12 10:11:29.996937');
INSERT INTO modules VALUES(6,2,'Introduction to Data Analysis','What is data analysis and why it matters','video','https://example.com/data-intro',NULL,1,25,1,'2025-10-12 10:11:29.998996');
INSERT INTO modules VALUES(7,2,'Python for Data Analysis','Essential Python skills for data work','video','https://example.com/python-data',NULL,2,50,0,'2025-10-12 10:11:29.999186');
INSERT INTO modules VALUES(8,2,'Working with Pandas','Data manipulation with pandas library','video','https://example.com/pandas',NULL,3,60,0,'2025-10-12 10:11:29.999188');
INSERT INTO modules VALUES(9,2,'Data Visualization','Create charts and graphs with matplotlib and seaborn','video','https://example.com/viz',NULL,4,45,0,'2025-10-12 10:11:29.999190');
INSERT INTO modules VALUES(10,3,'Introduction to UX Design','Fundamentals of user experience','video','https://example.com/ux-intro',NULL,1,30,1,'2025-10-12 10:11:30.000712');
INSERT INTO modules VALUES(11,3,'User Research Methods','Learn how to understand your users','video','https://example.com/user-research',NULL,2,40,0,'2025-10-12 10:11:30.000894');
INSERT INTO modules VALUES(12,3,'Wireframing and Prototyping','Create low and high-fidelity prototypes','video','https://example.com/wireframes',NULL,3,50,0,'2025-10-12 10:11:30.000896');
INSERT INTO modules VALUES(13,3,'UI Design with Figma','Design beautiful interfaces','video','https://example.com/figma',NULL,4,60,0,'2025-10-12 10:11:30.000897');
INSERT INTO modules VALUES(14,4,'Cybersecurity Basics','Introduction to security concepts','video','https://example.com/security-basics',NULL,1,35,1,'2025-10-12 10:11:30.001523');
INSERT INTO modules VALUES(15,4,'Network Security','Securing network infrastructure','video','https://example.com/network-sec',NULL,2,55,0,'2025-10-12 10:11:30.001654');
INSERT INTO modules VALUES(16,4,'Encryption and Cryptography','Understanding encryption methods','video','https://example.com/crypto',NULL,3,45,0,'2025-10-12 10:11:30.001656');
CREATE TABLE enrollments (
	id INTEGER NOT NULL, 
	learner_id INTEGER NOT NULL, 
	course_id INTEGER NOT NULL, 
	status VARCHAR(20), 
	progress JSON, 
	completion_percentage FLOAT, 
	enrolled_at DATETIME, 
	completed_at DATETIME, 
	PRIMARY KEY (id), 
	CONSTRAINT unique_enrollment UNIQUE (learner_id, course_id), 
	FOREIGN KEY(learner_id) REFERENCES learners (id), 
	FOREIGN KEY(course_id) REFERENCES courses (id)
);
INSERT INTO enrollments VALUES(1,1,1,'active','{}',0.0,'2025-10-12 10:11:30.013108',NULL);
INSERT INTO enrollments VALUES(2,1,2,'active','{}',0.0,'2025-10-12 10:11:30.017454',NULL);
INSERT INTO enrollments VALUES(3,1,3,'active','{}',0.0,'2025-10-12 10:11:30.017460',NULL);
INSERT INTO enrollments VALUES(4,3,1,'active','{}',0.0,'2025-10-12 14:20:18.712311',NULL);
CREATE TABLE applications (
	id INTEGER NOT NULL, 
	task_id INTEGER NOT NULL, 
	learner_id INTEGER NOT NULL, 
	status VARCHAR(20), 
	cover_letter TEXT, 
	submission_url VARCHAR(255), 
	submission_files JSON, 
	submission_notes TEXT, 
	applied_at DATETIME, 
	accepted_at DATETIME, 
	submitted_at DATETIME, 
	completed_at DATETIME, 
	PRIMARY KEY (id), 
	CONSTRAINT unique_application UNIQUE (learner_id, task_id), 
	FOREIGN KEY(task_id) REFERENCES tasks (id), 
	FOREIGN KEY(learner_id) REFERENCES learners (id)
);
INSERT INTO applications VALUES(1,1,1,'pending','I am excited to work on this landing page project. I have 2 years of experience with React and Tailwind CSS, and have built several responsive websites. I can start immediately and deliver within the deadline.',NULL,'[]',NULL,'2025-10-12 10:11:30.022555',NULL,NULL,NULL);
INSERT INTO applications VALUES(2,3,1,'accepted','I have strong experience in data analysis using Python and Pandas. I have worked on similar sales analysis projects and can provide valuable insights from your data.',NULL,'[]',NULL,'2025-10-12 10:11:30.022558',NULL,NULL,NULL);
INSERT INTO applications VALUES(3,2,1,'submitted','I have integrated payment APIs in multiple projects using Node.js. I am familiar with Stripe and PayPal integrations.','https://github.com/learner/payment-integration','[]','Implemented secure payment integration with Stripe API. All test cases are passing. Documentation included in the README.','2025-10-12 10:11:30.022560',NULL,'2025-10-10 10:11:30.021281',NULL);
INSERT INTO applications VALUES(4,5,1,'completed','I am a UX/UI designer with 3 years of experience. I have designed multiple mobile apps and have a strong portfolio.','https://www.figma.com/file/mobile-fitness-app','[]','Complete UI/UX design for the fitness tracking app with interactive prototype.','2025-10-12 10:11:30.022561',NULL,'2025-10-02 10:11:30.021349',NULL);
INSERT INTO applications VALUES(5,4,1,'in_progress','I have a background in statistics and machine learning. I can analyze customer behavior and provide actionable recommendations.',NULL,'[]',NULL,'2025-10-12 10:11:30.022563',NULL,NULL,NULL);
INSERT INTO applications VALUES(6,1,3,'pending','Ajdbcjbnc',NULL,'[]',NULL,'2025-10-12 14:20:43.670073',NULL,NULL,NULL);
CREATE TABLE certificates (
	id INTEGER NOT NULL, 
	learner_id INTEGER NOT NULL, 
	course_id INTEGER NOT NULL, 
	verification_code VARCHAR(100) NOT NULL, 
	certificate_url VARCHAR(255), 
	issued_at DATETIME, 
	PRIMARY KEY (id), 
	CONSTRAINT unique_certificate UNIQUE (learner_id, course_id), 
	FOREIGN KEY(learner_id) REFERENCES learners (id), 
	FOREIGN KEY(course_id) REFERENCES courses (id), 
	UNIQUE (verification_code)
);
CREATE TABLE evaluations (
	id INTEGER NOT NULL, 
	application_id INTEGER NOT NULL, 
	evaluator_id INTEGER, 
	rating FLOAT NOT NULL, 
	feedback TEXT, 
	strengths TEXT, 
	improvements TEXT, 
	is_outstanding BOOLEAN, 
	evaluated_at DATETIME, 
	PRIMARY KEY (id), 
	UNIQUE (application_id), 
	FOREIGN KEY(application_id) REFERENCES applications (id), 
	FOREIGN KEY(evaluator_id) REFERENCES supervisors (id)
);
CREATE UNIQUE INDEX ix_users_email ON users (email);
COMMIT;
