'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Plus, Edit3, Trash2, X, Globe, Flag, Star, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { supabase, Holiday } from '@/lib/supabase'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  national:  { color: '#00f5ff', bg: 'rgba(0,245,255,0.08)',  border: 'rgba(0,245,255,0.2)'  },
  religious: { color: '#ffd700', bg: 'rgba(255,215,0,0.08)',  border: 'rgba(255,215,0,0.2)'  },
  cultural:  { color: '#ff00aa', bg: 'rgba(255,0,170,0.08)',  border: 'rgba(255,0,170,0.2)'  },
  custom:    { color: '#00ffc8', bg: 'rgba(0,255,200,0.08)',  border: 'rgba(0,255,200,0.2)'  },
}

const TYPE_ICONS = { national: Flag, religious: Star, cultural: Globe, custom: Sparkles }

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null)
  const [form, setForm] = useState({
    name: '', date: '', country_code: 'NG', type: 'national',
    emoji: '🎉', is_active: true, message_template: '',
  })

  const fetchHolidays = async () => {
    setLoading(true)
    let q = supabase.from('holidays').select('*').order('date', { ascending: true })
    if (filterType !== 'all') q = q.eq('type', filterType)
    const { data } = await q
    setHolidays(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchHolidays() }, [filterType])

  const openAdd = () => {
    setEditHoliday(null)
    setForm({ name: '', date: '', country_code: 'NG', type: 'national', emoji: '🎉', is_active: true, message_template: '' })
    setShowModal(true)
  }

  const openEdit = (h: Holiday) => {
    setEditHoliday(h)
    setForm({
      name: h.name, date: h.date, country_code: h.country_code, type: h.type,
      emoji: h.emoji, is_active: h.is_active, message_template: h.message_template || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.date) { toast.error('Name and date required'); return }
    const payload = { ...form, message_template: form.message_template || null }
    if (editHoliday) {
      const { error } = await supabase.from('holidays').update(payload).eq('id', editHoliday.id)
      if (error) { toast.error('Update failed'); return }
      toast.success('Holiday updated!')
    } else {
      const { error } = await supabase.from('holidays').insert([payload])
      if (error) { toast.error('Failed to add'); return }
      toast.success('Holiday added!')
    }
    setShowModal(false)
    fetchHolidays()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete holiday?')) return
    await supabase.from('holidays').delete().eq('id', id)
    toast.success('Deleted')
    fetchHolidays()
  }

  const handleToggle = async (h: Holiday) => {
    await supabase.from('holidays').update({ is_active: !h.is_active }).eq('id', h.id)
    fetchHolidays()
  }

  const daysUntil = (dateStr: string) => {
    const today = new Date(); today.setHours(0,0,0,0)
    const d = new Date(dateStr); d.setHours(0,0,0,0)
    return Math.ceil((d.getTime() - today.getTime()) / 86400000)
  }

  return (
    <>
      <Header title="HOLIDAYS" subtitle="Manage public holiday calendar" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {['all','national','religious','cultural','custom'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: filterType === t ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterType === t ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  color: filterType === t ? '#00f5ff' : 'rgba(230,237,243,0.4)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd} className="btn-neon-solid ml-auto">
            <Plus size={14} /> ADD HOLIDAY
          </motion.button>
        </motion.div>

        {/* Holidays grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? [...Array(8)].map((_, i) => <div key={i} className="h-40 rounded-xl shimmer" />)
            : holidays.map((h, i) => {
                const tc = TYPE_COLORS[h.type as keyof typeof TYPE_COLORS] || TYPE_COLORS.custom
                const TypeIcon = TYPE_ICONS[h.type as keyof typeof TYPE_ICONS] || Star
                const days = daysUntil(h.date)
                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="glass-card p-4 relative cursor-default"
                    style={{ opacity: h.is_active ? 1 : 0.5 }}
                  >
                    {/* Type badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}
                      >
                        <TypeIcon size={9} />
                        <span className="capitalize">{h.type}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(h)} style={{ color: 'rgba(0,245,255,0.4)' }} onMouseEnter={e => (e.currentTarget.style.color='#00f5ff')} onMouseLeave={e => (e.currentTarget.style.color='rgba(0,245,255,0.4)')}>
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDelete(h.id)} style={{ color: 'rgba(255,68,68,0.3)' }} onMouseEnter={e => (e.currentTarget.style.color='#ff4444')} onMouseLeave={e => (e.currentTarget.style.color='rgba(255,68,68,0.3)')}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Emoji + Name */}
                    <div className="text-3xl mb-2">{h.emoji}</div>
                    <h3 className="text-sm font-semibold text-white mb-1 leading-tight">{h.name}</h3>
                    <p className="text-xs" style={{ color: 'rgba(230,237,243,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {new Date(h.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>

                    {/* Days until */}
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: days < 0 ? 'rgba(255,255,255,0.2)' : days <= 7 ? '#ff00aa' : days <= 30 ? '#ffd700' : '#00f5ff',
                          fontFamily: 'JetBrains Mono, monospace',
                          textShadow: days >= 0 ? `0 0 8px currentColor` : 'none',
                        }}
                      >
                        {days < 0 ? 'PAST' : days === 0 ? 'TODAY! 🎉' : `${days}d away`}
                      </span>
                      <button
                        onClick={() => handleToggle(h)}
                        className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                        style={{
                          background: h.is_active ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${h.is_active ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          color: h.is_active ? '#00ff88' : 'rgba(255,255,255,0.2)',
                        }}
                      >
                        {h.is_active ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl" style={{ background: `linear-gradient(90deg, transparent, ${tc.color}50, transparent)` }} />
                  </motion.div>
                )
              })
          }
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-6"
              style={{ border: '1px solid rgba(0,245,255,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="section-label mb-1">{editHoliday ? 'EDIT HOLIDAY' : 'NEW HOLIDAY'}</div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {editHoliday ? editHoliday.name : 'Add Holiday'}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} style={{ color: 'rgba(230,237,243,0.4)' }}><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>HOLIDAY NAME *</label>
                  <input className="neon-input" placeholder="e.g. Independence Day" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>DATE *</label>
                  <input className="neon-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>EMOJI</label>
                  <input className="neon-input" placeholder="🎉" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>TYPE</label>
                  <select className="neon-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                    <option value="national">National</option>
                    <option value="religious">Religious</option>
                    <option value="cultural">Cultural</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>COUNTRY</label>
                  <select className="neon-input" value={form.country_code} onChange={e => setForm({...form, country_code: e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                    <option value="NG">🇳🇬 Nigeria</option>
                    <option value="GH">🇬🇭 Ghana</option>
                    <option value="KE">🇰🇪 Kenya</option>
                    <option value="ZA">🇿🇦 South Africa</option>
                    <option value="INTL">🌍 International</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>CUSTOM MESSAGE (optional — uses default if blank)</label>
                  <textarea
                    className="neon-input resize-none"
                    rows={3}
                    placeholder="Enter a custom greeting message for this holiday..."
                    value={form.message_template}
                    onChange={e => setForm({...form, message_template: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-neon flex-1 justify-center">Cancel</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="btn-neon-solid flex-1 justify-center">
                  {editHoliday ? 'SAVE CHANGES' : 'ADD HOLIDAY'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
