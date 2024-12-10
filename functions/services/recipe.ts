import { eq, and, desc, asc, like, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { Database, recipes, familyMembers } from '../db';
import type {
  CreateRecipeInput,
  UpdateRecipeInput,
  Recipe,
  RecipeQuery,
} from '../types/recipe';
import { RecipeCategory, DifficultyLevel } from '../types/recipe';

// 数据库记录类型
type DbRecipe = typeof recipes.$inferSelect;
type NewDbRecipe = typeof recipes.$inferInsert;

export class RecipeService {
  private static instance: RecipeService;
  private db!: Database;

  private constructor() {}

  public static getInstance(db: Database): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    RecipeService.instance.db = db;
    return RecipeService.instance;
  }

  // 创建食谱
  async createRecipe(userId: string, data: CreateRecipeInput): Promise<Recipe> {
    const recipeId = nanoid();
    const now = new Date();

    const recipe: NewDbRecipe = {
      id: recipeId,
      title: data.title,
      description: data.description ?? null,
      category: data.category as keyof typeof RecipeCategory,
      difficulty: data.difficulty as keyof typeof DifficultyLevel,
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      createdBy: userId,
      familyGroupId: data.familyGroupId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const [createdRecipe] = await this.db.insert(recipes).values(recipe).returning();
    return this.mapToRecipe(createdRecipe);
  }

  // 更新食谱
  async updateRecipe(
    id: string,
    userId: string,
    data: UpdateRecipeInput
  ): Promise<Recipe | null> {
    const existingRecipe = await this.getRecipe(id, userId);
    if (!existingRecipe) {
      return null;
    }

    const updateData: Partial<NewDbRecipe> = {
      title: data.title,
      description: data.description ?? null,
      category: data.category as keyof typeof RecipeCategory,
      difficulty: data.difficulty as keyof typeof DifficultyLevel,
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      servings: data.servings ?? null,
      ingredients: data.ingredients,
      steps: data.steps,
      familyGroupId: data.familyGroupId ?? null,
      updatedAt: new Date(),
    };

    // 移除未定义的字段
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const [recipe] = await this.db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();

    return this.mapToRecipe(recipe);
  }

  // 获取单个食谱
  async getRecipe(id: string, userId: string): Promise<Recipe | null> {
    const familyGroupIds = await this.getUserFamilyGroupIds(userId);
    
    const recipe = await this.db.query.recipes.findFirst({
      where: and(
        eq(recipes.id, id),
        or(
          eq(recipes.createdBy, userId),
          eq(recipes.familyGroupId, familyGroupIds)
        )
      ),
    });

    return recipe ? this.mapToRecipe(recipe) : null;
  }

  // 获取食谱列表
  async listRecipes(userId: string, query: RecipeQuery): Promise<Recipe[]> {
    const { category, difficulty, search, familyGroupId, page, limit } = query;
    const offset = (page - 1) * limit;

    const familyGroupIds = await this.getUserFamilyGroupIds(userId);
    let conditions = [];

    conditions.push(
      or(
        eq(recipes.createdBy, userId),
        eq(recipes.familyGroupId, familyGroupIds)
      )
    );

    if (category) {
      conditions.push(eq(recipes.category, category));
    }
    if (difficulty) {
      conditions.push(eq(recipes.difficulty, difficulty));
    }
    if (familyGroupId) {
      conditions.push(eq(recipes.familyGroupId, familyGroupId));
    }
    if (search) {
      conditions.push(
        or(
          like(recipes.title, `%${search}%`),
          like(recipes.description || '', `%${search}%`)
        )
      );
    }

    const result = await this.db
      .select()
      .from(recipes)
      .where(and(...conditions))
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(this.mapToRecipe);
  }

  // 删除食谱
  async deleteRecipe(id: string, userId: string): Promise<boolean> {
    const existingRecipe = await this.getRecipe(id, userId);
    if (!existingRecipe) {
      return false;
    }

    await this.db.delete(recipes).where(eq(recipes.id, id));
    return true;
  }

  // 获取用户所属的家庭组ID列表
  private async getUserFamilyGroupIds(userId: string): Promise<string[]> {
    const members = await this.db
      .select({ familyGroupId: familyMembers.familyGroupId })
      .from(familyMembers)
      .where(eq(familyMembers.userId, userId));

    return members.map((m) => m.familyGroupId);
  }

  // 将数据库记录映射为 Recipe 类型
  private mapToRecipe(data: DbRecipe): Recipe {
    return {
      ...data,
      description: data.description ?? undefined,
      prepTime: data.prepTime ?? undefined,
      cookTime: data.cookTime ?? undefined,
      servings: data.servings ?? undefined,
      familyGroupId: data.familyGroupId ?? undefined,
    };
  }
}
