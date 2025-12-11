-- Migration: 002_create_users_table
-- Description: Create users table with authentication fields, profile data, and soft delete
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Unique constraints for active records only
CREATE UNIQUE INDEX idx_users_email_unique 
    ON users (email) 
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX idx_users_username_unique 
    ON users (username) 
    WHERE deleted_at IS NULL;

-- Composite indexes for common queries
CREATE INDEX idx_users_deleted_at_id 
    ON users (deleted_at, id);

CREATE INDEX idx_users_is_active_deleted_at 
    ON users (is_active, deleted_at);

CREATE INDEX idx_users_email_verified_deleted_at 
    ON users (email_verified, deleted_at);

-- Indexes for authentication lookups
CREATE INDEX idx_users_email_lower 
    ON users (LOWER(email)) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_users_username_lower 
    ON users (LOWER(username)) 
    WHERE deleted_at IS NULL;

-- Email format validation constraint
ALTER TABLE users 
    ADD CONSTRAINT chk_users_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Username format constraint (alphanumeric and underscore only)
ALTER TABLE users 
    ADD CONSTRAINT chk_users_username_format 
    CHECK (username ~* '^[a-zA-Z0-9_]+$');

-- Username length constraint
ALTER TABLE users 
    ADD CONSTRAINT chk_users_username_length 
    CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50);

-- Avatar URL validation (basic URL format)
ALTER TABLE users 
    ADD CONSTRAINT chk_users_avatar_url_format 
    CHECK (avatar_url IS NULL OR avatar_url ~* '^https?://');

-- Password hash length constraint (bcrypt generates 60 chars)
ALTER TABLE users 
    ADD CONSTRAINT chk_users_password_hash_length 
    CHECK (LENGTH(password_hash) >= 60);

-- Updated_at trigger
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE users IS 'Application users with authentication and profile data';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hash with 12 salt rounds';
COMMENT ON COLUMN users.is_active IS 'Account active status (deactivated accounts cannot login)';
COMMENT ON COLUMN users.email_verified IS 'Email verification status via token';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of last successful authentication';
