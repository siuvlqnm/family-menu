import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  addMenuItemSchema,
  createMenuSchema,
  createMenuShareSchema,
  menuQuerySchema,
  updateMenuItemSchema,
  updateMenuSchema,
} from '../types/menu';
import { MenuService } from '../services/menus';
import { createDb } from '../db';
import { getCurrentUser } from '../middleware/auth';
import { Bindings } from '../config';

const menu = new Hono<{ Bindings: Bindings }>();

// 创建菜单
menu.post(
  '/',
  zValidator('json', createMenuSchema),
  async (c) => {
    const input = c.req.valid('json');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const newMenu = await menuService.createMenu(input, user);
    
    return c.json(newMenu, 201);
  }
);

// 更新菜单
menu.put(
  '/:id',
  zValidator('json', updateMenuSchema),
  async (c) => {
    const id = c.req.param('id');
    const input = c.req.valid('json');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const updatedMenu = await menuService.updateMenu(id, input, user);
    
    return c.json(updatedMenu);
  }
);

// 获取菜单详情
menu.get(
  '/:id',
  async (c) => {
    const id = c.req.param('id');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const menu = await menuService.getMenu(id, user);
    
    return c.json(menu);
  }
);

// 查询菜单列表
menu.get(
  '/',
  zValidator('query', menuQuerySchema),
  async (c) => {
    const query = c.req.valid('query');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const result = await menuService.getMenus(query, user);
    
    return c.json(result);
  }
);

// 添加菜单项
menu.post(
  '/:id/items',
  zValidator('json', addMenuItemSchema),
  async (c) => {
    const menuId = c.req.param('id');
    const input = c.req.valid('json');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const menuItem = await menuService.addMenuItem(menuId, input, user);
    
    return c.json(menuItem, 201);
  }
);

// 更新菜单项
menu.put(
  '/:id/items/:itemId',
  zValidator('json', updateMenuItemSchema),
  async (c) => {
    const menuId = c.req.param('id');
    const itemId = c.req.param('itemId');
    const input = c.req.valid('json');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const menuItem = await menuService.updateMenuItem(menuId, itemId, input, user);
    
    return c.json(menuItem);
  }
);

// 删除菜单项
menu.delete(
  '/:id/items/:itemId',
  async (c) => {
    const menuId = c.req.param('id');
    const itemId = c.req.param('itemId');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    await menuService.deleteMenuItem(menuId, itemId, user);
    
    return c.json({ success: true });
  }
);

// 创建菜单分享
menu.post(
  '/:id/share',
  zValidator('json', createMenuShareSchema),
  async (c) => {
    const menuId = c.req.param('id');
    const input = c.req.valid('json');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const share = await menuService.createMenuShare(menuId, input, user);
    
    return c.json(share, 201);
  }
);

// 获取菜单分享列表
menu.get(
  '/:id/share',
  async (c) => {
    const menuId = c.req.param('id');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const shares = await menuService.getMenuShares(menuId, user);
    
    return c.json(shares);
  }
);

// 删除菜单分享
menu.delete(
  '/share/:shareId',
  async (c) => {
    const shareId = c.req.param('shareId');
    const user = await getCurrentUser(c);
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    await menuService.deleteMenuShare(shareId, user);
    
    return c.json({ success: true });
  }
);

// 获取分享的菜单（公开访问）
menu.get(
  '/share/:shareId',
  async (c) => {
    const shareId = c.req.param('shareId');
    const token = c.req.query('token');  // 可选的访问令牌
    const db = createDb(c.env.DB);
    const menuService = new MenuService(db);
    
    const menu = await menuService.getSharedMenu(shareId, token);
    
    return c.json(menu);
  }
);

export { menu as menuRouter };