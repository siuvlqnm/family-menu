'use client'

import * as React from 'react'
import Image from 'next/image'
import { FileImage, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // 这里应该调用你的图片上传 API
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const data = await response.json()
      // onChange?.(data.url)

      // 临时使用本地 URL（实际应用中应该使用上传后的 URL）
      const url = URL.createObjectURL(file)
      onChange?.(url)
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border-2 border-dashed p-4',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {value ? (
        <div className="relative">
          <div className="relative h-40 w-40">
            <Image
              src={value}
              alt="Uploaded"
              className="rounded-lg object-cover"
              fill
            />
          </div>
          {!disabled && onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center">
          <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              上传图片
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            支持 PNG、JPG、GIF 格式
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
