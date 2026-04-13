import { type InputHTMLAttributes } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function GlassInput({ label, className = '', id, ...props }: GlassInputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 bg-bg-surface border border-border-glass rounded-[var(--radius-glass)] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  )
}
