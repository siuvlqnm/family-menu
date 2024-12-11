import { Menu } from '@/types/menu';
import { Recipe } from '@/types/recipes';
import { ShoppingList } from '@/types/shopping';
import { User } from '@/types/auth';

export const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  familyGroups: [
    {
      id: '1',
      name: 'Doe Family',
      members: [],
      inviteCode: 'DOE123',
    },
  ],
};

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: '红烧肉',
    description: '经典的红烧肉做法，肥而不腻，入口即化',
    category: '荤菜',
    servings: 4,
    prepTime: 15,
    cookTime: 60,
    difficulty: 'medium',
    ingredients: [
      {
        id: '1',
        name: '五花肉',
        amount: 500,
        unit: '克'
      },
      {
        id: '2',
        name: '生抽',
        amount: 30,
        unit: '毫升'
      }
    ],
    steps: [
      {
        id: '1',
        order: 1,
        description: '将五花肉切成大块'
      },
      {
        id: '2',
        order: 2,
        description: '冷水下锅焯烫去腥'
      }
    ],
    images: [],
    createdBy: mockUser,
    tags: ['家常菜', '红烧'],
    favorites: 128,
    rating: 4.5
  }
];

export const mockMenus: Menu[] = [
  {
    id: '1',
    name: '周末家庭聚餐',
    date: '2023-12-25',
    createdBy: mockUser,
    items: [
      {
        id: '1',
        name: '红烧肉',
        description: '经典的红烧肉',
        servings: 4,
        recipeId: '1'
      }
    ],
    status: 'active',
    sharedWith: []
  }
];

export const mockShoppingLists: ShoppingList[] = [
  {
    id: '1',
    name: '周末采购清单',
    date: '2023-12-25',
    items: [
      {
        id: '1',
        name: '五花肉',
        amount: 500,
        unit: '克',
        completed: false
      },
      {
        id: '2',
        name: '生抽',
        amount: 30,
        unit: '毫升',
        completed: true,
        completedBy: mockUser,
        completedAt: '2023-12-24T10:00:00Z'
      }
    ],
    createdBy: mockUser,
    sharedWith: [],
    status: 'active'
  }
];
