"use client";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DynamicFormList } from "./dynamic-form-list"
import { TagInput } from "./tag-input"
import { Recipe } from "@/types/recipe"
import { useEffect } from "react"

const recipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "食谱名称至少需要2个字符",
  }),
  description: z.string().min(10, {
    message: "描述至少需要10个字符",
  }),
  category: z.string({
    required_error: "请选择食谱分类",
  }),
  servings: z.number().min(1, {
    message: "至少需要1份",
  }),
  prepTime: z.number().min(1, {
    message: "至少需要1分钟",
  }),
  cookTime: z.number().min(1, {
    message: "至少需要1分钟",
  }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "请选择难度等级",
  }),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string(),
    })
  ),
  steps: z.array(
    z.object({
      order: z.number(),
      description: z.string(),
      duration: z.number().optional(),
    })
  ),
  tags: z.array(z.string()),
  nutrition: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    servingSize: z.string(),
  }),
})

type RecipeFormValues = z.infer<typeof recipeFormSchema>

interface RecipeFormProps {
  initialData?: Recipe
  onSubmit: (data: RecipeFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RecipeFormProps) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      servings: 2,
      prepTime: 15,
      cookTime: 30,
      difficulty: "medium",
      ingredients: [],
      steps: [],
      tags: [],
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: "100g",
      },
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        servings: initialData.servings,
        prepTime: initialData.prepTime,
        cookTime: initialData.cookTime,
        difficulty: initialData.difficulty,
        ingredients: initialData.ingredients,
        steps: initialData.steps,
        tags: initialData.tags,
        nutrition: initialData.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          servingSize: "100g",
        },
      })
    }
  }, [initialData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>食谱名称</FormLabel>
              <FormControl>
                <Input placeholder="输入食谱名称" {...field} />
              </FormControl>
              <FormDescription>
                一个好的名称能让人一眼就知道这是什么菜
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="描述这道菜的特点、口感、适合的场合等"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                详细的描述可以帮助其他人更好地了解这道菜
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>分类</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="荤菜">荤菜</SelectItem>
                    <SelectItem value="素菜">素菜</SelectItem>
                    <SelectItem value="汤类">汤类</SelectItem>
                    <SelectItem value="主食">主食</SelectItem>
                    <SelectItem value="小吃">小吃</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>难度</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择难度" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">简单</SelectItem>
                    <SelectItem value="medium">中等</SelectItem>
                    <SelectItem value="hard">困难</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>份量</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>几人份</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>准备时间</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>分钟</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>烹饪时间</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>分钟</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ingredients"
          render={() => (
            <FormItem>
              <FormLabel>食材</FormLabel>
              <FormControl>
                <DynamicFormList
                  form={form}
                  name="ingredients"
                  addButtonText="添加食材"
                  defaultValues={{ name: "", amount: 0, unit: "g" }}
                  renderItem={(index) => (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="食材名称" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={0.1}
                                placeholder="数量"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`ingredients.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="单位" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="g">克</SelectItem>
                                <SelectItem value="ml">毫升</SelectItem>
                                <SelectItem value="个">个</SelectItem>
                                <SelectItem value="只">只</SelectItem>
                                <SelectItem value="根">根</SelectItem>
                                <SelectItem value="片">片</SelectItem>
                                <SelectItem value="勺">勺</SelectItem>
                                <SelectItem value="适量">适量</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                />
              </FormControl>
              <FormDescription>列出制作这道菜所需的所有食材</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="steps"
          render={() => (
            <FormItem>
              <FormLabel>步骤</FormLabel>
              <FormControl>
                <DynamicFormList
                  form={form}
                  name="steps"
                  addButtonText="添加步骤"
                  defaultValues={{ description: "", duration: 0, order: 0 }}
                  renderItem={(index) => (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`steps.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormControl>
                              <Textarea
                                placeholder={`第 ${index + 1} 步的具体操作`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`steps.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="预计时间（分钟）"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>可选</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                />
              </FormControl>
              <FormDescription>
                详细描述每个步骤，可以选择添加每个步骤的预计时间
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                添加标签以便更好地分类和搜索食谱（例如：快手菜、下饭菜、凉菜等）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">营养信息</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <FormField
              control={form.control}
              name="nutrition.calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>卡路里</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>蛋白质 (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>碳水化合物 (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>脂肪 (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrition.servingSize"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 md:col-span-4">
                  <FormLabel>每份大小</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：100g" {...field} />
                  </FormControl>
                  <FormDescription>
                    指定以上营养成分对应的食用量
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : initialData ? "更新食谱" : "创建食谱"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
