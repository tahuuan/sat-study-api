-- =============================================
-- SAT STUDY API - DATABASE CREATION SCRIPT
-- =============================================
-- PART 1: CREATE DATABASE (3.5 points)
-- This script creates a complete database with all constraints and sample data
-- =============================================

USE master;

-- Drop database if exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'sat_study_db')
BEGIN
    ALTER DATABASE sat_study_db SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE sat_study_db;
END

-- Create new database
CREATE DATABASE sat_study_db;

USE sat_study_db;

-- =============================================
-- I. CREATE TABLES (2 points)
-- =============================================

-- Table 1: user_activity
-- Description: Tracks user learning activity and streaks
CREATE TABLE user_activity (
    user_id UNIQUEIDENTIFIER NOT NULL,
    recent_date DATE NULL,
    active_second INT NULL DEFAULT 0,
    streak INT NULL DEFAULT 0,
    CONSTRAINT PK_user_activity PRIMARY KEY (user_id)
);

-- Table 2: user_settings
-- Description: User preferences and score goals
-- Constraints: CHECK constraints for score ranges (200-800)
CREATE TABLE user_settings (
    user_id UNIQUEIDENTIFIER NOT NULL,
    math_score_goal INT NULL,
    rd_wt_score_goal INT NULL,
    next_test_date DATE NULL,
    CONSTRAINT PK_user_settings PRIMARY KEY (user_id),
    -- Row-based CHECK constraints: Score must be between 200 and 800
    CONSTRAINT CHK_math_score_goal_range CHECK (math_score_goal IS NULL OR (math_score_goal >= 200 AND math_score_goal <= 800)),
    CONSTRAINT CHK_rd_wt_score_goal_range CHECK (rd_wt_score_goal IS NULL OR (rd_wt_score_goal >= 200 AND rd_wt_score_goal <= 800))
);

-- Table 3: subscription
-- Description: Subscription plans with auto-increment prefix (SUB0001, SUB0002,...)
-- Constraints: Primary key with prefix, CHECK constraint for enum values
CREATE TABLE subscription (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    sequence_id INT NOT NULL IDENTITY(1,1),
    subscription_code AS ('SUB' + RIGHT('0000' + CAST(sequence_id AS VARCHAR), 4)) PERSISTED NOT NULL,
    description TEXT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NULL CHECK (type IN ('free', 'basic', 'premium', 'premium_plus')),
    is_active BIT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NULL,
    duration INT NULL,
    CONSTRAINT PK_subscription PRIMARY KEY (id),
    CONSTRAINT UQ_subscription_code UNIQUE (subscription_code)
);

-- Table 4: user
-- Description: Main user table with auto-increment primary key
-- Constraints: UNIQUE email, CHECK constraints for enum values
CREATE TABLE [user] (
    user_id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(255) NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'ANONYMOUS')),
    password VARCHAR(255) NULL,
    role VARCHAR(255) NULL CHECK (role IN ('STUDENT', 'TUTOR', 'ADMIN')),
    rd_wt_score INT NULL,
    math_score INT NULL,
    phone_number VARCHAR(20) NULL,
    total_score INT NULL,
    certification VARCHAR(255) NULL,
    specialty VARCHAR(255) NULL,
    CONSTRAINT PK_user PRIMARY KEY (user_id),
    CONSTRAINT UQ_user_email UNIQUE (email)
);

-- Table 5: user_subscription_map
-- Description: Many-to-many relationship between users and subscriptions
CREATE TABLE user_subscription_map (
    user_id UNIQUEIDENTIFIER NOT NULL,
    subscription_id UNIQUEIDENTIFIER NOT NULL,
    status VARCHAR(50) NULL,
    payment_link VARCHAR(500) NULL,
    cancelled_at DATETIME2 NULL,
    cancel_reason TEXT NULL,
    CONSTRAINT PK_user_subscription_map PRIMARY KEY (user_id, subscription_id)
);

-- Table 6: chapter
-- Description: Learning chapters (Math or Reading & Writing)
CREATE TABLE chapter (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type VARCHAR(255) NULL CHECK (type IN ('math', 'reading_and_writing')),
    [order] INT NULL,
    CONSTRAINT PK_chapter PRIMARY KEY (id)
);

-- Table 7: lesson
-- Description: Individual lessons within chapters
CREATE TABLE lesson (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    title VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255) NULL,
    previous_lesson_id UNIQUEIDENTIFIER NULL,
    next_lesson_id UNIQUEIDENTIFIER NULL,
    chapter_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT PK_lesson PRIMARY KEY (id),
    CONSTRAINT UQ_lesson_previous UNIQUE (previous_lesson_id),
    CONSTRAINT UQ_lesson_next UNIQUE (next_lesson_id)
);

-- Table 8: lesson_content
-- Description: Content blocks within lessons
CREATE TABLE lesson_content (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    content TEXT NULL,
    type VARCHAR(255) NULL CHECK (type IN ('doc', 'text', 'inline_math')),
    content_parent_id UNIQUEIDENTIFIER NULL,
    lesson_id UNIQUEIDENTIFIER NOT NULL,
    [order] INT NULL,
    CONSTRAINT PK_lesson_content PRIMARY KEY (id)
);

-- Table 9: user_note
-- Description: User notes on lesson content
CREATE TABLE user_note (
    lesson_content_id UNIQUEIDENTIFIER NOT NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    content TEXT NULL,
    color VARCHAR(50) NULL,
    CONSTRAINT PK_user_note PRIMARY KEY (lesson_content_id, user_id)
);

-- Table 10: mission_task
-- Description: Learning missions for users
CREATE TABLE mission_task (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    able_to_ignored BIT NOT NULL DEFAULT 0,
    phase VARCHAR(100) NULL,
    [order] INT NULL,
    CONSTRAINT PK_mission_task PRIMARY KEY (id)
);

-- Table 11: mission_task_item
-- Description: Individual items within mission tasks
CREATE TABLE mission_task_item (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    able_to_ignored BIT NOT NULL DEFAULT 0,
    type VARCHAR(255) NOT NULL CHECK (type IN ('read_lesson', 'take_quizz', 'take_chapter_test', 'review', 'test_assessment')),
    content TEXT NULL,
    title VARCHAR(255) NULL,
    chapter_id UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_mission_task_item PRIMARY KEY (id)
);

-- Table 12: mission_task_mission_item_map
-- Description: Many-to-many mapping between mission tasks and items
CREATE TABLE mission_task_mission_item_map (
    mission_task_id UNIQUEIDENTIFIER NOT NULL,
    mission_task_item_id UNIQUEIDENTIFIER NOT NULL,
    [order] INT NULL,
    CONSTRAINT PK_mission_task_mission_item_map PRIMARY KEY (mission_task_id, mission_task_item_id)
);

-- Table 13: user_mission_task_item
-- Description: Tracks user progress on mission task items
CREATE TABLE user_mission_task_item (
    user_id UNIQUEIDENTIFIER NOT NULL,
    mission_task_item_id UNIQUEIDENTIFIER NOT NULL,
    is_completed BIT NOT NULL DEFAULT 0,
    CONSTRAINT PK_user_mission_task_item PRIMARY KEY (user_id, mission_task_item_id)
);

-- Table 14: image
-- Description: Image storage for questions
CREATE TABLE image (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    data TEXT NULL,
    width INT NULL,
    height INT NULL,
    checksum VARCHAR(255) NULL,
    CONSTRAINT PK_image PRIMARY KEY (id)
);

-- Table 15: question
-- Description: Test questions
CREATE TABLE question (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'in_review' CHECK (status IN ('in_review', 'approved', 'rejected', 'considering')),
    question_text TEXT NULL,
    correct_answer VARCHAR(255) NULL,
    difficulty VARCHAR(255) NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT NULL,
    kind VARCHAR(255) NOT NULL DEFAULT 'multiple_choice' CHECK (kind IN ('multiple_choice', 'free_response')),
    type VARCHAR(255) NULL CHECK (type IN ('math', 'reading_and_writing')),
    tutor_id UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_question PRIMARY KEY (id)
);

-- Table 16: question_option
-- Description: Multiple choice options for questions
CREATE TABLE question_option (
    question_id UNIQUEIDENTIFIER NOT NULL,
    value VARCHAR(10) NULL,
    name_option VARCHAR(500) NOT NULL,
    CONSTRAINT PK_question_option PRIMARY KEY (name_option),
    CONSTRAINT UQ_question_option UNIQUE (question_id, name_option)
);

-- Table 17: question_image
-- Description: Many-to-many relationship between questions and images
CREATE TABLE question_image (
    image_id UNIQUEIDENTIFIER NOT NULL,
    question_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT PK_question_image PRIMARY KEY (image_id, question_id)
);

