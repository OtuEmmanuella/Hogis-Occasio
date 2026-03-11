'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Mail, Phone, Zap, Shield, Globe, Calendar, Users, CheckCircle, ArrowRight, Star, Cpu } from 'lucide-react'

const FEATURES = [
  { icon: Calendar, title: 'Smart Holiday Detection',       desc: 'Auto-detects Nigerian & international public holidays. Never miss a celebration.',  color: '#00f5ff' },
  { icon: Users,    title: 'Guest List Management',        desc: 'Manage unlimited contacts with groups, tags, and individual channel preferences.',     color: '#00ffc8' },
  { icon: Mail,     title: 'Beautiful Email Templates',    desc: 'Branded, responsive HTML emails that look amazing on every device.',                    color: '#ffd700' },
  { icon: Phone,    title: 'SMS via Africa\'s Talking',    desc: 'Reliable SMS delivery across Nigeria and Africa using local carriers.',                 color: '#ff00aa' },
  { icon: Zap,      title: 'One-Click Broadcasting',       desc: 'Send personalized greetings to thousands of guests with a single click.',              color: '#00ff88' },
  { icon: Shield,   title: 'Powered by Supabase',          desc: 'Enterprise-grade PostgreSQL database with real-time capabilities and row-level security.',color: '#00f5ff' },
]

