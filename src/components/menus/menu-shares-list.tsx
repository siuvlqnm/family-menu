'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { MenuShare } from '@/types/menus'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { Copy, Link2, Key, Trash2 } from 'lucide-react'

interface MenuSharesListProps {
  shares: MenuShare[]
  onDelete: (shareId: string) => void
}

export function MenuSharesList({ shares, onDelete }: MenuSharesListProps) {
  const [copyTooltip, setCopyTooltip] = useState<string>('')

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: '已复制',
        description: '链接已复制到剪贴板',
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: '复制失败',
        description: '请手动复制链接',
        variant: 'destructive',
      })
    }
  }

  const getShareUrl = (share: MenuShare) => {
    const baseUrl = window.location.origin
    return share.shareType === 'LINK'
      ? `${baseUrl}/shared/menus/${share.id}`
      : `${baseUrl}/shared/menus/${share.id}?token=${share.token}`
  }

  const isExpired = (share: MenuShare) => {
    if (!share.expiresAt) return false
    return new Date(share.expiresAt) < new Date()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>分享类型</TableHead>
            <TableHead>访问权限</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>过期时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shares.map((share) => (
            <TableRow key={share.id}>
              <TableCell>
                <div className="flex items-center">
                  {share.shareType === 'LINK' ? (
                    <Link2 className="mr-2 h-4 w-4" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  {share.shareType === 'LINK' ? '公开链接' : '访问令牌'}
                </div>
              </TableCell>
              <TableCell>
                {share.allowEdit ? (
                  <Badge>可编辑</Badge>
                ) : (
                  <Badge variant="secondary">只读</Badge>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(share.createdAt), 'yyyy-MM-dd HH:mm')}
              </TableCell>
              <TableCell>
                {share.expiresAt
                  ? format(new Date(share.expiresAt), 'yyyy-MM-dd HH:mm')
                  : '永久有效'}
              </TableCell>
              <TableCell>
                {isExpired(share) ? (
                  <Badge variant="destructive">已过期</Badge>
                ) : (
                  <Badge variant="default">有效</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(getShareUrl(share))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>删除分享</AlertDialogTitle>
                        <AlertDialogDescription>
                          您确定要删除这个分享吗？删除后，通过此链接将无法访问菜单。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(share.id)}
                        >
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {shares.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center"
              >
                暂无分享记录
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
