"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChefHat, Calendar, ShoppingCart, Activity, Users, Package, Heart, Clock, Sparkles, Utensils, Apple } from "lucide-react";

const features = [
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "家人喜好记录",
    description: "记录每位家庭成员的饮食偏好，自动推荐合适的菜品"
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-500" />,
    title: "智能时间规划",
    description: "根据烹饪时间智能安排备餐顺序，让美食准时上桌"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    title: "节日特色菜谱",
    description: "节假日主题菜单推荐，让节日餐桌更有仪式感"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-black/20" />
        {/* Floating Icons */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-40 animate-float-slow">
            <ChefHat className="w-16 h-16 text-white/20" />
          </div>
          <div className="absolute top-60 right-80 animate-float-slower">
            <Utensils className="w-12 h-12 text-white/20" />
          </div>
          <div className="absolute top-40 right-60 animate-float">
            <Apple className="w-10 h-10 text-white/20" />
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-tr from-red-400/30 to-pink-500/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 h-full flex items-center relative">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              让每一餐都充满期待
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Family Menu 不只是一个菜单管理工具，更是连接家人味蕾的幸福纽带。
              智能规划每日菜单，记录家人口味，让烹饪更轻松，让生活更有滋味。
            </p>
            <div className="flex gap-4">
              <Link href="/recipes">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  开始探索美食
                </Button>
              </Link>
              <Link href="/recipes/new">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  创建今日菜单
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2">
            <div className="relative w-[400px] h-[400px] rounded-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full animate-pulse" />
              <div className="absolute inset-8 bg-gradient-to-tr from-yellow-200/40 to-orange-300/40 rounded-full animate-pulse-slow" />
              <div className="absolute inset-16 bg-gradient-to-r from-orange-100/50 to-red-200/50 rounded-full animate-pulse-slower" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          特色功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="relative">
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/recipes" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.orange.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-orange-600 mb-2">
                  <ChefHat className="w-6 h-6" />
                  <CardTitle className="group-hover:text-orange-600">食谱管理</CardTitle>
                </div>
                <CardDescription>
                  存储和管理您的家庭食谱，包括详细的烹饪步骤和营养信息。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    <span>智能分类管理</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    <span>详细步骤指导</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    <span>营养成分分析</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/menus" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.blue.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar className="w-6 h-6" />
                  <CardTitle className="group-hover:text-blue-600">菜单规划</CardTitle>
                </div>
                <CardDescription>
                  轻松规划每周菜单，让家人的饮食更有规律。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>智能推荐搭配</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>营养均衡建议</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>季节性调整</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shopping" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.green.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ShoppingCart className="w-6 h-6" />
                  <CardTitle className="group-hover:text-green-600">购物清单</CardTitle>
                </div>
                <CardDescription>
                  根据菜单自动生成购物清单，让采购更加便捷。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>自动计算用量</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>分类采购建议</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span>价格参考对比</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nutrition" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.purple.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Activity className="w-6 h-6" />
                  <CardTitle className="group-hover:text-purple-600">营养追踪</CardTitle>
                </div>
                <CardDescription>
                  监控饮食营养，保持健康的饮食习惯。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    <span>营养数据分析</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    <span>健康建议推送</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    <span>饮食报告生成</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/family" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.pink.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-pink-600 mb-2">
                  <Users className="w-6 h-6" />
                  <CardTitle className="group-hover:text-pink-600">家庭协作</CardTitle>
                </div>
                <CardDescription>
                  与家庭成员一起协作规划菜单，共享美食体验。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                    <span>家庭成员管理</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                    <span>协同编辑菜单</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                    <span>饮食偏好设置</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/inventory" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-orange-200 h-full bg-gradient-to-br from-yellow-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.yellow.100/30)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 text-yellow-600 mb-2">
                  <Package className="w-6 h-6" />
                  <CardTitle className="group-hover:text-yellow-600">库存管理</CardTitle>
                </div>
                <CardDescription>
                  跟踪厨房库存，及时补充食材。
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>库存实时更新</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>到期提醒</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    <span>智能补货建议</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-16 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-tr from-red-400/30 to-pink-500/30 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center text-white relative">
          <h2 className="text-3xl font-bold mb-4">开始享受美食之旅</h2>
          <p className="text-xl mb-8 opacity-90">
            加入我们，让每一餐都成为家人相聚的温暖时刻
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
            <Link href="/register" className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              立即加入
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
