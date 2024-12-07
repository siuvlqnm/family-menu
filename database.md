# Database Design

## Overview

The Family Menu application uses PostgreSQL as its primary database. The schema is designed to support all the core features including user management, recipe management, menu planning, shopping lists, and inventory tracking.

## Tables

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Family Groups
```sql
CREATE TABLE family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_family_groups_invite_code ON family_groups(invite_code);
```

### Family Members
```sql
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, family_group_id)
);

CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_family_members_family_group_id ON family_members(family_group_id);
```

### Recipes
```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('荤菜', '素菜', '汤类', '主食', '小吃')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    created_by UUID NOT NULL REFERENCES users(id),
    family_group_id UUID REFERENCES family_groups(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_created_by ON recipes(created_by);
CREATE INDEX idx_recipes_family_group_id ON recipes(family_group_id);
CREATE INDEX idx_recipes_category ON recipes(category);
```

### Recipe Ingredients
```sql
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('g', 'ml', '个', '只', '根', '片', '勺', '适量')),
    order_index INTEGER NOT NULL,
    UNIQUE(recipe_id, order_index)
);

CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
```

### Recipe Steps
```sql
CREATE TABLE recipe_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    duration INTEGER,
    order_index INTEGER NOT NULL,
    UNIQUE(recipe_id, order_index)
);

CREATE INDEX idx_recipe_steps_recipe_id ON recipe_steps(recipe_id);
```

### Menus
```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menus_family_group_id ON menus(family_group_id);
CREATE INDEX idx_menus_date_range ON menus(start_date, end_date);
```

### Menu Items
```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id),
    planned_date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    servings INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_recipe_id ON menu_items(recipe_id);
CREATE INDEX idx_menu_items_planned_date ON menu_items(planned_date);
```

### Shopping Lists
```sql
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shopping_lists_family_group_id ON shopping_lists(family_group_id);
CREATE INDEX idx_shopping_lists_status ON shopping_lists(status);
```

### Shopping List Items
```sql
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'purchased')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shopping_list_items_shopping_list_id ON shopping_list_items(shopping_list_id);
CREATE INDEX idx_shopping_list_items_status ON shopping_list_items(status);
```

## Relationships

1. Users & Family Groups (Many-to-Many through Family Members)
   - A user can belong to multiple family groups
   - A family group can have multiple users
   - The relationship includes a role (admin/member)

2. Recipes & Users (One-to-Many)
   - Each recipe is created by one user
   - A user can create multiple recipes
   - Recipes can optionally belong to a family group

3. Recipes & Ingredients (One-to-Many)
   - Each recipe has multiple ingredients
   - Each ingredient belongs to one recipe
   - Ingredients are ordered within a recipe

4. Recipes & Steps (One-to-Many)
   - Each recipe has multiple steps
   - Each step belongs to one recipe
   - Steps are ordered within a recipe

5. Menus & Recipes (Many-to-Many through Menu Items)
   - A menu can include multiple recipes
   - A recipe can be used in multiple menus
   - The relationship includes date and meal type

6. Shopping Lists & Items (One-to-Many)
   - Each shopping list has multiple items
   - Each item belongs to one shopping list

## Database Functions and Triggers

1. Updated At Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables with updated_at column
```

## Indexes

All foreign keys and frequently queried columns have been indexed to improve query performance. Additional indexes may be added based on query patterns observed in production.

## Data Types

- UUID: Used for all primary keys and foreign keys
- TIMESTAMP WITH TIME ZONE: Used for all timestamps to ensure proper timezone handling
- VARCHAR: Used for strings with known maximum lengths
- TEXT: Used for longer strings without a specific length limit
- DECIMAL: Used for precise numeric values (e.g., amounts)
- INTEGER: Used for whole numbers
- DATE: Used for calendar dates without time components

## Security Considerations

1. Passwords are stored as hashes only
2. All tables use UUIDs instead of sequential IDs
3. Foreign key constraints ensure referential integrity
4. Check constraints ensure data validity
5. Unique constraints prevent duplicate records where necessary

## Migration Strategy

Migrations will be managed using golang-migrate. Each change to the schema will be versioned and can be rolled back if needed.

Example migration file structure:
```
migrations/
├── 000001_create_users_table.up.sql
├── 000001_create_users_table.down.sql
├── 000002_create_family_groups_table.up.sql
├── 000002_create_family_groups_table.down.sql
...
```
