'use client'

import { RecipeForm } from "@/components/recipes/recipe-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useRecipeStore } from "@/stores/recipe-store"

export default function NewRecipePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { createRecipe, error } = useRecipeStore()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">新建食谱</h1>
        <p className="text-muted-foreground">创建一个新的食谱，记录美味的制作过程</p>
      </div>
      <div className="mx-auto max-w-2xl">
        <RecipeForm
          onSubmit={async (data) => {
            try {
              await createRecipe(data)
              
              toast({
                title: "创建成功",
                description: "食谱已成功创建",
              })
              
              router.push("/recipes")
            } catch (error) {
              toast({
                title: "创建失败",
                description: error instanceof Error ? error.message : "创建食谱时发生错误，请重试",
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