-- Table 18: test_template
-- Description: Test templates with auto-increment prefix (TPL0001, TPL0002,...)
CREATE TABLE test_template (
    test_template_id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    sequence_id INT NOT NULL IDENTITY(1,1),
    template_code AS ('TPL' + RIGHT('0000' + CAST(sequence_id AS VARCHAR), 4)) PERSISTED NOT NULL,
    is_public BIT NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    topic VARCHAR(255) NULL,
    test_type VARCHAR(255) NULL CHECK (test_type IN ('diagnostic', 'custom', 'chapter_test', 'quizz')),
    content_tier VARCHAR(100) NULL,
    CONSTRAINT PK_test_template PRIMARY KEY (test_template_id),
    CONSTRAINT UQ_template_code UNIQUE (template_code)
);

-- Table 19: test_template_module
-- Description: Modules within test templates
CREATE TABLE test_template_module (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    difficulty VARCHAR(255) NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    name VARCHAR(255) NULL,
    type VARCHAR(100) NULL,
    total_question INT NULL,
    time_limit_second INT NULL,
    test_template_id UNIQUEIDENTIFIER NULL,
    chapter_id UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_test_template_module PRIMARY KEY (id)
);

-- Table 20: test_template_question
-- Description: Questions within test template modules
CREATE TABLE test_template_question (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    test_template_module_id UNIQUEIDENTIFIER NOT NULL,
    question_id UNIQUEIDENTIFIER NOT NULL,
    [order] INT NULL,
    CONSTRAINT PK_test_template_question PRIMARY KEY (id)
);

-- Table 21: test_session
-- Description: User test sessions
-- Constraints: CHECK constraint for datetime ordering (started_at <= paused_at <= completed_at)
CREATE TABLE test_session (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    user_id UNIQUEIDENTIFIER NOT NULL,
    test_type VARCHAR(255) NULL CHECK (test_type IN ('diagnostic', 'custom', 'chapter_test', 'quizz')),
    test_name VARCHAR(255) NULL,
    total_question INT NULL,
    time_limit_second INT NULL,
    status VARCHAR(255) NULL CHECK (status IN ('not_started', 'in_progress', 'paused', 'completed', 'abandoned')),
    current_question_index INT NULL,
    number_question_answered INT NULL,
    started_at DATETIME2 NULL,
    paused_at DATETIME2 NULL,
    completed_at DATETIME2 NULL,
    reference_type VARCHAR(255) NULL CHECK (reference_type IN ('template_module', 'template')),
    reference_id UNIQUEIDENTIFIER NULL,
    number_question_correct INT NULL,
    CONSTRAINT PK_test_session PRIMARY KEY (id),
    -- Row-based CHECK constraint: datetime ordering
    CONSTRAINT CHK_test_session_datetime_order CHECK (
        (started_at IS NULL OR paused_at IS NULL OR started_at <= paused_at) AND
        (started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at) AND
        (paused_at IS NULL OR completed_at IS NULL OR paused_at <= completed_at)
    )
);

-- Table 22: test_session_question
-- Description: Questions within test sessions
CREATE TABLE test_session_question (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    question_id UNIQUEIDENTIFIER NOT NULL,
    answered_at DATETIME2 NULL,
    time_spent INT NULL,
    is_correct BIT NULL,
    [order] INT NULL,
    is_answered BIT NOT NULL DEFAULT 0,
    is_flagged BIT NOT NULL DEFAULT 0,
    answer VARCHAR(255) NULL,
    test_session_id UNIQUEIDENTIFIER NULL,
    CONSTRAINT PK_test_session_question PRIMARY KEY (id)
);

-- =============================================
-- ADD FOREIGN KEY CONSTRAINTS
-- =============================================

-- User activity -> User
ALTER TABLE user_activity 
ADD CONSTRAINT FK_user_activity_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- User settings -> User
ALTER TABLE user_settings 
ADD CONSTRAINT FK_user_settings_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- User subscription map -> User
ALTER TABLE user_subscription_map 
ADD CONSTRAINT FK_user_subscription_map_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- User subscription map -> Subscription
ALTER TABLE user_subscription_map 
ADD CONSTRAINT FK_user_subscription_map_subscription 
FOREIGN KEY (subscription_id) REFERENCES subscription(id);

-- User note -> Lesson content
ALTER TABLE user_note 
ADD CONSTRAINT FK_user_note_lesson_content 
FOREIGN KEY (lesson_content_id) REFERENCES lesson_content(id);

-- User note -> User
ALTER TABLE user_note 
ADD CONSTRAINT FK_user_note_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- Lesson content -> Lesson
ALTER TABLE lesson_content 
ADD CONSTRAINT FK_lesson_content_lesson 
FOREIGN KEY (lesson_id) REFERENCES lesson(id);

-- Lesson -> Lesson (previous)
ALTER TABLE lesson 
ADD CONSTRAINT FK_lesson_previous_lesson 
FOREIGN KEY (previous_lesson_id) REFERENCES lesson(id);

-- Lesson -> Lesson (next)
ALTER TABLE lesson 
ADD CONSTRAINT FK_lesson_next_lesson 
FOREIGN KEY (next_lesson_id) REFERENCES lesson(id);

-- Lesson -> Chapter
ALTER TABLE lesson 
ADD CONSTRAINT FK_lesson_chapter 
FOREIGN KEY (chapter_id) REFERENCES chapter(id);

-- Mission task mission item map -> Mission task
ALTER TABLE mission_task_mission_item_map 
ADD CONSTRAINT FK_mission_task_mission_item_map_mission_task 
FOREIGN KEY (mission_task_id) REFERENCES mission_task(id);

-- Mission task mission item map -> Mission task item
ALTER TABLE mission_task_mission_item_map 
ADD CONSTRAINT FK_mission_task_mission_item_map_mission_task_item 
FOREIGN KEY (mission_task_item_id) REFERENCES mission_task_item(id);

-- User mission task item -> User
ALTER TABLE user_mission_task_item 
ADD CONSTRAINT FK_user_mission_task_item_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- User mission task item -> Mission task item
ALTER TABLE user_mission_task_item 
ADD CONSTRAINT FK_user_mission_task_item_mission_task_item 
FOREIGN KEY (mission_task_item_id) REFERENCES mission_task_item(id);

-- Mission task item -> Chapter
ALTER TABLE mission_task_item 
ADD CONSTRAINT FK_mission_task_item_chapter 
FOREIGN KEY (chapter_id) REFERENCES chapter(id);

-- Question image -> Image
ALTER TABLE question_image 
ADD CONSTRAINT FK_question_image_image 
FOREIGN KEY (image_id) REFERENCES image(id);

-- Question image -> Question
ALTER TABLE question_image 
ADD CONSTRAINT FK_question_image_question 
FOREIGN KEY (question_id) REFERENCES question(id);

-- Question option -> Question
ALTER TABLE question_option 
ADD CONSTRAINT FK_question_option_question 
FOREIGN KEY (question_id) REFERENCES question(id);

-- Test session -> User
ALTER TABLE test_session 
ADD CONSTRAINT FK_test_session_user 
FOREIGN KEY (user_id) REFERENCES [user](user_id);

-- Test session question -> Test session
ALTER TABLE test_session_question 
ADD CONSTRAINT FK_test_session_question_test_session 
FOREIGN KEY (test_session_id) REFERENCES test_session(id);

-- Test session question -> Question
ALTER TABLE test_session_question 
ADD CONSTRAINT FK_test_session_question_question 
FOREIGN KEY (question_id) REFERENCES question(id);

-- Question -> User (tutor)
ALTER TABLE question 
ADD CONSTRAINT FK_question_tutor 
FOREIGN KEY (tutor_id) REFERENCES [user](user_id);

-- Test template question -> Test template module
ALTER TABLE test_template_question 
ADD CONSTRAINT FK_test_template_question_test_template_module 
FOREIGN KEY (test_template_module_id) REFERENCES test_template_module(id);

-- Test template question -> Question
ALTER TABLE test_template_question 
ADD CONSTRAINT FK_test_template_question_question 
FOREIGN KEY (question_id) REFERENCES question(id);

-- Test template module -> Test template
ALTER TABLE test_template_module 
ADD CONSTRAINT FK_test_template_module_test_template 
FOREIGN KEY (test_template_id) REFERENCES test_template(test_template_id);

-- Test template module -> Chapter
ALTER TABLE test_template_module 
ADD CONSTRAINT FK_test_template_module_chapter 
FOREIGN KEY (chapter_id) REFERENCES chapter(id);

-- =============================================
-- II. INSERT DATA (1.5 points)
-- =============================================

