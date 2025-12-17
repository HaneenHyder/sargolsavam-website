-- Add payment columns to appeals table
ALTER TABLE appeals 
ADD COLUMN IF NOT EXISTS payment_order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
