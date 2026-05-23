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
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
    }
    getUser()
  }, [])

  if (!user) return <p style={{ padding: '32px' }}>Carregando...</p>

  return (
    <main style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '4px' }}>
        dev<span style={{ color: '#534AB7' }}>arena</span>
      </h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>
        Bem-vindo, {user.user_metadata.user_name} 👋
      </p>
      <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
        Missões disponíveis
      </h2>
      <Link href="/missao/1" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', cursor: 'pointer' }}>
          <div style={{ fontSize: '11px', color: '#534AB7', fontWeight: '500', marginBottom: '6px' }}>
            REACT #001 · BUG
          </div>
          <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
            O filtro que não filtra
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            O filtro de produtos está quebrando ao trocar de categoria. A PM já reportou.
          </div>
        </div>
      </Link>
    </main>
  )
}