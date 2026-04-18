import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import TaskCard, { type TaskCardData } from './TaskCard'

interface TaskListProps {
  id: string
  title: string
  tasks: TaskCardData[]
  onRename: (id: string, newTitle: string) => void
  onAddTask: (listId: string) => void
  onRemoveList: (id: string) => void
  onEditTask: (taskId: string, title: string, description?: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function TaskList({ id, title, tasks, onRename, onAddTask, onRemoveList, onEditTask, onDeleteTask }: TaskListProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { setNodeRef, isOver } = useDroppable({ id })

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function handleRename() {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== title) {
      onRename(id, trimmed)
    } else {
      setEditTitle(title)
    }
    setEditing(false)
  }

  function handleDelete() {
    if (confirmDelete) {
      onRemoveList(id)
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      className={`glass flex flex-col w-72 shrink-0 max-h-full shadow-[var(--shadow-sm)] transition-colors ${
        isOver ? 'border-accent/30' : ''
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-glass flex items-center justify-between group/header">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') { setEditTitle(title); setEditing(false) }
            }}
            className="bg-transparent text-sm font-medium text-text-primary outline-none border-b border-accent w-full"
          />
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h3
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors truncate"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </h3>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-text-secondary/0 group-hover/header:text-text-secondary/60 hover:!text-text-primary rounded transition-all cursor-pointer shrink-0"
              aria-label={`Rename ${title}`}
            >
              <Pencil size={12} />
            </button>
          </div>
        )}
        <span className="text-xs text-text-secondary/80 ml-2 shrink-0 tabular-nums">{tasks.length}</span>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="p-2 flex flex-col gap-2 min-h-[80px] overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-xs text-text-secondary/70 text-center">
              No tasks yet
            </p>
            <button
              onClick={() => onAddTask(id)}
              className="text-xs text-accent/80 hover:text-accent transition-colors cursor-pointer"
            >
              + Add a task
            </button>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-2 py-2 border-t border-border-glass flex gap-1">
        <button
          onClick={() => onAddTask(id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Create
        </button>
        <button
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
            confirmDelete
              ? 'text-destructive bg-destructive/10'
              : 'text-text-secondary hover:text-destructive hover:bg-destructive/10'
          }`}
          aria-label={confirmDelete ? `Confirm remove ${title}` : `Remove ${title} list`}
        >
          <Trash2 size={14} />
          {confirmDelete && <span>Confirm?</span>}
        </button>
      </div>
    </div>
  )
}
