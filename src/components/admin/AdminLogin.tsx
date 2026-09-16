import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock, Mail, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('mestredamente1@gmail.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error('Falha no login:', err)
      setError('Credenciais inválidas. Verifique seu e-mail e senha.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sage-200 text-sage-800 flex items-center justify-center shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center font-serif text-3xl font-bold tracking-tight text-warm-700">
          Área da Profissional
        </h2>
        <p className="mt-2 text-center text-sm text-warm-500">
          Painel de administração e gestão do site institucional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border-warm-200 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-lg text-warm-700">Acesso Restrito</CardTitle>
            <CardDescription className="text-warm-500">
              Digite suas credenciais para gerenciar conteúdos e atendimentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-warm-700">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="pl-9 border-warm-200 focus:border-sage-400 focus:ring-sage-300"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-warm-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-warm-400 absolute left-3 top-3" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 border-warm-200 focus:border-sage-400 focus:ring-sage-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sage-300 hover:bg-sage-400 text-sage-800 font-semibold py-2.5 rounded-xl transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-warm-100 flex items-center justify-between text-xs text-warm-500">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-warm-600 hover:text-warm-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao site público
              </Link>
              <span>CRP 14/075954</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
