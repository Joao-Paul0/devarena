'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Feedback() {
  const [feedback, setFeedback] = useState(null)
  const [erro, setErro] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const titulo = searchParams.get('titulo')
    const causaRaiz = searchParams.get('causaRaiz')
    const comoTestar = searchParams.get('comoTestar')
    const historicoCat = searchParams.get('historicoCat')

    if (!titulo || !causaRaiz || !comoTestar) {
      router.push('/dashboard')
      return
    }

    async function gerarFeedback() {
      try {
        const resposta = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, causaRaiz, comoTestar, historicoCat })
        })
        const data = await resposta.json()
        setFeedback(data)
      } catch {
        setErro(true)
      }
    }

    gerarFeedback()
  }, [])

  if (erro) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Erro ao gerar feedback.</p>
      <Link href="/dashboard" style={{ color: 'var(--accent-light)', fontSize: '13px' }}>Voltar ao dashboard</Link>
    </div>
  )

  if (!feedback) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '10px' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid var(--border)', borderTopColor: 'var(--accent-light)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Gerando seu feedback...</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>O Lucas está revisando tudo 👀</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
          dev<span style={{ color: 'var(--accent-light)' }}>arena</span>
        </span>
        <Link href="/dashboard" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>← voltar</Link>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', background: '#2a1f5e', color: 'var(--accent-light)', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>React #001</span>
            <span style={{ fontSize: '11px', background: '#0d2b1f', color: 'var(--green)', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>missão concluída</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
            O filtro que não filtra
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {feedback.mensagem_final}
          </p>
        </div>

        {/* Pontuação */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '20px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ fontSize: '40px', fontWeight: '500', color: 'var(--accent-light)', lineHeight: '1' }}>
              {feedback.pontuacao_geral}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>pontuação</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(feedback.areas).map(([area, valor]) => (
              <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '150px', textTransform: 'capitalize' }}>
                  {area.replace('_', ' ')}
                </span>
                <div style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${valor}%`,
                    background: valor >= 70 ? 'var(--green)' : valor >= 50 ? '#dcdcaa' : 'var(--red)',
                    borderRadius: '2px',
                    transition: 'width .6s ease'
                  }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', minWidth: '28px', textAlign: 'right' }}>
                  {valor}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pontos fortes */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
            pontos fortes
          </div>
          {feedback.pontos_fortes.map((ponto, i) => (
            <div key={i} style={{ borderLeft: '2px solid var(--green)', background: '#0d2b1f', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{ponto}</span>
            </div>
          ))}
        </div>

        {/* Melhorias */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>
            melhorias
          </div>
          {feedback.melhorias.map((melhoria, i) => (
            <div key={i} style={{ borderLeft: '2px solid #dcdcaa', background: '#1e1c0e', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{melhoria}</span>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/dashboard" style={{
            flex: 1,
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            textDecoration: 'none'
          }}>
            Ver todas as missões
          </Link>
          <div style={{
            flex: 1,
            padding: '10px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-muted)',
            textAlign: 'center',
            cursor: 'not-allowed'
          }}>
            Próxima missão — em breve
          </div>
        </div>

      </div>
    </main>
  )
}