'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, Mail, Phone, Edit3, Trash2, X, Upload, CheckCircle, XCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState, useEffect } from 'react'
import { supabase, Guest } from '@/lib/supabase'
import toast from 'react-hot-toast'

const GROUPS = ['General', 'VIP', 'Staff', 'Customers', 'Partners', 'Family', 'Friends']

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editGuest, setEditGuest] = useState<Guest | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', group_name: 'General',
    notify_email: true, notify_sms: false, tags: '',
  })

  const fetchGuests = async () => {
    setLoading(true)
    let q = supabase.from('guests').select('*').order('created_at', { ascending: false })
    if (filterGroup !== 'All') q = q.eq('group_name', filterGroup)
    if (search) q = q.ilike('name', `%${search}%`)
    const { data } = await q
    setGuests(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchGuests() }, [search, filterGroup])

  const openAdd = () => {
    setEditGuest(null)
    setForm({ name: '', email: '', phone: '', group_name: 'General', notify_email: true, notify_sms: false, tags: '' })
    setShowModal(true)
  }

  const openEdit = (g: Guest) => {
    setEditGuest(g)
    setForm({
      name: g.name, email: g.email || '', phone: g.phone || '',
      group_name: g.group_name || 'General', notify_email: g.notify_email,
      notify_sms: g.notify_sms, tags: (g.tags || []).join(', '),
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    if (!form.email && !form.phone) { toast.error('Email or phone required'); return }

    const payload = {
      name: form.name.trim(),
      email: form.email || null,
      phone: form.phone || null,
      group_name: form.group_name,
      notify_email: form.notify_email,
      notify_sms: form.notify_sms,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }

    if (editGuest) {
      const { error } = await supabase.from('guests').update(payload).eq('id', editGuest.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Guest updated!')
    } else {
      const { error } = await supabase.from('guests').insert([payload])
      if (error) { toast.error('Failed to add'); return }
      toast.success('Guest added!')
    }
    setShowModal(false)
    fetchGuests()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this guest?')) return
    await supabase.from('guests').delete().eq('id', id)
    toast.success('Guest deleted')
    fetchGuests()
  }

  const handleToggleActive = async (g: Guest) => {
    await supabase.from('guests').update({ is_active: !g.is_active }).eq('id', g.id)
    fetchGuests()
  }

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="GUESTS" subtitle={`${guests.length} registered contacts`} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(0,245,255,0.4)' }} />
            <input
              className="neon-input pl-9"
              placeholder="Search guests by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Group filter */}
          <div className="flex gap-2 flex-wrap">
            {['All', ...GROUPS].map(g => (
              <button
                key={g}
                onClick={() => setFilterGroup(g)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filterGroup === g ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${filterGroup === g ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: filterGroup === g ? '#00f5ff' : 'rgba(230,237,243,0.4)',
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAdd}
            className="btn-neon-solid ml-auto"
          >
            <Plus size={14} />
            ADD GUEST
          </motion.button>
        </motion.div>

        {/* Guest table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card overflow-hidden"
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wider"
            style={{
              borderBottom: '1px solid rgba(0,245,255,0.06)',
              color: 'rgba(0,245,255,0.5)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <div className="col-span-3">Guest</div>
            <div className="col-span-3 hidden md:block">Contact</div>
            <div className="col-span-2 hidden lg:block">Group</div>
            <div className="col-span-2">Channels</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 rounded-lg shimmer" />
              ))}
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users size={40} style={{ color: 'rgba(0,245,255,0.2)' }} />
              <p className="text-sm" style={{ color: 'rgba(230,237,243,0.4)' }}>
                {search ? 'No guests match your search' : 'No guests yet. Add your first guest!'}
              </p>
              <button onClick={openAdd} className="btn-neon text-sm mt-2">
                <Plus size={14} /> Add Guest
              </button>
            </div>
          ) : (
            <div>
              {filteredGuests.map((g, i) => (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-all"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,245,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
                >
                  {/* Name + avatar */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,255,200,0.1))',
                        border: '1px solid rgba(0,245,255,0.2)',
                        color: '#00f5ff',
                        fontFamily: 'Orbitron, sans-serif',
                      }}
                    >
                      {g.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{g.name}</p>
                      {g.tags?.length > 0 && (
                        <p className="text-[10px] truncate" style={{ color: 'rgba(0,245,255,0.4)' }}>
                          {g.tags.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 hidden md:block">
                    {g.email && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(230,237,243,0.5)' }}>
                        <Mail size={11} style={{ color: '#00f5ff' }} />
                        <span className="truncate">{g.email}</span>
                      </div>
                    )}
                    {g.phone && (
                      <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'rgba(230,237,243,0.5)' }}>
                        <Phone size={11} style={{ color: '#ffd700' }} />
                        <span>{g.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Group */}
                  <div className="col-span-2 hidden lg:block">
                    <span
                      className="text-xs px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(0,245,255,0.06)', color: 'rgba(0,245,255,0.7)', border: '1px solid rgba(0,245,255,0.12)' }}
                    >
                      {g.group_name || 'General'}
                    </span>
                  </div>

                  {/* Channels */}
                  <div className="col-span-2 flex gap-2">
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: g.notify_email ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.03)',
                        color: g.notify_email ? '#00f5ff' : 'rgba(255,255,255,0.2)',
                        border: `1px solid ${g.notify_email ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                      }}
                    >
                      EMAIL
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        background: g.notify_sms ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                        color: g.notify_sms ? '#ffd700' : 'rgba(255,255,255,0.2)',
                        border: `1px solid ${g.notify_sms ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)'}`,
                      }}
                    >
                      SMS
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <button onClick={() => handleToggleActive(g)} title="Toggle active">
                      {g.is_active
                        ? <CheckCircle size={16} style={{ color: '#00ff88' }} />
                        : <XCircle size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      }
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(g)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'rgba(0,245,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#00f5ff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,245,255,0.5)')}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'rgba(255,68,68,0.4)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,68,68,0.4)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(0,245,255,0.06)' }}
          >
            <span className="text-xs" style={{ color: 'rgba(230,237,243,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
              SHOWING {filteredGuests.length} OF {guests.length} GUESTS
            </span>
            <button className="btn-neon text-xs py-1.5 px-3">
              <Upload size={12} /> IMPORT CSV
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-6"
              style={{ border: '1px solid rgba(0,245,255,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="section-label mb-1">{editGuest ? 'EDIT CONTACT' : 'NEW CONTACT'}</div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {editGuest ? 'Update Guest' : 'Add Guest'}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} style={{ color: 'rgba(230,237,243,0.4)' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>FULL NAME *</label>
                  <input className="neon-input" placeholder="e.g. Emeka Okonkwo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>EMAIL ADDRESS</label>
                  <input className="neon-input" type="email" placeholder="emeka@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>PHONE (E.164 FORMAT)</label>
                  <input className="neon-input" placeholder="+2348012345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>GROUP</label>
                  <select
                    className="neon-input"
                    value={form.group_name}
                    onChange={e => setForm({...form, group_name: e.target.value})}
                    style={{ background: 'rgba(13,17,23,0.8)' }}
                  >
                    {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>TAGS (comma-separated)</label>
                  <input className="neon-input" placeholder="vip, premium, loyal" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
                </div>

                {/* Notification toggles */}
                <div className="flex gap-4">
                  {[
                    { key: 'notify_email', label: 'Email', color: '#00f5ff' },
                    { key: 'notify_sms',   label: 'SMS',   color: '#ffd700' },
                  ].map(ch => (
                    <label key={ch.key} className="flex items-center gap-2 cursor-pointer">
                      <div
                        className="relative w-10 h-5 rounded-full transition-all cursor-pointer"
                        style={{
                          background: (form as any)[ch.key]
                            ? `linear-gradient(90deg, ${ch.color}40, ${ch.color}20)`
                            : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${(form as any)[ch.key] ? ch.color + '60' : 'rgba(255,255,255,0.1)'}`,
                        }}
                        onClick={() => setForm({...form, [ch.key]: !(form as any)[ch.key]})}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                          style={{
                            background: (form as any)[ch.key] ? ch.color : 'rgba(255,255,255,0.3)',
                            left: (form as any)[ch.key] ? '22px' : '2px',
                            boxShadow: (form as any)[ch.key] ? `0 0 6px ${ch.color}` : 'none',
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(230,237,243,0.6)' }}>{ch.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="btn-neon flex-1 justify-center">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="btn-neon-solid flex-1 justify-center"
                >
                  {editGuest ? 'SAVE CHANGES' : 'ADD GUEST'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
