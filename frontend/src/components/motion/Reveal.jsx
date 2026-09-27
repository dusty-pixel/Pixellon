import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { VARIANTS, DURATION, EASE } from '../../motion/tokens'
import { usePointer } from '../../motion/MotionProvider'

/** Generic scroll reveal — rise + settle, once per viewport entry. */
export function SectionReveal({ children, className = '', delay = 0, y = 22 }) {
  const { reduced } = usePointer()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: DURATION.normal, ease: EASE.out, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Masked line reveal for headings — text slides up from behind a mask. */
export function MaskHeading({ children, className = '', as: Tag = 'h2', delay = 0 }) {
  const { reduced } = usePointer()
  const inner = (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
  if (reduced) return <Tag className={className}>{children}</Tag>
  return <Tag className={className}>{inner}</Tag>
}

/** Letter-stagger hero word. Controlled, readable, premium. */
export function StaggerWord({ text, className = '', delay = 0, as: Tag = 'span' }) {
  const { reduced } = usePointer()
  if (reduced) return <Tag className={className}>{text}</Tag>
  return (
    <Tag className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: '60%', rotate: 2 }}
          animate={{ opacity: 1, y: '0%', rotate: 0 }}
          transition={{ duration: DURATION.normal, ease: EASE.out, delay: delay + i * 0.035 }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </Tag>
  )
}

/** Stagger container + item for card grids. */
export function Stagger({ children, className = '', stagger = 0.07 }) {
  const { reduced } = usePointer()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={VARIANTS.staggerParent(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  const { reduced } = usePointer()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={VARIANTS.staggerChild}>
      {children}
    </motion.div>
  )
}

/** Rolling number counter (stats, XP, scores). */
export function CountUp({ to, className = '', duration = 1.2, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  const { reduced } = usePointer()

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}
