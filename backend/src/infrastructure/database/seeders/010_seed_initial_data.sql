 
-- Migration: 010_seed_initial_data
-- Description: Seed initial data for roles, test users, skills, and sample projects
-- Author: System Architect
-- Date: 2025-12-11

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'admin', 'Administrator with full system access'),
    ('550e8400-e29b-41d4-a716-446655440002', 'user', 'Regular user with limited access')
ON CONFLICT (name) DO NOTHING;

-- Insert test admin user (password: Admin@123 - bcrypt hash with 12 rounds)
INSERT INTO users (id, username, email, password_hash, full_name, is_active, email_verified) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 
     'admin', 
     'admin@portfolio.dev', 
     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7667fLPW3K', 
     'System Administrator', 
     TRUE, 
     TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert test regular user (password: User@123)
INSERT INTO users (id, username, email, password_hash, full_name, is_active, email_verified) VALUES
    ('650e8400-e29b-41d4-a716-446655440002', 
     'testuser', 
     'user@portfolio.dev', 
     '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
     'Test User', 
     TRUE, 
     TRUE)
ON CONFLICT (email) DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert common skills with categories
INSERT INTO skills (id, name, category, proficiency_level, color_hex) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', 'JavaScript', 'Programming Languages', 'expert', '#F7DF1E'),
    ('750e8400-e29b-41d4-a716-446655440002', 'TypeScript', 'Programming Languages', 'expert', '#3178C6'),
    ('750e8400-e29b-41d4-a716-446655440003', 'Node.js', 'Backend', 'advanced', '#339933'),
    ('750e8400-e29b-41d4-a716-446655440004', 'Express', 'Backend', 'advanced', '#000000'),
    ('750e8400-e29b-41d4-a716-446655440005', 'React', 'Frontend', 'expert', '#61DAFB'),
    ('750e8400-e29b-41d4-a716-446655440006', 'PostgreSQL', 'Database', 'advanced', '#4169E1'),
    ('750e8400-e29b-41d4-a716-446655440007', 'Docker', 'DevOps', 'intermediate', '#2496ED'),
    ('750e8400-e29b-41d4-a716-446655440008', 'Git', 'Tools', 'advanced', '#F05032'),
    ('750e8400-e29b-41d4-a716-446655440009', 'REST API', 'Backend', 'advanced', '#009688'),
    ('750e8400-e29b-41d4-a716-446655440010', 'Clean Architecture', 'Architecture', 'advanced', '#4CAF50'),
    ('750e8400-e29b-41d4-a716-446655440011', 'Redis', 'Cache', 'intermediate', '#DC382D'),
    ('750e8400-e29b-41d4-a716-446655440012', 'JWT', 'Security', 'advanced', '#000000'),
    ('750e8400-e29b-41d4-a716-446655440013', 'Sequelize', 'ORM', 'advanced', '#52B0E7'),
    ('750e8400-e29b-41d4-a716-446655440014', 'Vite', 'Build Tools', 'intermediate', '#646CFF'),
    ('750e8400-e29b-41d4-a716-446655440015', 'TailwindCSS', 'Frontend', 'advanced', '#38B2AC')
ON CONFLICT (name) DO NOTHING;

-- Insert sample developer profile
INSERT INTO developers (id, user_id, full_name, title, bio, available_for_hire, years_experience) VALUES
    ('850e8400-e29b-41d4-a716-446655440001',
     '650e8400-e29b-41d4-a716-446655440001',
     'John Doe',
     'Senior Full-Stack Developer',
     'Passionate full-stack developer with 8+ years of experience building scalable web applications using modern technologies. Specialized in Clean Architecture, TypeScript, and cloud-native solutions.',
     TRUE,
     8)
ON CONFLICT (user_id) DO NOTHING;

-- Link skills to developer
INSERT INTO developer_skills (developer_id, skill_id, proficiency_override, years_using, is_primary_skill) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'expert', 8, TRUE),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'expert', 5, TRUE),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', 'advanced', 6, TRUE),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', 'expert', 7, TRUE),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440006', 'advanced', 4, FALSE),
    ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440007', 'intermediate', 3, FALSE)
ON CONFLICT (developer_id, skill_id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, title, slug, description, status, is_featured, is_published, start_date, display_order) VALUES
    ('950e8400-e29b-41d4-a716-446655440001',
     'Portfolio Full-Stack System',
     'portfolio-full-stack-system',
     'Professional portfolio system built with Clean Architecture, featuring user authentication, project showcase, and newsletter subscription.',
     'in_progress',
     TRUE,
     TRUE,
     '2025-01-01',
     1),
    ('950e8400-e29b-41d4-a716-446655440002',
     'E-Commerce Platform',
     'ecommerce-platform',
     'Scalable e-commerce solution with payment integration, inventory management, and real-time notifications.',
     'completed',
     TRUE,
     TRUE,
     '2024-06-01',
     2)
ON CONFLICT (slug) DO NOTHING;

-- Link skills to projects
INSERT INTO project_skills (project_id, skill_id, is_primary_tech) VALUES
    ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', TRUE),
    ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440003', TRUE),
    ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', TRUE),
    ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440006', TRUE),
    ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440010', FALSE),
    ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', TRUE),
    ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440005', TRUE),
    ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440006', TRUE)
ON CONFLICT (project_id, skill_id) DO NOTHING;

-- Insert sample newsletter subscriptions
INSERT INTO emails (email, is_subscribed, subscribed_at) VALUES
    ('subscriber1@example.com', TRUE, CURRENT_TIMESTAMP),
    ('subscriber2@example.com', TRUE, CURRENT_TIMESTAMP),
    ('subscriber3@example.com', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Add comments for seed data
COMMENT ON CONSTRAINT fk_user_roles_user_id ON user_roles IS 'Seeded with admin and user roles';
COMMENT ON CONSTRAINT fk_developer_skills_developer_id ON developer_skills IS 'Seeded with sample developer profile';
COMMENT ON CONSTRAINT fk_project_skills_project_id ON project_skills IS 'Seeded with sample projects';
