-- Migration: 004_create_emails_table
-- Description: Create emails table for newsletter subscription management
-- Author: System Architect
-- Date: 2025-12-11

CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    is_subscribed BOOLEAN NOT NULL DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Unique constraint on email for active records
CREATE UNIQUE INDEX idx_emails_email_unique 
    ON emails (email) 
    WHERE deleted_at IS NULL;

-- Composite indexes for queries
CREATE INDEX idx_emails_deleted_at 
    ON emails (deleted_at);

CREATE INDEX idx_emails_is_subscribed_deleted_at 
    ON emails (is_subscribed, deleted_at);

CREATE INDEX idx_emails_subscribed_at 
    ON emails (subscribed_at DESC) 
    WHERE is_subscribed = TRUE AND deleted_at IS NULL;

-- Email format validation
ALTER TABLE emails 
    ADD CONSTRAINT chk_emails_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Logical constraint: unsubscribed_at should be NULL when is_subscribed is TRUE
ALTER TABLE emails 
    ADD CONSTRAINT chk_emails_subscription_logic 
    CHECK (
        (is_subscribed = TRUE AND unsubscribed_at IS NULL) OR
        (is_subscribed = FALSE AND unsubscribed_at IS NOT NULL)
    );

-- Updated_at trigger
CREATE TRIGGER trigger_emails_updated_at
    BEFORE UPDATE ON emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE emails IS 'Newsletter email subscriptions with opt-in/opt-out tracking';
COMMENT ON COLUMN emails.is_subscribed IS 'Current subscription status';
COMMENT ON COLUMN emails.unsubscribed_at IS 'Timestamp when user unsubscribed (NULL if subscribed)';
