import { motion, useMotionValue, useTransform, useInView } from 'framer-motion'
import { useRef, type MouseEvent } from 'react'

export default function HeroInteractive() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const gradientX = useTransform(mouseX, [0, 1], [20, 80])
  const gradientY = useTransform(mouseY, [0, 1], [20, 80])

  function handleMouseMove(e: MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden cursor-default"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor-responsive gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${gradientX.get()}% ${gradientY.get()}%, rgba(94, 106, 210, 0.08), transparent 60%)`,
        }}
      />

      {/* Parallax floating shapes */}
      <motion.div
        className="absolute top-20 left-[15%] w-32 h-32 rounded-full border border-border-glass opacity-20"
        style={{ x: useTransform(mouseX, [0, 1], [-20, 20]), y: useTransform(mouseY, [0, 1], [-20, 20]) }}
      />
      <motion.div
        className="absolute bottom-32 right-[20%] w-24 h-24 rounded-2xl border border-border-glass opacity-15 rotate-12"
        style={{ x: useTransform(mouseX, [0, 1], [15, -15]), y: useTransform(mouseY, [0, 1], [10, -10]) }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-semibold leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Visualize Your{' '}
          <span className="text-text-secondary">Workflow</span>
        </motion.h2>

        <motion.p
          className="text-lg text-text-secondary max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Move your cursor around. Just like our boards respond to your every action,
          KanBan adapts to how you work — fluid, intuitive, and always in sync.
        </motion.p>

        {/* Interactive demo cards */}
        <motion.div
          className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {['Backlog', 'Active', 'Shipped'].map((label, i) => (
            <motion.div
              key={label}
              className="glass p-4 text-center"
              style={{
                x: useTransform(mouseX, [0, 1], [-(i - 1) * 8, (i - 1) * 8]),
                y: useTransform(mouseY, [0, 1], [-5, 5]),
              }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.15)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className="text-xs text-text-secondary mb-3 uppercase tracking-wider">{label}</p>
              <div className="flex flex-col gap-2">
                {[1, 2].map((n) => (
                  <div key={n} className="h-8 rounded-lg bg-bg-elevated border border-border-glass" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
