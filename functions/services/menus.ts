import { and, between, eq, isNull, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { Database, familyMembers, menuItems, menuShares, menus, recipes } from '../db';
import {
  AddMenuItemInput,
  CreateMenuInput,
  CreateMenuShareInput,
  Menu,
  MenuQueryInput,
  MenuShare,
  MenuStatus,
  MenuWithItems,
  UpdateMenuInput,
  UpdateMenuItemInput,
} from '../types/menu';
import { AuthUser } from '../types/auth';
import { nanoid } from '../utils/id';

export class MenuService {
  constructor(private db: Database) {}

  // 检查用户是否是家庭组成员
  private async checkFamilyMembership(familyGroupId: string, userId: string): Promise<void> {
    const member = await this.db.query.familyMembers.findFirst({
      where: and(
        eq(familyMembers.familyGroupId, familyGroupId),
        eq(familyMembers.userId, userId)
      ),
    });

    if (!member) {
      throw new HTTPException(403, { message: 'Not a member of this family group' });
    }
  }

  // 创建菜单
  async createMenu(input: CreateMenuInput, user: AuthUser): Promise<Menu> {
    // 检查家庭组成员权限
    await this.checkFamilyMembership(input.familyGroupId, user.id);

    // 验证日期
    if (input.startDate > input.endDate) {
      throw new HTTPException(400, { message: 'Start date must be before end date' });
    }

    // 创建菜单
    const menuData = {
      id: nanoid(),
      name: input.name,
      description: input.description || undefined,
      type: input.type,
      tags: input.tags || [],
      startDate: input.startDate,
      endDate: input.endDate,
      familyGroupId: input.familyGroupId,
      createdBy: user.id,
    } satisfies Omit<Menu, 'createdAt' | 'updatedAt'>;

    const [menu] = await this.db.insert(menus).values(menuData).returning();

    return menu;
  }

  // 更新菜单
  async updateMenu(id: string, input: UpdateMenuInput, user: AuthUser): Promise<Menu> {
    // 获取菜单
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, id),
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menu.familyGroupId, user.id);

    // 只有创建者可以更新
    if (menu.createdBy !== user.id) {
      throw new HTTPException(403, { message: 'Not authorized to update this menu' });
    }

    // 验证日期
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new HTTPException(400, { message: 'Start date must be before end date' });
    }

    // 更新菜单
    const [updatedMenu] = await this.db.update(menus)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(menus.id, id))
      .returning();

    return updatedMenu;
  }

  // 获取菜单详情
  async getMenu(id: string, user: AuthUser): Promise<MenuWithItems> {
    // 获取菜单
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, id),
      with: {
        items: {
          with: {
            recipe: true,
          },
        },
      },
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menu.familyGroupId, user.id);

    return menu;
  }

  // 查询菜单列表
  async getMenus(query: MenuQueryInput, user: AuthUser): Promise<{
    menus: Menu[];
    total: number;
  }> {
    // 检查家庭组成员权限
    await this.checkFamilyMembership(query.familyGroupId, user.id);

    // 构建查询条件
    const conditions = [
      eq(menus.familyGroupId, query.familyGroupId),
    ];

    if (query.status) {
      conditions.push(eq(menus.status, query.status));
    }

    if (query.startDate && query.endDate) {
      conditions.push(
        between(menus.startDate, query.startDate, query.endDate)
      );
    }

    // 计算分页
    const offset = (query.page - 1) * query.limit;

    // 查询菜单
    const [menuList, [{ count }]] = await Promise.all([
      this.db.query.menus.findMany({
        where: and(...conditions),
        limit: query.limit,
        offset,
        orderBy: (menus, { desc }) => [desc(menus.createdAt)],
      }),
      this.db.select({ count: sql`count(*)` })
        .from(menus)
        .where(and(...conditions)),
    ]);

    return {
      menus: menuList,
      total: Number(count),
    };
  }

  // 添加菜单项
  async addMenuItem(menuId: string, input: AddMenuItemInput, user: AuthUser): Promise<MenuItem> {
    // 获取菜单
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, menuId),
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menu.familyGroupId, user.id);

    // 检查日期是否在菜单范围内
    if (input.date < menu.startDate || input.date > menu.endDate) {
      throw new HTTPException(400, { message: 'Date must be within menu date range' });
    }

    // 检查食谱是否存在且属于家庭组
    const recipe = await this.db.query.recipes.findFirst({
      where: eq(recipes.id, input.recipeId),
    });

    if (!recipe || recipe.familyGroupId !== menu.familyGroupId) {
      throw new HTTPException(404, { message: 'Recipe not found in family group' });
    }

    // 添加菜单项
    const [menuItem] = await this.db.insert(menuItems).values({
      id: nanoid(),
      menuId,
      recipeId: input.recipeId,
      date: input.date,
      mealTime: input.mealTime,
      note: input.note,
    }).returning();

    return {
      ...menuItem,
      recipe: {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
      },
    };
  }

  // 更新菜单项
  async updateMenuItem(
    menuId: string,
    itemId: string,
    input: UpdateMenuItemInput,
    user: AuthUser
  ): Promise<MenuItem> {
    // 获取菜单项
    const menuItem = await this.db.query.menuItems.findFirst({
      where: and(
        eq(menuItems.id, itemId),
        eq(menuItems.menuId, menuId)
      ),
      with: {
        menu: true,
        recipe: true,
      },
    });

    if (!menuItem) {
      throw new HTTPException(404, { message: 'Menu item not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menuItem.menu.familyGroupId, user.id);

    // 更新菜单项
    const [updatedMenuItem] = await this.db.update(menuItems)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, itemId))
      .returning();

    return {
      ...updatedMenuItem,
      recipe: {
        id: menuItem.recipe.id,
        title: menuItem.recipe.title,
        description: menuItem.recipe.description,
        category: menuItem.recipe.category,
        difficulty: menuItem.recipe.difficulty,
      },
    };
  }

  // 删除菜单项
  async deleteMenuItem(menuId: string, itemId: string, user: AuthUser): Promise<void> {
    // 获取菜单项
    const menuItem = await this.db.query.menuItems.findFirst({
      where: and(
        eq(menuItems.id, itemId),
        eq(menuItems.menuId, menuId)
      ),
      with: {
        menu: true,
      },
    });

    if (!menuItem) {
      throw new HTTPException(404, { message: 'Menu item not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menuItem.menu.familyGroupId, user.id);

    // 删除菜单项
    await this.db.delete(menuItems)
      .where(eq(menuItems.id, itemId));
  }

  // 创建菜单分享
  async createMenuShare(menuId: string, input: CreateMenuShareInput, user: AuthUser): Promise<MenuShare> {
    // 获取菜单
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, menuId),
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menu.familyGroupId, user.id);

    // 生成分享记录
    const [share] = await this.db.insert(menuShares).values({
      id: nanoid(),
      menuId,
      shareType: input.shareType,
      token: input.shareType === 'token' ? nanoid(32) : null,
      expiresAt: input.expiresAt,
      createdBy: user.id,
    }).returning();

    return share;
  }

  // 通过分享链接获取菜单
  async getSharedMenu(shareId: string, token?: string): Promise<MenuWithItems> {
    // 获取分享记录
    const share = await this.db.query.menuShares.findFirst({
      where: eq(menuShares.id, shareId),
    });

    if (!share) {
      throw new HTTPException(404, { message: 'Share not found' });
    }

    // 检查是否过期
    if (share.expiresAt && share.expiresAt < new Date()) {
      throw new HTTPException(403, { message: 'Share has expired' });
    }

    // 如果是token类型，验证token
    if (share.shareType === 'token') {
      if (!token || token !== share.token) {
        throw new HTTPException(403, { message: 'Invalid token' });
      }
    }

    // 获取菜单详情
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, share.menuId),
      with: {
        items: {
          with: {
            recipe: true,
          },
        },
      },
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    return menu;
  }

  // 获取菜单的分享列表
  async getMenuShares(menuId: string, user: AuthUser): Promise<MenuShare[]> {
    // 获取菜单
    const menu = await this.db.query.menus.findFirst({
      where: eq(menus.id, menuId),
    });

    if (!menu) {
      throw new HTTPException(404, { message: 'Menu not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(menu.familyGroupId, user.id);

    // 获取分享列表
    const shares = await this.db.query.menuShares.findMany({
      where: eq(menuShares.menuId, menuId),
    });

    return shares;
  }

  // 删除菜单分享
  async deleteMenuShare(shareId: string, user: AuthUser): Promise<void> {
    // 获取分享记录
    const share = await this.db.query.menuShares.findFirst({
      where: eq(menuShares.id, shareId),
      with: {
        menu: true,
      },
    });

    if (!share) {
      throw new HTTPException(404, { message: 'Share not found' });
    }

    // 检查家庭组成员权限
    await this.checkFamilyMembership(share.menu.familyGroupId, user.id);

    // 删除分享记录
    await this.db.delete(menuShares)
      .where(eq(menuShares.id, shareId));
  }
}
