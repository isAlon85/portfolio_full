-- Migration: 001_create_roles_table
-- Description: Create roles table with UUID primary key, unique name constraint, and soft delete support
-- Author: System Architect
-- Date: 2025-12-11

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create unique constraint on name excluding soft-deleted records
CREATE UNIQUE INDEX idx_roles_name_unique 
    ON roles (name) 
    WHERE deleted_at IS NULL;

-- Create index for soft delete queries
CREATE INDEX idx_roles_deleted_at 
    ON roles (deleted_at);

-- Create composite index for efficient filtering
CREATE INDEX idx_roles_deleted_at_id 
    ON roles (deleted_at, id);

-- Add lowercase constraint check
ALTER TABLE roles 
    ADD CONSTRAINT chk_roles_name_lowercase 
    CHECK (name = LOWER(name));

-- Add length constraint
ALTER TABLE roles 
    ADD CONSTRAINT chk_roles_name_length 
    CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 50);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE roles IS 'User roles for RBAC (Role-Based Access Control)';
COMMENT ON COLUMN roles.id IS 'UUID primary key generated with uuid_generate_v4()';
COMMENT ON COLUMN roles.name IS 'Unique lowercase role name (e.g., admin, user)';
COMMENT ON COLUMN roles.deleted_at IS 'Soft delete timestamp (NULL = active record)';
