import { supabase, BuildLog } from '@/lib/supabase'
import BuildLogForm from './components/BuildLogForm'
import BuildLogCard from './components/BuildLogCard'

async function getBuildLogs(): Promise<BuildLog[]> {
  const { data, error } = await supabase
    .from('BUILD_LOGS')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch build logs:', error.message)
    return []
  }

  return data ?? []
}

export default async function Page() {
  const logs = await getBuildLogs()

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '6px',
            letterSpacing: '-0.5px',
          }}
        >
          Build Log 🛠️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
          A public wall of shipped things. What did you build today?
        </p>
      </div>

      {/* Form */}
      <BuildLogForm />

      {/* Feed */}
      <div>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}
        >
          {logs.length} {logs.length === 1 ? 'ship' : 'ships'}
        </h3>

        {logs.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              color: 'var(--text-secondary)',
              background: 'var(--surface)',
              border: '1px dashed var(--border)',
              borderRadius: '14px',
              fontSize: '15px',
            }}
          >
            No ships yet. Be the first to post! 🚀
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map(log => (
              <BuildLogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
