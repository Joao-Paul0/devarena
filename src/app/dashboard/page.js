'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
    }
    getUser()
  }, [])

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)', fontSize: '13px' }}>
      Carregando...
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
          dev<span style={{ color: 'var(--accent-light)' }}>arena</span>
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {user.user_metadata.user_name}
        </span>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Boas vindas */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Olá, {user.user_metadata.user_name} 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Escolha uma missão e treine como se fosse trabalho real.
          </p>
        </div>

        {/* Trilha */}
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Trilha React</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Cards de missão */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Missão 1 — disponível */}
          <Link href="/missao/1" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '16px 20px',
              cursor: 'pointer',
              transition: 'border-color .15s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                🐛
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', background: '#2a1f5e', color: 'var(--accent-light)', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' }}>React #001</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>bug · nível júnior</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  O filtro que não filtra
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  O filtro de produtos está quebrando ao trocar de categoria. A PM já reportou.
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
                ~2h →
              </div>
            </div>
          </Link>

          {/* Missão 2 — bloqueada */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px 20px',
            opacity: '0.5',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              ⚡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '20px', fontWeight: '500' }}>React #002</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>performance · nível júnior</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>
                A lista que trava
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Complete a missão #001 para desbloquear.
              </div>
            </div>
            <div style={{ fontSize: '16px', flexShrink: 0 }}>
              🔒
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}