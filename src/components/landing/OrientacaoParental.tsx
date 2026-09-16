import { Users, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrientacaoParentalContent } from '@/types/content'

import SmartImage from '@/components/ui/SmartImage'

interface OrientacaoParentalProps {
  content?: OrientacaoParentalContent
  photoUrl?: string | null
  isLoadingMedia?: boolean
  whatsappPhone?: string
  whatsappMessage?: string
}

export default function OrientacaoParental({
  content,
  photoUrl,
  isLoadingMedia,
  whatsappPhone = '5511999998888',
  whatsappMessage = '',
}: OrientacaoParentalProps) {
  const cleanPhone = whatsappPhone.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    whatsappMessage || 'Olá, Andréa! Gostaria de saber mais sobre a Orientação Parental.',
  )}`

  const defaultPoints = [
    'Birras e Limites: manejo acolhedor com consistência e sem violência',
    'Rotina e Sono: estruturação de horários previsíveis que trazem segurança',
    'Uso Consciente de Telas: equilíbrio digital adaptado a cada fase',
    'Comunicação Afetiva: diálogos claros que conectam e reduzem conflitos',
    'Transições Familiares: apoio na chegada de irmãos, separação ou luto',
    'Autonomia e Segurança Emocional: fortalecendo a autoconfiança da criança',
  ]

  const points = content?.points?.length ? content.points : defaultPoints

  return (
    <section
      id="orientacao-parental"
      className="py-20 lg:py-28 bg-white border-t border-warm-200 relative"
    >
      {/* Linha fina decorativa superior com toque de ouro sutil */}
      <div className="max-w-xs mx-auto mb-12 gold-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAIXA COM FUNDO CONTRASTANTE E DESTAQUE VISUAL COMPLETO */}
        <div className="relative rounded-3xl bg-sage-50/90 border-2 border-sage-200 p-8 sm:p-12 lg:p-16 shadow-[0_16px_50px_rgba(111,162,135,0.14)] overflow-hidden">
          {/* Decoração sutil */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sage-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sage-300/30 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#C9A96A]/40 text-xs font-semibold text-warm-700 tracking-wider uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#C9A96A]" />
              <Users className="w-3.5 h-3.5 text-sage-700" />
              <span>Destaque Especial • Apoio Parental</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight">
              {content?.title || 'Orientação Parental'}
            </h2>

            {/* FRASE-ÂNCORA EXATA EXIGIDA NO BRIEFING */}
            <div className="py-4 px-6 sm:px-8 rounded-2xl bg-white/95 backdrop-blur border border-[#C9A96A]/30 inline-block shadow-sm max-w-2xl">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-sage-900 italic leading-snug">
                "{content?.quote || 'Fortalecendo pais para fortalecer a relação com os filhos'}"
              </p>
              <p className="text-xs sm:text-sm text-warm-600 font-medium pt-2 border-t border-[#C9A96A]/20 mt-2">
                {content?.subtitle || 'Estratégias práticas para desafios da parentalidade'}
              </p>
            </div>

            <p className="text-base sm:text-lg text-warm-700 leading-relaxed max-w-3xl mx-auto font-normal">
              {content?.description ||
                'A parentalidade é uma das jornadas mais desafiadoras e enriquecedoras da vida. A orientação parental oferece apoio qualificado para mães, pais e responsáveis que buscam educar com afeto, respeito e firmeza, sem violência e sem culpa.'}
            </p>

            {/* Foto ilustrativa (com skeleton neutro durante loading e aspect-ratio fixo 3/2) */}
            {(isLoadingMedia || photoUrl) && (
              <div className="pt-2 max-w-2xl mx-auto w-full">
                <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-sage-200 shadow-sm bg-sage-100/50">
                  <SmartImage
                    src={photoUrl}
                    isLoading={isLoadingMedia}
                    alt="Orientação Parental e Acolhimento Familiar"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Lista de pontos em grid (6 tópicos reais) */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/95 border border-sage-200/80 hover:border-[#C9A96A]/50 transition-colors shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-sage-100 border border-sage-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-700" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-warm-700 leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA da Orientação Parental */}
            <div className="pt-8">
              <Button
                asChild
                size="lg"
                className="bg-sage-600 hover:bg-sage-700 text-white font-medium px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] text-base"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {content?.cta_text || 'Quero agendar uma Orientação Parental'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
