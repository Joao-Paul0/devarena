import { createClient } from '../lib/supabase'

export default async function Home() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()

  return (
    <main>
      <h1>devarena</h1>
      <p>{error ? 'Erro na conexão' : 'Supabase conectado ✓'}</p>
    </main>
  )
}