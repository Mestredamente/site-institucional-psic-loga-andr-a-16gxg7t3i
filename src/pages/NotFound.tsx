import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, ArrowLeft, Heart, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'Página Não Encontrada (404) | Andréa Armôa'
  }, [])

  return (
    <div className="min-h-screen bg-warm-50 text-warm-700 flex flex-col justify-between selection:bg-sage-200 selection:text-sage-900">
      {/* Header simplificado */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-warm-200/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-800">
              Andréa Armôa
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
            <span className="text-xs uppercase tracking-wider text-warm-500 font-medium hidden sm:inline-block">
              CRP 14/075954
            </span>
          </Link>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-warm-300 text-xs"
          >
            <Link to="/">
              <Home className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
              Página Inicial
            </Link>
          </Button>
        </div>
      </header>

      {/* Conteúdo acolhedor central */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-sage-100 border border-sage-200 flex items-center justify-center mx-auto text-sage-700 shadow-sm">
          <Heart className="w-10 h-10 text-sage-600 fill-sage-100" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sage-700 bg-sage-50 px-3 py-1 rounded-full border border-sage-200">
            Erro 404 • Página Não Encontrada
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight">
            Sentimos muito, esse caminho não existe.
          </h1>
          <p className="text-base sm:text-lg text-warm-600 font-normal leading-relaxed max-w-lg mx-auto">
            O endereço digitado (
            <code className="text-xs font-mono bg-warm-200/70 px-1.5 py-0.5 rounded text-warm-800">
              {location.pathname}
            </code>
            ) foi movido, digitado incorretamente ou não está mais disponível.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-warm-200 shadow-sm max-w-md mx-auto space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-warm-700">
            <ShieldCheck className="w-4 h-4 text-sage-600" />
            <span>O que você pode fazer agora:</span>
          </div>
          <ul className="text-xs text-warm-600 space-y-2 list-disc list-inside">
            <li>Voltar à página inicial para conhecer os atendimentos clínicos</li>
            <li>Acessar as orientações sobre Psicoterapia ou Orientação Parental</li>
            <li>Entrar em contato para tirar dúvidas pontuais ou agendar horário</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium px-8 py-6 rounded-full shadow-sm text-base focus:ring-2 focus:ring-sage-500"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retornar à Página Inicial
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-warm-300 text-warm-700 hover:bg-warm-100 rounded-full text-base"
          >
            <Link to="/#contato">Ir para Contato</Link>
          </Button>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="py-6 border-t border-warm-200 text-center text-xs text-warm-500">
        <p>© {new Date().getFullYear()} Andréa dos Santos Silva Armôa • CRP 14/075954</p>
      </footer>
    </div>
  )
}
