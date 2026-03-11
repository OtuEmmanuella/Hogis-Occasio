'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: 'cyan' | 'teal' | 'gold' | 'pink' | 'green'
  trend?: { value: number; label: string }
  delay?: number
}

const COLOR_MAP = {
  cyan:  { hex: '#00f5ff', glow: 'rgba(0,245,255,0.15)',  bg: 'rgba(0,245,255,0.05)',  border: 'rgba(0,245,255,0.15)'  },
  teal:  { hex: '#00ffc8', glow: 'rgba(0,255,200,0.15)',  bg: 'rgba(0,255,200,0.05)',  border: 'rgba(0,255,200,0.15)'  },
  gold:  { hex: '#ffd700', glow: 'rgba(255,215,0,0.15)',  bg: 'rgba(255,215,0,0.05)',  border: 'rgba(255,215,0,0.15)'  },
  pink:  { hex: '#ff00aa', glow: 'rgba(255,0,170,0.15)',  bg: 'rgba(255,0,170,0.05)',  border: 'rgba(255,0,170,0.15)'  },
  green: { hex: '#00ff88', glow: 'rgba(0,255,136,0.15)',  bg: 'rgba(0,255,136,0.05)',  border: 'rgba(0,255,136,0.15)'  },
}

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend, delay = 0 }: StatCardProps) {
  const c = COLOR_MAP[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card p-5 cursor-default"
      style={{ boxShadow: `0 0 30px ${c.glow}, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'rgba(230,237,243,0.4)' }}>
            {title}
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
            className="text-3xl font-bold"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: c.hex,
              textShadow: `0 0 20px ${c.hex}80`,
            }}
          >
            {value}
          </motion.div>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: 'rgba(230,237,243,0.35)' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon size={20} style={{ color: c.hex, filter: `drop-shadow(0 0 6px ${c.hex})` }} />
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-semibold"
            style={{ color: trend.value >= 0 ? '#00ff88' : '#ff4444' }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs" style={{ color: 'rgba(230,237,243,0.3)' }}>
            {trend.label}
          </span>
        </div>
      )}

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${c.hex}60, transparent)` }}
      />
    </motion.div>
  )
}
