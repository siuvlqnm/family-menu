"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          欢迎使用 Family Menu
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          简单高效的家庭菜单管理工具
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/recipes">
              浏览食谱
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/recipes/new">
              创建食谱
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/recipes" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">食谱管理</h2>
            <p className="text-gray-600">
              存储和管理您的家庭食谱，包括详细的烹饪步骤和营养信息。
            </p>
          </div>
        </Link>

        <Link href="/menus" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">菜单规划</h2>
            <p className="text-gray-600">
              轻松规划每周菜单，让家人的饮食更有规律。
            </p>
          </div>
        </Link>

        <Link href="/shopping" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">购物清单</h2>
            <p className="text-gray-600">
              根据菜单自动生成购物清单，让采购更加便捷。
            </p>
          </div>
        </Link>

        <Link href="/nutrition" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">营养追踪</h2>
            <p className="text-gray-600">
              监控饮食营养，保持健康的饮食习惯。
            </p>
          </div>
        </Link>

        <Link href="/family" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">家庭协作</h2>
            <p className="text-gray-600">
              与家庭成员一起协作规划菜单，共享美食体验。
            </p>
          </div>
        </Link>

        <Link href="/inventory" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 group-hover:text-primary">库存管理</h2>
            <p className="text-gray-600">
              跟踪厨房库存，及时补充食材。
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
