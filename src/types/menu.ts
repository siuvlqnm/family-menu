import { User } from './auth';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  servings: number;
  recipeId: string;
  notes?: string;
}

export interface Menu {
  id: string;
  name: string;
  date: string;
  createdBy: User;
  items: MenuItem[];
  status: 'draft' | 'active' | 'completed';
  sharedWith: User[];
}

export interface MenuFilters {
  status?: Menu['status'];
  date?: string;
  search?: string;
}
