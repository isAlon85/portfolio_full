-- Migration: 005_create_developers_table
-- Description: Create developers table with profile information and social links
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS developers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    bio TEXT,
    profile_image_url VARCHAR(500),
    resume_url VARCHAR(500),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    website_url VARCHAR(255),
    location VARCHAR(100),
    years_experience INTEGER,
    available_for_hire BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign key constraint
    CONSTRAINT fk_developers_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Unique constraint on user_id for active records
CREATE UNIQUE INDEX idx_developers_user_id_unique 
    ON developers (user_id) 
    WHERE deleted_at IS NULL AND user_id IS NOT NULL;

-- Indexes
CREATE INDEX idx_developers_deleted_at 
    ON developers (deleted_at);

CREATE INDEX idx_developers_available_for_hire_deleted_at 
    ON developers (available_for_hire, deleted_at);

CREATE INDEX idx_developers_full_name 
    ON developers (full_name) 
    WHERE deleted_at IS NULL;

-- URL validation constraints
ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_profile_image_url_format 
    CHECK (profile_image_url IS NULL OR profile_image_url ~* '^https?://');

ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_resume_url_format 
    CHECK (resume_url IS NULL OR resume_url ~* '^https?://');

ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_github_url_format 
    CHECK (github_url IS NULL OR github_url ~* '^https?://');

ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_linkedin_url_format 
    CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://');

ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_twitter_url_format 
    CHECK (twitter_url IS NULL OR twitter_url ~* '^https?://');

ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_website_url_format 
    CHECK (website_url IS NULL OR website_url ~* '^https?://');

-- Years experience constraint
ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_years_experience_range 
    CHECK (years_experience IS NULL OR (years_experience >= 0 AND years_experience <= 100));

-- Full name length constraint
ALTER TABLE developers 
    ADD CONSTRAINT chk_developers_full_name_length 
    CHECK (LENGTH(full_name) >= 2 AND LENGTH(full_name) <= 100);

-- Updated_at trigger
CREATE TRIGGER trigger_developers_updated_at
    BEFORE UPDATE ON developers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE developers IS 'Developer profiles with professional information and social links';
COMMENT ON COLUMN developers.user_id IS 'Optional link to user account (NULL for public profiles)';
COMMENT ON COLUMN developers.available_for_hire IS 'Hiring availability status';
COMMENT ON COLUMN developers.years_experience IS 'Years of professional experience';
