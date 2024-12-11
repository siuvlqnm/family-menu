import { User } from './auth';
import { Ingredient } from './recipes';

export interface ShoppingItem extends Ingredient {
  completed: boolean;
  completedBy?: User;
  completedAt?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  createdBy: User;
  sharedWith: User[];
  status: 'active' | 'completed';
  menuId?: string;
}

export interface ShoppingFilters {
  status?: ShoppingList['status'];
  date?: string;
  search?: string;
}
