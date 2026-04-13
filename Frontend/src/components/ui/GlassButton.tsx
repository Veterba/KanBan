import { type ButtonHTMLAttributes } from 'react'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function GlassButton({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: GlassButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer rounded-[var(--radius-glass)] focus-visible:outline-2 focus-visible:outline-accent'

  const variants = {
    default: 'glass hover:bg-bg-elevated hover:border-border-glass-hover active:scale-[0.97]',
    accent: 'bg-accent text-white hover:bg-accent-hover shadow-[0_0_20px_var(--color-accent-glow)] active:scale-[0.97]',
    ghost: 'bg-transparent hover:bg-bg-surface border border-transparent hover:border-border-glass active:scale-[0.97]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
