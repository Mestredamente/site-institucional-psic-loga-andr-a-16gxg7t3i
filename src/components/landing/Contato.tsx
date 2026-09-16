import { MapPin, Phone, Instagram, Mail, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContatoContent } from '@/types/content'

interface ContatoProps {
  content?: ContatoContent
}

export default function Contato({ content }: ContatoProps) {
  const whatsappPhone = content?.whatsapp || '5511999998888'
  const cleanPhone = whatsappPhone.replace(/\D/g, '')
  const whatsappFormatted = content?.whatsapp_formatted || '(11) 99999-8888'
  const whatsappMsg =
    content?.whatsapp_message ||
    'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.'
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`

  const instagramHandle = content?.instagram || '@andreaarnoapsi'
  const instagramUrl =
    content?.instagram_url || `https://instagram.com/${instagramHandle.replace('@', '')}`

  const mapsIframe =
    content?.maps_iframe_url ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.654!3d-23.564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjEiUyA0NsKwMzknMTQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000'

  return (
    <section id="contato" className="py-20 lg:py-28 bg-warm-100/60 border-t border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Atendimento & Localização
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Entre em Contato'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Dê o primeiro passo em direção ao seu equilíbrio emocional e bem-estar.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Card de Informações e Ações (5 colunas) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-warm-200 shadow-sm">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-warm-700">Canais de Atendimento</h3>
              <p className="text-sm text-warm-600 leading-relaxed font-normal">
                Para dúvidas sobre disponibilidade, valores ou agendamento de consultas, sinta-se à
                vontade para enviar uma mensagem pelo WhatsApp ou acompanhar os conteúdos no
                Instagram.
              </p>

              <div className="space-y-4 pt-2">
                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                      WhatsApp
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-warm-700 hover:text-sage-700 transition-colors"
                    >
                      {whatsappFormatted}
                    </a>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                      Consultório Presencial
                    </span>
                    <p className="text-sm font-medium text-warm-700">
                      {content?.address || 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'}
                    </p>
                    {content?.address_complement && (
                      <p className="text-xs text-warm-500">{content.address_complement}</p>
                    )}
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                      Instagram
                    </span>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-warm-700 hover:text-sage-700 transition-colors"
                    >
                      {instagramHandle}
                    </a>
                  </div>
                </div>

                {/* Email */}
                {content?.email && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-sage-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                        E-mail
                      </span>
                      <a
                        href={`mailto:${content.email}`}
                        className="text-sm font-medium text-warm-700 hover:text-sage-700 transition-colors"
                      >
                        {content.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-warm-100 space-y-3">
              <Button
                asChild
                className="w-full bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium py-6 rounded-2xl shadow-sm text-base transition-all transform hover:scale-[1.01]"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Conversar no WhatsApp
                </a>
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-warm-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-sage-600" />
                <span>Horários com agendamento prévio</span>
              </div>
            </div>
          </div>

          {/* Mapa do Google embutido (7 colunas) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-warm-200 shadow-sm bg-white min-h-[350px] relative">
            <iframe
              src={mapsIframe}
              title="Localização do consultório no Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
