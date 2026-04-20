import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { Search, Plus, Sparkles, GripVertical } from 'lucide-react'
import Sidebar from './Sidebar'
import TaskList from './TaskList'
import { type TaskCardData } from './TaskCard'

interface Column {
  id: string
  title: string
  tasks: TaskCardData[]
}

let nextId = 100

function generateId() {
  return `item-${nextId++}`
}

const initialColumns: Column[] = [
  {
    id: 'col-1',
    title: 'User Story',
    tasks: [
      { id: 'task-1', title: 'Story 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { id: 'task-2', title: 'Story 2', description: 'Ut enim ad minim veniam, quis nostrud exercitation.' },
    ],
  },
  {
    id: 'col-2',
    title: 'To Do',
    tasks: [
      { id: 'task-3', title: 'Layout', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
  },
  {
    id: 'col-3',
    title: 'In Progress',
    tasks: [
      { id: 'task-4', title: 'Code', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { id: 'task-5', title: 'Adv', description: 'Lorem ipsum dolor sit amet.' },
    ],
  },
  {
    id: 'col-4',
    title: 'Done',
    tasks: [
      { id: 'task-6', title: 'Tech Assessment', description: 'Consectetur adipiscing elit, sed do eiusmod.' },
    ],
  },
]

export default function WorkflowPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeTask, setActiveTask] = useState<TaskCardData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findColumn = useCallback(
    (taskId: string) => columns.find((col) => col.tasks.some((t) => t.id === taskId)),
    [columns]
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const col = findColumn(active.id as string)
    const task = col?.tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCol = findColumn(activeId)
    const overCol = findColumn(overId) || columns.find((c) => c.id === overId)

    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    setColumns((prev) => {
      const activeItems = [...activeCol.tasks]
      const overItems = [...overCol.tasks]
      const activeIndex = activeItems.findIndex((t) => t.id === activeId)
      const overIndex = overItems.findIndex((t) => t.id === overId)
      const [movedTask] = activeItems.splice(activeIndex, 1)

      const insertIndex = overIndex >= 0 ? overIndex : overItems.length
      overItems.splice(insertIndex, 0, movedTask)

      return prev.map((col) => {
        if (col.id === activeCol.id) return { ...col, tasks: activeItems }
        if (col.id === overCol.id) return { ...col, tasks: overItems }
        return col
      })
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const col = findColumn(activeId)
    if (!col) return

    const oldIndex = col.tasks.findIndex((t) => t.id === activeId)
    const newIndex = col.tasks.findIndex((t) => t.id === overId)

    if (oldIndex !== -1 && newIndex !== -1) {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === col.id ? { ...c, tasks: arrayMove(c.tasks, oldIndex, newIndex) } : c
        )
      )
    }
  }

  function handleAddList() {
    const id = generateId()
    setColumns((prev) => [...prev, { id, title: 'New List', tasks: [] }])
  }

  function handleRemoveList(id: string) {
    setColumns((prev) => prev.filter((c) => c.id !== id))
  }

  function handleRenameList(id: string, newTitle: string) {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    )
  }

  function handleAddTask(listId: string) {
    const id = generateId()
    setColumns((prev) =>
      prev.map((c) =>
        c.id === listId
          ? { ...c, tasks: [...c.tasks, { id, title: 'New Task' }] }
          : c
      )
    )
  }

  function handleEditTask(taskId: string, title: string, description?: string) {
    setColumns((prev) =>
      prev.map((c) => ({
        ...c,
        tasks: c.tasks.map((t) =>
          t.id === taskId ? { ...t, title, description } : t
        ),
      }))
    )
  }

  function handleDeleteTask(taskId: string) {
    setColumns((prev) =>
      prev.map((c) => ({
        ...c,
        tasks: c.tasks.filter((t) => t.id !== taskId),
      }))
    )
  }

  return (
    <motion.div
      className="h-screen flex bg-bg-deep"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border-glass bg-bg-base">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search size={16} className="text-text-secondary shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary/50 outline-none w-full"
            />
          </div>

          <button
            onClick={handleAddList}
            className="flex items-center gap-2 px-4 py-2 text-sm glass hover:bg-bg-elevated transition-colors cursor-pointer rounded-[var(--radius-glass)]"
          >
            <Plus size={16} />
            New Task List
          </button>
        </header>

        {/* Board canvas */}
        <div className="flex-1 p-4 md:p-6 min-h-0">
          <div className="glass-board h-full flex flex-col overflow-hidden p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden -mx-2 px-2">
                <div className="flex gap-5 items-start h-full">
                  {columns.map((col) => (
                    <TaskList
                      key={col.id}
                      id={col.id}
                      title={col.title}
                      tasks={col.tasks.filter((t) =>
                        t.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )}
                      onRename={handleRenameList}
                      onAddTask={handleAddTask}
                      onRemoveList={handleRemoveList}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>

              {createPortal(
                <DragOverlay dropAnimation={null}>
                  {activeTask ? (
                    <div className="glass p-3 w-64 shadow-[var(--shadow-lg)] cursor-grabbing">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 p-1 text-text-secondary/60 shrink-0">
                          <GripVertical size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary leading-snug">{activeTask.title}</p>
                          {activeTask.description && (
                            <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                              {activeTask.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-0.5 shrink-0 w-[46px]" />
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        </div>

        {/* Bottom bar */}
        <footer className="flex items-center justify-end px-6 py-3 border-t border-border-glass bg-bg-base">
          <button className="flex items-center gap-2 px-4 py-2 text-sm glass hover:bg-bg-elevated transition-colors cursor-pointer rounded-[var(--radius-glass)]">
            <Sparkles size={16} className="text-accent" />
            Ask Claude
          </button>
        </footer>
      </div>
    </motion.div>
  )
}
