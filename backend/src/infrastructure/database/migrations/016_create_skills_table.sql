-- Migration: 006_create_skills_table
-- Description: Create skills table with categorization and proficiency levels
-- Author: System Architect
-- Date: 2025-12-11

-- Create ENUM type for proficiency levels
CREATE TYPE skill_proficiency AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    proficiency_level skill_proficiency NOT NULL DEFAULT 'intermediate',
    icon_url VARCHAR(500),
    color_hex VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Unique constraint on name for active records
CREATE UNIQUE INDEX idx_skills_name_unique 
    ON skills (name) 
    WHERE deleted_at IS NULL;

-- Indexes
CREATE INDEX idx_skills_deleted_at 
    ON skills (deleted_at);

CREATE INDEX idx_skills_category_deleted_at 
    ON skills (category, deleted_at);

CREATE INDEX idx_skills_proficiency_level_deleted_at 
    ON skills (proficiency_level, deleted_at);

CREATE INDEX idx_skills_name_trgm 
    ON skills USING gin(name gin_trgm_ops) 
    WHERE deleted_at IS NULL;

-- Enable trigram extension for fuzzy search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Name length constraint
ALTER TABLE skills 
    ADD CONSTRAINT chk_skills_name_length 
    CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 50);

-- Icon URL validation
ALTER TABLE skills 
    ADD CONSTRAINT chk_skills_icon_url_format 
    CHECK (icon_url IS NULL OR icon_url ~* '^https?://');

-- Color hex format validation (#RRGGBB)
ALTER TABLE skills 
    ADD CONSTRAINT chk_skills_color_hex_format 
    CHECK (color_hex IS NULL OR color_hex ~* '^#[0-9A-Fa-f]{6}$');

-- Updated_at trigger
CREATE TRIGGER trigger_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE skills IS 'Technical skills with categorization and proficiency tracking';
COMMENT ON COLUMN skills.proficiency_level IS 'Skill proficiency: beginner, intermediate, advanced, expert';
COMMENT ON COLUMN skills.color_hex IS 'Hex color code for UI display (e.g., #FF5733)';
