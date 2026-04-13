import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import GlassButton from '../../components/ui/GlassButton'
import GlassInput from '../../components/ui/GlassInput'

export default function SignIn() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(94,106,210,0.08) 0%, var(--color-bg-deep) 60%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <motion.div
        className="glass w-full max-w-md p-8"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full glass-elevated flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-text-secondary border-dashed animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1">
          Yooo, welcome back!
        </h1>
        <p className="text-sm text-text-secondary text-center mb-8">
          First time here?{' '}
          <Link to="/auth/signup" className="text-text-primary hover:text-accent transition-colors underline underline-offset-4">
            Sign up for free
          </Link>
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <GlassInput
            label="Your email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
          <GlassInput
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <GlassButton variant="accent" size="lg" className="w-full mt-2">
            Sign in
          </GlassButton>
        </form>

        <button className="w-full text-sm text-text-secondary hover:text-text-primary text-center mt-4 cursor-pointer bg-transparent border-none transition-colors">
          Sign in using magic link
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border-glass" />
          <span className="text-xs text-text-secondary">or</span>
          <div className="flex-1 h-px bg-border-glass" />
        </div>

        <GlassButton variant="default" size="lg" className="w-full">
          Single sign-on (SSO)
        </GlassButton>

        <p className="text-xs text-text-secondary text-center mt-6 leading-relaxed">
          You acknowledge that you read, and agree, to our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-text-primary transition-colors">
            Terms of Service
          </a>{' '}
          and our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-text-primary transition-colors">
            Privacy Policy
          </a>.
        </p>
      </motion.div>
    </motion.div>
  )
}
