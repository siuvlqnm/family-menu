-- 更新 menus 表
DROP TABLE IF EXISTS menus;
CREATE TABLE menus (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'DAILY' CHECK (type IN ('DAILY', 'WEEKLY', 'HOLIDAY', 'SPECIAL')),
  tags TEXT DEFAULT '[]',
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  family_group_id TEXT REFERENCES family_groups(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 更新 menu_items 表
DROP TABLE IF EXISTS menu_items;
CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  menu_id TEXT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL REFERENCES recipes(id),
  date INTEGER NOT NULL,
  meal_time TEXT NOT NULL CHECK (meal_time IN ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK')),
  servings INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 更新 menu_shares 表
DROP TABLE IF EXISTS menu_shares;
CREATE TABLE menu_shares (
  id TEXT PRIMARY KEY,
  menu_id TEXT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('LINK', 'TOKEN')),
  token TEXT UNIQUE,
  expires_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL REFERENCES users(id)
);
