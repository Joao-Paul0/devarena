import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(request) {
  const { titulo, causaRaiz, comoTestar } = await request.json()

  const resposta = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `Você é Lucas Faria, tech lead sênior especialista em React da ShopFlow.
Você está revisando um Pull Request de um dev júnior.
Seja direto, técnico e exigente mas justo.
Nunca diga "tá errado" — questione o raciocínio com perguntas abertas.
Faça no máximo 2 comentários — um ponto positivo e uma pergunta técnica que faça o dev pensar.
Responda em português, de forma concisa, como um comentário de code review.
Se a causa raiz mencionada for correta (mutação direta do array de produtos com splice), reconheça e aprofunde.
Se a causa raiz estiver errada ou vaga, questione educadamente.`,
    messages: [
      {
        role: 'user',
        content: `O dev abriu um PR com as seguintes informações:
Título: ${titulo}
Causa raiz: ${causaRaiz}
Como testar: ${comoTestar}

Faça sua revisão como tech lead.`
      }
    ]
  })

  return Response.json({ resposta: resposta.content[0].text })
}