-- Insert Users (5 records)
DECLARE @student1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @student2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @student3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @tutor1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @admin1_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO [user] (user_id, first_name, last_name, email, status, password, role, rd_wt_score, math_score, total_score, phone_number)
VALUES 
    (@student1_id, 'John', 'Smith', 'john.smith@email.com', 'ACTIVE', 'hashed_password_1', 'STUDENT', 650, 700, 1350, '0901234567'),
    (@student2_id, 'Emma', 'Johnson', 'emma.johnson@email.com', 'ACTIVE', 'hashed_password_2', 'STUDENT', 600, 620, 1220, '0912345678'),
    (@student3_id, 'Michael', 'Brown', 'michael.brown@email.com', 'ACTIVE', 'hashed_password_3', 'STUDENT', 550, 580, 1130, '0923456789'),
    (@tutor1_id, 'Sarah', 'Williams', 'sarah.williams@email.com', 'ACTIVE', 'hashed_password_4', 'TUTOR', 750, 780, 1530, '0934567890'),
    (@admin1_id, 'David', 'Jones', 'david.jones@email.com', 'ACTIVE', 'hashed_password_5', 'ADMIN', NULL, NULL, NULL, '0945678901');

-- Insert User Activity (4 records)
INSERT INTO user_activity (user_id, recent_date, active_second, streak)
SELECT user_id, CAST(GETDATE() AS DATE), 3600, 7 FROM [user] WHERE email = 'john.smith@email.com'
UNION ALL
SELECT user_id, CAST(GETDATE() AS DATE), 2400, 5 FROM [user] WHERE email = 'emma.johnson@email.com'
UNION ALL
SELECT user_id, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), 1800, 3 FROM [user] WHERE email = 'michael.brown@email.com'
UNION ALL
SELECT user_id, CAST(GETDATE() AS DATE), 5400, 15 FROM [user] WHERE email = 'sarah.williams@email.com';

-- Insert User Settings (4 records)
INSERT INTO user_settings (user_id, math_score_goal, rd_wt_score_goal, next_test_date)
SELECT user_id, 750, 700, CAST(DATEADD(DAY, 30, GETDATE()) AS DATE) FROM [user] WHERE email = 'john.smith@email.com'
UNION ALL
SELECT user_id, 700, 680, CAST(DATEADD(DAY, 45, GETDATE()) AS DATE) FROM [user] WHERE email = 'emma.johnson@email.com'
UNION ALL
SELECT user_id, 650, 650, CAST(DATEADD(DAY, 60, GETDATE()) AS DATE) FROM [user] WHERE email = 'michael.brown@email.com'
UNION ALL
SELECT user_id, 800, 800, NULL FROM [user] WHERE email = 'sarah.williams@email.com';

-- Insert Subscriptions (4 records - will generate SUB0001, SUB0002, SUB0003, SUB0004)
INSERT INTO subscription (name, description, type, is_active, price, duration)
VALUES 
    ('Free Plan', 'Basic access to SAT preparation materials', 'free', 1, 0.00, NULL),
    ('Basic Plan', 'Standard access with practice tests', 'basic', 1, 29.99, 30),
    ('Premium Plan', 'Full access with personalized learning', 'premium', 1, 49.99, 30),
    ('Premium Plus', 'Ultimate access with 1-on-1 tutoring', 'premium_plus', 1, 99.99, 30);

-- Insert User Subscription Map (5 records)
DECLARE @sub_free_id UNIQUEIDENTIFIER, @sub_basic_id UNIQUEIDENTIFIER, @sub_premium_id UNIQUEIDENTIFIER;
SELECT @sub_free_id = id FROM subscription WHERE type = 'free';
SELECT @sub_basic_id = id FROM subscription WHERE type = 'basic';
SELECT @sub_premium_id = id FROM subscription WHERE type = 'premium';

INSERT INTO user_subscription_map (user_id, subscription_id, status, payment_link)
SELECT user_id, @sub_premium_id, 'active', 'https://payment.example.com/12345' FROM [user] WHERE email = 'john.smith@email.com'
UNION ALL
SELECT user_id, @sub_basic_id, 'active', 'https://payment.example.com/12346' FROM [user] WHERE email = 'emma.johnson@email.com'
UNION ALL
SELECT user_id, @sub_free_id, 'active', NULL FROM [user] WHERE email = 'michael.brown@email.com'
UNION ALL
SELECT user_id, @sub_premium_id, 'active', 'https://payment.example.com/12347' FROM [user] WHERE email = 'sarah.williams@email.com'
UNION ALL
SELECT user_id, @sub_free_id, 'active', NULL FROM [user] WHERE email = 'david.jones@email.com';

-- Insert Chapters (6 records)
DECLARE @chapter_math_algebra UNIQUEIDENTIFIER = NEWID();
DECLARE @chapter_math_geometry UNIQUEIDENTIFIER = NEWID();
DECLARE @chapter_math_stats UNIQUEIDENTIFIER = NEWID();
DECLARE @chapter_rw_grammar UNIQUEIDENTIFIER = NEWID();
DECLARE @chapter_rw_reading UNIQUEIDENTIFIER = NEWID();
DECLARE @chapter_rw_vocab UNIQUEIDENTIFIER = NEWID();

INSERT INTO chapter (id, title, description, type, [order])
VALUES 
    (@chapter_math_algebra, 'Algebra Fundamentals', 'Basic algebra concepts and equations', 'math', 1),
    (@chapter_math_geometry, 'Geometry Basics', 'Fundamental geometry principles', 'math', 2),
    (@chapter_math_stats, 'Statistics and Probability', 'Data analysis and probability concepts', 'math', 3),
    (@chapter_rw_grammar, 'Grammar and Usage', 'English grammar rules and conventions', 'reading_and_writing', 1),
    (@chapter_rw_reading, 'Reading Comprehension', 'Text analysis and comprehension strategies', 'reading_and_writing', 2),
    (@chapter_rw_vocab, 'Vocabulary in Context', 'Advanced vocabulary and word usage', 'reading_and_writing', 3);

-- Insert Lessons (8 records)
DECLARE @lesson1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson4_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson5_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson6_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson7_id UNIQUEIDENTIFIER = NEWID();
DECLARE @lesson8_id UNIQUEIDENTIFIER = NEWID();

DECLARE @chapter_math_algebra_id UNIQUEIDENTIFIER, @chapter_math_geometry_id UNIQUEIDENTIFIER;
DECLARE @chapter_rw_grammar_id UNIQUEIDENTIFIER, @chapter_rw_reading_id UNIQUEIDENTIFIER;
SELECT @chapter_math_algebra_id = id FROM chapter WHERE title = 'Algebra Fundamentals';
SELECT @chapter_math_geometry_id = id FROM chapter WHERE title = 'Geometry Basics';
SELECT @chapter_rw_grammar_id = id FROM chapter WHERE title = 'Grammar and Usage';
SELECT @chapter_rw_reading_id = id FROM chapter WHERE title = 'Reading Comprehension';

INSERT INTO lesson (id, title, sub_title, chapter_id, previous_lesson_id, next_lesson_id)
VALUES 
    (@lesson1_id, 'Linear Equations', 'Solving one-variable equations', @chapter_math_algebra_id, NULL, @lesson2_id),
    (@lesson2_id, 'Systems of Equations', 'Solving multiple equations simultaneously', @chapter_math_algebra_id, @lesson1_id, NULL),
    (@lesson3_id, 'Triangles and Angles', 'Properties of triangles', @chapter_math_geometry_id, NULL, @lesson4_id),
    (@lesson4_id, 'Circles and Arcs', 'Circle geometry fundamentals', @chapter_math_geometry_id, @lesson3_id, NULL),
    (@lesson5_id, 'Subject-Verb Agreement', 'Matching subjects with verbs', @chapter_rw_grammar_id, NULL, @lesson6_id),
    (@lesson6_id, 'Pronoun Usage', 'Correct pronoun reference', @chapter_rw_grammar_id, @lesson5_id, NULL),
    (@lesson7_id, 'Main Idea Identification', 'Finding central themes', @chapter_rw_reading_id, NULL, @lesson8_id),
    (@lesson8_id, 'Inference Skills', 'Drawing conclusions from text', @chapter_rw_reading_id, @lesson7_id, NULL);

-- Insert Lesson Content (12 records)
DECLARE @lesson1_id_var UNIQUEIDENTIFIER, @lesson2_id_var UNIQUEIDENTIFIER, @lesson3_id_var UNIQUEIDENTIFIER;
SELECT @lesson1_id_var = id FROM lesson WHERE title = 'Linear Equations';
SELECT @lesson2_id_var = id FROM lesson WHERE title = 'Systems of Equations';
SELECT @lesson3_id_var = id FROM lesson WHERE title = 'Triangles and Angles';

