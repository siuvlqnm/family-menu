CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  `password` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `family_groups` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `invite_code` text NOT NULL UNIQUE,
  `created_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `family_members` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `family_group_id` text NOT NULL,
  `role` text NOT NULL CHECK (`role` IN ('admin', 'member')),
  `joined_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`family_group_id`) REFERENCES `family_groups` (`id`) ON DELETE CASCADE
);

CREATE TABLE `recipes` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `description` text,
  `category` text NOT NULL CHECK (`category` IN ('荤菜', '素菜', '汤类', '主食', '小吃')),
  `difficulty` text NOT NULL CHECK (`difficulty` IN ('easy', 'medium', 'hard')),
  `prep_time` integer,
  `cook_time` integer,
  `servings` integer,
  `created_by` text NOT NULL,
  `family_group_id` text,
  `ingredients` text NOT NULL,
  `steps` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  FOREIGN KEY (`family_group_id`) REFERENCES `family_groups` (`id`) ON DELETE CASCADE
);

CREATE TABLE `recipe_shares` (
  `id` text PRIMARY KEY NOT NULL,
  `recipe_id` text NOT NULL,
  `source_family_group_id` text,
  `target_family_group_id` text NOT NULL,
  `share_type` text NOT NULL CHECK (`share_type` IN ('copy', 'link')),
  `shared_by` text NOT NULL,
  `shared_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`source_family_group_id`) REFERENCES `family_groups` (`id`),
  FOREIGN KEY (`target_family_group_id`) REFERENCES `family_groups` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`shared_by`) REFERENCES `users` (`id`)
);

CREATE TABLE `menus` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `start_date` integer NOT NULL,
  `end_date` integer NOT NULL,
  `status` text NOT NULL DEFAULT 'draft' CHECK (`status` IN ('draft', 'published', 'archived')),
  `family_group_id` text NOT NULL,
  `created_by` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`family_group_id`) REFERENCES `family_groups` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
);

CREATE TABLE `menu_items` (
  `id` text PRIMARY KEY NOT NULL,
  `menu_id` text NOT NULL,
  `recipe_id` text NOT NULL,
  `date` integer NOT NULL,
  `meal_time` text NOT NULL CHECK (`meal_time` IN ('breakfast', 'lunch', 'dinner')),
  `note` text,
  `created_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
);
