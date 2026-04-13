import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import GlassButton from '../../components/ui/GlassButton'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

const mockColumns = [
  { title: 'To Do', cards: ['Research competitors', 'Define user stories', 'Setup CI/CD'] },
  { title: 'In Progress', cards: ['Design system', 'Build landing page'] },
  { title: 'Review', cards: ['API endpoints'] },
  { title: 'Done', cards: ['Project kickoff', 'Wireframes'] },
]

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const leftX = useTransform(scrollYProgress, [0, 0.5], [-300, 0])
  const rightX = useTransform(scrollYProgress, [0, 0.5], [300, 0])
  const columnsOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Text content */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <motion.p
          className="text-sm text-accent font-medium tracking-widest uppercase mb-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Visual Task Management
        </motion.p>

        <motion.h1
          className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Organize your work,{' '}
          <span className="text-text-secondary">visually.</span>
        </motion.h1>

        <motion.p
          className="text-lg text-text-secondary max-w-xl mx-auto mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          KanBan brings clarity to your projects with intuitive boards,
          drag-and-drop simplicity, and a clean interface that stays out of your way.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Link to="/auth/signup">
            <GlassButton variant="accent" size="lg">
              Get Started Free
            </GlassButton>
          </Link>
          <Link to="/workflow">
            <GlassButton variant="default" size="lg">
              Try Demo
            </GlassButton>
          </Link>
        </motion.div>
      </div>

      {/* Scroll-triggered KanBan columns */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {mockColumns.map((col, i) => (
          <motion.div
            key={col.title}
            className="glass p-4"
            style={{
              x: i < 2 ? leftX : rightX,
              opacity: columnsOpacity,
            }}
          >
            <h3 className="text-sm font-medium text-text-secondary mb-3 pb-2 border-b border-border-glass">
              {col.title}
            </h3>
            <div className="flex flex-col gap-2">
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="glass p-3 text-xs text-text-primary"
                >
                  {card}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
