'use client'

import { motion } from 'framer-motion'
import { Upload, Users, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import toast from 'react-hot-toast'

// Pre-loaded guest list from Hogis records
const HOGIS_GUESTS = [
  { name: 'KENNENY NMERIBEOLE', phone: '08060616394' },
  { name: 'ETIM INYANG', phone: '08023135473' },
  { name: 'IKIP WINNER', phone: '07026859884' },
  { name: 'IROKA IFEANYI', phone: '08068923224' },
  { name: 'OBIORA EVENDU', phone: '08039558885' },
  { name: 'UDO EKWERE', phone: '08173957452' },
  { name: 'KAYODE JOHN', phone: '07030890898' },
  { name: 'MRS SABINA IWENJORA', phone: '08033129039' },
  { name: 'PATRICK FAVOUR', phone: '08105746465' },
  { name: 'USHER PAUL', phone: '08104115958' },
  { name: 'TONY EYO', phone: '09039057374' },
  { name: 'EDET EMMANUEL', phone: '08063751845' },
  { name: 'DAVID UDEME', phone: '07040181296' },
  { name: 'WILLIAMS MBEH', phone: '08035150254' },
  { name: 'ANIMPAYE MARGARD', phone: '08077754955' },
  { name: 'OSARA ELINDIAH', phone: '08068644837' },
  { name: 'IREGHA JOHN KALU', phone: '07065146621' },
  { name: 'OGU HENRY', phone: '08039726707' },
  { name: 'CHIDI-NADI EZE', phone: '08033663745' },
  { name: 'ISREAL REBULADO', phone: '07033697631' },
  { name: 'KOLADE AFI', phone: '08039043469' },
  { name: 'AKINOLA SAMSON', phone: '08100771245' },
  { name: 'CHINEDU OBINNA', phone: '08068889923' },
  { name: 'FRANCE ALINYBE', phone: '08036156933' },
  { name: 'UAURU FELIX', phone: '08096174403' },
  { name: 'LEXTECH ECOSYSTEM', phone: '08107499774' },
  { name: 'AYAM PATIENCE NDIYO', phone: '08129531881' },
  { name: 'HON JONS INGOM', phone: '08136544443' },
  { name: 'BASSEY CLINTON', phone: '07019445298' },
  { name: 'AKEM PRINCE JULIUS', phone: '08148818244' },
  { name: 'JOSEPH SAMUEL', phone: '08137034184' },
  { name: 'KAYODE SAKA', phone: '08155574245' },
  { name: 'ABRAHAM YUSUF', phone: '09133516873' },
  { name: 'IKIP OBIO', phone: '09163623416' },
  { name: 'BASSEY EKPO', phone: '08035356966' },
  { name: 'OBAJI AKPET', phone: '09131542130' },
  { name: 'JOSEPH ORIJO', phone: '08069211645' },
  { name: 'PRECIOUS OGBEMUDIA', phone: '09182545381' },
  { name: 'IRONSHO RAPHAEL', phone: '08066145112' },
  { name: 'AKPAN GODDY', phone: '08029382828' },
  { name: 'EDOH EMMA', phone: '09034674741' },
  { name: 'WISDOM IFEKENANDU', phone: '09065295585' },
  { name: 'PATIENCE ENIAYEWU', phone: '07037969984' },
  { name: 'ATIM ITA', phone: '09046035095' },
]

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [groupName, setGroupName] = useState('Hogis Guests')
  const [preview, setPreview] = useState(false)

  const handleImport = async () => {
    setImporting(true)
    try {
      const guests = HOGIS_GUESTS.map(g => ({
        ...g,
        group_name: groupName,
      }))

      const res = await fetch('/api/import-guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests }),
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
      <Header title="IMPORT GUESTS" subtitle="Bulk import your guest list into the system" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">

          {result ? (
            // Success screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
              style={{ border: '1px solid rgba(0,255,136,0.3)' }}
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.4)' }}>
                <CheckCircle size={48} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 15px #00ff88)' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                IMPORT COMPLETE
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(230,237,243,0.5)' }}>
                All guests have been added to the system
              </p>
              <div className="text-5xl font-bold mb-2" style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px #00ff88' }}>
                {result.imported}
              </div>
              <p className="text-sm mb-8" style={{ color: 'rgba(230,237,243,0.4)' }}>guests imported successfully</p>
              <div className="flex gap-3 justify-center">
                <a href="/dashboard/guests">
                  <button className="btn-neon-solid">
                    <Users size={14} /> VIEW GUESTS
                  </button>
                </a>
                <button onClick={() => setResult(null)} className="btn-neon">
                  Import More
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Info card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5"
                style={{ border: '1px solid rgba(0,245,255,0.15)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
                    <Upload size={22} style={{ color: '#00f5ff' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Bulk Guest Import</h3>
                    <p className="text-xs" style={{ color: 'rgba(230,237,243,0.5)' }}>
                      Your 44 Hogis guests are pre-loaded and ready to import. Phone numbers will be automatically
                      formatted to the correct Nigerian +234 format. All guests will be set to receive SMS notifications.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Group name */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
                <div className="section-label mb-3">GROUP NAME</div>
                <input
                  className="neon-input"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="e.g. VIP, Staff, Customers"
                />
                <p className="text-[10px] mt-2" style={{ color: 'rgba(230,237,243,0.3)' }}>
                  All imported guests will be placed in this group. You can change individual guests later.
                </p>
              </motion.div>

              {/* Guest preview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="section-label mb-1">GUEST LIST PREVIEW</div>
                    <p className="text-xs" style={{ color: 'rgba(230,237,243,0.4)' }}>
                      {HOGIS_GUESTS.length} guests ready to import
                    </p>
                  </div>
                  <button
                    onClick={() => setPreview(!preview)}
                    className="btn-neon text-xs py-1.5 px-3"
                  >
                    {preview ? 'Hide' : 'Preview All'}
                  </button>
                </div>

                {/* Always show first 5 */}
                <div className="space-y-2">
                  {(preview ? HOGIS_GUESTS : HOGIS_GUESTS.slice(0, 5)).map((g, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.15)' }}>
                        {g.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{g.name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(230,237,243,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
                          +234{g.phone.startsWith('0') ? g.phone.slice(1) : g.phone}
                        </p>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ background: 'rgba(255,215,0,0.1)', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)' }}>
                        SMS
                      </span>
                    </motion.div>
                  ))}
                  {!preview && HOGIS_GUESTS.length > 5 && (
                    <p className="text-xs text-center py-2" style={{ color: 'rgba(230,237,243,0.3)' }}>
                      +{HOGIS_GUESTS.length - 5} more guests — click Preview All to see everyone
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Warning */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)' }}>
                <AlertCircle size={16} style={{ color: '#ffd700', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>
                  <strong style={{ color: '#ffd700' }}>Important:</strong> Only click Import once. Clicking multiple times will create duplicate guests. If you already imported some guests, check the Guests page first before importing again.
                </p>
              </motion.div>

              {/* Import button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,245,255,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImport}
                disabled={importing}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3"
                style={{
                  background: importing ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00c8ff, #00ffc8)',
                  color: importing ? 'rgba(255,255,255,0.3)' : '#010409',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '0.1em',
                  cursor: importing ? 'not-allowed' : 'pointer',
                }}
              >
                {importing ? (
                  <><Loader2 size={16} className="animate-spin" /> IMPORTING {HOGIS_GUESTS.length} GUESTS...</>
                ) : (
                  <><Upload size={16} /> IMPORT {HOGIS_GUESTS.length} GUESTS NOW</>
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </>
  )
}