INSERT INTO lesson_content (content, type, lesson_id, [order])
VALUES 
    ('A linear equation is an algebraic equation in which each term is either a constant or the product of a constant and a single variable.', 'text', @lesson1_id_var, 1),
    ('To solve for x: 2x + 5 = 15, subtract 5 from both sides, then divide by 2.', 'text', @lesson1_id_var, 2),
    ('x = \frac{15-5}{2} = 5', 'inline_math', @lesson1_id_var, 3),
    ('A system of equations is a collection of two or more equations with the same set of variables.', 'text', @lesson2_id_var, 1),
    ('Methods include substitution, elimination, and graphing.', 'text', @lesson2_id_var, 2),
    ('Example: x + y = 10 and 2x - y = 5', 'inline_math', @lesson2_id_var, 3),
    ('The sum of angles in a triangle always equals 180 degrees.', 'text', @lesson3_id_var, 1),
    ('Types of triangles: equilateral, isosceles, and scalene.', 'text', @lesson3_id_var, 2),
    ('Pythagorean theorem: a^2 + b^2 = c^2', 'inline_math', @lesson3_id_var, 3),
    ('Triangle inequality theorem states that the sum of any two sides must be greater than the third side.', 'text', @lesson3_id_var, 4);

-- Insert Mission Tasks (4 records)
DECLARE @mission1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mission2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mission3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mission4_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO mission_task (id, title, description, able_to_ignored, phase, [order])
VALUES 
    (@mission1_id, 'Getting Started', 'Complete your first assessment test', 0, 'onboarding', 1),
    (@mission2_id, 'Master Algebra', 'Complete all algebra lessons and tests', 0, 'learning', 2),
    (@mission3_id, 'Grammar Guru', 'Achieve 90% accuracy in grammar exercises', 0, 'learning', 3),
    (@mission4_id, 'Practice Makes Perfect', 'Take 10 practice tests', 1, 'practice', 4);

-- Insert Mission Task Items (6 records)
DECLARE @mti1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mti2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mti3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mti4_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mti5_id UNIQUEIDENTIFIER = NEWID();
DECLARE @mti6_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO mission_task_item (id, able_to_ignored, type, content, title, chapter_id)
VALUES 
    (@mti1_id, 0, 'test_assessment', 'Take diagnostic test to assess your current level', 'Diagnostic Test', NULL),
    (@mti2_id, 0, 'read_lesson', 'Read all lessons in Algebra Fundamentals', 'Study Algebra', @chapter_math_algebra_id),
    (@mti3_id, 0, 'take_chapter_test', 'Complete algebra chapter test', 'Algebra Test', @chapter_math_algebra_id),
    (@mti4_id, 0, 'read_lesson', 'Study grammar rules', 'Grammar Lessons', @chapter_rw_grammar_id),
    (@mti5_id, 0, 'take_quizz', 'Complete grammar quiz', 'Grammar Quiz', @chapter_rw_grammar_id),
    (@mti6_id, 1, 'review', 'Review your mistakes', 'Mistake Review', NULL);

-- Insert Mission Task Mission Item Map (8 records)
INSERT INTO mission_task_mission_item_map (mission_task_id, mission_task_item_id, [order])
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Getting Started'),
    (SELECT id FROM mission_task_item WHERE title = 'Diagnostic Test'),
    1
UNION ALL
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Master Algebra'),
    (SELECT id FROM mission_task_item WHERE title = 'Study Algebra'),
    1
UNION ALL
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Master Algebra'),
    (SELECT id FROM mission_task_item WHERE title = 'Algebra Test'),
    2
UNION ALL
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Grammar Guru'),
    (SELECT id FROM mission_task_item WHERE title = 'Grammar Lessons'),
    1
UNION ALL
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Grammar Guru'),
    (SELECT id FROM mission_task_item WHERE title = 'Grammar Quiz'),
    2
UNION ALL
SELECT 
    (SELECT id FROM mission_task WHERE title = 'Practice Makes Perfect'),
    (SELECT id FROM mission_task_item WHERE title = 'Mistake Review'),
    1;

-- Insert Questions (8 records)
DECLARE @q1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q4_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q5_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q6_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q7_id UNIQUEIDENTIFIER = NEWID();
DECLARE @q8_id UNIQUEIDENTIFIER = NEWID();

DECLARE @tutor_id UNIQUEIDENTIFIER;
SELECT @tutor_id = user_id FROM [user] WHERE role = 'TUTOR';

INSERT INTO question (id, status, question_text, correct_answer, difficulty, explanation, kind, type, tutor_id)
VALUES 
    (@q1_id, 'approved', 'If 3x + 7 = 22, what is the value of x?', 'C', 'easy', 'Subtract 7 from both sides: 3x = 15. Then divide by 3: x = 5.', 'multiple_choice', 'math', @tutor_id),
    (@q2_id, 'approved', 'What is the area of a circle with radius 5?', 'B', 'medium', 'Use formula A = πr². A = π(5)² = 25π ≈ 78.54', 'multiple_choice', 'math', @tutor_id),
    (@q3_id, 'approved', 'Solve the system: x + y = 8 and x - y = 2', 'A', 'medium', 'Add equations: 2x = 10, so x = 5. Then y = 3.', 'multiple_choice', 'math', @tutor_id),
    (@q4_id, 'approved', 'In a right triangle, if one leg is 3 and hypotenuse is 5, what is the other leg?', 'D', 'easy', 'Use Pythagorean theorem: 3² + b² = 5², so b² = 16, b = 4', 'multiple_choice', 'math', @tutor_id),
    (@q5_id, 'approved', 'Choose the correct verb: The team (is/are) playing well.', 'A', 'easy', 'Team is a collective noun treated as singular, so use "is".', 'multiple_choice', 'reading_and_writing', @tutor_id),
    (@q6_id, 'approved', 'Which pronoun correctly completes: Each student must bring ___ own laptop?', 'C', 'medium', '"Each student" is singular, so use "his or her" (or "their" in modern usage).', 'multiple_choice', 'reading_and_writing', @tutor_id),
    (@q7_id, 'approved', 'What is the main idea of a passage about climate change effects?', 'B', 'medium', 'The passage discusses various impacts of climate change on ecosystems.', 'multiple_choice', 'reading_and_writing', @tutor_id),
    (@q8_id, 'approved', 'Based on the context, what does "inevitable" most nearly mean?', 'A', 'easy', 'Inevitable means unavoidable or certain to happen.', 'multiple_choice', 'reading_and_writing', @tutor_id);

-- Insert Question Options (32 records - 4 options per 8 questions)
INSERT INTO question_option (question_id, name_option, value)
SELECT id, 'A', '3' FROM question WHERE question_text LIKE '%3x + 7 = 22%'
UNION ALL SELECT id, 'B', '4' FROM question WHERE question_text LIKE '%3x + 7 = 22%'
UNION ALL SELECT id, 'C', '5' FROM question WHERE question_text LIKE '%3x + 7 = 22%'
UNION ALL SELECT id, 'D', '6' FROM question WHERE question_text LIKE '%3x + 7 = 22%'

UNION ALL SELECT id, 'A', '25' FROM question WHERE question_text LIKE '%area of a circle%'
UNION ALL SELECT id, 'B', '78.54' FROM question WHERE question_text LIKE '%area of a circle%'
UNION ALL SELECT id, 'C', '31.42' FROM question WHERE question_text LIKE '%area of a circle%'
UNION ALL SELECT id, 'D', '50' FROM question WHERE question_text LIKE '%area of a circle%'

UNION ALL SELECT id, 'A', 'x=5, y=3' FROM question WHERE question_text LIKE '%x + y = 8%'
UNION ALL SELECT id, 'B', 'x=4, y=4' FROM question WHERE question_text LIKE '%x + y = 8%'
UNION ALL SELECT id, 'C', 'x=6, y=2' FROM question WHERE question_text LIKE '%x + y = 8%'
UNION ALL SELECT id, 'D', 'x=3, y=5' FROM question WHERE question_text LIKE '%x + y = 8%'

UNION ALL SELECT id, 'A', '3' FROM question WHERE question_text LIKE '%right triangle%'
UNION ALL SELECT id, 'B', '5' FROM question WHERE question_text LIKE '%right triangle%'
UNION ALL SELECT id, 'C', '6' FROM question WHERE question_text LIKE '%right triangle%'
UNION ALL SELECT id, 'D', '4' FROM question WHERE question_text LIKE '%right triangle%'

UNION ALL SELECT id, 'A', 'is' FROM question WHERE question_text LIKE '%team (is/are)%'
UNION ALL SELECT id, 'B', 'are' FROM question WHERE question_text LIKE '%team (is/are)%'
UNION ALL SELECT id, 'C', 'were' FROM question WHERE question_text LIKE '%team (is/are)%'
UNION ALL SELECT id, 'D', 'been' FROM question WHERE question_text LIKE '%team (is/are)%'

UNION ALL SELECT id, 'A', 'his' FROM question WHERE question_text LIKE '%student must bring%'
UNION ALL SELECT id, 'B', 'her' FROM question WHERE question_text LIKE '%student must bring%'
UNION ALL SELECT id, 'C', 'his or her' FROM question WHERE question_text LIKE '%student must bring%'
UNION ALL SELECT id, 'D', 'its' FROM question WHERE question_text LIKE '%student must bring%'

