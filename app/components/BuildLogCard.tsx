'use client'

import { useState, useTransition } from 'react'
import { BuildLog } from '@/lib/supabase'
import { incrementReaction } from '@/app/actions'

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function avatarColor(name: string) {
  const colors = [
    '#7c6cff', '#e066ff', '#ff6c9d', '#ff9f43',
    '#26de81', '#2bcbba', '#45aaf2', '#fd9644',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`
}

const REACTIONS = [
  { key: 'fire',   emoji: '🔥', label: 'Fire' },
  { key: 'clap',   emoji: '👏', label: 'Clap' },
  { key: 'rocket', emoji: '🚀', label: 'Rocket' },
] as const

type ReactionKey = 'fire' | 'clap' | 'rocket'

export default function BuildLogCard({ log }: { log: BuildLog }) {
  const color = avatarColor(log.name)
  const initials = getInitials(log.name)
  const [isPending, startTransition] = useTransition()

  const [counts, setCounts] = useState<Record<ReactionKey, number>>({
    fire:   log.fire_count   ?? 0,
    clap:   log.clap_count   ?? 0,
    rocket: log.rocket_count ?? 0,
  })

  function handleReaction(reaction: ReactionKey) {
    setCounts(prev => ({ ...prev, [reaction]: prev[reaction] + 1 }))
    startTransition(async () => {
      await incrementReaction(log.id, reaction)
    })
  }

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
    >
      {/* Avatar */}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{log.name}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{relativeTime(log.created_at)}</span>
        </div>

        <p style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: '1.55', margin: '0 0 12px 0' }}>
          {log.description}
        </p>

        {/* Reactions + project link row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {REACTIONS.map(({ key, emoji, label }) => (
            <button
              key={key}
              aria-label={label}
              disabled={isPending}
              onClick={() => handleReaction(key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: isPending ? 'default' : 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--accent)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              <span>{emoji}</span>
              <span>{counts[key]}</span>
            </button>
          ))}

          {log.project_link && (
            <a
              href={log.project_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                color: 'var(--accent)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent-hover)')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)')}
            >
              View Project ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
