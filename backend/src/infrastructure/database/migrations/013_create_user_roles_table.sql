-- Migration: 003_create_user_roles_table
-- Description: Create user_roles junction table for N:N relationship between users and roles
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite primary key
    PRIMARY KEY (user_id, role_id),
    
    -- Foreign key constraints
    CONSTRAINT fk_user_roles_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_user_roles_role_id 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_user_roles_assigned_by 
        FOREIGN KEY (assigned_by) 
        REFERENCES users(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Indexes for foreign key lookups
CREATE INDEX idx_user_roles_user_id 
    ON user_roles (user_id);

CREATE INDEX idx_user_roles_role_id 
    ON user_roles (role_id);

CREATE INDEX idx_user_roles_assigned_by 
    ON user_roles (assigned_by) 
    WHERE assigned_by IS NOT NULL;

-- Index for audit queries
CREATE INDEX idx_user_roles_assigned_at 
    ON user_roles (assigned_at DESC);

-- Comments
COMMENT ON TABLE user_roles IS 'Junction table for N:N relationship between users and roles';
COMMENT ON COLUMN user_roles.assigned_by IS 'User ID who assigned this role (audit trail)';
COMMENT ON COLUMN user_roles.assigned_at IS 'Timestamp when role was assigned';
