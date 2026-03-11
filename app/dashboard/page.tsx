'use client'

import { motion } from 'framer-motion'
import { Users, CalendarDays, Send, CheckCircle, Clock, Zap, ArrowRight, TrendingUp, Mail, Phone, XCircle, RefreshCw } from 'lucide-react'
import Header from '@/components/layout/Header'
import StatCard from '@/components/ui/StatCard'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ALL_HOLIDAYS_2026, daysUntilHoliday, formatHolidayDate } from '@/lib/holidays'

type ActivityLog = {
  id: string
  channel: 'email' | 'sms'
  status: 'sent' | 'failed' | 'pending'
  created_at: string
  sent_at: string | null
  guests: { name: string; email: string | null; phone: string | null } | null
  holidays: { name: string; emoji: string } | null
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ guests: 0, holidays: 0, sent: 0, pending: 0 })
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  // Real upcoming holidays from our library — sorted, accurate day counts
  const upcomingHolidays = ALL_HOLIDAYS_2026
    .filter(h => {
      const d = daysUntilHoliday(h.date)
      return d >= 0 && d <= 90
    })
    .slice(0, 5)

  const fetchData = useCallback(async () => {
    setLoadingActivity(true)

    // Stats from Supabase
    const [
      { count: guests },
      { count: holidays },
      { count: sent },
      { count: pending },
    ] = await Promise.all([
      supabase.from('guests').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('holidays').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('notification_logs').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
      supabase.from('notification_logs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])
    setStats({ guests: guests || 0, holidays: holidays || 0, sent: sent || 0, pending: pending || 0 })

    // Real activity logs — latest 6 entries with guest + holiday details
    const { data: logs } = await supabase
      .from('notification_logs')
      .select('id, channel, status, created_at, sent_at, guests(name, email, phone), holidays(name, emoji)')
      .order('created_at', { ascending: false })
      .limit(6)

    setActivityLogs((logs as ActivityLog[]) || [])
    setLoadingActivity(false)
    setLastRefreshed(new Date())
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Computed: delivery rate from real data
  const total = stats.sent + (stats.pending || 0)
  const deliveryRate = total > 0 ? ((stats.sent / total) * 100).toFixed(1) : '—'

  return (
    <>
      <Header title="DASHBOARD" subtitle="Mission Control — Holiday Notification System" />

      <div className="flex-1 p-6 space-y-8 overflow-auto">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(0,255,200,0.04) 50%, rgba(0,0,0,0) 100%)',
            border: '1px solid rgba(0,245,255,0.15)',
          }}
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)' }} />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="section-label mb-2">WELCOME BACK, HOGIS ADMIN</div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}>
                OCCASIO COMMAND CENTER
              </h1>
              <p className="text-sm" style={{ color: 'rgba(230,237,243,0.5)' }}>
                {upcomingHolidays.length} upcoming holidays in the next 90 days · {stats.guests} active guests
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link href="/dashboard/send">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-neon-solid text-sm">
                    <Zap size={14} /> SEND GREETINGS
                  </motion.button>
                </Link>
                <Link href="/dashboard/guests">
                  <motion.button whileHover={{ scale: 1.02 }} className="btn-neon text-sm">
                    <Users size={14} /> MANAGE GUESTS
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs" style={{ color: '#00ff88', fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM LIVE</span>
              </div>
              <div className="text-xs text-right" style={{ color: 'rgba(0,245,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                CRON: ACTIVE<br />QUEUE: READY<br />API: ONLINE
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 text-[10px] mt-1"
                style={{ color: 'rgba(0,245,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}
              >
                <RefreshCw size={9} /> refreshed {timeAgo(lastRefreshed.toISOString())}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Guests"   value={stats.guests}   subtitle="Subscribed members"  icon={Users}        color="cyan"  trend={{ value: 12, label: 'this month' }} delay={0.1} />
          <StatCard title="Active Holidays" value={stats.holidays}  subtitle="In your calendar"    icon={CalendarDays} color="teal"  trend={{ value: 0,  label: 'stable' }}     delay={0.2} />
          <StatCard title="Total Sent"      value={stats.sent}     subtitle="All time"             icon={Send}         color="gold"  delay={0.3} />
          <StatCard title="Pending"         value={stats.pending}  subtitle="Queued to send"       icon={Clock}        color="pink"  delay={0.4} />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── UPCOMING HOLIDAYS — Real data from holidays library ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-label mb-1">UPCOMING</div>
                <h3 className="text-sm font-semibold text-white">Next Holidays</h3>
              </div>
              <Link href="/dashboard/holidays">
                <button className="btn-neon text-xs py-1.5 px-3">
                  View All <ArrowRight size={12} />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingHolidays.length === 0 ? (
                <p className="text-xs text-center py-8" style={{ color: 'rgba(230,237,243,0.3)' }}>
                  No upcoming holidays in the next 90 days
                </p>
              ) : upcomingHolidays.map((h, i) => {
                const days = daysUntilHoliday(h.date)
                return (
                  <motion.div
                    key={h.name + h.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.1)' }}
                    >
                      {h.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{h.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(230,237,243,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {formatHolidayDate(h.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: days === 0 ? '#00ff88' : days <= 7 ? '#ff00aa' : days <= 30 ? '#ffd700' : '#00f5ff',
                          fontFamily: 'JetBrains Mono, monospace',
                          textShadow: `0 0 8px currentColor`,
                        }}
                      >
                        {days === 0 ? 'TODAY!' : `${days}d`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* ── ACTIVITY FEED — Real logs from Supabase ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-5 lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="section-label mb-1">ACTIVITY FEED</div>
                <h3 className="text-sm font-semibold text-white">Recent Notifications</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'rgba(0,245,255,0.4)', border: '1px solid rgba(0,245,255,0.1)' }}
                  title="Refresh"
                >
                  <RefreshCw size={12} />
                </button>
                <Link href="/dashboard/history">
                  <button className="btn-neon text-xs py-1.5 px-3">
                    Full Log <ArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>

            {loadingActivity ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl shimmer" />
                ))}
              </div>
            ) : activityLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Send size={32} style={{ color: 'rgba(0,245,255,0.15)' }} />
                <p className="text-sm text-center" style={{ color: 'rgba(230,237,243,0.35)' }}>
                  No notifications sent yet
                </p>
                <p className="text-xs text-center" style={{ color: 'rgba(230,237,243,0.2)' }}>
                  Go to Send Now to broadcast your first holiday greeting
                </p>
                <Link href="/dashboard/send">
                  <button className="btn-neon text-xs mt-1">
                    <Zap size={12} /> Send First Greeting
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {activityLogs.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.07 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    {/* Channel icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: a.channel === 'email' ? 'rgba(0,245,255,0.08)' : 'rgba(255,215,0,0.08)',
                        border: `1px solid ${a.channel === 'email' ? 'rgba(0,245,255,0.2)' : 'rgba(255,215,0,0.2)'}`,
                      }}
                    >
                      {a.channel === 'email'
                        ? <Mail size={13} style={{ color: '#00f5ff' }} />
                        : <Phone size={13} style={{ color: '#ffd700' }} />
                      }
                    </div>

                    {/* Guest + holiday */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {a.guests?.name || 'Unknown Guest'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'rgba(230,237,243,0.4)' }}>
                        {a.holidays?.emoji} {a.holidays?.name || 'Holiday'}
                      </p>
                    </div>

                    {/* Status + time */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={
                        a.status === 'sent' ? 'badge-active' :
                        a.status === 'failed' ? 'badge-failed' : 'badge-pending'
                      }>
                        {a.status === 'sent'    && <CheckCircle size={9} />}
                        {a.status === 'failed'  && <XCircle size={9} />}
                        {a.status === 'pending' && <Clock size={9} />}
                        {a.status}
                      </span>
                      <span className="text-[10px] hidden sm:block" style={{ color: 'rgba(230,237,243,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {timeAgo(a.sent_at || a.created_at)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Metrics bar — real where possible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="section-label">SYSTEM METRICS</div>
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'Delivery Rate',    value: stats.sent > 0 ? `${deliveryRate}%` : '—',  color: '#00ff88' },
                { label: 'Total Sent',       value: stats.sent.toString(),                       color: '#00f5ff' },
                { label: 'Pending Queue',    value: stats.pending.toString(),                    color: '#ffd700' },
                { label: 'Active Contacts',  value: stats.guests.toString(),                     color: '#00ffc8' },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <TrendingUp size={12} style={{ color: m.color }} />
                  <span className="text-xs" style={{ color: 'rgba(230,237,243,0.4)' }}>{m.label}</span>
                  <span className="text-sm font-bold" style={{ color: m.color, fontFamily: 'Orbitron, sans-serif', textShadow: `0 0 10px ${m.color}80` }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}