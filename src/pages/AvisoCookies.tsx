import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AvisoCookies() {
  useEffect(() => {
    document.title = 'Aviso de Cookies | Andréa Armôa - Psicóloga CRP 14/075954'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-warm-50 text-warm-700 selection:bg-sage-200 selection:text-sage-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-warm-200/70 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Voltar ao Início
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200 text-xs font-semibold uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5 text-sage-700" />
            <span>Transparência de Cookies</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight">
            Aviso de Cookies
          </h1>
          <p className="text-sm text-warm-500">
            Última atualização: Setembro de 2026 • Diretrizes claras de uso de cookies e
            rastreadores.
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-warm-700 text-sm sm:text-base leading-relaxed">
          {/* Seção 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">1.</span> O que são cookies?
            </h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no navegador do seu dispositivo
              quando você visita um site. Eles servem para lembrar preferências, permitir a
              navegação segura entre páginas e compreender de forma anônima como o site é utilizado.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">2.</span> Quais categorias de cookies utilizamos?
            </h2>
            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-warm-800">
                    Cookies Necessários (Essenciais)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-sage-800 bg-sage-100 px-2 py-0.5 rounded-full">
                    Sempre Ativos
                  </span>
                </div>
                <p className="text-xs text-warm-600">
                  Imprescindíveis para que o website funcione com segurança e estabilidade, como o
                  registro de que você visualizou ou respondeu ao banner de consentimento e a
                  preservação de sessão administrativa da profissional. Não podem ser desativados.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-warm-800">
                    Cookies de Desempenho e Estatísticas (Opcionais)
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-warm-600 bg-warm-200 px-2 py-0.5 rounded-full">
                    Sob Consentimento
                  </span>
                </div>
                <p className="text-xs text-warm-600">
                  Permitem mensurar o volume de acessos e páginas mais procuradas de forma
                  totalmente agregada e anônima.{' '}
                  <strong>
                    Atualmente, este site não mantém nenhum rastreador de terceiros ou script
                    invasivo de rastreamento publicitário ativo.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">3.</span> Como gerenciar ou revogar o consentimento
            </h2>
            <p>
              Você pode a qualquer momento redefinir sua preferência de cookies limpando o
              armazenamento local do seu navegador ou através das configurações de privacidade de
              navegadores como Google Chrome, Mozilla Firefox, Safari ou Microsoft Edge.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    localStorage.removeItem('andrea_armoa_cookie_consent')
                    window.location.reload()
                  } catch {
                    /* intentionally ignored */
                  }
                }}
                className="rounded-xl border-sage-300 text-sage-800 hover:bg-sage-50 text-xs"
              >
                Redefinir Preferências de Cookies
              </Button>
            </div>
          </section>
        </div>

        <div className="pt-6 border-t border-warm-200 flex justify-center">
          <Button
            asChild
            className="bg-sage-300 hover:bg-sage-400 text-sage-800 rounded-full px-8 py-5"
          >
            <Link to="/">Retornar à Página Principal</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-warm-900 text-warm-300 text-xs text-center border-t border-warm-800">
        <p>
          © {new Date().getFullYear()} Andréa dos Santos Silva Armôa • CRP 14/075954 • Todos os
          direitos reservados.
        </p>
      </footer>
    </div>
  )
}
