'use client'

// Shared, tasteful entrance motion for the LMS — one orchestrated load moment.
// Honors prefers-reduced-motion (renders static). Used by the dashboards.

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

const EASE = [0.2, 0.8, 0.2, 1] as const

/** Fade + rise a block into view on mount. Stagger sections with `delay`. */
export function Reveal({ children, delay = 0, y = 16, className }: {
  children: ReactNode; delay?: number; y?: number; className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/** Container that staggers its <StaggerItem> children (e.g. a KPI row). */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return <motion.div className={className} variants={item}>{children}</motion.div>
}
