import { CheckCircle2, ShieldCheck, HeartPulse, Brain, Compass, Sparkles } from 'lucide-react'
import type { BeneficiosContent } from '@/types/content'

interface BeneficiosProps {
  content?: BeneficiosContent
}

export default function Beneficios({ content }: BeneficiosProps) {
  const defaultItems = [
    {
      title: 'Mais equilíbrio emocional',
      desc: 'Aprenda a reconhecer, nomear e regular suas emoções frente às adversidades do cotidiano.',
    },
    {
      title: 'Melhora nos relacionamentos',
      desc: 'Comunicação mais assertiva, estabelecimento de limites saudáveis e vínculos interpessoais seguros.',
    },
    {
      title: 'Autoconhecimento profundo',
      desc: 'Compreensão ampla das suas potências, limites, necessidades reais e história de vida.',
    },
    {
      title: 'Fortalecimento familiar',
      desc: 'Mais cooperação, escuta ativa e acolhimento entre pais, filhos e familiares.',
    },
    {
      title: 'Gestão da ansiedade e estresse',
      desc: 'Estratégias baseadas em evidências para reduzir a sobrecarga e restaurar a paz interna.',
    },
    {
      title: 'Apoio em fases de transição',
      desc: 'Segurança psicológica para atravessar mudanças profissionais, perdas, divórcios ou novas etapas.',
    },
  ]

  const items = content?.items?.length ? content.items : defaultItems

  const benefitIcons = [
    <HeartPulse key="0" className="w-5 h-5 text-sage-600" />,
    <ShieldCheck key="1" className="w-5 h-5 text-sage-600" />,
    <Brain key="2" className="w-5 h-5 text-sage-600" />,
    <Sparkles key="3" className="w-5 h-5 text-sage-600" />,
    <Compass key="4" className="w-5 h-5 text-sage-600" />,
    <CheckCircle2 key="5" className="w-5 h-5 text-sage-600" />,
  ]

  return (
    <section id="beneficios" className="py-20 lg:py-28 bg-white border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Transformação & Bem-Estar
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Principais Benefícios do Acompanhamento'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Investir em psicoterapia é construir uma relação de respeito consigo e com quem você ama.'}
          </p>
        </div>

        {/* Grid de benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-2xl bg-warm-50/70 border border-warm-200 hover:border-sage-300 hover:bg-white shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0 mt-0.5">
                {benefitIcons[index % benefitIcons.length]}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-warm-700 mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
