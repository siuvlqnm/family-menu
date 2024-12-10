-- 创建用户表
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建家庭组表
DROP TABLE IF EXISTS family_groups;
CREATE TABLE family_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建家庭组成员表
DROP TABLE IF EXISTS family_members;
CREATE TABLE family_members (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_group_id TEXT NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('admin', 'member')),
  joined_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建食谱表
DROP TABLE IF EXISTS recipes;
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK(category IN ('MEAT', 'VEGETABLE', 'SOUP', 'STAPLE', 'SNACK')),
  difficulty TEXT NOT NULL CHECK(difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  created_by TEXT NOT NULL REFERENCES users(id),
  family_group_id TEXT REFERENCES family_groups(id) ON DELETE CASCADE,
  ingredients TEXT NOT NULL,
  steps TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建食谱共享表
DROP TABLE IF EXISTS recipe_shares;
CREATE TABLE recipe_shares (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  source_family_group_id TEXT REFERENCES family_groups(id),
  target_family_group_id TEXT NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);