UNION ALL SELECT id, 'A', 'Climate affects weather' FROM question WHERE question_text LIKE '%main idea%'
UNION ALL SELECT id, 'B', 'Climate change impacts ecosystems' FROM question WHERE question_text LIKE '%main idea%'
UNION ALL SELECT id, 'C', 'Weather varies daily' FROM question WHERE question_text LIKE '%main idea%'
UNION ALL SELECT id, 'D', 'Ecosystems are diverse' FROM question WHERE question_text LIKE '%main idea%'

UNION ALL SELECT id, 'A', 'unavoidable' FROM question WHERE question_text LIKE '%inevitable%'
UNION ALL SELECT id, 'B', 'possible' FROM question WHERE question_text LIKE '%inevitable%'
UNION ALL SELECT id, 'C', 'unlikely' FROM question WHERE question_text LIKE '%inevitable%'
UNION ALL SELECT id, 'D', 'optional' FROM question WHERE question_text LIKE '%inevitable%';

-- Insert Test Templates (4 records - will generate TPL0001, TPL0002, TPL0003, TPL0004)
DECLARE @template1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @template2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @template3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @template4_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO test_template (test_template_id, is_public, name, description, topic, test_type, content_tier)
VALUES 
    (@template1_id, 1, 'SAT Math Diagnostic', 'Comprehensive math diagnostic test', 'Mathematics', 'diagnostic', 'premium'),
    (@template2_id, 1, 'Algebra Practice Test', 'Focused algebra practice', 'Algebra', 'chapter_test', 'basic'),
    (@template3_id, 1, 'Reading & Writing Diagnostic', 'Full R&W assessment', 'Reading and Writing', 'diagnostic', 'premium'),
    (@template4_id, 0, 'Custom Math Quiz', 'Personalized math quiz', 'Mixed', 'quizz', 'free');

-- Insert Test Template Modules (6 records)
DECLARE @tpl1_id UNIQUEIDENTIFIER, @tpl2_id UNIQUEIDENTIFIER, @tpl3_id UNIQUEIDENTIFIER;
SELECT @tpl1_id = test_template_id FROM test_template WHERE name = 'SAT Math Diagnostic';
SELECT @tpl2_id = test_template_id FROM test_template WHERE name = 'Algebra Practice Test';
SELECT @tpl3_id = test_template_id FROM test_template WHERE name = 'Reading & Writing Diagnostic';

DECLARE @ttm1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ttm2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ttm3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ttm4_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ttm5_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ttm6_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO test_template_module (id, difficulty, name, type, total_question, time_limit_second, test_template_id, chapter_id)
VALUES 
    (@ttm1_id, 'medium', 'Math Module 1', 'calculator', 22, 2100, @tpl1_id, @chapter_math_algebra_id),
    (@ttm2_id, 'hard', 'Math Module 2', 'no_calculator', 22, 2100, @tpl1_id, @chapter_math_geometry_id),
    (@ttm3_id, 'easy', 'Algebra Module', 'calculator', 15, 1200, @tpl2_id, @chapter_math_algebra_id),
    (@ttm4_id, 'medium', 'Reading Module 1', 'reading', 27, 1920, @tpl3_id, @chapter_rw_reading_id),
    (@ttm5_id, 'medium', 'Writing Module 1', 'writing', 27, 1920, @tpl3_id, @chapter_rw_grammar_id),
    (@ttm6_id, 'hard', 'Writing Module 2', 'writing', 27, 1920, @tpl3_id, @chapter_rw_vocab);

-- Insert Test Template Questions (12 records)
DECLARE @ttm1_id_var UNIQUEIDENTIFIER, @ttm2_id_var UNIQUEIDENTIFIER, @ttm3_id_var UNIQUEIDENTIFIER;
SELECT @ttm1_id_var = id FROM test_template_module WHERE name = 'Math Module 1';
SELECT @ttm2_id_var = id FROM test_template_module WHERE name = 'Math Module 2';
SELECT @ttm3_id_var = id FROM test_template_module WHERE name = 'Algebra Module';

-- Get question IDs
DECLARE @q1_id_var UNIQUEIDENTIFIER, @q2_id_var UNIQUEIDENTIFIER, @q3_id_var UNIQUEIDENTIFIER, @q4_id_var UNIQUEIDENTIFIER;
DECLARE @q5_id_var UNIQUEIDENTIFIER, @q6_id_var UNIQUEIDENTIFIER, @q7_id_var UNIQUEIDENTIFIER, @q8_id_var UNIQUEIDENTIFIER;
SELECT @q1_id_var = id FROM question WHERE question_text LIKE '%3x + 7 = 22%';
SELECT @q2_id_var = id FROM question WHERE question_text LIKE '%area of a circle%';
SELECT @q3_id_var = id FROM question WHERE question_text LIKE '%x + y = 8%';
SELECT @q4_id_var = id FROM question WHERE question_text LIKE '%right triangle%';
SELECT @q5_id_var = id FROM question WHERE question_text LIKE '%team (is/are)%';
SELECT @q6_id_var = id FROM question WHERE question_text LIKE '%student must bring%';
SELECT @q7_id_var = id FROM question WHERE question_text LIKE '%main idea%';
SELECT @q8_id_var = id FROM question WHERE question_text LIKE '%inevitable%';

INSERT INTO test_template_question (test_template_module_id, question_id, [order])
VALUES 
    (@ttm1_id_var, @q1_id_var, 1),
    (@ttm1_id_var, @q3_id_var, 2),
    (@ttm2_id_var, @q2_id_var, 1),
    (@ttm2_id_var, @q4_id_var, 2),
    (@ttm3_id_var, @q1_id_var, 1),
    (@ttm3_id_var, @q3_id_var, 2);

-- Insert Test Sessions (4 records)
DECLARE @student1_id_var UNIQUEIDENTIFIER, @student2_id_var UNIQUEIDENTIFIER;
SELECT @student1_id_var = user_id FROM [user] WHERE email = 'john.smith@email.com';
SELECT @student2_id_var = user_id FROM [user] WHERE email = 'emma.johnson@email.com';

DECLARE @ts1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ts2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ts3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @ts4_id UNIQUEIDENTIFIER = NEWID();

DECLARE @tpl1_id_var UNIQUEIDENTIFIER;
SELECT @tpl1_id_var = test_template_id FROM test_template WHERE name = 'SAT Math Diagnostic';

INSERT INTO test_session (id, user_id, test_type, test_name, total_question, time_limit_second, status, current_question_index, number_question_answered, started_at, paused_at, completed_at, reference_type, reference_id, number_question_correct)
VALUES 
    (@ts1_id, @student1_id_var, 'diagnostic', 'Math Diagnostic Test', 44, 4200, 'completed', 44, 44, DATEADD(HOUR, -2, GETDATE()), NULL, DATEADD(HOUR, -1, GETDATE()), 'template', @tpl1_id_var, 38),
    (@ts2_id, @student2_id_var, 'diagnostic', 'Math Diagnostic Test', 44, 4200, 'in_progress', 15, 15, DATEADD(MINUTE, -30, GETDATE()), NULL, NULL, 'template', @tpl1_id_var, NULL),
    (@ts3_id, @student1_id_var, 'chapter_test', 'Algebra Chapter Test', 15, 1200, 'completed', 15, 15, DATEADD(DAY, -1, GETDATE()), NULL, DATEADD(DAY, -1, GETDATE()), 'template_module', @ttm1_id_var, 13),
    (@ts4_id, @student2_id_var, 'quizz', 'Quick Math Quiz', 10, 600, 'abandoned', 5, 5, DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -2, GETDATE()), NULL, 'template_module', @ttm3_id_var, NULL);

-- Insert Test Session Questions (16 records)
DECLARE @ts1_id_var UNIQUEIDENTIFIER, @ts3_id_var UNIQUEIDENTIFIER;
SELECT @ts1_id_var = id FROM test_session WHERE test_name = 'Math Diagnostic Test' AND status = 'completed';
SELECT @ts3_id_var = id FROM test_session WHERE test_name = 'Algebra Chapter Test';

INSERT INTO test_session_question (question_id, answered_at, time_spent, is_correct, [order], is_answered, is_flagged, answer, test_session_id)
VALUES 
    (@q1_id_var, DATEADD(HOUR, -2, GETDATE()), 45, 1, 1, 1, 0, 'C', @ts1_id_var),
    (@q2_id_var, DATEADD(HOUR, -2, GETDATE()), 67, 1, 2, 1, 0, 'B', @ts1_id_var),
    (@q3_id_var, DATEADD(HOUR, -2, GETDATE()), 89, 0, 3, 1, 1, 'B', @ts1_id_var),
    (@q4_id_var, DATEADD(HOUR, -2, GETDATE()), 52, 1, 4, 1, 0, 'D', @ts1_id_var),
    (@q1_id_var, DATEADD(DAY, -1, GETDATE()), 38, 1, 1, 1, 0, 'C', @ts3_id_var),
    (@q3_id_var, DATEADD(DAY, -1, GETDATE()), 72, 1, 2, 1, 0, 'A', @ts3_id_var);

