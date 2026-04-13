import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useRef, useEffect } from 'react'
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react'

export interface TaskCardData {
  id: string
  title: string
  description?: string
}

interface TaskCardProps {
  task: TaskCardData
  onEdit: (taskId: string, title: string, description?: string) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  useEffect(() => {
    if (editing && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [editing])

  function handleSave() {
    const trimmed = editTitle.trim()
    if (trimmed) {
      onEdit(task.id, trimmed, editDesc.trim() || undefined)
    }
    setEditing(false)
  }

  function handleCancel() {
    setEditTitle(task.title)
    setEditDesc(task.description ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <div ref={setNodeRef} style={style} className="glass p-3">
        <input
          ref={titleRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          placeholder="Task title"
          className="w-full bg-transparent text-sm text-text-primary outline-none border-b border-accent/50 pb-1 mb-2 placeholder:text-text-secondary/30"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel()
          }}
          placeholder="Description (optional)"
          rows={2}
          className="w-full bg-transparent text-xs text-text-secondary outline-none resize-none placeholder:text-text-secondary/30"
        />
        <div className="flex justify-end gap-1 mt-2">
          <button
            onClick={handleCancel}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-surface transition-colors cursor-pointer"
            aria-label="Cancel editing"
          >
            <X size={14} />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 text-accent hover:text-accent-hover rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
            aria-label="Save changes"
          >
            <Check size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass p-3 group/card cursor-default hover:bg-bg-elevated transition-colors"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 text-text-secondary/0 group-hover/card:text-text-secondary/40 hover:!text-text-secondary cursor-grab active:cursor-grabbing rounded transition-colors shrink-0"
          aria-label={`Drag ${task.title}`}
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary leading-snug">{task.title}</p>
          {task.description && (
            <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-text-secondary/60 hover:text-text-primary rounded transition-colors cursor-pointer"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-text-secondary/60 hover:text-destructive rounded transition-colors cursor-pointer"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