const HOLIDAYS = [
  { emoji: '🇳🇬', name: 'Independence Day',   date: 'Oct 1' },
  { emoji: '🎄', name: 'Christmas',            date: 'Dec 25' },
  { emoji: '🕌', name: 'Eid al-Fitr',          date: 'Varies' },
  { emoji: '⚒️', name: 'Workers\' Day',        date: 'May 1' },
  { emoji: '🇳🇬', name: 'Democracy Day',       date: 'Jun 12' },
  { emoji: '❤️', name: 'Valentine\'s Day',     date: 'Feb 14' },
  { emoji: '👩', name: 'Women\'s Day',          date: 'Mar 8' },
  { emoji: '🎆', name: 'New Year',             date: 'Jan 1' },
]

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: 'rgba(0,245,255,0.4)', boxShadow: '0 0 6px rgba(0,245,255,0.6)' }}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const [activeHoliday, setActiveHoliday] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveHoliday(p => (p + 1) % HOLIDAYS.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#010409' }}>
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,245,255,0.06) 0%, transparent 70%)',
      }} />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 flex items-center justify-between px-6 lg:px-16 py-5"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00f5ff, #00ffc8)', boxShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
            <Bell size={18} className="text-[#010409]" />
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>HOGIS</div>
            <div className="text-[9px] tracking-[4px]" style={{ color: 'rgba(0,245,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>OCCASIO</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Holidays', 'How it Works'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm transition-colors" style={{ color: 'rgba(230,237,243,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00f5ff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(230,237,243,0.5)')}>
              {item}
            </a>
          ))}
        </div>
        <Link href="/dashboard">
          <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,245,255,0.4)' }} whileTap={{ scale: 0.98 }} className="btn-neon-solid text-sm">
            Launch App <ArrowRight size={14} />
          </motion.button>
        </Link>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        {/* Particles */}
        {[
          { x:'10%', y:'20%', s:3, d:0   }, { x:'80%', y:'15%', s:4, d:1   },
          { x:'20%', y:'70%', s:2, d:2   }, { x:'70%', y:'60%', s:3, d:0.5 },
          { x:'50%', y:'85%', s:2, d:1.5 }, { x:'90%', y:'75%', s:3, d:2.5 },
          { x:'5%',  y:'50%', s:2, d:3   }, { x:'40%', y:'10%', s:4, d:0.8 },
        ].map((p, i) => (
          <FloatingParticle key={i} x={p.x} y={p.y} size={p.s} delay={p.d} />
        ))}

        {/* Rotating ring decoration */}
        <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{
          border: '1px solid rgba(0,245,255,0.04)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />
        <div className="absolute w-[800px] h-[800px] rounded-full pointer-events-none" style={{
          border: '1px solid rgba(0,245,255,0.02)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }} />

        <motion.div style={{ y, opacity }} className="relative text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            POWERED BY SUPABASE · FREE TO START · MADE FOR NIGERIA
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.02em' }}
          >
            <span className="text-white">CELEBRATE </span>
            <span style={{ background: 'linear-gradient(135deg, #00f5ff, #00ffc8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EVERY
            </span>
            <br />
            <span className="text-white">HOLIDAY WITH </span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #ffd700, #ff00aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              YOUR PEOPLE
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: 'rgba(230,237,243,0.5)', lineHeight: 1.6 }}
          >
            Automatically send personalized holiday greetings to all your guests via Email or SMS.
            Built for Nigerian businesses — powered by Supabase, Resend & Africa's Talking.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0,245,255,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-neon-solid text-base px-8 py-4"
              >
                <Zap size={16} /> GET STARTED FREE
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="btn-neon text-base px-8 py-4"
            >
              WATCH DEMO <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          {/* Holiday ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-3"
          >
            {HOLIDAYS.map((h, i) => (
              <motion.div
                key={h.name}
                animate={{ scale: activeHoliday === i ? 1.1 : 1, opacity: activeHoliday === i ? 1 : 0.4 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: activeHoliday === i ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeHoliday === i ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.04)'}`,
                  color: activeHoliday === i ? '#00f5ff' : 'rgba(230,237,243,0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                {h.emoji} {h.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">CAPABILITIES</div>
            <h2 className="text-4xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              EVERYTHING YOU NEED
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-card p-6"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}10`, border: `1px solid ${f.color}25` }}>
                  <f.icon size={22} style={{ color: f.color, filter: `drop-shadow(0 0 6px ${f.color})` }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,237,243,0.45)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 lg:px-16 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-label mb-3">WORKFLOW</div>
            <h2 className="text-4xl font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>HOW IT WORKS</h2>
          </div>
          <div className="space-y-6">
            {[
              { n: '01', title: 'Add Your Guest List', desc: 'Import or add your contacts with their email, phone number, and preferred notification channels (email/SMS).', icon: Users, color: '#00f5ff' },
              { n: '02', title: 'Configure Holidays', desc: 'Nigerian public holidays are pre-loaded. Add custom ones, set custom messages, and toggle which to celebrate.', icon: Calendar, color: '#ffd700' },
              { n: '03', title: 'Broadcast with One Click', desc: 'Select a holiday, choose your channels and groups, then hit "Launch Broadcast". Done.', icon: Zap, color: '#00ffc8' },
              { n: '04', title: 'Track & Analyze', desc: 'View delivery logs, open rates, and failed sends in the History dashboard. Optimize over time.', icon: Cpu, color: '#ff00aa' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-start gap-5"
              >
                <div className="text-4xl font-black flex-shrink-0" style={{ color: `${step.color}30`, fontFamily: 'Orbitron, sans-serif' }}>{step.n}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}10`, border: `1px solid ${step.color}25` }}>
                  <step.icon size={20} style={{ color: step.color }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(230,237,243,0.45)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12"
            style={{ border: '1px solid rgba(0,245,255,0.2)', boxShadow: '0 0 60px rgba(0,245,255,0.08)' }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>READY TO CELEBRATE?</h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(230,237,243,0.45)' }}>
              Set up in minutes. Free to use. No credit card required.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(0,245,255,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-neon-solid text-base px-10 py-4"
              >
                <Zap size={16} /> LAUNCH HOGIS OCCASIO
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-8 border-t border-[rgba(0,245,255,0.06)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00f5ff, #00ffc8)' }}>
              <Bell size={14} className="text-[#010409]" />
            </div>
            <span className="text-sm font-bold" style={{ fontFamily: 'Orbitron, sans-serif', color: 'rgba(230,237,243,0.5)' }}>
              HOGIS OCCASIO
            </span>
          </div>
          <p className="text-xs text-center" style={{ color: 'rgba(230,237,243,0.2)' }}>
            © {new Date().getFullYear()} Hogis Group · Built with ❤️ for Nigeria · Powered by Supabase
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs" style={{ color: 'rgba(0,255,136,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
