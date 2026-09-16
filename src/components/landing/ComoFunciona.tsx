import { MapPin, Video, Users, BrainCircuit, Clock, ArrowRight } from 'lucide-react'
import type { ComoFuncionaContent } from '@/types/content'

interface ComoFuncionaProps {
  content?: ComoFuncionaContent
}

export default function ComoFunciona({ content }: ComoFuncionaProps) {
  const defaultEtapas = [
    {
      step: '01',
      title: 'Primeiro Contato',
      desc: 'Mensagem inicial via WhatsApp para entender sua busca, tirar dúvidas e checar horários disponíveis.',
    },
    {
      step: '02',
      title: 'Sessão de Acolhimento',
      desc: 'Primeiro encontro dedicado à escuta qualificada da sua queixa e alinhamento do vínculo de confiança.',
    },
    {
      step: '03',
      title: 'Plano de Cuidado',
      desc: 'Definição conjunta de metas terapêuticas, formato (presencial ou online) e frequência das sessões.',
    },
    {
      step: '04',
      title: 'Acompanhamento Contínuo',
      desc: 'Desenvolvimento de recursos emocionais, ressignificação de vivências e autonomia para o dia a dia.',
    },
  ]

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

  const etapas = content?.etapas?.length ? content.etapas : defaultEtapas
  const modalities = content?.modalities?.length ? content.modalities : defaultModalities

  const modIcons = [
    <MapPin key="0" className="w-5 h-5 text-sage-700" />,
    <Video key="1" className="w-5 h-5 text-sage-700" />,
    <Users key="2" className="w-5 h-5 text-sage-700" />,
    <BrainCircuit key="3" className="w-5 h-5 text-sage-700" />,
  ]

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C9A96A]/40 text-xs font-semibold text-warm-700 uppercase tracking-widest shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
            <span>Etapas & Modalidades</span>
          </div>
          <h2
            id="como-funciona-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight"
          >
            {content?.title || 'Como Funciona'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Formatos flexíveis e estruturados com total respeito ao sigilo e à ética profissional.'}
          </p>
        </div>

        {/* 4 ETAPAS DO PROCESSO: Primeiro contato → Sessão de acolhimento → Plano de cuidado → Acompanhamento */}
        <div className="mb-16">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm-800 text-center mb-8">
            As 4 Etapas do Seu Acompanhamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {etapas.map((etapa, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-warm-200 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#C9A96A]">
                      {etapa.step}
                    </span>
                    {idx < etapas.length - 1 && (
                      <ArrowRight className="hidden lg:block w-4 h-4 text-warm-300 absolute -right-3 top-9 z-10 bg-white rounded-full" />
                    )}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-warm-800 mb-2">{etapa.title}</h4>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                    {etapa.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-warm-100 flex items-center gap-1.5 text-[11px] text-sage-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  <span>Etapa {idx + 1} de 4</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linha divisória sutil com acento dourado */}
        <div className="max-w-xs mx-auto mb-16 gold-divider" />

        {/* Grid de Modalidades (Presencial e Online) */}
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm-800 text-center mb-8">
            Modalidades Presencial & Online
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modalities.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-warm-200 hover:border-[#C9A96A]/40 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center">
                      {modIcons[index % modIcons.length]}
                    </div>
                    <span className="text-[10px] font-semibold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-200">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-warm-800 mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-warm-100 flex items-center gap-2 text-xs font-medium text-warm-500">
                  <Clock className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span>{item.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
