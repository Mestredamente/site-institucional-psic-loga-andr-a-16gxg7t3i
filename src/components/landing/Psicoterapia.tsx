import { User, Sparkles, Heart } from 'lucide-react'
import type { PsicoterapiaContent } from '@/types/content'

interface PsicoterapiaProps {
  content?: PsicoterapiaContent
}

export default function Psicoterapia({ content }: PsicoterapiaProps) {
  const getIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-sage-700" />
      case 'heart':
        return <Heart className="w-6 h-6 text-sage-700" />
      default:
        return <User className="w-6 h-6 text-sage-700" />
    }
  }

  const defaultAudiences = [
    {
      title: 'Adultos',
      description:
        'Apoio nas demandas de ansiedade, depressão, estresse, transições de carreira, luto e desenvolvimento de equilíbrio emocional e autoconhecimento.',
      icon: 'user',
    },
    {
      title: 'Adolescentes',
      description:
        'Espaço acolhedor para lidar com as transformações da fase, pressões escolares, identidade, relações sociais e conflitos emocionais.',
      icon: 'sparkles',
    },
    {
      title: 'Crianças',
      description:
        'Atendimento lúdico e sensível para apoiar questões de comportamento, regulação emocional, medos, dificuldades escolares e dinâmicas familiares.',
      icon: 'heart',
    },
  ]

  const audiences = content?.audiences?.length ? content.audiences : defaultAudiences

  return (
    <section id="psicoterapia" className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Atuação Clínica
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Psicoterapia Clínica'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle || 'Um espaço seguro para elaboração, crescimento e reconstrução.'}
          </p>
          {content?.description && (
            <p className="text-sm sm:text-base text-warm-600 leading-relaxed pt-2">
              {content.description}
            </p>
          )}
        </div>

        {/* Cards de Atuação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-warm-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sage-100 border border-sage-200 flex items-center justify-center mb-6 group-hover:bg-sage-200 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-serif text-2xl font-bold text-warm-700 mb-3 group-hover:text-warm-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-warm-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-warm-100 flex items-center text-xs font-semibold text-sage-700">
                <span>Atendimento humanizado</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
