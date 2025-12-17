-- Add display_order column to committee_members
ALTER TABLE committee_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
