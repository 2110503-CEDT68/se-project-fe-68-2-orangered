'use client'
import { useEffect, useState } from "react"
import Link from "next/link"

interface Announcement {
  _id: string
  title: string
  shop?: { name: string }
}

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!backendUrl) return
    fetch(`${backendUrl}/api/v1/announcements/all`)
      .then(r => r.json())
      .then(result => {
        if (result.success && result.data?.length) {
          const shuffled = [...result.data].sort(() => Math.random() - 0.5)
          setAnnouncements(shuffled)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (announcements.length < 2) return
    const interval = setInterval(() => {
      setPhase('out')
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % announcements.length)
        setPhase('in')
      }, 350)
    }, 4500)
    return () => clearInterval(interval)
  }, [announcements])

  if (!announcements.length) return <div className="flex flex-1" />

  const ann = announcements[current]
  const dotCount = Math.min(announcements.length, 5)

  return (
    <div className="flex flex-1 items-center min-w-0 px-4 relative overflow-hidden">

      <div className="flex items-center gap-4 w-full justify-center">

        {/* Live badge */}
        <div className="shrink-0 flex items-center gap-1.5 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
          </span>
          <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-gold/80">Live</span>
        </div>

        <span className="w-px h-4 bg-gold/20 shrink-0" />

        {/* Sliding text — clickable */}
        <Link
          href="/announcements"
          className="group relative min-w-0 flex-1 max-w-xl"
          style={{
            opacity: phase === 'in' ? 1 : 0,
            transform: phase === 'in' ? 'translateY(0px)' : 'translateY(-7px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}
        >
          {ann.shop?.name && (
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-gold/70 mr-1.5">
              {ann.shop.name}
            </span>
          )}
          <span className="text-[11px] font-mono tracking-[0.08em] text-text-sub/70 group-hover:text-text-sub transition-colors truncate">
            {ann.title}
          </span>
        </Link>

        {/* Progress dots */}
        <div className="hidden sm:flex shrink-0 items-center gap-1 select-none">
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              style={{ transition: 'all 0.4s ease' }}
              className={`rounded-full ${
                i === current % dotCount
                  ? 'w-3 h-[3px] bg-gold/80'
                  : 'w-[3px] h-[3px] bg-white/15'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
