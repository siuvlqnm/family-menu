'use client'

import { ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardFooter, CardHeader } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { Eye, Edit, Trash2 } from 'lucide-react'

export interface ContentCardProps {
  coverImage?: string
  title: string
  description?: string
  status?: {
    label: string
    variant?: 'default' | 'secondary' | 'outline'
  }
  badges?: Array<{
    label: string
    icon?: ReactNode
    variant?: 'default' | 'secondary' | 'outline'
  }>
  topRightBadge?: {
    label: string
    icon?: ReactNode
    variant?: 'default' | 'secondary' | 'outline'
  }
  createdAt?: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function ContentCard({
  coverImage,
  title,
  description,
  status,
  badges = [],
  topRightBadge,
  createdAt,
  onView,
  onEdit,
  onDelete,
  className,
}: ContentCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {coverImage && (
        <div className="relative aspect-video">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />
          {topRightBadge && (
            <div className="absolute right-2 top-2">
              <Badge
                variant={topRightBadge.variant || 'secondary'}
                className="flex items-center gap-1"
              >
                {topRightBadge.icon}
                {topRightBadge.label}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {status && (
            <Badge variant={status.variant || 'default'}>
              {status.label}
            </Badge>
          )}
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant={badge.variant || 'outline'}
                className="flex items-center gap-1"
              >
                {badge.icon}
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {createdAt && (
        <CardContent>
          <div className="text-sm text-muted-foreground">
            创建于 {createdAt}
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-end gap-2">
        {onView && (
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
