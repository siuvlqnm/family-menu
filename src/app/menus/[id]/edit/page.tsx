'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useFamilyStore } from '@/stores/family-store'
import { useMenuStore } from '@/stores/menus-store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { ImageUpload } from '@/components/ui/image-upload'
import { TagInput } from '@/components/ui/tag-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MenuType } from '@/types/menus'
import { cn } from '@/lib/utils'

interface EditMenuPageProps {
  params: {
    id: string
  }
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
  const router = useRouter()
  const { user, checkAuth } = useAuthStore()
  const { familyGroups, fetchFamilyGroups } = useFamilyStore()
  const { menu, getMenu, updateMenu } = useMenuStore()

  // 表单状态
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<keyof typeof MenuType>('DAILY')
  const [coverImage, setCoverImage] = useState<string>()
  const [tags, setTags] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [menuType, setMenuType] = useState<'personal' | 'family'>('personal')
  const [familyGroupId, setFamilyGroupId] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    // 检查认证状态
    const isAuthed = checkAuth()
    if (!isAuthed) {
      router.replace(`/login?from=/menus/${params.id}/edit`)
      return
    }

    // 获取家庭组列表
    fetchFamilyGroups()

    // 获取菜单详情
    getMenu(params.id)
  }, [checkAuth, router, params.id, fetchFamilyGroups, getMenu])

  useEffect(() => {
    if (menu) {
      setName(menu.name)
      setDescription(menu.description || '')
      setType(menu.type)
      setCoverImage(menu.coverImage)
      setTags(menu.tags || [])
      setStartDate(new Date(menu.startDate))
      setEndDate(new Date(menu.endDate))
      setMenuType(menu.familyGroupId ? 'family' : 'personal')
      setFamilyGroupId(menu.familyGroupId)
    }
  }, [menu])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    try {
      const updatedMenu = await updateMenu(params.id, {
        name,
        description,
        type,
        coverImage,
        tags,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        familyGroupId: menuType === 'family' ? familyGroupId : undefined,
      })

      router.push(`/menus/${updatedMenu.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新菜单失败')
      setLoading(false)
    }
  }

  if (!menu) {
    return null
  }

  return (
    <div className="container space-y-6 py-6">
      <PageHeader
        title="编辑菜单"
        description="更新菜单信息"
        backButton
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          {/* 菜单归属 */}
          <div className="space-y-2">
            <Label>菜单归属</Label>
            <Select
              value={menuType}
              onValueChange={(value: 'personal' | 'family') => {
                setMenuType(value)
                if (value === 'personal') {
                  setFamilyGroupId(undefined)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择菜单归属" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">个人菜单</SelectItem>
                <SelectItem value="family">家庭组菜单</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 家庭组选择（仅当选择家庭组菜单时显示） */}
          {menuType === 'family' && (
            <div className="space-y-2">
              <Label>选择家庭组</Label>
              <Select
                value={familyGroupId}
                onValueChange={setFamilyGroupId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择家庭组" />
                </SelectTrigger>
                <SelectContent>
                  {familyGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 基本信息 */}
          <div className="space-y-2">
            <Label>菜单名称</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入菜单名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>描述</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入菜单描述"
            />
          </div>

          <div className="space-y-2">
            <Label>类型</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="选择菜单类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MenuType).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>开始日期</Label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>结束日期</Label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              suggestions={[]}  // TODO: 从后端获取标签建议
              placeholder="输入标签"
            />
          </div>

          <div className="space-y-2">
            <Label>封面图片</Label>
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              maxSize={5 * 1024 * 1024}  // 5MB
              accept="image/*"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '保存中...' : '保存修改'}
          </Button>
        </div>
      </form>
    </div>
  )
}
