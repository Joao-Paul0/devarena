'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)

export default function Missao({ params }) {
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
  const [tituloPR, setTituloPR] = useState('')
  const [causaRaiz, setCausaRaiz] = useState('')
  const [comoTestar, setComoTestar] = useState('')
  const [feedbackLucas, setFeedbackLucas] = useState('')
  const [enviandoPR, setEnviandoPR] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const [arquivoAtivo, setArquivoAtivo] = useState('ProductList.jsx')
  const [codigosEditados, setCodigosEditados] = useState({})
  const [previewCategoria, setPreviewCategoria] = useState('')
  const [previewProdutos, setPreviewProdutos] = useState([
    { id: 1, name: 'Notebook Pro', category: 'Eletrônicos', price: 3499 },
    { id: 2, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 299 },
    { id: 3, name: 'Camiseta Dev', category: 'Roupas', price: 79 },
    { id: 4, name: 'Moletom Clean', category: 'Roupas', price: 149 },
    { id: 5, name: 'Caneca Code', category: 'Casa', price: 49 },
    { id: 6, name: 'Mousepad XL', category: 'Casa', price: 89 },
  ])

  const todosProdutos = [
    { id: 1, name: 'Notebook Pro', category: 'Eletrônicos', price: 3499 },
    { id: 2, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 299 },
    { id: 3, name: 'Camiseta Dev', category: 'Roupas', price: 79 },
    { id: 4, name: 'Moletom Clean', category: 'Roupas', price: 149 },
    { id: 5, name: 'Caneca Code', category: 'Casa', price: 49 },
    { id: 6, name: 'Mousepad XL', category: 'Casa', price: 89 },
  ]

  function executarPreview(cat) {
    setPreviewCategoria(cat)

    try {
      const codigo = codigosEditados['ProductList.jsx'] || arquivos['ProductList.jsx']

      // Extrai a lógica do handleFilter do código do dev
      const matchFilter = codigo.match(/if \(cat === ''\)[^}]+}[\s\S]*?setProducts\([^)]+\)/g)

      // Simula o comportamento baseado no código
      if (cat === '') {
        setPreviewProdutos([...todosProdutos])
        return
      }

      // Detecta se o dev usou filter correto
      const usouFilterCorreto = codigo.includes(`p.category === cat`) ||
        codigo.includes(`p.category === cat)`)

      // Detecta se ainda usa splice
      const usouSplice = codigo.includes('splice')

      // Detecta filter invertido
      const usouFilterInvertido = codigo.includes(`p.category !== cat`)

      if (usouSplice) {
        // Simula o bug do splice — na segunda filtragem some
        if (previewCategoria !== '' && cat !== previewCategoria) {
          setPreviewProdutos([])
        } else {
          setPreviewProdutos(todosProdutos.filter(p => p.category === cat))
        }
      } else if (usouFilterInvertido) {
        // Filter com lógica invertida — remove a categoria selecionada
        setPreviewProdutos(todosProdutos.filter(p => p.category !== cat))
      } else if (usouFilterCorreto) {
        // Solução correta
        setPreviewProdutos(todosProdutos.filter(p => p.category === cat))
      } else {
        // Código não reconhecido — mostra todos
        setPreviewProdutos([...todosProdutos])
      }
    } catch {
      setPreviewProdutos([...todosProdutos])
    }
  }

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
      if (!resposta.ok) throw new Error('Erro na API')
      const data = await resposta.json()
      setChat(prev => [...prev, { de: 'carla', texto: data.resposta }])
    } catch {
      setChat(prev => [...prev, { de: 'carla', texto: 'Ops, tô com problema técnico aqui. Tenta de novo em instantes! 🙏' }])
    } finally {
      setCarregandoResposta(false)
    }
  }

  async function enviarPR() {
    console.log('enviarPR chamado')
    console.log('titulo:', tituloPR)
    console.log('causaRaiz:', causaRaiz)
    console.log('comoTestar:', comoTestar)
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

      setTimeout(async () => {
        console.log('codigo editado:', codigosEditados['ProductList.jsx']?.substring(0, 200))
        console.log('arquivo atual:', arquivos['ProductList.jsx']?.substring(0, 200))
        const feedbackResposta = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: tituloPR,
            causaRaiz,
            comoTestar,
            historicoCat: String(chat.length),
            codigoEditado: codigosEditados['ProductList.jsx'] || arquivos['ProductList.jsx']
          })
        })
        const feedbackData = await feedbackResposta.json()
        sessionStorage.setItem('feedback', JSON.stringify(feedbackData))
        router.push('/feedback/1')
      }, 3000)

    } catch {
      alert('Erro ao enviar PR. Tenta de novo.')
    } finally {
      setEnviandoPR(false)
    }
  }

  const arquivos = {
    'ProductList.jsx': `import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/products'
import ProductCard from './ProductCard'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchProducts().then(data => setProducts(data))
  }, [])

  function handleFilter(cat) {
    setCategory(cat)

    if (cat === '') {
      fetchProducts().then(data => setProducts(data))
      return
    }

    for (let i = products.length - 1; i >= 0; i--) {
      if (products[i].category !== cat) {
        products.splice(i, 1)
      }
    }
    setProducts([...products])
  }

  return (
    <div className="p-4">
      <select
        onChange={e => handleFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Todas as categorias</option>
        <option value="Eletrônicos">Eletrônicos</option>
        <option value="Roupas">Roupas</option>
        <option value="Casa">Casa</option>
      </select>
      <div className="grid grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}`,

    'ProductCard.jsx': `export default function ProductCard({ product }) {
  console.log('render ProductCard', product.id)

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-medium text-sm">{product.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
      <p className="text-sm font-medium mt-2">
        R$ {product.price.toLocaleString('pt-BR')}
      </p>
    </div>
  )
}`,

    'products.js': `export const fetchProducts = () =>
  Promise.resolve([
    { id: 1, name: 'Notebook Pro', category: 'Eletrônicos', price: 3499 },
    { id: 2, name: 'Fone Bluetooth', category: 'Eletrônicos', price: 299 },
    { id: 3, name: 'Camiseta Dev', category: 'Roupas', price: 79 },
    { id: 4, name: 'Moletom Clean', category: 'Roupas', price: 149 },
    { id: 5, name: 'Caneca Code', category: 'Casa', price: 49 },
    { id: 6, name: 'Mousepad XL', category: 'Casa', price: 89 },
  ])`
  }

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)', fontSize: '13px' }}>
      Carregando...
    </div>
  )

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
          dev<span style={{ color: 'var(--accent-light)' }}>arena</span>
        </span>
        <span style={{ fontSize: '11px', background: '#2a1f5e', color: 'var(--accent-light)', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' }}>React #001</span>
        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>O filtro que não filtra</span>
      </div>

      {/* Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden' }}>

        {/* Painel principal */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Abas */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
            {['briefing', 'codigo', 'preview', 'pr'].map(a => (
              <button key={a} onClick={() => setAba(a)} style={{
                padding: '9px 18px',
                fontSize: '13px',
                background: 'none',
                border: 'none',
                borderBottom: aba === a ? '2px solid var(--accent-light)' : '2px solid transparent',
                color: aba === a ? 'var(--accent-light)' : 'var(--text-muted)',
                fontWeight: aba === a ? '500' : '400',
                cursor: 'pointer'
              }}>
                {a === 'pr' ? 'Pull Request' : a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

            {aba === 'briefing' && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Repositório: <a href="https://github.com/Joao-Paul0/shopflow-frontend" target="_blank" style={{ color: 'var(--accent-light)' }}>github.com/Joao-Paul0/shopflow-frontend</a>
                </div>
                <div style={{ background: '#1a1a2e', border: '1px solid #2a1f5e', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--accent-light)', marginBottom: '6px' }}>
                    Carla Mendes — Product Manager · #bugs-produto
                  </div>
                  <div style={{ fontSize: '13px', color: '#c8c8e8', lineHeight: '1.7' }}>
                    Oi! Tô recebendo reclamações de usuários que o filtro de produtos não tá funcionando direito. Eles falam que selecionam uma categoria, os produtos aparecem certos, mas quando tentam trocar de categoria ou voltar pra &quot;Todas&quot;, os produtos somem ou aparecem errado. Consegue dar uma olhada? 🙏
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '2' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>O que entregar:</span><br />
                  1. Reproduza o bug e descreva os passos exatos<br />
                  2. Identifique a causa raiz no código<br />
                  3. Corrija e abra um Pull Request com boa descrição
                </div>
              </div>
            )}

            {aba === 'codigo' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0' }}>

                {/* Tabs de arquivo */}
                <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                  {Object.keys(arquivos).map(arquivo => (
                    <div
                      key={arquivo}
                      onClick={() => setArquivoAtivo(arquivo)}
                      style={{
                        padding: '6px 16px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: arquivoAtivo === arquivo ? 'var(--accent-light)' : 'var(--text-muted)',
                        borderBottom: arquivoAtivo === arquivo ? '1px solid var(--accent-light)' : '1px solid transparent',
                        background: arquivoAtivo === arquivo ? 'var(--bg-primary)' : 'transparent'
                      }}
                    >
                      {arquivo}
                    </div>
                  ))}
                </div>

                {/* Editor */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <MonacoEditor
                    onChange={(valor) => setCodigosEditados(prev => ({
                      ...prev,
                      [arquivoAtivo]: valor || ''
                    }))}
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={codigosEditados[arquivoAtivo] ?? arquivos[arquivoAtivo]}
                    path={arquivoAtivo}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      renderLineHighlight: 'line',
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 12 }
                    }}
                  />
                </div>
              </div>
            )}
            {aba === 'preview' && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header do preview */}
                <div style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
                  ShopFlow — preview do seu código
                </div>

                {/* Simulação da loja */}
                <div style={{ flex: 1, overflow: 'auto', padding: '20px', background: '#f9fafb' }}>

                  {/* Header da loja */}
                  <div style={{ background: '#fff', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>ShopFlow</span>
                  </div>

                  {/* Filtro */}
                  <div style={{ marginBottom: '16px' }}>
                    <select
                      value={previewCategoria}
                      onChange={e => executarPreview(e.target.value)}
                      style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', background: '#fff', color: '#111', cursor: 'pointer' }}
                    >
                      <option value="">Todas as categorias</option>
                      <option value="Eletrônicos">Eletrônicos</option>
                      <option value="Roupas">Roupas</option>
                      <option value="Casa">Casa</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
                    {previewProdutos.length} produto(s) encontrado(s)
                    {previewProdutos.length === 0 && (
                      <span style={{ color: '#ef4444', fontWeight: '500', marginLeft: '8px' }}>
                        ⚠ Bug detectado — lista vazia
                      </span>
                    )}
                    {previewProdutos.length === todosProdutos.length && previewCategoria !== '' && (
                      <span style={{ color: '#ef4444', fontWeight: '500', marginLeft: '8px' }}>
                        ⚠ Bug detectado — filtro não está funcionando
                      </span>
                    )}
                    {previewProdutos.length > 0 && previewProdutos.length < todosProdutos.length && previewCategoria !== '' && previewProdutos.every(p => p.category === previewCategoria) && (
                      <span style={{ color: '#16a34a', fontWeight: '500', marginLeft: '8px' }}>
                        ✓ Filtro funcionando corretamente
                      </span>
                    )}
                  </div>

                  {/* Grid de produtos */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {previewProdutos.map(p => (
                      <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '4px' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>{p.category}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#111' }}>
                          R$ {p.price.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
            {aba === 'pr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Título do PR</label>
                  <input
                    value={tituloPR}
                    onChange={e => setTituloPR(e.target.value)}
                    placeholder="ex: fix: corrige filtro de categoria"
                    style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Causa raiz</label>
                  <textarea
                    value={causaRaiz}
                    onChange={e => setCausaRaiz(e.target.value)}
                    placeholder="Explique o que estava causando o bug..."
                    style={{ width: '100%', height: '90px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', resize: 'none', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Como testar</label>
                  <textarea
                    value={comoTestar}
                    onChange={e => setComoTestar(e.target.value)}
                    placeholder="Passos para confirmar que o bug foi corrigido..."
                    style={{ width: '100%', height: '90px', padding: '8px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', resize: 'none', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={() => {
                    console.log('clicou')
                    enviarPR()
                  }}
                  disabled={enviandoPR}
                  style={{ background: enviandoPR ? 'var(--bg-hover)' : 'var(--accent)', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: enviandoPR ? 'default' : 'pointer' }}
                >
                  {enviandoPR ? 'Enviando...' : 'Enviar PR para revisão →'}
                </button>

                {feedbackLucas && (
                  <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px', background: 'var(--bg-secondary)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Lucas Faria — Tech Lead · revisão
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                      {feedbackLucas}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat com a Carla */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', flexShrink: 0 }}>
            Chat — Carla (PM)
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chat.map((msg, i) => (
              <div key={i} style={{
                background: msg.de === 'carla' ? '#1a1a2e' : 'var(--bg-tertiary)',
                border: `1px solid ${msg.de === 'carla' ? '#2a1f5e' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                lineHeight: '1.6',
                color: msg.de === 'carla' ? '#c8c8e8' : 'var(--text-primary)',
                alignSelf: msg.de === 'carla' ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}>
                {msg.de === 'carla' && <div style={{ fontSize: '10px', fontWeight: '500', marginBottom: '3px', color: 'var(--accent-light)' }}>Carla</div>}
                {msg.texto}
              </div>
            ))}
            {carregandoResposta && (
              <div style={{ background: '#1a1a2e', border: '1px solid #2a1f5e', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: '#c8c8e8', alignSelf: 'flex-start' }}>
                <div style={{ fontSize: '10px', fontWeight: '500', marginBottom: '3px', color: 'var(--accent-light)' }}>Carla</div>
                digitando...
              </div>
            )}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', flexShrink: 0 }}>
            <input
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensagem()}
              placeholder="Perguntar à Carla..."
              style={{ flex: 1, padding: '7px 12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button onClick={enviarMensagem} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '13px' }}>→</button>
          </div>
        </div>
      </div>
    </main>
  )
}