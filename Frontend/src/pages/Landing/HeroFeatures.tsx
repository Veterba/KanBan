import { motion, useInView } from 'framer-motion'
import { useRef, useState, type MouseEvent } from 'react'
import { GripVertical, Users, BarChart3, Smartphone } from 'lucide-react'

const features = [
  {
    icon: GripVertical,
    title: 'Drag & Drop',
    description: 'Effortlessly move tasks between columns. Reorder priorities with a simple gesture.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite your team, assign tasks, and track progress together in real time.',
  },
  {
    icon: BarChart3,
    title: 'Smart Tracking',
    description: 'Automatic progress tracking and insights that help you identify bottlenecks.',
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Access your boards from any device. Your workflow travels with you.',
  },
]

function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotateX(-y * 10)
    setRotateY(x * 10)
  }

  function handleMouseLeave() {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className="glass p-6 cursor-default"
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
    >
      {children}
    </motion.div>
  )
}

export default function HeroFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm text-accent font-medium tracking-widest uppercase mb-4">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
          Built for{' '}
          <span className="text-text-secondary">modern teams</span>
        </h2>
        <p className="text-lg text-text-secondary max-w-xl mx-auto">
          Everything you need to keep your projects moving forward, nothing you don't.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {features.map((feature, i) => (
          <TiltCard key={feature.title} index={i}>
            <div className="p-3 rounded-xl bg-accent/10 text-accent w-fit mb-4">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
