---
name: framer-motion
description: Add motion to React/Next.js UI with framer-motion (motion components, variants, stagger, gestures, layout animation, AnimatePresence, scroll-linked motion). Use whenever animating a component, page, list, modal, or interaction — entrance/exit, hover/tap, drag, count-up, page transitions, scroll reveals — or when asked to "make it feel alive / add animation / animate this". Always honors prefers-reduced-motion.
---

# framer-motion

Animation for React. Installed in this project (`framer-motion@^12`). In this app the
reusable wrappers live in `@/components/motion/Motion.tsx` (`Reveal`, `Stagger`,
`StaggerItem`) — prefer those for dashboards; reach for the API below for anything custom.

## Non-negotiables
1. **Next.js App Router:** any file using `motion.*`, `useReducedMotion`, `AnimatePresence`,
   or motion hooks MUST start with `'use client'`. Keep pages as server components and put
   animation in small client wrappers.
2. **Accessibility:** gate motion on `useReducedMotion()` — return the static element when true.
   Never animate essential content into existence with no fallback.
3. **Taste:** one orchestrated moment per screen. Durations 0.2–0.6s, ease `[0.2,0.8,0.2,1]`
   (or `easeOut`). Animate `opacity`/`transform` only (GPU-friendly) — avoid animating
   `width`/`height`/`top`/`left`; use `scale`/`x`/`y` or `layout`.

## Core API
```tsx
'use client'
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion'

// 1. Basic: animate a value on mount
<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45, ease: [0.2,0.8,0.2,1] }} />

// 2. Variants + stagger (parent drives children)
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }
<motion.ul variants={list} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i} variants={item} />)}
</motion.ul>

// 3. Gestures (micro-interactions)
<motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} />

// 4. Exit animation — wrap in AnimatePresence, give a stable key
<AnimatePresence>
  {open && <motion.div key="modal"
    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }} />}
</AnimatePresence>

// 5. Shared layout — animate position/size changes automatically
<motion.div layout />            // animates when its layout changes
<motion.div layoutId="card-1" /> // morphs between two instances (e.g. grid → detail)

// 6. Scroll reveal — animate when it enters the viewport (once)
<motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }} />

// 7. Scroll-linked + number count-up
const { scrollYProgress } = useScroll()
const count = useMotionValue(0); const rounded = useTransform(count, v => Math.round(v))
useEffect(() => { const c = animate(count, target, { duration: 1.2, ease: 'easeOut' }); return c.stop }, [target])
<motion.span>{rounded}</motion.span>
```

## Reduced-motion pattern (use everywhere)
```tsx
const reduce = useReducedMotion()
if (reduce) return <div className={className}>{children}</div>
return <motion.div {...animationProps}>{children}</motion.div>
```

## Recipes
- **Section entrance:** `initial opacity:0,y:16 → animate opacity:1,y:0`, stagger sections via `delay`.
- **List stagger:** parent `staggerChildren`, children share `variants`.
- **Modal/toast:** `AnimatePresence` + `exit`, stable `key`.
- **Card → detail morph:** matching `layoutId` on both.
- **Count-up KPI:** `useMotionValue` + `animate()` + `useTransform(Math.round)`.
- **Page transitions (App Router):** a `'use client'` template.tsx wrapping `children` in
  `<motion.div key={pathname}>` with initial/animate.

## Pitfalls
- Forgetting `'use client'` → "useRef/createContext only works in Client Components" error.
- `AnimatePresence` children need a unique, stable `key` or exit won't fire.
- Don't animate layout-affecting CSS props directly — use transforms or `layout`.
- v12 note: the package also ships as `motion` (`import { motion } from 'motion/react'`); this
  project uses the `framer-motion` import path — keep it consistent.
```
