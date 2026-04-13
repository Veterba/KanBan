import { Link } from 'react-router-dom'
import { Map, LayoutGrid, Terminal, FolderOpen, User, MessageCircle, Plus, Menu } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { icon: Map, label: 'Map', soon: true },
  { icon: LayoutGrid, label: 'Board', active: true },
  { icon: Terminal, label: 'Command', soon: true },
  { icon: FolderOpen, label: 'Files', soon: true },
  { icon: User, label: 'My Account', to: '/account' },
  { icon: MessageCircle, label: 'Chat', soon: true },
] as const

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`h-full border-r border-border-glass bg-bg-base flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top */}
      <div className="p-4 flex items-center gap-3 border-b border-border-glass">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-bg-surface rounded-lg transition-colors cursor-pointer text-text-secondary hover:text-text-primary"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={18} />
        </button>
        {!collapsed && (
          <span className="text-sm font-medium text-text-primary truncate">Project 1</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, active, to, soon }) => {
          const content = (
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                soon
                  ? 'text-text-secondary/40 cursor-default'
                  : active
                    ? 'bg-bg-elevated text-text-primary cursor-pointer'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface cursor-pointer'
              }`}
              title={soon ? 'Coming soon' : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm truncate">{label}</span>
              )}
              {!collapsed && soon && (
                <span className="ml-auto text-[10px] text-text-secondary/30 uppercase tracking-wider shrink-0">
                  Soon
                </span>
              )}
            </div>
          )

          if (to) {
            return <Link key={label} to={to}>{content}</Link>
          }
          return <div key={label}>{content}</div>
        })}
      </nav>

      {/* Add section */}
      <div className="p-2 border-t border-border-glass">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer">
          <Plus size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm">Add section</span>}
        </div>
      </div>
    </aside>
  )
}
