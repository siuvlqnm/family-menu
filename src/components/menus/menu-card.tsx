import { Menu } from "@/types/menu"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Info } from "lucide-react"
import { useRouter } from "next/navigation"

interface MenuCardProps {
  menu: Menu
}

export function MenuCard({ menu }: MenuCardProps) {
  const router = useRouter()

  const getStatusText = (status: Menu["status"]) => {
    switch (status) {
      case "active":
        return "进行中"
      case "completed":
        return "已完成"
      default:
        return "草稿"
    }
  }

  const getStatusColor = (status: Menu["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{menu.name}</CardTitle>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              menu.status
            )}`}
          >
            {getStatusText(menu.status)}
          </span>
        </div>
        <CardDescription>{menu.date}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1.5 h-4 w-4" />
            <span>{menu.sharedWith.length + 1}人共享</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="mr-1.5 h-4 w-4" />
            <span>{menu.items.length}道菜</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/menus/${menu.id}`)}
          >
            查看详情
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/menus/${menu.id}/edit`)}
          >
            编辑
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
