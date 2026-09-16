import { MapPin, Video, Users, BrainCircuit, Clock } from 'lucide-react'
import type { ComoFuncionaContent } from '@/types/content'

interface ComoFuncionaProps {
  content?: ComoFuncionaContent
}

export default function ComoFunciona({ content }: ComoFuncionaProps) {
  const defaultModalities = [
    {
      title: 'Atendimento Presencial',
      desc: 'Sessões individuais em consultório privativo, silencioso e preparado para garantir total conforto, acolhimento e sigilo profissional.',
      tag: 'Consultório',
      duration: '50 minutos',
    },
    {
      title: 'Atendimento Online (Teleatendimento)',
      desc: 'Sessões por videochamada criptografada e segura, permitindo o acompanhamento de qualquer lugar do Brasil e do mundo com mesma eficácia clínica.',
      tag: 'Nacional & Internacional',
      duration: '50 minutos',
    },
    {
      title: 'Orientação Parental',
      desc: 'Encontros focados nas demandas práticas da rotina familiar e na relação pais-filhos, com intervenções direcionadas e personalizadas.',
      tag: 'Para Cuidadores',
      duration: '50 a 60 minutos',
    },
    {
      title: 'Avaliação Neuropsicológica',
      desc: 'Investigação aprofundada das funções cognitivas (atenção, memória, raciocínio, funções executivas), auxiliando em diagnósticos e condutas terapêuticas.',
      tag: 'Clínica & Cognitiva',
      duration: 'Processo estruturado em sessões',
    },
  ]

  const modalities = content?.modalities?.length ? content.modalities : defaultModalities

  const modIcons = [
    <MapPin key="0" className="w-6 h-6 text-sage-700" />,
    <Video key="1" className="w-6 h-6 text-sage-700" />,
    <Users key="2" className="w-6 h-6 text-sage-700" />,
    <BrainCircuit key="3" className="w-6 h-6 text-sage-700" />,
  ]

  return (
    <section id="como-funciona" className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Modalidades de Atendimento
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Como Funciona'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Formatos flexíveis e estruturados com total respeito ao sigilo e à ética profissional.'}
          </p>
        </div>

        {/* Grid de Modalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modalities.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-warm-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center">
                    {modIcons[index % modIcons.length]}
                  </div>
                  <span className="text-[11px] font-semibold text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-warm-700 mb-2.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-warm-100 flex items-center gap-2 text-xs font-medium text-warm-500">
                <Clock className="w-3.5 h-3.5 text-sage-600" />
                <span>{item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
