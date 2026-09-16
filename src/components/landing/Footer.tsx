import { Heart, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterProps {
  crp?: string
}

export default function Footer({ crp = 'CRP 14/075954' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-warm-900 text-warm-200 pt-16 pb-12 border-t border-warm-800 relative">
      {/* Detalhe fino dourado decorativo */}
      <div className="max-w-xs mx-auto mb-10 gold-divider opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-warm-800/80">
          {/* Apresentação no footer */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
              <span className="font-serif text-2xl font-bold text-warm-50 tracking-tight block">
                Andréa dos Santos Silva Armôa
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-sage-300 font-semibold">
              Psicóloga Clínica e Neuropsicóloga • {crp}
            </p>
            <p className="text-sm text-warm-400 leading-relaxed font-light max-w-sm">
              Espaço de acolhimento psicológico, neuropsicologia e orientação parental. Cuidado
              humano e ético em todas as fases da vida.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-warm-100">Navegação</h4>
            <ul className="space-y-2 text-sm text-warm-400">
              <li>
                <a href="#sobre" className="hover:text-warm-100 transition-colors">
                  Sobre Mim
                </a>
              </li>
              <li>
                <a href="#psicoterapia" className="hover:text-warm-100 transition-colors">
                  Psicoterapia
                </a>
              </li>
              <li>
                <a href="#orientacao-parental" className="hover:text-warm-100 transition-colors">
                  Orientação Parental
                </a>
              </li>
              <li>
                <a href="#para-quem" className="hover:text-warm-100 transition-colors">
                  Para Quem
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-warm-100 transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-warm-100 transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-warm-100 transition-colors">
                  Contato & Localização
                </a>
              </li>
            </ul>
          </div>

          {/* Aviso Ético CRP & Emergências (Exigido no PRD) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sage-300">
              Aviso Ético & Emergências
            </h4>
            <div className="p-4 rounded-2xl bg-warm-800/60 border border-warm-800 text-xs text-warm-400 leading-relaxed space-y-2.5">
              <p>
                Este site possui caráter estritamente informativo e não substitui consultas
                psicológicas, diagnósticos ou tratamentos especializados. Atuação regulada pelo
                Conselho Regional de Psicologia ({crp}).
              </p>
              <p className="text-warm-300 font-medium pt-1 border-t border-warm-700/60">
                ⚠{' '}
                <strong className="text-warm-100">Em caso de emergência ou crise emocional</strong>:
                Ligue para o Centro de Valorização da Vida (CVV) pelo telefone{' '}
                <strong className="text-white">188</strong> (ligação gratuita, 24 horas) ou procure
                a Unidade de Pronto Atendimento (UPA / SAMU 192) mais próxima.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé inferior com Direitos e Link discreto da Área da Profissional */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-500">
          <p>© {currentYear} Andréa dos Santos Silva Armôa. Todos os direitos reservados.</p>

          {/* Link discreto "Área da Profissional" */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-warm-500 hover:text-warm-300 transition-colors py-1 px-2 rounded hover:bg-warm-800/40"
            title="Acesso restrito à profissional"
          >
            <Lock className="w-3 h-3 text-warm-500" />
            <span>Área da Profissional</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
