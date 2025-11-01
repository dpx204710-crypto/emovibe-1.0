-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text,
    country text CHECK (country IN ('China', 'USA')),
    gender text CHECK (gender IN ('Male','Female','Other')),
    role text CHECK (role IN ('user','counselor','admin')) DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now()
);

-- Memberships
CREATE TABLE IF NOT EXISTS memberships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    type text CHECK (type IN ('weekly','monthly')) DEFAULT 'weekly',
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    price numeric(10,2) DEFAULT 99,
    status text CHECK (status IN ('active','expired','cancelled')) DEFAULT 'active'
);

-- AI Roles
CREATE TABLE IF NOT EXISTS ai_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    personality text,
    preferences jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Chats
