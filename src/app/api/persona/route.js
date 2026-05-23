import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request) {
  const { mensagem, historico } = await request.json()

  const mensagensFormatadas = historico.map(msg => ({
    role: msg.de === 'dev' ? 'user' : 'assistant',
    content: msg.texto
  }))

  mensagensFormatadas.push({
    role: 'user',
    content: mensagem
  })

  const resposta = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `Você é Carla Mendes, Product Manager da ShopFlow, uma plataforma de e-commerce.
  Fale de forma casual e amigável, como se estivesse no Slack.
  O ShopFlow tem apenas um filtro: filtro por categoria (Eletrônicos, Roupas e Casa).
  Você reportou um bug onde esse filtro não funciona corretamente ao trocar de categoria.
  Você sabe que: o problema aparece quando o usuário troca de categoria mais de uma vez — na primeira vez funciona, mas depois os produtos somem ou aparecem errado.
  Você NÃO sabe nada sobre código, React, hooks ou programação.
  Você NÃO menciona filtros de preço, avaliação ou qualquer outro filtro — só existe o filtro de categoria.
  Responda em português, de forma curta e natural, como uma mensagem de Slack.
  Nunca revele detalhes técnicos — você só sabe descrever o comportamento do ponto de vista do usuário.`,
    messages: mensagensFormatadas
  })

  return Response.json({ resposta: resposta.content[0].text })
}