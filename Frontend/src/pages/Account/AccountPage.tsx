import { motion } from 'framer-motion'
import { User, CheckCircle, Crown, Settings } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import GlassButton from '../../components/ui/GlassButton'

const completedProjects = [
  { name: 'Website Redesign', tasks: 24, completed: '2 days ago' },
  { name: 'Mobile App MVP', tasks: 18, completed: '1 week ago' },
  { name: 'API Integration', tasks: 12, completed: '2 weeks ago' },
]

export default function AccountPage() {
  return (
    <motion.main
      className="min-h-screen pt-24 pb-16 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile */}
        <GlassCard className="p-8 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full glass-elevated flex items-center justify-center shrink-0">
            <User size={32} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-1">John Doe</h1>
            <p className="text-sm text-text-secondary">john@example.com</p>
          </div>
          <GlassButton variant="ghost" size="sm">
            <Settings size={16} className="mr-2" />
            Settings
          </GlassButton>
        </GlassCard>

        {/* Plan */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown size={20} className="text-accent" />
            <h2 className="text-lg font-medium">Your Plan</h2>
          </div>
          <div className="glass p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs text-text-secondary mt-1">Up to 3 boards, 50 tasks per board</p>
            </div>
            <GlassButton variant="accent" size="sm">
              Upgrade
            </GlassButton>
          </div>
        </GlassCard>

        {/* Completed Projects */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={20} className="text-accent" />
            <h2 className="text-lg font-medium">Completed Projects</h2>
          </div>
          <div className="flex flex-col gap-3">
            {completedProjects.map((project) => (
              <div
                key={project.name}
                className="glass p-4 flex items-center justify-between hover:bg-bg-elevated transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {project.tasks} tasks completed
                  </p>
                </div>
                <p className="text-xs text-text-secondary">{project.completed}</p>
              </div>
            ))}
            {completedProjects.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-8">
                No completed projects yet. Start building!
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </motion.main>
  )
}
