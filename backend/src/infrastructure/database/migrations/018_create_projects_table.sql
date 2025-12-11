-- Migration: 008_create_projects_table
-- Description: Create projects table with portfolio project information
-- Author: System Architect
-- Date: 2025-12-11

-- Create ENUM type for project status
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled');

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    long_description TEXT,
    thumbnail_url VARCHAR(500),
    demo_url VARCHAR(500),
    repo_url VARCHAR(500),
    status project_status NOT NULL DEFAULT 'planning',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    display_order INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Unique constraint on slug for active records
CREATE UNIQUE INDEX idx_projects_slug_unique 
    ON projects (slug) 
    WHERE deleted_at IS NULL;

-- Composite indexes for common queries
CREATE INDEX idx_projects_deleted_at_id 
    ON projects (deleted_at, id);

CREATE INDEX idx_projects_status_published_deleted_at 
    ON projects (status, is_published, deleted_at);

CREATE INDEX idx_projects_featured_published_deleted_at 
    ON projects (is_featured, is_published, deleted_at);

CREATE INDEX idx_projects_display_order_deleted_at 
    ON projects (display_order ASC, deleted_at);

CREATE INDEX idx_projects_created_at_deleted_at 
    ON projects (created_at DESC, deleted_at);

CREATE INDEX idx_projects_views_count 
    ON projects (views_count DESC) 
    WHERE is_published = TRUE AND deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_projects_title_trgm 
    ON projects USING gin(title gin_trgm_ops) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_projects_description_trgm 
    ON projects USING gin(description gin_trgm_ops) 
    WHERE deleted_at IS NULL;

-- Title length constraint
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_title_length 
    CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 150);

-- Slug format constraint (lowercase alphanumeric and hyphens only)
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_slug_format 
    CHECK (slug ~* '^[a-z0-9-]+$');

-- URL validation constraints
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_thumbnail_url_format 
    CHECK (thumbnail_url IS NULL OR thumbnail_url ~* '^https?://');

ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_demo_url_format 
    CHECK (demo_url IS NULL OR demo_url ~* '^https?://');

ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_repo_url_format 
    CHECK (repo_url IS NULL OR repo_url ~* '^https?://');

-- Date logic constraint
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_date_logic 
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date);

-- Display order constraint
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_display_order_positive 
    CHECK (display_order >= 0);

-- Views count constraint
ALTER TABLE projects 
    ADD CONSTRAINT chk_projects_views_count_non_negative 
    CHECK (views_count >= 0);

-- Updated_at trigger
CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE projects IS 'Portfolio projects with metadata, links, and publication status';
COMMENT ON COLUMN projects.slug IS 'URL-friendly unique identifier (lowercase-with-hyphens)';
COMMENT ON COLUMN projects.is_featured IS 'Display prominently on homepage';
COMMENT ON COLUMN projects.is_published IS 'Visibility status (unpublished projects hidden from public)';
COMMENT ON COLUMN projects.display_order IS 'Manual ordering for display (lower numbers first)';
COMMENT ON COLUMN projects.views_count IS 'Page view counter';
