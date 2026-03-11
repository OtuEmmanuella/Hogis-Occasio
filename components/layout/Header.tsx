'use client'

import { motion } from 'framer-motion'
import { Bell, Search, Cpu, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
 const [mounted, setMounted] = useState(false)
const [time, setTime] = useState('')
const [date, setDate] = useState('')

useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDate(now.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(1, 4, 9, 0.85)',
        borderBottom: '1px solid rgba(0,245,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left: Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="section-label">// HOGIS OCCASIO</span>
          <span style={{ color: 'rgba(0,245,255,0.2)' }}>|</span>
          <span className="section-label">{title}</span>
        </div>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'rgba(230,237,243,0.4)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: Status bar */}
      <div className="flex items-center gap-4">
        {/* Time */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}
          >
            <div
              className="text-xs font-mono"
              style={{ color: '#00f5ff', fontFamily: 'JetBrains Mono, monospace', textShadow: '0 0 10px rgba(0,245,255,0.5)' }}
            >
             {mounted ? time : '--:--:--'}

            </div>
            <div className="text-[10px]" style={{ color: 'rgba(230,237,243,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
              {mounted ? date : '...'}

            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi size={12} style={{ color: '#00ff88' }} />
            <span className="text-xs" style={{ color: 'rgba(0,255,136,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>LIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu size={12} style={{ color: '#00f5ff' }} />
            <span className="text-xs" style={{ color: 'rgba(0,245,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>API</span>
          </div>
        </div>

        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg transition-colors"
          style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}
        >
          <Bell size={16} style={{ color: 'rgba(0,245,255,0.7)' }} />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background: '#ff00aa', color: 'white', boxShadow: '0 0 8px rgba(255,0,170,0.5)' }}
          >
            3
          </span>
        </motion.button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #00ffc8)',
            color: '#010409',
            fontFamily: 'Orbitron, sans-serif',
          }}
        >
          H
        </div>
      </div>
    </motion.header>
  )
}