-- Insert Images (4 records)
DECLARE @img1_id UNIQUEIDENTIFIER = NEWID();
DECLARE @img2_id UNIQUEIDENTIFIER = NEWID();
DECLARE @img3_id UNIQUEIDENTIFIER = NEWID();
DECLARE @img4_id UNIQUEIDENTIFIER = NEWID();

INSERT INTO image (id, data, width, height, checksum)
VALUES 
    (@img1_id, 'base64_encoded_image_data_1', 800, 600, 'abc123hash1'),
    (@img2_id, 'base64_encoded_image_data_2', 1024, 768, 'def456hash2'),
    (@img3_id, 'base64_encoded_image_data_3', 640, 480, 'ghi789hash3'),
    (@img4_id, 'base64_encoded_image_data_4', 1200, 900, 'jkl012hash4');

-- Insert Question Images (4 records)
INSERT INTO question_image (image_id, question_id)
VALUES 
    (@img1_id, @q2_id_var),
    (@img2_id, @q3_id_var),
    (@img3_id, @q4_id_var),
    (@img4_id, @q7_id_var);

-- Insert User Notes (4 records)
DECLARE @lc1_id UNIQUEIDENTIFIER, @lc2_id UNIQUEIDENTIFIER, @lc3_id UNIQUEIDENTIFIER;
SELECT TOP 1 @lc1_id = id FROM lesson_content WHERE [order] = 1;
SELECT TOP 1 @lc2_id = id FROM lesson_content WHERE [order] = 2;
SELECT TOP 1 @lc3_id = id FROM lesson_content WHERE [order] = 3;

INSERT INTO user_note (lesson_content_id, user_id, content, color)
VALUES 
    (@lc1_id, @student1_id_var, 'Important concept! Review again before test.', '#FFD700'),
    (@lc2_id, @student1_id_var, 'This step is tricky - practice more problems.', '#FF6347'),
    (@lc1_id, @student2_id_var, 'Great explanation of the fundamentals.', '#90EE90'),
    (@lc3_id, @student2_id_var, 'Need to memorize this formula.', '#87CEEB');

-- Insert User Mission Task Items (5 records)
DECLARE @mti1_id_var UNIQUEIDENTIFIER, @mti2_id_var UNIQUEIDENTIFIER, @mti3_id_var UNIQUEIDENTIFIER;
SELECT @mti1_id_var = id FROM mission_task_item WHERE title = 'Diagnostic Test';
SELECT @mti2_id_var = id FROM mission_task_item WHERE title = 'Study Algebra';
SELECT @mti3_id_var = id FROM mission_task_item WHERE title = 'Algebra Test';

INSERT INTO user_mission_task_item (user_id, mission_task_item_id, is_completed)
VALUES 
    (@student1_id_var, @mti1_id_var, 1),
    (@student1_id_var, @mti2_id_var, 1),
    (@student1_id_var, @mti3_id_var, 1),
    (@student2_id_var, @mti1_id_var, 1),
    (@student2_id_var, @mti2_id_var, 0);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

PRINT '================================================';
PRINT 'DATABASE CREATION COMPLETED SUCCESSFULLY';
PRINT '================================================';
PRINT '';
PRINT 'Table Row Counts:';
PRINT '----------------';

SELECT 'user' AS TableName, COUNT(*) AS RowCount FROM [user]
UNION ALL SELECT 'user_activity', COUNT(*) FROM user_activity
UNION ALL SELECT 'user_settings', COUNT(*) FROM user_settings
UNION ALL SELECT 'subscription', COUNT(*) FROM subscription
UNION ALL SELECT 'user_subscription_map', COUNT(*) FROM user_subscription_map
UNION ALL SELECT 'chapter', COUNT(*) FROM chapter
UNION ALL SELECT 'lesson', COUNT(*) FROM lesson
UNION ALL SELECT 'lesson_content', COUNT(*) FROM lesson_content
UNION ALL SELECT 'user_note', COUNT(*) FROM user_note
UNION ALL SELECT 'mission_task', COUNT(*) FROM mission_task
UNION ALL SELECT 'mission_task_item', COUNT(*) FROM mission_task_item
UNION ALL SELECT 'mission_task_mission_item_map', COUNT(*) FROM mission_task_mission_item_map
UNION ALL SELECT 'user_mission_task_item', COUNT(*) FROM user_mission_task_item
UNION ALL SELECT 'image', COUNT(*) FROM image
UNION ALL SELECT 'question', COUNT(*) FROM question
UNION ALL SELECT 'question_option', COUNT(*) FROM question_option
UNION ALL SELECT 'question_image', COUNT(*) FROM question_image
UNION ALL SELECT 'test_template', COUNT(*) FROM test_template
UNION ALL SELECT 'test_template_module', COUNT(*) FROM test_template_module
UNION ALL SELECT 'test_template_question', COUNT(*) FROM test_template_question
UNION ALL SELECT 'test_session', COUNT(*) FROM test_session
UNION ALL SELECT 'test_session_question', COUNT(*) FROM test_session_question
ORDER BY TableName;

PRINT '';
PRINT '================================================';
PRINT 'SAMPLE DATA VERIFICATION:';
PRINT '================================================';
PRINT '';

-- Show subscription codes with prefix
PRINT 'Subscription Codes (with prefix):';
SELECT subscription_code, name, type FROM subscription ORDER BY subscription_code;

PRINT '';
PRINT 'Test Template Codes (with prefix):';
SELECT template_code, name, test_type FROM test_template ORDER BY template_code;

PRINT '';
PRINT 'User Settings Score Goals (CHECK constraint validation):';
SELECT 
    u.email,
    us.math_score_goal,
    us.rd_wt_score_goal,
    CASE 
        WHEN us.math_score_goal BETWEEN 200 AND 800 OR us.math_score_goal IS NULL THEN 'Valid'
        ELSE 'Invalid'
    END AS math_goal_status,
    CASE 
        WHEN us.rd_wt_score_goal BETWEEN 200 AND 800 OR us.rd_wt_score_goal IS NULL THEN 'Valid'
        ELSE 'Invalid'
    END AS rw_goal_status
FROM user_settings us
JOIN [user] u ON us.user_id = u.user_id;

PRINT '';
PRINT 'Test Session Datetime Validation (CHECK constraint):';
SELECT 
    test_name,
    status,
    started_at,
    paused_at,
    completed_at,
    CASE 
        WHEN (started_at IS NULL OR paused_at IS NULL OR started_at <= paused_at) AND
             (started_at IS NULL OR completed_at IS NULL OR started_at <= completed_at) AND
             (paused_at IS NULL OR completed_at IS NULL OR paused_at <= completed_at)
        THEN 'Valid'
        ELSE 'Invalid'
    END AS datetime_order_status
FROM test_session;


PRINT '';
PRINT '================================================';
PRINT 'PART 1 COMPLETED - PROCEEDING TO PART 2';
PRINT '================================================';


-- =============================================
-- PART 2: STORE PROCEDURE, FUNCTION, TRIGGER (3 points)
-- =============================================

-- =============================================
-- I. FUNCTIONS AND STORED PROCEDURES (2 points)
-- =============================================

-- ---------------------------------------------
-- FUNCTION 1: Calculate User's Current Study Streak
-- ---------------------------------------------
-- Description: Calculates how many consecutive days a user has been active
-- Input: @userId (UNIQUEIDENTIFIER) - The user's ID
-- Output: INT - Number of consecutive active days
-- Features: WHERE clause, validation, date calculation
-- ---------------------------------------------
CREATE FUNCTION dbo.fn_CalculateUserStreak
(
    @userId UNIQUEIDENTIFIER
)
RETURNS INT
AS
BEGIN
    DECLARE @currentStreak INT = 0;
    
    -- Validation: Check if user exists
    IF NOT EXISTS (SELECT 1 FROM [user] WHERE user_id = @userId)
    BEGIN
        RETURN -1; -- Invalid user
    END
    
    -- Get the current streak from user_activity
    SELECT @currentStreak = ISNULL(streak, 0)
    FROM user_activity
    WHERE user_id = @userId;
    
    RETURN @currentStreak;
END;

