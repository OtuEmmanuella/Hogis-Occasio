'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Mail, Phone, Users, CalendarDays, Zap, CheckCircle,
  Loader2, AlertCircle, Search, UserCheck, UserX, ChevronDown, ChevronUp
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState, useEffect, useMemo } from 'react'
import { supabase, Guest, Holiday } from '@/lib/supabase'
import toast from 'react-hot-toast'

type SendStatus = 'idle' | 'sending' | 'done'
type RecipientMode = 'all' | 'groups' | 'individual'

export default function SendPage() {
  const [holidays, setHolidays]           = useState<Holiday[]>([])
  const [guests, setGuests]               = useState<Guest[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
  const [channels, setChannels]           = useState({ email: true, sms: false })
  const [customMessage, setCustomMessage] = useState('')
  const [status, setStatus]               = useState<SendStatus>('idle')
  const [progress, setProgress]           = useState({ sent: 0, failed: 0, total: 0 })

  // Recipient mode
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('all')
  const [selectedGroups, setSelectedGroups]   = useState<string[]>([])
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([])
  const [guestSearch, setGuestSearch]     = useState('')
  const [showAllGuests, setShowAllGuests] = useState(false)

  const groups = useMemo(() => {
    const g = Array.from(new Set(guests.map(g => g.group_name || 'General').filter(Boolean)))
    return g as string[]
  }, [guests])

  useEffect(() => {
    const load = async () => {
      const [{ data: hols }, { data: gs }] = await Promise.all([
        supabase.from('holidays').select('*').eq('is_active', true).order('date'),
        supabase.from('guests').select('*').eq('is_active', true).order('name'),
      ])
      setHolidays(hols || [])
      setGuests(gs || [])
    }
    load()
  }, [])

  // Who will actually receive the message
  const targetGuests = useMemo(() => {
    return guests.filter(g => {
      // Must have the right channel enabled
      const hasChannel = (channels.email && g.notify_email && g.email) ||
                         (channels.sms   && g.notify_sms  && g.phone)
      if (!hasChannel) return false

      if (recipientMode === 'all') return true
      if (recipientMode === 'groups') {
        return selectedGroups.length === 0 || selectedGroups.includes(g.group_name || 'General')
      }
      if (recipientMode === 'individual') {
        return selectedGuestIds.includes(g.id)
      }
      return true
    })
  }, [guests, channels, recipientMode, selectedGroups, selectedGuestIds])

  // Filtered guest list for individual search
  const filteredGuestList = useMemo(() => {
    return guests.filter(g => {
      if (!guestSearch) return true
      const q = guestSearch.toLowerCase()
      return g.name.toLowerCase().includes(q) ||
             (g.email || '').toLowerCase().includes(q) ||
             (g.group_name || '').toLowerCase().includes(q)
    })
  }, [guests, guestSearch])

  const visibleGuests = showAllGuests ? filteredGuestList : filteredGuestList.slice(0, 8)

  const toggleGuest = (id: string) => {
    setSelectedGuestIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const selectAllFiltered = () => {
    const ids = filteredGuestList.map(g => g.id)
    setSelectedGuestIds(prev => {
      const allSelected = ids.every(id => prev.includes(id))
      if (allSelected) return prev.filter(id => !ids.includes(id))
      return Array.from(new Set([...prev, ...ids]))
    })
  }

  const daysUntil = (dateStr: string) => {
    const today = new Date(); today.setHours(0,0,0,0)
    const d = new Date(dateStr); d.setHours(0,0,0,0)
    return Math.ceil((d.getTime() - today.getTime()) / 86400000)
  }

  const handleSend = async () => {
    if (!selectedHoliday) { toast.error('Please select a holiday'); return }
    if (!channels.email && !channels.sms) { toast.error('Select at least one channel'); return }
    if (targetGuests.length === 0) { toast.error('No recipients match your selection'); return }

    setStatus('sending')
    setProgress({ sent: 0, failed: 0, total: targetGuests.length })

    try {
      const body: any = {
        holidayId: selectedHoliday.id,
        channels,
        customMessage: customMessage || null,
      }

      if (recipientMode === 'groups' && selectedGroups.length > 0) {
        body.groups = selectedGroups
      } else if (recipientMode === 'individual') {
        body.guestIds = selectedGuestIds
      }
      // 'all' sends no filter — backend sends to everyone

      const res = await fetch('/api/send-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Send failed')

      setProgress({ sent: data.sent, failed: data.failed, total: data.total })
      setStatus('done')
      toast.success(`✅ Sent ${data.sent} notifications!`)
    } catch (err: any) {
      toast.error(err.message)
      setStatus('idle')
    }
  }

  const channelCount = [channels.email, channels.sms].filter(Boolean).length || 1
  const estimatedMessages = targetGuests.length * channelCount

  return (
    <>
      <Header title="SEND NOW" subtitle="Broadcast holiday greetings instantly" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── SUCCESS SCREEN ── */}
          {status === 'done' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
              style={{ border: '1px solid rgba(0,255,136,0.3)' }}
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)' }}
              >
                <CheckCircle size={48} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 15px #00ff88)' }} />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                TRANSMISSION COMPLETE
              </h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(230,237,243,0.5)' }}>
                Your holiday greetings have been dispatched
              </p>
              <div className="flex justify-center gap-12 mb-8">
                <div>
                  <div className="text-4xl font-bold" style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px #00ff88' }}>
                    {progress.sent}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(230,237,243,0.4)' }}>Sent</div>
                </div>
                {progress.failed > 0 && (
                  <div>
                    <div className="text-4xl font-bold" style={{ color: '#ff4444', fontFamily: 'Orbitron, sans-serif' }}>
                      {progress.failed}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(230,237,243,0.4)' }}>Failed</div>
                  </div>
                )}
              </div>
              <button onClick={() => { setStatus('idle'); setSelectedGuestIds([]) }} className="btn-neon-solid">
                <Send size={14} /> SEND ANOTHER
              </button>
            </motion.div>

          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* STEP 1 — Holiday */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="step-badge">1</div>
                    <div className="section-label">SELECT HOLIDAY</div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {holidays.map(h => {
                      const days = daysUntil(h.date)
                      const isSelected = selectedHoliday?.id === h.id
                      return (
                        <button
                          key={h.id}
                          onClick={() => { setSelectedHoliday(h); setCustomMessage(h.message_template || '') }}
                          className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                          style={{
                            background: isSelected ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.05)'}`,
                          }}
                        >
                          <span className="text-xl flex-shrink-0">{h.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{h.name}</p>
                            <p className="text-[10px]" style={{ color: days <= 7 && days >= 0 ? '#ff00aa' : 'rgba(230,237,243,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                              {days < 0 ? 'Past' : days === 0 ? 'TODAY!' : `${days}d away`}
                            </p>
                          </div>
                          {isSelected && <CheckCircle size={12} style={{ color: '#00f5ff', flexShrink: 0 }} />}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* STEP 2 — Channels */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="step-badge">2</div>
                    <div className="section-label">DELIVERY CHANNELS</div>
                  </div>
                  <div className="flex gap-4">
                    {[
                      { key: 'email', icon: Mail,  label: 'Email',  sub: 'Via Gmail',          color: '#00f5ff' },
                      { key: 'sms',   icon: Phone, label: 'SMS',    sub: "Via Africa's Talking", color: '#ffd700' },
                    ].map(ch => (
                      <button
                        key={ch.key}
                        onClick={() => setChannels({ ...channels, [ch.key]: !(channels as any)[ch.key] })}
                        className="flex-1 flex items-center gap-3 p-4 rounded-xl transition-all"
                        style={{
                          background: (channels as any)[ch.key] ? `rgba(${ch.color === '#00f5ff' ? '0,245,255' : '255,215,0'},0.08)` : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${(channels as any)[ch.key] ? ch.color + '40' : 'rgba(255,255,255,0.05)'}`,
                        }}
                      >
                        <ch.icon size={20} style={{ color: (channels as any)[ch.key] ? ch.color : 'rgba(255,255,255,0.2)', filter: (channels as any)[ch.key] ? `drop-shadow(0 0 6px ${ch.color})` : 'none' }} />
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium" style={{ color: (channels as any)[ch.key] ? 'white' : 'rgba(255,255,255,0.3)' }}>{ch.label}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.3)' }}>{ch.sub}</p>
                        </div>
                        {/* Toggle pill */}
                        <div className="w-9 h-5 rounded-full relative flex-shrink-0 transition-all"
                          style={{ background: (channels as any)[ch.key] ? ch.color + '30' : 'rgba(255,255,255,0.05)', border: `1px solid ${(channels as any)[ch.key] ? ch.color + '60' : 'rgba(255,255,255,0.08)'}` }}>
                          <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                            style={{ background: (channels as any)[ch.key] ? ch.color : 'rgba(255,255,255,0.2)', left: (channels as any)[ch.key] ? '18px' : '2px', boxShadow: (channels as any)[ch.key] ? `0 0 6px ${ch.color}` : 'none' }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* STEP 3 — Recipients */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="step-badge">3</div>
                    <div className="section-label">SELECT RECIPIENTS</div>
                  </div>

                  {/* Mode selector */}
                  <div className="flex gap-2 mb-5">
                    {([
                      { value: 'all',        label: 'All Guests',   icon: Users },
                      { value: 'groups',     label: 'By Group',     icon: UserCheck },
                      { value: 'individual', label: 'Pick Guests',  icon: UserX },
                    ] as { value: RecipientMode; label: string; icon: any }[]).map(m => (
                      <button
                        key={m.value}
                        onClick={() => setRecipientMode(m.value)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: recipientMode === m.value ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${recipientMode === m.value ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                          color: recipientMode === m.value ? '#00f5ff' : 'rgba(230,237,243,0.4)',
                        }}
                      >
                        <m.icon size={13} />
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* ALL MODE */}
                  {recipientMode === 'all' && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
                      <Users size={16} style={{ color: '#00f5ff' }} />
                      <p className="text-sm" style={{ color: 'rgba(230,237,243,0.6)' }}>
                        Sending to <strong className="text-white">{guests.length} active guests</strong> who have the selected channel(s) enabled
                      </p>
                    </div>
                  )}

                  {/* GROUPS MODE */}
                  {recipientMode === 'groups' && (
                    <div>
                      <p className="text-xs mb-3" style={{ color: 'rgba(230,237,243,0.4)' }}>
                        Select one or more groups — leave all unselected to send to all groups
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groups.map(g => (
                          <button
                            key={g}
                            onClick={() => setSelectedGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: selectedGroups.includes(g) ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${selectedGroups.includes(g) ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                              color: selectedGroups.includes(g) ? '#00f5ff' : 'rgba(230,237,243,0.45)',
                            }}
                          >
                            {selectedGroups.includes(g) && <CheckCircle size={10} />}
                            {g}
                            <span className="opacity-50">
                              ({guests.filter(gst => (gst.group_name || 'General') === g).length})
                            </span>
                          </button>
                        ))}
                        {groups.length === 0 && (
                          <p className="text-xs" style={{ color: 'rgba(230,237,243,0.3)' }}>No groups found. Add guests with group names first.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* INDIVIDUAL MODE */}
                  {recipientMode === 'individual' && (
                    <div>
                      {/* Search + select all */}
                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(230,237,243,0.3)' }} />
                          <input
                            type="text"
                            placeholder="Search by name, email or group..."
                            value={guestSearch}
                            onChange={e => setGuestSearch(e.target.value)}
                            className="neon-input pl-8 py-2 text-xs w-full"
                          />
                        </div>
                        <button
                          onClick={selectAllFiltered}
                          className="px-3 py-2 rounded-xl text-xs transition-all flex-shrink-0"
                          style={{
                            background: 'rgba(0,245,255,0.06)',
                            border: '1px solid rgba(0,245,255,0.15)',
                            color: '#00f5ff',
                          }}
                        >
                          {filteredGuestList.every(g => selectedGuestIds.includes(g.id)) ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      {/* Selected count pill */}
                      {selectedGuestIds.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88' }}>
                            ✓ {selectedGuestIds.length} guest{selectedGuestIds.length > 1 ? 's' : ''} selected
                          </span>
                          <button onClick={() => setSelectedGuestIds([])} className="text-[10px]" style={{ color: 'rgba(230,237,243,0.3)' }}>
                            Clear
                          </button>
                        </div>
                      )}

                      {/* Guest list */}
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {visibleGuests.map(g => {
                          const isSelected = selectedGuestIds.includes(g.id)
                          const hasEmail = g.notify_email && g.email
                          const hasSMS = g.notify_sms && g.phone
                          return (
                            <button
                              key={g.id}
                              onClick={() => toggleGuest(g.id)}
                              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                              style={{
                                background: isSelected ? 'rgba(0,245,255,0.06)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isSelected ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.04)'}`,
                              }}
                            >
                              {/* Checkbox */}
                              <div
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                                style={{
                                  background: isSelected ? '#00f5ff' : 'transparent',
                                  border: `1.5px solid ${isSelected ? '#00f5ff' : 'rgba(230,237,243,0.2)'}`,
                                  boxShadow: isSelected ? '0 0 8px rgba(0,245,255,0.4)' : 'none',
                                }}
                              >
                                {isSelected && <CheckCircle size={11} style={{ color: '#010409' }} />}
                              </div>

                              {/* Avatar */}
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.15)' }}
                              >
                                {g.name.charAt(0).toUpperCase()}
                              </div>

                              {/* Name + email */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{g.name}</p>
                                <p className="text-[10px] truncate" style={{ color: 'rgba(230,237,243,0.35)' }}>
                                  {g.email || g.phone || 'No contact info'}
                                </p>
                              </div>

                              {/* Channel badges */}
                              <div className="flex gap-1 flex-shrink-0">
                                {hasEmail && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>
                                    EMAIL
                                  </span>
                                )}
                                {hasSMS && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}>
                                    SMS
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}

                        {filteredGuestList.length === 0 && (
                          <p className="text-xs text-center py-6" style={{ color: 'rgba(230,237,243,0.3)' }}>
                            No guests match your search
                          </p>
                        )}
                      </div>

                      {/* Show more / less */}
                      {filteredGuestList.length > 8 && (
                        <button
                          onClick={() => setShowAllGuests(!showAllGuests)}
                          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg transition-all"
                          style={{ color: 'rgba(0,245,255,0.5)', border: '1px solid rgba(0,245,255,0.08)' }}
                        >
                          {showAllGuests ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show all {filteredGuestList.length} guests</>}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* STEP 4 — Custom Message */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="step-badge">4</div>
                    <div className="section-label">CUSTOM MESSAGE (optional)</div>
                  </div>
                  <textarea
                    className="neon-input resize-none"
                    rows={4}
                    placeholder={selectedHoliday
                      ? `Using default message for ${selectedHoliday.name}. Type here to override...`
                      : 'Select a holiday first...'}
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    disabled={!selectedHoliday}
                  />
                  <p className="text-[10px] mt-2" style={{ color: 'rgba(230,237,243,0.3)' }}>
                    💡 Use {'{{name}}'} to personalise — e.g. "Happy Holidays, {'{{name}}'}!"
                  </p>
                </motion.div>
              </div>

              {/* ── RIGHT COLUMN — Summary + Send ── */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">

                {/* Summary */}
                <div className="glass-card p-5" style={{ border: '1px solid rgba(0,245,255,0.12)' }}>
                  <div className="section-label mb-4">MISSION SUMMARY</div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays size={15} style={{ color: 'rgba(0,245,255,0.5)', marginTop: 2 }} />
                      <div>
                        <p className="text-[10px] mb-0.5" style={{ color: 'rgba(230,237,243,0.35)' }}>HOLIDAY</p>
                        <p className="text-sm font-medium text-white">
                          {selectedHoliday ? `${selectedHoliday.emoji} ${selectedHoliday.name}` : '— not selected —'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Send size={15} style={{ color: 'rgba(0,245,255,0.5)', marginTop: 2 }} />
                      <div>
                        <p className="text-[10px] mb-0.5" style={{ color: 'rgba(230,237,243,0.35)' }}>CHANNELS</p>
                        <div className="flex gap-2">
                          {channels.email && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>📧 Email</span>}
                          {channels.sms   && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}>📱 SMS</span>}
                          {!channels.email && !channels.sms && <span className="text-xs" style={{ color: 'rgba(230,237,243,0.3)' }}>None selected</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users size={15} style={{ color: 'rgba(0,245,255,0.5)', marginTop: 2 }} />
                      <div>
                        <p className="text-[10px] mb-0.5" style={{ color: 'rgba(230,237,243,0.35)' }}>RECIPIENTS</p>
                        <p className="text-3xl font-bold" style={{ color: '#00f5ff', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 15px rgba(0,245,255,0.5)' }}>
                          {targetGuests.length}
                        </p>
                        <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.3)' }}>
                          {recipientMode === 'all' ? 'all active guests' :
                           recipientMode === 'groups' ? `${selectedGroups.length || 'all'} group${selectedGroups.length !== 1 ? 's' : ''}` :
                           `${selectedGuestIds.length} selected`}
                        </p>
                      </div>
                    </div>

                    <div className="h-px" style={{ background: 'rgba(0,245,255,0.06)' }} />

                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'rgba(230,237,243,0.4)' }}>Est. Messages</span>
                      <span className="text-lg font-bold" style={{ color: '#00ffc8', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px rgba(0,255,200,0.4)' }}>
                        {estimatedMessages}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,245,255,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={status === 'sending' || !selectedHoliday || targetGuests.length === 0}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: (!selectedHoliday || status === 'sending' || targetGuests.length === 0)
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                    color: (!selectedHoliday || status === 'sending' || targetGuests.length === 0)
                      ? 'rgba(255,255,255,0.2)'
                      : '#010409',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: '0.1em',
                    cursor: (!selectedHoliday || status === 'sending' || targetGuests.length === 0) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin" /> TRANSMITTING...</>
                  ) : (
                    <><Zap size={16} /> LAUNCH BROADCAST</>
                  )}
                </motion.button>

                {/* Sending animation */}
                <AnimatePresence>
                  {status === 'sending' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card p-4"
                    >
                      <div className="text-xs mb-2" style={{ color: 'rgba(0,245,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                        TRANSMISSION IN PROGRESS...
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #00f5ff, #00ffc8)' }}
                          animate={{ width: ['0%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Warnings */}
                {targetGuests.length === 0 && (channels.email || channels.sms) && (
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                    <AlertCircle size={14} style={{ color: '#ffd700', flexShrink: 0, marginTop: 1 }} />
                    <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>
                      {recipientMode === 'individual' && selectedGuestIds.length === 0
                        ? 'No guests selected. Pick at least one guest above.'
                        : 'No guests match your filters. Check that guests have the selected channel enabled.'}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .step-badge {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          background: rgba(0,245,255,0.15);
          border: 1px solid rgba(0,245,255,0.3);
          color: #00f5ff;
          font-family: Orbitron, sans-serif;
          flex-shrink: 0;
        }
      `}</style>
    </>
  )
}