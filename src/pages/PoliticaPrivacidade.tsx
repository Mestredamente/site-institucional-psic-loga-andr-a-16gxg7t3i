import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Lock, Heart, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PoliticaPrivacidade() {
  useEffect(() => {
    document.title = 'Política de Privacidade | Andréa Armôa - Psicóloga CRP 14/075954'
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
            <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
            <span>Transparência & LGPD</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-sm text-warm-500">
            Última atualização: Setembro de 2026 • Em conformidade com a Lei Geral de Proteção de
            Dados (Lei 13.709/2018) e o Código de Ética do Psicólogo.
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-warm-700 text-sm sm:text-base leading-relaxed">
          {/* Seção 1 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">1.</span> Nosso Compromisso Ético e com a sua
              Privacidade
            </h2>
            <p>
              O site institucional da psicóloga <strong>Andréa dos Santos Silva Armôa</strong>{' '}
              (inscrita no Conselho Regional de Psicologia sob o registro{' '}
              <strong>CRP 14/075954</strong>) tem caráter exclusivamente informativo e educativo,
              destinado a apresentar os serviços de Psicoterapia Clínica, Avaliação Neuropsicológica
              e Orientação Parental.
            </p>
            <p>
              Tratamos a privacidade como um pilar indissociável da prática psicológica. O sigilo
              profissional é um dever ético absoluto assegurado pelo{' '}
              <strong>Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005)</strong>{' '}
              e respeitado integralmente em conjunto com os princípios da Lei Federal nº 13.709/2018
              (Lei Geral de Proteção de Dados Pessoais — LGPD).
            </p>
          </section>

          {/* Seção 2 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">2.</span> Ausência de Armazenamento de Dados Clínicos
              no Site
            </h2>
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs sm:text-sm text-sage-900 flex items-start gap-3">
              <Lock className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção e Segurança:</strong> Nenhum dado clínico, anamnese, evolução
                terapêutica ou prontuário de pacientes é coletado ou armazenado por meio deste
                website.
              </div>
            </div>
            <p>
              Prontuários e anotações profissionais de atendimentos clínicos são mantidos em
              ambiente físico e/ou prontuário eletrônico privativo devidamente resguardado sob
              sigilo absoluto, conforme preconizam as resoluções vigentes do Conselho Federal de
              Psicologia (CFP).
            </p>
          </section>

          {/* Seção 3 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">3.</span> Dados que Coletamos e Finalidade
            </h2>
            <p>
              Por ser uma página de apresentação institucional, as únicas formas de coleta de dados
              são:
            </p>
            <ul className="space-y-2 list-disc list-inside text-warm-600">
              <li>
                <strong>Contato voluntário via WhatsApp:</strong> Ao clicar nos botões de
                atendimento, você é redirecionado voluntariamente para o aplicativo oficial do
                WhatsApp. Lá, o número de telefone e o nome cadastrado no seu aplicativo serão
                visíveis apenas para a profissional Andréa Armôa para viabilizar o retorno da sua
                solicitação de agendamento.
              </li>
              <li>
                <strong>Cookies técnicos essenciais:</strong> Pequenos registros locais utilizados
                exclusivamente para salvar preferências de visualização (ex: se você já visualizou o
                aviso de cookies) e proteger a integridade do tráfego web.
              </li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">4.</span> Direitos do Titular de Dados (Art. 18 da
              LGPD)
            </h2>
            <p>Conforme o Artigo 18 da LGPD, você tem direito a solicitar:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Confirmação da existência de tratamento',
                'Acesso aos seus dados de contato mantidos',
                'Correção de dados incompletos ou inexatos',
                'Eliminação de mensagens e dados de contato prévios',
                'Informações sobre compartilhamento (não há)',
                'Revogação do consentimento a qualquer tempo',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs bg-warm-50 p-2.5 rounded-xl border border-warm-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Seção 5 */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200 space-y-3 shadow-xs">
            <h2 className="font-serif text-2xl font-bold text-warm-800 flex items-center gap-2">
              <span className="text-[#C9A96A]">5.</span> Encarregado pelo Tratamento de Dados (DPO)
              e Contato
            </h2>
            <p>
              Para qualquer dúvida sobre esta política ou para exercer os direitos previstos na
              LGPD, entre em contato diretamente com a profissional responsável:
            </p>
            <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 text-xs sm:text-sm space-y-1">
              <p>
                <strong>Responsável:</strong> Andréa dos Santos Silva Armôa
              </p>
              <p>
                <strong>Qualificação:</strong> Psicóloga Clínica & Neuropsicóloga (CRP 14/075954)
              </p>
              <p>
                <strong>Canal de Atendimento:</strong> Via WhatsApp através dos links disponíveis
                neste site institucional
              </p>
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
