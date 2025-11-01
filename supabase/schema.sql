-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
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

-- Memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    type text CHECK (type IN ('weekly','monthly')) DEFAULT 'weekly',
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    price numeric(10,2) DEFAULT 99,
    status text CHECK (status IN ('active','expired','cancelled')) DEFAULT 'active'
);

-- AI Roles table
CREATE TABLE IF NOT EXISTS ai_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    personality text,
    preferences jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    counselor_id uuid REFERENCES users(id),
    ai_role_id uuid REFERENCES ai_roles(id),
    status text CHECK (status IN ('active','closed')) DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    text text NOT NULL,
    type text CHECK (type IN ('user','counselor','ai')) DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now()
);

-- Tree Holes table
CREATE TABLE IF NOT EXISTS tree_holes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    content text NOT NULL,
    anonymous boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Trials table (for 1-hour free trial)
CREATE TABLE IF NOT EXISTS trials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    chat_id uuid REFERENCES chats(id),
    start_time timestamp with time zone DEFAULT now(),
    end_time timestamp,
    duration_minutes int DEFAULT 60,
    used boolean DEFAULT false
);