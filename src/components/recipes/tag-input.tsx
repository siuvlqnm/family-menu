"use client";

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      e.preventDefault()
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()])
      }
      setInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-1 h-4 w-4 p-0"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </span>
        ))}
      </div>
      <Input
        placeholder="输入标签后按回车"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
