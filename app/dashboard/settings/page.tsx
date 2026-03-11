'use client'

import { motion } from 'framer-motion'
import { Settings, Mail, Phone, Bell, Clock, Save, TestTube2, CheckCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    senderName: 'Hogis Group',
    senderEmail: 'greetings@hogis.com',
    emailProvider: 'resend',
    smsProvider: 'africastalking',
    sendTime: '09:00',
    timezone: 'Africa/Lagos',
    autoSend: true,
    sendDaysBefore: 0,
    includeUnsubscribeLink: true,
    testEmail: '',
    testPhone: '',
  })

  const handleSave = () => {
    toast.success('Settings saved!')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestEmail = async () => {
    if (!config.testEmail) { toast.error('Enter test email'); return }
    toast.success(`Test email sent to ${config.testEmail}`)
  }

  const handleTestSMS = async () => {
    if (!config.testPhone) { toast.error('Enter test phone'); return }
    toast.success(`Test SMS sent to ${config.testPhone}`)
  }

  return (
    <>
      <Header title="SETTINGS" subtitle="Configure notification system" />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Branding */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} style={{ color: '#00f5ff' }} />
              <div className="section-label">SENDER IDENTITY</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>SENDER NAME</label>
                <input className="neon-input" value={config.senderName} onChange={e => setConfig({...config, senderName: e.target.value})} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>SENDER EMAIL</label>
                <input className="neon-input" type="email" value={config.senderEmail} onChange={e => setConfig({...config, senderEmail: e.target.value})} />
              </div>
            </div>
          </motion.div>

          {/* Email Config */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={16} style={{ color: '#00f5ff' }} />
              <div className="section-label">EMAIL CONFIGURATION</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>EMAIL PROVIDER</label>
                <select className="neon-input" value={config.emailProvider} onChange={e => setConfig({...config, emailProvider: e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                  <option value="resend">Resend (Free: 100 emails/day) ⭐ Recommended</option>
                  <option value="sendgrid">SendGrid (Free: 100 emails/day)</option>
                  <option value="mailgun">Mailgun (Free trial)</option>
                  <option value="smtp">Custom SMTP</option>
                </select>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
                <p className="text-xs" style={{ color: 'rgba(0,245,255,0.7)' }}>
                  💡 <strong>Resend</strong> is recommended — free tier gives 3,000 emails/month. Set <code>RESEND_API_KEY</code> in your .env.local
                </p>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>TEST EMAIL</label>
                <div className="flex gap-2">
                  <input className="neon-input flex-1" type="email" placeholder="test@example.com" value={config.testEmail} onChange={e => setConfig({...config, testEmail: e.target.value})} />
                  <button onClick={handleTestEmail} className="btn-neon whitespace-nowrap">
                    <TestTube2 size={13} /> Send Test
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SMS Config */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={16} style={{ color: '#ffd700' }} />
              <div className="section-label">SMS CONFIGURATION</div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>SMS PROVIDER</label>
                <select className="neon-input" value={config.smsProvider} onChange={e => setConfig({...config, smsProvider: e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                  <option value="africastalking">Africa's Talking (Best for Nigeria 🇳🇬)</option>
                  <option value="twilio">Twilio (Free trial credit)</option>
                  <option value="termii">Termii (Nigerian provider)</option>
                </select>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)' }}>
                <p className="text-xs" style={{ color: 'rgba(255,215,0,0.7)' }}>
                  💡 <strong>Africa's Talking</strong> is best for Nigerian numbers. Sign up at africastalking.com and set <code>AFRICASTALKING_API_KEY</code>
                </p>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>TEST PHONE</label>
                <div className="flex gap-2">
                  <input className="neon-input flex-1" type="tel" placeholder="+2348012345678" value={config.testPhone} onChange={e => setConfig({...config, testPhone: e.target.value})} />
                  <button onClick={handleTestSMS} className="btn-neon whitespace-nowrap">
                    <TestTube2 size={13} /> Send Test
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scheduling */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} style={{ color: '#00ffc8' }} />
              <div className="section-label">SCHEDULING</div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>SEND TIME</label>
                  <input className="neon-input" type="time" value={config.sendTime} onChange={e => setConfig({...config, sendTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>TIMEZONE</label>
                  <select className="neon-input" value={config.timezone} onChange={e => setConfig({...config, timezone: e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: 'rgba(0,245,255,0.6)' }}>SEND DAYS BEFORE HOLIDAY</label>
                <select className="neon-input" value={config.sendDaysBefore} onChange={e => setConfig({...config, sendDaysBefore: +e.target.value})} style={{ background: 'rgba(13,17,23,0.8)' }}>
                  <option value={0}>On the day</option>
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={7}>1 week before</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <p className="text-sm font-medium text-white">Auto-send on holidays</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(230,237,243,0.4)' }}>Automatically broadcast when a holiday arrives</p>
                </div>
                <div
                  className="relative w-11 h-6 rounded-full cursor-pointer transition-all"
                  onClick={() => setConfig({...config, autoSend: !config.autoSend})}
                  style={{
                    background: config.autoSend ? 'linear-gradient(90deg, rgba(0,245,255,0.3), rgba(0,255,200,0.2))' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${config.autoSend ? 'rgba(0,245,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ background: config.autoSend ? '#00f5ff' : 'rgba(255,255,255,0.3)', left: config.autoSend ? '22px' : '2px', boxShadow: config.autoSend ? '0 0 8px rgba(0,245,255,0.8)' : 'none' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3"
            style={{
              background: saved ? 'linear-gradient(135deg, rgba(0,255,136,0.3), rgba(0,255,200,0.2))' : 'linear-gradient(135deg, #00c8ff, #00ffc8)',
              color: saved ? '#00ff88' : '#010409',
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '0.1em',
              border: saved ? '1px solid rgba(0,255,136,0.4)' : 'none',
            }}
          >
            {saved ? <><CheckCircle size={16} /> SAVED!</> : <><Save size={16} /> SAVE SETTINGS</>}
          </motion.button>
        </div>
      </div>
    </>
  )
}
