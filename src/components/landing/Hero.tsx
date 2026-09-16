import { Heart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HeroContent } from '@/types/content'

import SmartImage from '@/components/ui/SmartImage'

interface HeroProps {
  content?: HeroContent
  photoUrl?: string | null
  isLoadingMedia?: boolean
  whatsappPhone?: string
  whatsappMessage?: string
}

export default function Hero({
  content,
  photoUrl,
  isLoadingMedia,
  whatsappPhone = '',
  whatsappMessage = '',
}: HeroProps) {
  const cleanPhone = (whatsappPhone || '').replace(/\D/g, '')
  const isSuspicious = /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const hasValidPhone = Boolean(cleanPhone && !isSuspicious)
  const whatsappUrl = hasValidPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        whatsappMessage || 'Olá, Andréa! Gostaria de agendar um atendimento.',
      )}`
    : '#contato'

  // Imagem default profissional caso o admin ainda não tenha feito upload
  // NOTA: SÓ deve ser exibida após a consulta ao backend concluir (não durante o loading)
  const defaultPhoto = 'https://img.usecurling.com/ppl/large?gender=female&seed=48'

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-24 pb-16 lg:py-0 overflow-hidden bg-gradient-to-b from-warm-50 via-warm-50 to-warm-100/50">
      {/* Elementos sutis de fundo */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-warm-200/50 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna Texto (7 colunas no desktop) */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8 text-center lg:text-left animate-fade-in-up">
            {content?.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#C9A96A]/40 text-xs font-semibold text-warm-700 tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C9A96A]" />
                <Heart className="w-3.5 h-3.5 text-sage-600 fill-sage-600" />
                <span>{content.badge}</span>
              </div>
            )}

            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-warm-700 tracking-tight leading-[1.15]">
                {content?.title || 'Andréa dos Santos Silva Armôa'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-medium text-warm-500">
                {content?.subtitle || 'Psicóloga Clínica e Neuropsicóloga'} —{' '}
                <span className="font-semibold text-warm-700">
                  {content?.crp || 'CRP 14/075954'}
                </span>
              </p>
            </div>

            <div className="border-l-2 border-l-[#C9A96A] pl-4 py-1 text-left">
              <p className="text-base sm:text-lg text-warm-600 font-serif italic leading-relaxed max-w-2xl">
                "
                {content?.welcoming_phrase ||
                  'Aqui, você encontra um espaço seguro, acolhedor e ético para se ouvir, se compreender e se cuidar.'}
                "
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-sage-300 hover:bg-sage-400 text-sage-800 font-semibold px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] text-base"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {content?.cta_primary || 'Agendar Atendimento'}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-warm-300 text-warm-700 hover:bg-warm-100 hover:text-warm-900 font-medium px-8 py-6 rounded-full transition-all text-base"
              >
                <a href="#sobre">{content?.cta_secondary || 'Conhecer Minha Atuação'}</a>
              </Button>
            </div>

            {/* Mini selo de confiança */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-warm-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500 inline-block" />
                <span>Atendimento Sigiloso & Ético</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500 inline-block" />
                <span>Presencial & Online</span>
              </div>
            </div>
          </div>

          {/* Coluna Foto (5 colunas no desktop) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in">
            <div className="relative group max-w-md w-full">
              {/* Moldura de fundo decorativa com sombra suave */}
              <div className="absolute inset-0 bg-sage-200/70 rounded-3xl transform rotate-2 group-hover:rotate-1 transition-transform duration-500" />

              <div className="relative rounded-3xl overflow-hidden border border-warm-200 bg-white shadow-xl aspect-[3/4]">
                <SmartImage
                  src={photoUrl}
                  fallbackSrc={defaultPhoto}
                  isLoading={isLoadingMedia}
                  priority={true}
                  alt="Andréa dos Santos Silva Armôa, psicóloga clínica e neuropsicóloga no consultório"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                >
                  {/* Legenda sutil no rodapé da imagem */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-warm-900/80 via-warm-900/40 to-transparent p-5 text-white z-10 pointer-events-none">
                    <p className="font-serif font-bold text-lg">Andréa dos Santos Silva Armôa</p>
                    <p className="text-xs text-warm-100 opacity-90">
                      Psicóloga Clínica e Neuropsicóloga • CRP 14/075954
                    </p>
                  </div>
                </SmartImage>
              </div>
            </div>
          </div>
        </div>

        {/* Seta indicativa de rolagem com bounce */}
        <div className="hidden lg:flex justify-center mt-12 animate-bounce">
          <a
            href="#sobre"
            aria-label="Rolar para a seção Sobre Mim"
            className="p-2 text-warm-400 hover:text-warm-700 transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}
