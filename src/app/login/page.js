'use client'

import { createClient } from '../../lib/supabase'

export default function Login() {
  const supabase = createClient()

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/dashboard'
      }
    })
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '8px' }}>
        dev<span style={{ color: '#534AB7' }}>arena</span>
      </h1>
      <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
        Treine como se fosse trabalho real.
      </p>
      <button
        onClick={handleLogin}
        style={{ background: '#24292e', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        Entrar com GitHub
      </button>
    </main>
  )
}