'use client'

import { useParams } from 'next/navigation'
import { RecipeForm } from "@/components/recipes/recipe-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useRecipeStore } from "@/stores/recipes-store"

const EditRecipePage = () => {
  const params = useParams() as { id: string }
  const { id } = params
  const { toast } = useToast()
  const router = useRouter()
  const { recipe, loading, error, fetchRecipe, updateRecipe } = useRecipeStore()

  useEffect(() => {
    fetchRecipe(id)
  }, [id, fetchRecipe])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    toast({
      title: "获取食谱失败",
      description: error,
      variant: "destructive",
    })
  }

  if (!recipe) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">食谱未找到</h2>
          <p className="text-muted-foreground mt-2">该食谱可能已被删除或移动</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">编辑食谱</h1>
        <p className="text-muted-foreground">修改食谱信息</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <RecipeForm
          recipe={recipe}
          onSubmit={async (data) => {
            try {
              await updateRecipe(id, data)
              
              toast({
                title: "更新成功",
                description: "食谱已成功更新",
              })
              
              router.push("/recipes")
            } catch (error) {
              toast({
                title: "更新失败",
                description: error instanceof Error ? error.message : "更新食谱时发生错误，请重试",
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