-- ---------------------------------------------
-- FUNCTION 2: Calculate Average Score by Test Type
-- ---------------------------------------------
-- Description: Calculates average score for a specific test type across all users
-- Input: @testType (VARCHAR) - Type of test ('diagnostic', 'custom', 'chapter_test', 'quizz')
-- Output: DECIMAL - Average percentage score
-- Features: AGGREGATE FUNCTION, WHERE clause, validation, calculation
-- ---------------------------------------------
CREATE FUNCTION dbo.fn_GetAverageScoreByTestType
(
    @testType VARCHAR(255)
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @avgScore DECIMAL(5,2) = 0;
    
    -- Validation: Check if test type is valid
    IF @testType NOT IN ('diagnostic', 'custom', 'chapter_test', 'quizz')
    BEGIN
        RETURN -1; -- Invalid test type
    END
    
    -- Calculate average score percentage
    SELECT @avgScore = AVG(
        CASE 
            WHEN total_question > 0 
            THEN (CAST(number_question_correct AS DECIMAL) / total_question) * 100
            ELSE 0
        END
    )
    FROM test_session
    WHERE test_type = @testType 
        AND status = 'completed'
        AND number_question_correct IS NOT NULL
        AND total_question > 0;
    
    RETURN ISNULL(@avgScore, 0);
END;

-- ---------------------------------------------
-- STORED PROCEDURE 1: Get User Performance Report
-- ---------------------------------------------
-- Description: Generates comprehensive performance report for a user
-- Input: 
--   @userId (UNIQUEIDENTIFIER) - User's ID
--   @startDate (DATE) - Start date for report period
--   @endDate (DATE) - End date for report period
-- Output: Result set with performance metrics
-- Features: Multiple tables JOIN, WHERE, ORDER BY, AGGREGATE, GROUP BY, HAVING, IF validation
-- ---------------------------------------------
CREATE PROCEDURE sp_GetUserPerformanceReport
    @userId UNIQUEIDENTIFIER,
    @startDate DATE = NULL,
    @endDate DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validation: Check if user exists
    IF NOT EXISTS (SELECT 1 FROM [user] WHERE user_id = @userId)
    BEGIN
        RAISERROR('User does not exist', 16, 1);
        RETURN;
    END
    
    -- Validation: Check date range
    IF @startDate IS NOT NULL AND @endDate IS NOT NULL
    BEGIN
        IF @startDate > @endDate
        BEGIN
            RAISERROR('Start date must be before or equal to end date', 16, 1);
            RETURN;
        END
    END
    
    -- Set default dates if not provided
    IF @startDate IS NULL
        SET @startDate = DATEADD(MONTH, -1, GETDATE());
    IF @endDate IS NULL
        SET @endDate = GETDATE();
    
    -- Query with JOIN, WHERE, GROUP BY, HAVING, ORDER BY
    SELECT 
        u.first_name + ' ' + u.last_name AS UserName,
        ts.test_type AS TestType,
        COUNT(ts.id) AS TotalTests,
        AVG(CASE 
            WHEN ts.total_question > 0 
            THEN (CAST(ts.number_question_correct AS DECIMAL) / ts.total_question) * 100
            ELSE 0
        END) AS AverageScore,
        MAX(CASE 
            WHEN ts.total_question > 0 
            THEN (CAST(ts.number_question_correct AS DECIMAL) / ts.total_question) * 100
            ELSE 0
        END) AS BestScore,
        MIN(CASE 
            WHEN ts.total_question > 0 
            THEN (CAST(ts.number_question_correct AS DECIMAL) / ts.total_question) * 100
            ELSE 0
        END) AS LowestScore,
        SUM(DATEDIFF(SECOND, ts.started_at, ts.completed_at)) AS TotalTimeSpentSeconds
    FROM [user] u
    INNER JOIN test_session ts ON u.user_id = ts.user_id
    WHERE u.user_id = @userId
        AND ts.status = 'completed'
        AND ts.started_at >= @startDate
        AND ts.completed_at <= @endDate
        AND ts.number_question_correct IS NOT NULL
    GROUP BY u.first_name, u.last_name, ts.test_type
    HAVING COUNT(ts.id) >= 1  -- Only show test types with at least 1 completed test
    ORDER BY TestType ASC, AverageScore DESC;
    
    -- Additional summary information
    SELECT 
        ua.streak AS CurrentStreak,
        ua.active_second AS TotalActiveSeconds,
        us.math_score_goal AS MathGoal,
        us.rd_wt_score_goal AS ReadingWritingGoal,
        u.math_score AS CurrentMathScore,
        u.rd_wt_score AS CurrentRWScore
    FROM [user] u
    LEFT JOIN user_activity ua ON u.user_id = ua.user_id
    LEFT JOIN user_settings us ON u.user_id = us.user_id
    WHERE u.user_id = @userId;
END;

-- ---------------------------------------------
-- STORED PROCEDURE 2: Get Top Performing Students by Chapter
-- ---------------------------------------------
-- Description: Returns top N students for each chapter based on test performance
-- Input: 
--   @topN (INT) - Number of top students to return per chapter
--   @minTests (INT) - Minimum number of tests required to be included
-- Output: Result set with top students per chapter
-- Features: Multiple tables JOIN, WHERE, AGGREGATE, GROUP BY, HAVING, FOR loop logic, validation
-- ---------------------------------------------
CREATE PROCEDURE sp_GetTopStudentsByChapter
    @topN INT = 5,
    @minTests INT = 2
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validation: Check input parameters
    IF @topN <= 0
    BEGIN
        RAISERROR('Top N must be greater than 0', 16, 1);
        RETURN;
    END
    
    IF @minTests < 1
    BEGIN
        RAISERROR('Minimum tests must be at least 1', 16, 1);
        RETURN;
    END
    
    -- Temporary table to store results
    CREATE TABLE #TopStudents (
        ChapterTitle VARCHAR(255),
        ChapterType VARCHAR(255),
        StudentName VARCHAR(511),
        StudentEmail VARCHAR(255),
        TestsCompleted INT,
        AverageScore DECIMAL(5,2),
        Ranking INT
    );
    
    -- Declare variables for cursor
    DECLARE @chapterId UNIQUEIDENTIFIER;
    DECLARE @chapterTitle VARCHAR(255);
    DECLARE @chapterType VARCHAR(255);
    
    -- Cursor to iterate through chapters (simulating FOR loop)
    DECLARE chapter_cursor CURSOR FOR
    SELECT id, title, type
    FROM chapter
    ORDER BY type, [order];
    
    OPEN chapter_cursor;
    FETCH NEXT FROM chapter_cursor INTO @chapterId, @chapterTitle, @chapterType;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Insert top students for this chapter
        INSERT INTO #TopStudents
        SELECT TOP (@topN)
            @chapterTitle AS ChapterTitle,
            @chapterType AS ChapterType,
            u.first_name + ' ' + u.last_name AS StudentName,
            u.email AS StudentEmail,
            COUNT(ts.id) AS TestsCompleted,
            AVG(CASE 
                WHEN ts.total_question > 0 
                THEN (CAST(ts.number_question_correct AS DECIMAL) / ts.total_question) * 100
                ELSE 0
            END) AS AverageScore,
            ROW_NUMBER() OVER (ORDER BY AVG(CASE 
                WHEN ts.total_question > 0 
                THEN (CAST(ts.number_question_correct AS DECIMAL) / ts.total_question) * 100
                ELSE 0
            END) DESC) AS Ranking
        FROM [user] u
        INNER JOIN test_session ts ON u.user_id = ts.user_id
        INNER JOIN test_template_module ttm ON ts.reference_id = ttm.test_template_id
        WHERE u.role = 'STUDENT'
            AND ts.status = 'completed'
            AND ts.reference_type = 'template'
            AND ttm.chapter_id = @chapterId
            AND ts.number_question_correct IS NOT NULL
        GROUP BY u.user_id, u.first_name, u.last_name, u.email
        HAVING COUNT(ts.id) >= @minTests
        ORDER BY AverageScore DESC;
        
        FETCH NEXT FROM chapter_cursor INTO @chapterId, @chapterTitle, @chapterType;
    END;
    
    CLOSE chapter_cursor;
    DEALLOCATE chapter_cursor;
    
    -- Return results
    SELECT * FROM #TopStudents
    ORDER BY ChapterType, ChapterTitle, Ranking;
    
    DROP TABLE #TopStudents;
END;

