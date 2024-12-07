'use client'

import { useParams } from 'next/navigation'
import { RecipeForm } from "@/components/recipes/recipe-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Recipe } from "@/types/recipe"
import { recipeApi } from "@/services/recipe"

const EditRecipePage = () => {
  const params = useParams() as { id: string };
  const { id } = params;
  const { toast } = useToast()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeApi.getRecipe(id)
        setRecipe(data)
      } catch (error) {
        toast({
          title: "获取食谱失败",
          description: "无法加载食谱数据，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id, toast])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">食谱未找到</h2>
          <p className="text-muted-foreground mt-2">该食谱可能已被删除或移动</p>
          <button
            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={() => router.push('/recipes')}
          >
            返回食谱列表
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">编辑食谱</h1>
        <p className="text-muted-foreground">修改食谱内容，让它变得更完善</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <RecipeForm
          initialData={recipe}
          onSubmit={async (data) => {
            try {
              await recipeApi.updateRecipe(id, data)
              
              toast({
                title: "更新成功",
                description: "食谱已成功更新",
              })
              
              router.push("/recipes")
            } catch (error) {
              toast({
                title: "更新失败",
                description: "无法更新食谱，请稍后重试",
                variant: "destructive",
              })
            }
          }}
          onCancel={() => router.push("/recipes")}
        />
      </div>
    </div>
  )
}

export default EditRecipePage