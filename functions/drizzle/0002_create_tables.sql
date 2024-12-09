-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;

-- Create tables with correct column names
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
