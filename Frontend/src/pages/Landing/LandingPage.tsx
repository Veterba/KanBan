import { Suspense } from 'react'
import { motion } from 'framer-motion'
import Hero from './Hero'
import HeroInteractive from './HeroInteractive'
import HeroFeatures from './HeroFeatures'

export default function LandingPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <HeroInteractive />
      <HeroFeatures />
      <Suspense fallback={<div className="min-h-screen" />}>
      </Suspense>
    </motion.main>
  )
}
