'use client'

import { motion } from 'framer-motion'
import { History, Mail, Phone, CheckCircle, XCircle, Clock, Search, RefreshCw } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChannel, setFilterChannel] = useState('all')
  const [search, setSearch] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    let q = supabase
      .from('notification_logs')
      .select('*, guests(name, email, phone), holidays(name, emoji)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    if (filterChannel !== 'all') q = q.eq('channel', filterChannel)

    const { data } = await q
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [filterStatus, filterChannel])

  const filtered = logs.filter(l => {
    if (!search) return true
    const name = l.guests?.name?.toLowerCase() || ''
    const holiday = l.holidays?.name?.toLowerCase() || ''
    return name.includes(search.toLowerCase()) || holiday.includes(search.toLowerCase())
  })

  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
    pending: logs.filter(l => l.status === 'pending').length,
  }

  return (
    <>
      <Header title="HISTORY" subtitle="Notification transmission log" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total',   value: stats.total,   color: '#00f5ff' },
            { label: 'Sent',    value: stats.sent,    color: '#00ff88' },
            { label: 'Failed',  value: stats.failed,  color: '#ff4444' },
            { label: 'Pending', value: stats.pending, color: '#ffd700' },
          ].map(s => (
            <div key={s.label} className="glass-card p-3 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Orbitron, sans-serif', textShadow: `0 0 15px ${s.color}80` }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(230,237,243,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,245,255,0.4)' }} />
            <input className="neon-input pl-9 text-sm" placeholder="Search by guest or holiday..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all','sent','failed','pending'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{ background: filterStatus===s?'rgba(0,245,255,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${filterStatus===s?'rgba(0,245,255,0.35)':'rgba(255,255,255,0.06)'}`, color:filterStatus===s?'#00f5ff':'rgba(230,237,243,0.4)' }}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['all','email','sms'].map(c => (
              <button key={c} onClick={() => setFilterChannel(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{ background: filterChannel===c?'rgba(255,215,0,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${filterChannel===c?'rgba(255,215,0,0.3)':'rgba(255,255,255,0.06)'}`, color:filterChannel===c?'#ffd700':'rgba(230,237,243,0.4)' }}>
                {c}
              </button>
            ))}
          </div>
          <button onClick={fetchLogs} className="btn-neon py-1.5 px-3 text-xs">
            <RefreshCw size={12} /> Refresh
          </button>
        </motion.div>

        {/* Log table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider"
            style={{ borderBottom: '1px solid rgba(0,245,255,0.06)', color: 'rgba(0,245,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="col-span-3">Guest</div>
            <div className="col-span-3">Holiday</div>
            <div className="col-span-2">Channel</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Time</div>
          </div>

          {loading ? (
            <div className="space-y-2 p-4">{[...Array(6)].map((_,i) => <div key={i} className="h-12 rounded-lg shimmer" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <History size={40} style={{ color: 'rgba(0,245,255,0.2)' }} />
              <p className="text-sm" style={{ color: 'rgba(230,237,243,0.4)' }}>No notification logs yet</p>
            </div>
          ) : (
            filtered.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}
              >
                <div className="col-span-3">
                  <p className="text-sm font-medium text-white truncate">{l.guests?.name || '—'}</p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(230,237,243,0.35)' }}>
                    {l.channel === 'email' ? l.guests?.email : l.guests?.phone}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-white truncate">{l.holidays?.emoji} {l.holidays?.name || '—'}</p>
                </div>
                <div className="col-span-2">
                  <span className="flex items-center gap-1.5 text-xs"
                    style={{ color: l.channel === 'email' ? '#00f5ff' : '#ffd700' }}>
                    {l.channel === 'email' ? <Mail size={11} /> : <Phone size={11} />}
                    {l.channel.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={l.status === 'sent' ? 'badge-active' : l.status === 'failed' ? 'badge-failed' : 'badge-pending'}>
                    {l.status === 'sent' ? <CheckCircle size={9} /> : l.status === 'failed' ? <XCircle size={9} /> : <Clock size={9} />}
                    {l.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs" style={{ color: 'rgba(230,237,243,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {l.sent_at ? new Date(l.sent_at).toLocaleDateString('en-NG', { day:'numeric', month:'short' }) : '—'}
                  </p>
                  <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {l.sent_at ? new Date(l.sent_at).toLocaleTimeString('en-NG', { hour:'2-digit', minute:'2-digit' }) : '—'}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </>
  )
}
