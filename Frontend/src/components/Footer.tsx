import { Link } from 'react-router-dom'

interface FooterProps {
  onContactClick: () => void
}

export default function Footer({ onContactClick }: FooterProps) {
  return (
    <footer className="border-t border-border-glass bg-bg-base">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Brand */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">KanBan</h3>
            <p className="text-sm text-text-secondary">
              Streamline your workflow with visual task management.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex flex-col items-start md:items-center gap-2">
            <h4 className="text-sm font-medium text-text-primary mb-1">Navigation</h4>
            <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link to="/workflow" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Workflow
            </Link>
            <Link to="/account" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Account
            </Link>
            <button
              onClick={onContactClick}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Contact
            </button>
          </div>

          {/* Right - Info */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <h4 className="text-sm font-medium text-text-primary mb-1">Get in Touch</h4>
            <p className="text-sm text-text-secondary">123 Workflow Street, Suite 100</p>
            <p className="text-sm text-text-secondary">San Francisco, CA 94102</p>
            <a href="tel:+1234567890" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              +1 (234) 567-890
            </a>
            <a href="mailto:hello@kanban.app" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              hello@kanban.app
            </a>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="mt-8 pt-6 border-t border-border-glass text-center">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} KanBan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
