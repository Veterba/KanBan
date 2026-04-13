import { motion, useInView } from 'framer-motion'
import { useRef, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial } from '@react-three/drei'
import GlassButton from '../../components/ui/GlassButton'

function GlassTorus() {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh rotation={[0.5, 0.3, 0]}>
        <torusGeometry args={[1.2, 0.4, 32, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          roughness={0}
          color="#5E6AD2"
          transmission={0.95}
        />
      </mesh>
    </Float>
  )
}

export default function HeroCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* 3D Element */}
        <motion.div
          className="h-[400px] w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-text-secondary text-sm">Loading 3D...</div>}>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-3, -3, 2]} intensity={0.5} color="#5E6AD2" />
              <GlassTorus />
            </Canvas>
          </Suspense>
        </motion.div>

        {/* CTA content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm text-accent font-medium tracking-widest uppercase mb-4">
            Ready?
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Streamline your{' '}
            <span className="text-text-secondary">workflow today</span>
          </h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Join teams who've simplified their project management.
            No credit card required — start organizing in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth/signup">
              <GlassButton variant="accent" size="lg">
                Start Free
              </GlassButton>
            </Link>
            <Link to="/workflow">
              <GlassButton variant="default" size="lg">
                Explore Demo
              </GlassButton>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-8 flex items-center gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg-deep"
                />
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              <span className="text-text-primary font-medium">2,400+</span> teams already on board
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
