import { Award, CheckCircle2 } from 'lucide-react'
import type { SobreContent } from '@/types/content'

interface SobreProps {
  content?: SobreContent
  photoUrl?: string
}

export default function Sobre({ content, photoUrl }: SobreProps) {
  const defaultPhoto = 'https://img.usecurling.com/p/800/1000?q=psychology+therapy+office'
  const finalPhoto = photoUrl || defaultPhoto

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Foto Secundária / Card Lateral */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-warm-200 bg-warm-50 aspect-[4/5] group">
              <img
                src={finalPhoto}
                alt="Consultório Andréa Armôa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur border border-warm-200 shadow-sm text-warm-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center text-sage-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sage-700">
                      Compromisso Ético
                    </p>
                    <p className="text-sm font-medium text-warm-700">
                      Registro Ativo no CRP 14/075954
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Textos Sobre */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
                Apresentação Profissional
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
                {content?.title || 'Sobre Mim'}
              </h2>
            </div>

            <p className="text-lg sm:text-xl font-medium text-warm-600 leading-relaxed">
              {content?.lead ||
                'Acolhimento com base científica, respeito à sua história e compromisso com o desenvolvimento humano em cada fase da vida.'}
            </p>

            <div className="space-y-4 text-warm-600 leading-relaxed font-normal">
              {content?.paragraphs && content.paragraphs.length > 0 ? (
                content.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <p>
                    Sou Andréa dos Santos Silva Armôa, psicóloga clínica e neuropsicóloga com
                    registro ativo no Conselho Regional de Psicologia (CRP 14/075954). Minha prática
                    é guiada pela escuta atenta, ética e acolhedora.
                  </p>
                  <p>
                    Uno a sensibilidade da clínica psicológica com o rigor dos instrumentos
                    neuropsicológicos para oferecer um acompanhamento completo para adultos,
                    adolescentes, crianças e famílias.
                  </p>
                </>
              )}
            </div>

            {/* Destaques / Highlights */}
            {content?.highlights && content.highlights.length > 0 && (
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {content.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-warm-50 border border-warm-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-warm-700 block">{h.label}</span>
                      <span className="text-xs text-warm-500">{h.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
