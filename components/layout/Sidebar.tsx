'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, CalendarDays, Send, History,
  Settings, Zap, ChevronRight, Bell, Upload
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard',    badge: null },
  { href: '/dashboard/guests',    icon: Users,           label: 'Guests',       badge: null },
  { href: '/dashboard/holidays',  icon: CalendarDays,    label: 'Holidays',     badge: null },
  { href: '/dashboard/send',      icon: Send,            label: 'Send Now',     badge: 'HOT' },
  { href: '/dashboard/history',   icon: History,         label: 'History',      badge: null },
  { href: '/dashboard/settings',  icon: Settings,        label: 'Settings',     badge: null },
  { href: '/dashboard/import',    icon: Upload,          label: 'Import',       badge: null },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative flex flex-col h-screen sticky top-0 z-40"
      style={{ width: collapsed ? 72 : 240, transition: 'width 0.3s ease' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900 border-r border-[rgba(0,245,255,0.08)]" />
      <div className="absolute inset-0 hex-bg opacity-50" />

      {/* Glow line */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,245,255,0.3) 30%, rgba(0,255,200,0.3) 70%, transparent)' }}
      />

      <div className="relative flex flex-col h-full p-4 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="relative flex-shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00f5ff, #00ffc8)', boxShadow: '0 0 20px rgba(0,245,255,0.5)' }}
            >
              <Bell size={18} className="text-dark-950" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <div className="font-display text-sm font-bold tracking-wider text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  HOGIS
                </div>
                <div className="text-xs tracking-widest" style={{ color: 'rgba(0,245,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                  OCCASIO
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="section-label px-2 mb-1">Navigation</div>
        )}

        {/* Nav items */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-[rgba(0,245,255,0.08)] text-white'
                      : 'text-[rgba(230,237,243,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ background: 'linear-gradient(to bottom, #00f5ff, #00ffc8)' }}
                    />
                  )}

                  <Icon
                    size={18}
                    style={isActive ? { color: '#00f5ff', filter: 'drop-shadow(0 0 6px rgba(0,245,255,0.8))' } : {}}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!collapsed && item.badge && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(255,0,170,0.2)', color: '#ff00aa', border: '1px solid rgba(255,0,170,0.3)' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg transition-colors"
          style={{ color: 'rgba(0,245,255,0.4)', border: '1px solid rgba(0,245,255,0.1)' }}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronRight size={16} />
          </motion.div>
        </motion.button>

        {/* System status */}
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mt-1"
            style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}
          >
            <Zap size={12} style={{ color: '#00ff88' }} />
            <span className="text-xs" style={{ color: 'rgba(0,255,136,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>
              SYSTEM ONLINE
            </span>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
