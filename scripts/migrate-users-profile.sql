-- ============================================
-- MIGRATION SCRIPT: Update Users Table for Profile Feature
-- ============================================
-- This script updates the existing users table to add new profile fields
-- Run this if you already have a users table and want to add the new columns

USE xplorin_db;

-- Add new columns to users table (if they don't exist)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL COMMENT 'Phone number with country code' AFTER full_name,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE DEFAULT NULL COMMENT 'User date of birth' AFTER phone_number,
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT NULL COMMENT 'Country name' AFTER date_of_birth,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT NULL COMMENT 'City name' AFTER country,
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20) DEFAULT NULL COMMENT 'Postal/ZIP code' AFTER city,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT NULL COMMENT 'Full location string (City, Country)' AFTER postal_code,
  ADD COLUMN IF NOT EXISTS profile_picture MEDIUMTEXT DEFAULT NULL COMMENT 'Base64 encoded profile picture or URL' AFTER location;

-- If your table has 'phone' column instead of 'phone_number', rename it
-- ALTER TABLE users CHANGE phone phone_number VARCHAR(20) DEFAULT NULL COMMENT 'Phone number with country code';

-- Verify the changes
DESCRIBE users;

-- Optional: Update existing users to set location from city and country
UPDATE users 
SET location = CONCAT(COALESCE(city, ''), ', ', COALESCE(country, ''))
WHERE city IS NOT NULL AND country IS NOT NULL AND location IS NULL;

SELECT 'Migration completed successfully!' as message;
