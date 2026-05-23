import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request) {
  const { titulo, causaRaiz, comoTestar, historicoCat } = await request.json()

  const resposta = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: `Você é um sistema de avaliação da plataforma devarena.
Avalie o desempenho de um dev júnior numa missão de bug fix em React.
Responda APENAS em JSON válido, sem texto antes ou depois, sem markdown, sem backticks.
O JSON deve ter exatamente essa estrutura:
{
  "pontuacao_geral": number de 0 a 100,
  "areas": {
    "investigacao": number de 0 a 100,
    "qualidade_tecnica": number de 0 a 100,
    "comunicacao": number de 0 a 100,
    "atencao_codebase": number de 0 a 100
  },
  "pontos_fortes": [string, string],
  "melhorias": [string, string],
  "mensagem_final": string de 2 frases encorajadoras e honestas
}`,
    messages: [
      {
        role: 'user',
        content: `Avalie esse dev júnior com base nas informações abaixo:

Título do PR: ${titulo}
Causa raiz identificada: ${causaRaiz}
Como testar descrito: ${comoTestar}
Número de mensagens trocadas com a PM: ${historicoCat}

O bug correto era: mutação direta do array de produtos com splice() no handleFilter.
A solução correta é usar filter() sem mutar o estado original.`
      }
    ]
  })

  const texto = resposta.content[0].text
  const limpo = texto.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const json = JSON.parse(limpo)
  return Response.json(json)
}