-- Migration: 007_create_developer_skills_table
-- Description: Create developer_skills junction table for N:N relationship
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS developer_skills (
    developer_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    proficiency_override skill_proficiency,
    years_using INTEGER,
    is_primary_skill BOOLEAN NOT NULL DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite primary key
    PRIMARY KEY (developer_id, skill_id),
    
    -- Foreign key constraints
    CONSTRAINT fk_developer_skills_developer_id 
        FOREIGN KEY (developer_id) 
        REFERENCES developers(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_developer_skills_skill_id 
        FOREIGN KEY (skill_id) 
        REFERENCES skills(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Indexes for foreign key lookups
CREATE INDEX idx_developer_skills_developer_id 
    ON developer_skills (developer_id);

CREATE INDEX idx_developer_skills_skill_id 
    ON developer_skills (skill_id);

CREATE INDEX idx_developer_skills_is_primary 
    ON developer_skills (developer_id, is_primary_skill) 
    WHERE is_primary_skill = TRUE;

CREATE INDEX idx_developer_skills_proficiency_override 
    ON developer_skills (proficiency_override) 
    WHERE proficiency_override IS NOT NULL;

-- Years using constraint
ALTER TABLE developer_skills 
    ADD CONSTRAINT chk_developer_skills_years_using_range 
    CHECK (years_using IS NULL OR (years_using >= 0 AND years_using <= 50));

-- Comments
COMMENT ON TABLE developer_skills IS 'Junction table linking developers to skills with additional metadata';
COMMENT ON COLUMN developer_skills.proficiency_override IS 'Override skill proficiency for this developer (NULL = use skill default)';
COMMENT ON COLUMN developer_skills.years_using IS 'Years of experience using this skill';
COMMENT ON COLUMN developer_skills.is_primary_skill IS 'Mark as primary/featured skill for developer';
