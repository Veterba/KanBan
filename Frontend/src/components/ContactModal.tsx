import { motion } from 'framer-motion'
import { X, Mail, Phone, MapPin } from 'lucide-react'

interface ContactModalProps {
  onClose: () => void
}

export default function ContactModal({ onClose }: ContactModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Scrim */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="glass-elevated relative z-10 w-full max-w-md mx-4 p-8"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer rounded-full hover:bg-bg-surface"
          aria-label="Close contact modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
        <p className="text-text-secondary mb-8">We'd love to hear from you.</p>

        <div className="flex flex-col gap-5">
          <a
            href="mailto:hello@kanban.app"
            className="flex items-center gap-4 p-4 glass rounded-[var(--radius-glass)] hover:bg-bg-elevated transition-colors group"
          >
            <div className="p-2 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Email</p>
              <p className="text-sm text-text-secondary">hello@kanban.app</p>
            </div>
          </a>

          <a
            href="tel:+1234567890"
            className="flex items-center gap-4 p-4 glass rounded-[var(--radius-glass)] hover:bg-bg-elevated transition-colors group"
          >
            <div className="p-2 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Phone</p>
              <p className="text-sm text-text-secondary">+1 (234) 567-890</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-4 glass rounded-[var(--radius-glass)]">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Address</p>
              <p className="text-sm text-text-secondary">123 Workflow St, Suite 100<br />San Francisco, CA 94102</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
