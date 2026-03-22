'use client'

import { useActionState, useRef, useEffect } from 'react'
import { createBuildLog, ActionState } from '@/app/actions'

const initialState: ActionState = {}

export default function BuildLogForm() {
  const [state, action, pending] = useActionState(createBuildLog, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form
      ref={formRef}
      action={action}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '32px',
      }}
    >
      <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
        🚀 What did you ship?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label
            htmlFor="name"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ada Lovelace"
            required
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            What you shipped
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Built a real-time build log app with Next.js and Supabase..."
            required
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '15px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label
            htmlFor="project_link"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Project Link <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <input
            id="project_link"
            name="project_link"
            type="url"
            placeholder="https://github.com/..."
            style={{
              width: '100%',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '15px',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {state.error && (
          <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0 }}>{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? 'var(--surface-2)' : 'var(--accent)',
            color: pending ? 'var(--text-secondary)' : '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: pending ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={e => { if (!pending) (e.target as HTMLButtonElement).style.background = 'var(--accent-hover)' }}
          onMouseLeave={e => { if (!pending) (e.target as HTMLButtonElement).style.background = 'var(--accent)' }}
        >
          {pending ? 'Shipping...' : 'Ship it →'}
        </button>
      </div>
    </form>
  )
}
