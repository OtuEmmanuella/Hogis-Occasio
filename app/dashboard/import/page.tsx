'use client'

import { motion } from 'framer-motion'
import { Upload, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import toast from 'react-hot-toast'
import guestsData from '@/data/guests-data.json'

type GuestEntry = {
  name: string
  phone: string | null
  email: string | null
  group_name: string
}

const ALL_GUESTS: GuestEntry[] = guestsData as GuestEntry[]
const GROUP_NAMES = Array.from(new Set(ALL_GUESTS.map(g => g.group_name)))
const GROUPS = GROUP_NAMES.map(name => ({
  name,
  count: ALL_GUESTS.filter(g => g.group_name === name).length,
}))

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<string[]>(GROUP_NAMES)
  const [preview, setPreview] = useState(false)

  const toggleGroup = (name: string) => {
    setSelectedGroups(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const guestsToImport = ALL_GUESTS.filter(g => selectedGroups.includes(g.group_name))

  const handleImport = async () => {
    if (guestsToImport.length === 0) { toast.error('Select at least one group'); return }
    setImporting(true)
    try {
      const res = await fetch('/api/import-guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: guestsToImport }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setResult({ imported: data.imported })
      toast.success(`Successfully imported ${data.imported} guests!`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <Header title="IMPORT GUESTS" subtitle="Bulk import all guest lists into the system" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">

          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center" style={{ border: '1px solid rgba(0,255,136,0.3)' }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)' }}>
                <CheckCircle size={48} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 15px #00ff88)' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                IMPORT COMPLETE
              </h2>
              <div className="text-5xl font-bold my-6"
                style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px #00ff88' }}>
                {result.imported}
              </div>
              <p className="text-sm mb-8" style={{ color: 'rgba(230,237,243,0.4)' }}>guests imported successfully</p>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard/guests">
                  <button className="btn-neon-solid"><Users size={14} /> VIEW GUESTS</button>
                </a>
                <button onClick={() => setResult(null)} className="btn-neon">Import More</button>
              </div>
            </motion.div>

          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5" style={{ border: '1px solid rgba(0,245,255,0.15)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
                    <Upload size={22} style={{ color: '#00f5ff' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Bulk Guest Import — {ALL_GUESTS.length} Guests Ready
                    </h3>
                    <p className="text-xs" style={{ color: 'rgba(230,237,243,0.5)' }}>
                      All phone numbers pre-formatted to +234. To add more guests in future,
                      edit <code style={{ color: '#00f5ff' }}>data/guests-data.json</code> and redeploy.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }} className="glass-card p-5">
                <div className="section-label mb-4">SELECT GROUPS TO IMPORT</div>
                <div className="grid grid-cols-2 gap-3">
                  {GROUPS.map(g => (
                    <button key={g.name} onClick={() => toggleGroup(g.name)}
                      className="flex items-center justify-between p-4 rounded-xl text-left transition-all"
                      style={{
                        background: selectedGroups.includes(g.name) ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedGroups.includes(g.name) ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <div>
                        <p className="text-sm font-medium text-white">{g.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(230,237,243,0.4)' }}>{g.count} guests</p>
                      </div>
                      {selectedGroups.includes(g.name) && <CheckCircle size={16} style={{ color: '#00f5ff' }} />}
                    </button>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: 'rgba(230,237,243,0.3)' }}>
                  {guestsToImport.length} guests selected
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)' }}>
                <AlertCircle size={16} style={{ color: '#ffd700', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>
                  <strong style={{ color: '#ffd700' }}>Import once only.</strong> If you already have duplicates
                  in Supabase, run this SQL to clean them first before importing again.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="section-label">PREVIEW</div>
                  <button onClick={() => setPreview(!preview)} className="btn-neon text-xs py-1.5 px-3">
                    {preview ? 'Hide' : 'Show first 10'}
                  </button>
                </div>
                {preview && (
                  <div className="space-y-1.5">
                    {guestsToImport.slice(0, 10).map((g, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff' }}>
                          {g.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{g.name}</p>
                          <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {g.phone} · {g.group_name}
                          </p>
                        </div>
                        {g.email && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>
                            EMAIL
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}>
                          SMS
                        </span>
                      </div>
                    ))}
                    {guestsToImport.length > 10 && (
                      <p className="text-xs text-center pt-1" style={{ color: 'rgba(230,237,243,0.3)' }}>
                        ...and {guestsToImport.length - 10} more
                      </p>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleImport}
                disabled={importing || guestsToImport.length === 0}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3"
                style={{
                  background: importing || guestsToImport.length === 0
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                  color: importing || guestsToImport.length === 0 ? 'rgba(255,255,255,0.3)' : '#010409',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '0.1em',
                  cursor: importing || guestsToImport.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {importing
                  ? <><Loader2 size={16} className="animate-spin" /> IMPORTING {guestsToImport.length} GUESTS...</>
                  : <><Upload size={16} /> IMPORT {guestsToImport.length} GUESTS NOW</>
                }
              </motion.button>
            </>
          )}
        </div>
      </div>
    </>
  )
}