-- ---------------------------------------------
-- STORED PROCEDURE 3: Update User Score Goals
-- ---------------------------------------------
-- Description: Updates user's score goals with validation
-- Input: 
--   @userId (UNIQUEIDENTIFIER) - User's ID
--   @mathGoal (INT) - Math score goal (200-800)
--   @rwGoal (INT) - Reading & Writing score goal (200-800)
-- Features: IF validation, UPDATE with WHERE
-- ---------------------------------------------
CREATE PROCEDURE sp_UpdateUserScoreGoals
    @userId UNIQUEIDENTIFIER,
    @mathGoal INT = NULL,
    @rwGoal INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validation: Check if user exists
    IF NOT EXISTS (SELECT 1 FROM [user] WHERE user_id = @userId)
    BEGIN
        RAISERROR('User does not exist', 16, 1);
        RETURN;
    END
    
    -- Validation: Check math goal range
    IF @mathGoal IS NOT NULL AND (@mathGoal < 200 OR @mathGoal > 800)
    BEGIN
        RAISERROR('Math score goal must be between 200 and 800', 16, 1);
        RETURN;
    END
    
    -- Validation: Check reading/writing goal range
    IF @rwGoal IS NOT NULL AND (@rwGoal < 200 OR @rwGoal > 800)
    BEGIN
        RAISERROR('Reading & Writing score goal must be between 200 and 800', 16, 1);
        RETURN;
    END
    
    -- Check if user_settings record exists
    IF NOT EXISTS (SELECT 1 FROM user_settings WHERE user_id = @userId)
    BEGIN
        -- Insert new record
        INSERT INTO user_settings (user_id, math_score_goal, rd_wt_score_goal)
        VALUES (@userId, @mathGoal, @rwGoal);
    END
    ELSE
    BEGIN
        -- Update existing record
        UPDATE user_settings
        SET 
            math_score_goal = ISNULL(@mathGoal, math_score_goal),
            rd_wt_score_goal = ISNULL(@rwGoal, rd_wt_score_goal)
        WHERE user_id = @userId;
    END
    
    -- Return updated values
    SELECT 
        u.first_name + ' ' + u.last_name AS UserName,
        us.math_score_goal AS MathGoal,
        us.rd_wt_score_goal AS ReadingWritingGoal,
        us.next_test_date AS NextTestDate
    FROM [user] u
    INNER JOIN user_settings us ON u.user_id = us.user_id
    WHERE u.user_id = @userId;
END;

-- =============================================
-- II. TRIGGERS (1 point)
-- =============================================

-- ---------------------------------------------
-- TRIGGER 1: Auto-calculate total_score (Derived Column)
-- ---------------------------------------------
-- Description: Automatically calculates and updates total_score when math_score or rd_wt_score changes
-- Type: AFTER UPDATE on user table
-- Purpose: Generate derived column values (total_score = math_score + rd_wt_score)
-- ---------------------------------------------
CREATE TRIGGER trg_user_calculate_total_score
ON [user]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update total_score for inserted/updated records
    UPDATE u
    SET total_score = ISNULL(i.math_score, 0) + ISNULL(i.rd_wt_score, 0)
    FROM [user] u
    INNER JOIN inserted i ON u.user_id = i.user_id
    WHERE i.math_score IS NOT NULL OR i.rd_wt_score IS NOT NULL;
END;

-- ---------------------------------------------
-- TRIGGER 2: Update streak on user_activity (Derived Column)
-- ---------------------------------------------
-- Description: Updates user's study streak based on recent activity
-- Type: AFTER INSERT, UPDATE on user_activity table
-- Purpose: Generate derived column values (streak calculation)
-- ---------------------------------------------
CREATE TRIGGER trg_user_activity_update_streak
ON user_activity
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @userId UNIQUEIDENTIFIER;
    DECLARE @recentDate DATE;
    DECLARE @currentStreak INT;
    
    -- Get values from inserted row
    SELECT @userId = user_id, @recentDate = recent_date
    FROM inserted;
    
    -- Calculate streak
    IF @recentDate = CAST(GETDATE() AS DATE)
    BEGIN
        -- Activity today - increment or maintain streak
        SELECT @currentStreak = ISNULL(streak, 0) + 1
        FROM user_activity
        WHERE user_id = @userId;
    END
    ELSE IF @recentDate = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)
    BEGIN
        -- Activity yesterday - maintain current streak
        SELECT @currentStreak = ISNULL(streak, 1)
        FROM user_activity
        WHERE user_id = @userId;
    END
    ELSE
    BEGIN
        -- Gap in activity - reset streak to 1
        SET @currentStreak = 1;
    END
    
    -- Update the streak
    UPDATE user_activity
    SET streak = @currentStreak
    WHERE user_id = @userId;
END;

-- ---------------------------------------------
-- TRIGGER 3: Enforce tutor qualification (Business Rule)
-- ---------------------------------------------
-- Description: Ensures only qualified tutors can create approved questions
-- Type: AFTER INSERT, UPDATE on question table
-- Purpose: Enforce business rule - tutors must have certification to create approved questions
-- Business Rule: Only users with role='TUTOR' and certification can create 'approved' questions
-- ---------------------------------------------
CREATE TRIGGER trg_question_enforce_tutor_qualification
ON question
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if any inserted/updated questions violate the rule
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN [user] u ON i.tutor_id = u.user_id
        WHERE i.status = 'approved'
            AND (u.role != 'TUTOR' OR u.certification IS NULL)
    )
    BEGIN
        RAISERROR('Only certified tutors can create approved questions', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;

-- ---------------------------------------------
-- TRIGGER 4: Enforce subscription payment for premium content (Business Rule)
-- ---------------------------------------------
-- Description: Ensures users have active premium subscription to access premium test templates
-- Type: AFTER INSERT on test_session table
-- Purpose: Enforce business rule - premium content requires active premium subscription
-- Business Rule: Users must have 'premium' or 'premium_plus' subscription to start tests with content_tier='premium'
-- ---------------------------------------------
CREATE TRIGGER trg_test_session_enforce_subscription
ON test_session
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user has required subscription for premium content
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN test_template tt ON i.reference_id = tt.test_template_id
        LEFT JOIN user_subscription_map usm ON i.user_id = usm.user_id
        LEFT JOIN subscription s ON usm.subscription_id = s.id
        WHERE i.reference_type = 'template'
            AND tt.content_tier = 'premium'
            AND (
                s.id IS NULL 
                OR s.type NOT IN ('premium', 'premium_plus')
                OR usm.status != 'active'
            )
    )
    BEGIN
        RAISERROR('Premium subscription required to access premium content', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;

-- =============================================
-- PART 2 TESTING AND VERIFICATION
-- =============================================

PRINT '';
PRINT '================================================';
PRINT 'TESTING FUNCTIONS AND STORED PROCEDURES';
PRINT '================================================';
PRINT '';

-- Test Function 1: Calculate User Streak
PRINT 'Testing fn_CalculateUserStreak:';
DECLARE @testUserId UNIQUEIDENTIFIER;
SELECT TOP 1 @testUserId = user_id FROM [user] WHERE role = 'STUDENT';
DECLARE @streakResult INT = dbo.fn_CalculateUserStreak(@testUserId);
PRINT 'User streak: ' + CAST(@streakResult AS VARCHAR);
PRINT '';

-- Test Function 2: Average Score by Test Type
PRINT 'Testing fn_GetAverageScoreByTestType:';
DECLARE @avgDiagnostic DECIMAL(5,2) = dbo.fn_GetAverageScoreByTestType('diagnostic');
PRINT 'Average diagnostic test score: ' + CAST(@avgDiagnostic AS VARCHAR) + '%';
PRINT '';

-- Test Stored Procedure 1: User Performance Report
PRINT 'Testing sp_GetUserPerformanceReport:';
EXEC sp_GetUserPerformanceReport @userId = @testUserId;
PRINT '';

-- Test Stored Procedure 2: Top Students by Chapter
PRINT 'Testing sp_GetTopStudentsByChapter:';
EXEC sp_GetTopStudentsByChapter @topN = 3, @minTests = 1;
PRINT '';

-- Test Stored Procedure 3: Update Score Goals
PRINT 'Testing sp_UpdateUserScoreGoals:';
EXEC sp_UpdateUserScoreGoals @userId = @testUserId, @mathGoal = 750, @rwGoal = 720;
PRINT '';

-- Test Trigger 1: Total Score Calculation
PRINT 'Testing trg_user_calculate_total_score:';
UPDATE [user] 
SET math_score = 700, rd_wt_score = 650 
WHERE user_id = @testUserId;
SELECT first_name, last_name, math_score, rd_wt_score, total_score 
FROM [user] 
WHERE user_id = @testUserId;
PRINT '';

PRINT '================================================';
PRINT 'PART 2 COMPLETED SUCCESSFULLY';
PRINT '================================================';
PRINT '';
PRINT 'Summary:';
PRINT '- 2 Functions created: fn_CalculateUserStreak, fn_GetAverageScoreByTestType';
PRINT '- 3 Stored Procedures created: sp_GetUserPerformanceReport, sp_GetTopStudentsByChapter, sp_UpdateUserScoreGoals';
PRINT '- 4 Triggers created: trg_user_calculate_total_score, trg_user_activity_update_streak,';
PRINT '                      trg_question_enforce_tutor_qualification, trg_test_session_enforce_subscription';
PRINT '';
PRINT '================================================';
PRINT 'FULL SCRIPT EXECUTION COMPLETED';
PRINT '================================================';
