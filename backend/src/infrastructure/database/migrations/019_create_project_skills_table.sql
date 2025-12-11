-- Migration: 009_create_project_skills_table
-- Description: Create project_skills junction table for N:N relationship
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS project_skills (
    project_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    is_primary_tech BOOLEAN NOT NULL DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite primary key
    PRIMARY KEY (project_id, skill_id),
    
    -- Foreign key constraints
    CONSTRAINT fk_project_skills_project_id 
        FOREIGN KEY (project_id) 
        REFERENCES projects(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_project_skills_skill_id 
        FOREIGN KEY (skill_id) 
        REFERENCES skills(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

-- Indexes for foreign key lookups
CREATE INDEX idx_project_skills_project_id 
    ON project_skills (project_id);

CREATE INDEX idx_project_skills_skill_id 
    ON project_skills (skill_id);

CREATE INDEX idx_project_skills_is_primary_tech 
    ON project_skills (project_id, is_primary_tech) 
    WHERE is_primary_tech = TRUE;

-- Comments
COMMENT ON TABLE project_skills IS 'Junction table linking projects to skills/technologies used';
COMMENT ON COLUMN project_skills.is_primary_tech IS 'Mark as primary/featured technology for project';
