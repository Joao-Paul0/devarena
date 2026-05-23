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
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <p style={{ color: '#666' }}>Erro ao gerar feedback. <Link href="/dashboard">Voltar</Link></p>
    </div>
  )

  if (!feedback) return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <p style={{ color: '#666', fontSize: '14px' }}>Gerando seu feedback...</p>
      <p style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>O Lucas está revisando tudo 👀</p>
    </div>
  )

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '16px' }}>
          dev<span style={{ color: '#534AB7' }}>arena</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', background: '#EEEDFE', color: '#3C3489', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>React #001</span>
          <span style={{ fontSize: '11px', background: '#E1F5EE', color: '#085041', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>missão concluída</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>O filtro que não filtra</h1>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{feedback.mensagem_final}</p>
      </div>

      {/* Pontuação geral */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div style={{ fontSize: '36px', fontWeight: '500', color: '#534AB7' }}>{feedback.pontuacao_geral}</div>
          <div style={{ fontSize: '11px', color: '#999' }}>pontuação</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(feedback.areas).map(([area, valor]) => (
            <div key={area} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#666', minWidth: '140px', textTransform: 'capitalize' }}>{area.replace('_', ' ')}</span>
              <div style={{ flex: 1, height: '4px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${valor}%`, background: valor >= 70 ? '#1D9E75' : valor >= 50 ? '#BA7517' : '#D85A30', borderRadius: '2px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#666', minWidth: '28px', textAlign: 'right' }}>{valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pontos fortes */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#999', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '10px' }}>pontos fortes</div>
        {feedback.pontos_fortes.map((ponto, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 14px', borderLeft: '2px solid #1D9E75', background: '#F0FBF7', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', lineHeight: '1.6', color: '#111' }}>{ponto}</span>
          </div>
        ))}
      </div>

      {/* Melhorias */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#999', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '10px' }}>melhorias</div>
        {feedback.melhorias.map((melhoria, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 14px', borderLeft: '2px solid #BA7517', background: '#FDFAF3', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', lineHeight: '1.6', color: '#111' }}>{melhoria}</span>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href="/dashboard" style={{ flex: 1, display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#111', textDecoration: 'none' }}>
          Ver todas as missões
        </Link>
        <div style={{ flex: 1, padding: '10px', background: '#534AB7', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#fff', textAlign: 'center', cursor: 'not-allowed', opacity: .6 }}>
          Próxima missão — em breve
        </div>
      </div>

    </main>
  )
}