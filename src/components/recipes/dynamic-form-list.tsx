"use client";

import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useFieldArray, UseFormReturn } from "react-hook-form"

interface DynamicFormListProps {
  form: UseFormReturn<any>
  name: string
  renderItem: (index: number) => React.ReactNode
  addButtonText: string
  defaultValues?: any
}

export function DynamicFormList({
  form,
  name,
  renderItem,
  addButtonText,
  defaultValues = {},
}: DynamicFormListProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="relative flex items-start gap-4">
          <div className="flex-1">{renderItem(index)}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append(defaultValues)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  )
}
