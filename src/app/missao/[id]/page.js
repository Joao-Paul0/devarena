'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Missao({ params }) {
  const [tituloPR, setTituloPR] = useState('')
  const [causaRaiz, setCausaRaiz] = useState('')
  const [comoTestar, setComoTestar] = useState('')
  const [feedbackLucas, setFeedbackLucas] = useState('')
  const [enviandoPR, setEnviandoPR] = useState(false)
  const [user, setUser] = useState(null)
  const [aba, setAba] = useState('briefing')
  const [mensagem, setMensagem] = useState('')
  const [chat, setChat] = useState([
    {
      de: 'carla',
      texto: 'Oi! Tô recebendo reclamações de usuários que o filtro de produtos não tá funcionando direito. Eles falam que selecionam uma categoria, os produtos aparecem certos, mas quando tentam trocar de categoria ou voltar pra "Todas", os produtos somem ou aparecem errado. Consegue dar uma olhada? 🙏'
    }
  ])
  const [carregandoResposta, setCarregandoResposta] = useState(false)
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

  async function enviarMensagem() {
    if (!mensagem.trim()) return
    const novaMensagem = { de: 'dev', texto: mensagem }
    setChat(prev => [...prev, novaMensagem])
    setMensagem('')
    setCarregandoResposta(true)

    try {
      const resposta = await fetch('/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem, historico: chat })
      })

      if (!resposta.ok) {
        throw new Error('Erro na API')
      }

      const data = await resposta.json()
      setChat(prev => [...prev, { de: 'carla', texto: data.resposta }])
    } catch (erro) {
      setChat(prev => [...prev, {
        de: 'carla',
        texto: 'Ops, tô com problema técnico aqui. Tenta de novo em instantes! 🙏'
      }])
    } finally {
      setCarregandoResposta(false)
    }
  }

  async function enviarPR() {
    if (!tituloPR.trim() || !causaRaiz.trim() || !comoTestar.trim()) {
      alert('Preencha todos os campos antes de enviar.')
      return
    }
    setEnviandoPR(true)
    try {
      const resposta = await fetch('/api/techlead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: tituloPR, causaRaiz, comoTestar })
      })
      const data = await resposta.json()
      setFeedbackLucas(data.resposta)

      // Após 3 segundos mostrando o comentário do Lucas, vai pro feedback
      setTimeout(() => {
        const params = new URLSearchParams({
          titulo: tituloPR,
          causaRaiz,
          comoTestar,
          historicoCat: String(chat.length)
        })
        router.push(`/feedback/1?${params.toString()}`)
      }, 3000)

    } catch {
      alert('Erro ao enviar PR. Tenta de novo.')
    } finally {
      setEnviandoPR(false)
    }
  }

  if (!user) return <p style={{ padding: '32px' }}>Carregando...</p>

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>dev<span style={{ color: '#534AB7' }}>arena</span></span>
        <span style={{ fontSize: '11px', background: '#EEEDFE', color: '#3C3489', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>React #001</span>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>O filtro que não filtra</span>
      </div>

      {/* Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden' }}>

        {/* Painel principal */}
        <div style={{ borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            {['briefing', 'codigo', 'pr'].map(a => (
              <button key={a} onClick={() => setAba(a)} style={{ padding: '8px 16px', fontSize: '13px', background: 'none', border: 'none', borderBottom: aba === a ? '2px solid #534AB7' : '2px solid transparent', color: aba === a ? '#534AB7' : '#666', fontWeight: aba === a ? '500' : '400', cursor: 'pointer', textTransform: 'capitalize' }}>
                {a === 'pr' ? 'Pull Request' : a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>

          {/* Conteúdo da aba */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>

            {aba === 'briefing' && (
              <div>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>
                  Repositório: <a href="https://github.com/Joao-Paul0/shopflow-frontend" target="_blank" style={{ color: '#534AB7' }}>github.com/Joao-Paul0/shopflow-frontend</a>
                </div>
                <div style={{ background: '#EEEDFE', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '500', color: '#534AB7', marginBottom: '6px' }}>Carla Mendes — Product Manager · #bugs-produto</div>
                  <div style={{ fontSize: '13px', color: '#26215C', lineHeight: '1.6' }}>Oi! Tô recebendo reclamações de usuários que o filtro de produtos não tá funcionando direito. Eles falam que selecionam uma categoria, os produtos aparecem certos, mas quando tentam trocar de categoria ou voltar pra &quot;Todas&quot;, os produtos somem ou aparecem errado. Consegue dar uma olhada? 🙏</div>
                </div>
                <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.8' }}>
                  <strong>O que entregar:</strong><br />
                  1. Reproduza o bug e descreva os passos exatos<br />
                  2. Identifique a causa raiz no código<br />
                  3. Corrija e abra um Pull Request com boa descrição
                </div>
              </div>
            )}

            {aba === 'codigo' && (
              <div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Clone o repositório e trabalhe localmente:</div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', background: '#f3f4f6', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                  git clone https://github.com/Joao-Paul0/shopflow-frontend.git<br />
                  cd shopflow-frontend<br />
                  npm install<br />
                  npm run dev
                </div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
                  O bug está em algum lugar da lógica de filtro. Explore o código, reproduza o problema e encontre a causa raiz antes de corrigir.
                </div>
              </div>
            )}

            {aba === 'pr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#666', display: 'block', marginBottom: '4px' }}>Título do PR</label>
                  <input
                    value={tituloPR}
                    onChange={e => setTituloPR(e.target.value)}
                    placeholder="ex: fix: corrige filtro de categoria"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#666', display: 'block', marginBottom: '4px' }}>Causa raiz</label>
                  <textarea
                    value={causaRaiz}
                    onChange={e => setCausaRaiz(e.target.value)}
                    placeholder="Explique o que estava causando o bug..."
                    style={{ width: '100%', height: '80px', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', resize: 'none', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#666', display: 'block', marginBottom: '4px' }}>Como testar</label>
                  <textarea
                    value={comoTestar}
                    onChange={e => setComoTestar(e.target.value)}
                    placeholder="Passos para confirmar que o bug foi corrigido..."
                    style={{ width: '100%', height: '80px', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', resize: 'none', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={enviarPR}
                  disabled={enviandoPR}
                  style={{ background: enviandoPR ? '#999' : '#534AB7', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: enviandoPR ? 'default' : 'pointer' }}
                >
                  {enviandoPR ? 'Enviando...' : 'Enviar PR para revisão →'}
                </button>

                {feedbackLucas && (
                  <div style={{ marginTop: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '500', color: '#666', marginBottom: '8px' }}>
                      Lucas Faria — Tech Lead · revisão
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.7', color: '#374151', whiteSpace: 'pre-wrap' }}>
                      {feedbackLucas}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Chat com a Carla */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '500', color: '#666', background: '#f9fafb' }}>
            Chat — Carla (PM)
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ background: msg.de === 'carla' ? '#EEEDFE' : '#f3f4f6', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', lineHeight: '1.6', color: msg.de === 'carla' ? '#26215C' : '#111', alignSelf: msg.de === 'carla' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                {msg.de === 'carla' && <div style={{ fontSize: '10px', fontWeight: '500', marginBottom: '3px', opacity: .7 }}>Carla</div>}
                {msg.texto}
              </div>
            ))}
            {carregandoResposta && (
              <div style={{ background: '#EEEDFE', borderRadius: '8px', padding: '8px 10px', fontSize: '13px', color: '#26215C', alignSelf: 'flex-start' }}>
                <div style={{ fontSize: '10px', fontWeight: '500', marginBottom: '3px', opacity: .7 }}>Carla</div>
                digitando...
              </div>
            )}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '6px' }}>
            <input
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensagem()}
              placeholder="Perguntar à Carla..."
              style={{ flex: 1, padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
            />
            <button onClick={enviarMensagem} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>→</button>
          </div>
        </div>

      </div>
    </main>
  )
}