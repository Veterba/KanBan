import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  elevated?: boolean
}

export default function GlassCard({ elevated, className = '', children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={`${elevated ? 'glass-elevated' : 'glass'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
