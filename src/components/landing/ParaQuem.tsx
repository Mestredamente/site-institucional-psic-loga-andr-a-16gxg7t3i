import { User, Users, Sparkles, Smile } from 'lucide-react'
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
        'Apoio lúdico no desenvolvimento socioemocional, medos, dificuldades de comportamento, perdas, luto e adaptações na escola e em casa.',
      badge: 'Lúdico & Clínico',
    },
    {
      name: 'Pais e Responsáveis',
      summary:
        'Famílias que desejam clareza, segurança e ferramentas práticas para educar com afeto, firmeza e presença consciente no dia a dia.',
      badge: 'Parentalidade',
    },
  ]

  const groups = content?.groups?.length ? content.groups : defaultGroups

  const icons = [
    <User key="0" className="w-6 h-6 text-sage-700" />,
    <Sparkles key="1" className="w-6 h-6 text-sage-700" />,
    <Smile key="2" className="w-6 h-6 text-sage-700" />,
    <Users key="3" className="w-6 h-6 text-sage-700" />,
  ]

  return (
    <section id="para-quem" className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Público-Alvo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Para Quem São os Atendimentos'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Cuidado individualizado e respeitoso para cada fase do desenvolvimento humano.'}
          </p>
        </div>

        {/* Grid de 4 públicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-warm-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center">
                    {icons[index % icons.length]}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-warm-700 mb-2.5">{item.name}</h3>
                <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-warm-100 flex items-center gap-2 text-xs text-warm-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                <span>Atendimento dedicado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
