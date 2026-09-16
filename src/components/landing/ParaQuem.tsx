import { User, Users, Sparkles, Smile, Home } from 'lucide-react'
import type { ParaQuemContent } from '@/types/content'

interface ParaQuemProps {
  content?: ParaQuemContent
}

export default function ParaQuem({ content }: ParaQuemProps) {
  const defaultGroups = [
    {
      name: 'Adultos',
      summary:
        'Pessoas que buscam autoconhecimento, superação de crises emocionais, manejo de ansiedade, estresse ou reorganização da vida profissional e afetiva.',
      badge: 'Individual',
    },
    {
      name: 'Adolescentes',
      summary:
        'Jovens vivenciando pressões escolares, descobertas, inseguranças, conflitos relacionais e necessidade de um espaço acolhedor e confidencial.',
      badge: 'Especializado',
    },
    {
      name: 'Crianças',
      summary:
        'Apoio lúdico no desenvolvimento socioemocional, regulação de emoções, medos, dificuldades de comportamento e adaptações escolares.',
      badge: 'Lúdico & Clínico',
    },
    {
      name: 'Pais e Responsáveis',
      summary:
        'Mães, pais e cuidadores que desejam clareza e ferramentas práticas para educar com afeto, firmeza e presença consciente no dia a dia.',
      badge: 'Parentalidade',
    },
    {
      name: 'Famílias',
      summary:
        'Acolhimento de impasses relacionais, transições de ciclo familiar, alinhamento de convivência e fortalecimento de vínculos afetivos coletivos.',
      badge: 'Sistêmico & Vínculos',
    },
  ]

  const groups = content?.groups?.length ? content.groups : defaultGroups

  const icons = [
    <User key="0" className="w-5 h-5 text-sage-700" />,
    <Sparkles key="1" className="w-5 h-5 text-sage-700" />,
    <Smile key="2" className="w-5 h-5 text-sage-700" />,
    <Users key="3" className="w-5 h-5 text-sage-700" />,
    <Home key="4" className="w-5 h-5 text-sage-700" />,
  ]

  return (
    <section
      id="para-quem"
      aria-labelledby="para-quem-title"
      className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C9A96A]/40 text-xs font-semibold text-warm-700 uppercase tracking-widest shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
            <span>Público-Alvo</span>
          </div>
          <h2
            id="para-quem-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight"
          >
            {content?.title || 'Para Quem São os Atendimentos'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Cuidado individualizado e respeitoso para cada fase do desenvolvimento humano.'}
          </p>
        </div>

        {/* Grid de 5 públicos (Adultos, Adolescentes, Crianças, Pais/Responsáveis e Famílias) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {groups.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-warm-200 hover:border-[#C9A96A]/40 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sage-100/80 border border-sage-200 flex items-center justify-center">
                    {icons[index % icons.length]}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-800 bg-sage-100/70 px-2.5 py-0.5 rounded-full border border-sage-200/80">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-warm-800 mb-2">{item.name}</h3>
                <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-warm-100 flex items-center gap-2 text-xs text-warm-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
                <span className="text-[11px]">Cuidado qualificado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
