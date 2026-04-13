import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

interface NavbarProps {
  onContactClick: () => void
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/workflow', label: 'Workflow' },
    { to: '/account', label: 'Account' },
  ]

  return (
    <motion.nav
      className="glass-navbar fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/" className="text-xl font-semibold text-text-primary tracking-tight">
        KanBan
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-4 py-2 text-sm rounded-[var(--radius-glass)] transition-all duration-200 ${
              location.pathname === to
                ? 'text-text-primary bg-bg-elevated'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
            }`}
          >
            {label}
          </Link>
        ))}
        <button
          onClick={onContactClick}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-[var(--radius-glass)] transition-all duration-200 cursor-pointer"
        >
          Contact
        </button>
        <Link
          to="/auth/signin"
          className="ml-2 px-5 py-2 text-sm bg-accent text-white rounded-[var(--radius-glass)] hover:bg-accent-hover transition-colors duration-200 shadow-[0_0_20px_var(--color-accent-glow)]"
        >
          Sign In
        </Link>
      </div>
    </motion.nav>
  )
}
