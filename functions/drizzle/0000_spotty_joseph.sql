DROP TABLE IF EXISTS family_groups;
CREATE TABLE `family_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`invite_code` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS family_members;
--> statement-breakpoint
CREATE UNIQUE INDEX `family_groups_invite_code_unique` ON `family_groups` (`invite_code`);--> statement-breakpoint
CREATE TABLE `family_members` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`family_group_id` text NOT NULL,
	`role` text NOT NULL,
	`joined_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`family_group_id`) REFERENCES `family_groups`(`id`) ON UPDATE no action ON DELETE cascade
);

DROP TABLE IF EXISTS menu_items;
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` text PRIMARY KEY NOT NULL,
	`menu_id` text NOT NULL,
	`recipe_id` text NOT NULL,
	`date` integer NOT NULL,
	`meal_time` text NOT NULL,
	`note` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);

DROP TABLE IF EXISTS menus;
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`family_group_id` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`family_group_id`) REFERENCES `family_groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

DROP TABLE IF EXISTS recipe_shares;
--> statement-breakpoint
CREATE TABLE `recipe_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`recipe_id` text NOT NULL,
	`source_family_group_id` text,
	`target_family_group_id` text NOT NULL,
	`share_type` text NOT NULL,
	`shared_by` text NOT NULL,
	`shared_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_family_group_id`) REFERENCES `family_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_family_group_id`) REFERENCES `family_groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`shared_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

DROP TABLE IF EXISTS recipes;
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`difficulty` text NOT NULL,
	`prep_time` integer,
	`cook_time` integer,
	`servings` integer,
	`created_by` text NOT NULL,
	`family_group_id` text,
	`ingredients` text NOT NULL,
	`steps` text NOT NULL,
	`favorites` integer DEFAULT 0 NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	`tags` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`family_group_id`) REFERENCES `family_groups`(`id`) ON UPDATE no action ON DELETE cascade
);

DROP TABLE IF EXISTS users;
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);