import { MapPin, Phone, Instagram, Mail, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ContatoContent } from '@/types/content'

interface ContatoProps {
  content?: ContatoContent
}

export default function Contato({ content }: ContatoProps) {
  const rawWhatsapp = content?.whatsapp || ''
  const cleanPhone = rawWhatsapp.replace(/\D/g, '')
  // Validar se telefone é real (mínimo 10 dígitos, sem repetição de noves fictícios)
  const isSuspiciousPhone =
    !rawWhatsapp || /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const hasValidWhatsapp = Boolean(rawWhatsapp && !isSuspiciousPhone)
  const whatsappFormatted = content?.whatsapp_formatted || (hasValidWhatsapp ? rawWhatsapp : '')
  const whatsappMsg =
    content?.whatsapp_message ||
    'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.'
  const whatsappUrl = hasValidWhatsapp
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`
    : '#'

  // Instagram sanitizado: conta real da profissional @andreaarmoapsi
  let instagramHandle = (content?.instagram || '').trim()
  if (!instagramHandle || instagramHandle.toLowerCase().includes('andreaarno')) {
    instagramHandle = '@andreaarmoapsi'
  }
  const instagramUrl =
    content?.instagram_url && !content.instagram_url.toLowerCase().includes('andreaarno')
      ? content.instagram_url
      : `https://instagram.com/${instagramHandle.replace('@', '')}`

  // Endereço: ocultar se for endereço não preenchido ou não verificado
  const rawAddress = (content?.address || '').trim()
  const isPlaceholderAddress = !rawAddress || /p[a]ulista|prime office/i.test(rawAddress)
  const hasValidAddress = !isPlaceholderAddress
  const address = hasValidAddress ? rawAddress : ''
  const addressComplement = hasValidAddress ? content?.address_complement : ''

  // Email: ocultar se for placeholder não confirmado
  const rawEmail = (content?.email || '').trim()
  const hasValidEmail = Boolean(
    rawEmail && rawEmail.includes('@') && !rawEmail.toLowerCase().includes('andreaarmoa.com.br'),
  )

  const mapsIframe =
    content?.maps_iframe_url && !content.maps_iframe_url.includes('1600000000000')
      ? content.maps_iframe_url
      : null

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
                {hasValidWhatsapp ? (
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
                ) : (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-sage-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                        Atendimento com Agendamento
                      </span>
                      <p className="text-sm font-medium text-warm-700">
                        Atendimento presencial e teleatendimento online nacional.
                      </p>
                    </div>
                  </div>
                )}

                {/* Endereço - Ocultado dinamicamente caso não haja endereço confirmado */}
                {hasValidAddress && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-sage-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                        Consultório Presencial
                      </span>
                      <p className="text-sm font-medium text-warm-700">{address}</p>
                      {addressComplement && (
                        <p className="text-xs text-warm-500">{addressComplement}</p>
                      )}
                    </div>
                  </div>
                )}

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
                      {instagramHandle || '@andreaarmoapsi'}
                    </a>
                  </div>
                </div>

                {/* Email - apenas se confirmado */}
                {hasValidEmail && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-sage-700" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider block">
                        E-mail
                      </span>
                      <a
                        href={`mailto:${rawEmail}`}
                        className="text-sm font-medium text-warm-700 hover:text-sage-700 transition-colors"
                      >
                        {rawEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-warm-100 space-y-3">
              <Button
                asChild
                className="w-full bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium py-6 rounded-2xl shadow-sm text-base transition-all transform hover:scale-[1.01] focus:ring-2 focus:ring-sage-500"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conversar no WhatsApp com a psicóloga Andréa Armôa"
                >
                  Conversar no WhatsApp
                </a>
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-warm-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-sage-600" />
                <span>Horários com agendamento prévio • Sigilo profissional garantido</span>
              </div>
            </div>
          </div>

          {/* Mapa do Google embutido (7 colunas) ou Painel de Modalidades quando sem endereço */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-warm-200 shadow-sm bg-white min-h-[350px] relative flex flex-col justify-center">
            {mapsIframe ? (
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
            ) : (
              <div className="p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-sage-100 border border-sage-200 flex items-center justify-center mx-auto text-sage-700">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-warm-800">
                  Atendimento Presencial &amp; Online
                </h3>
                <p className="text-sm text-warm-600 leading-relaxed font-normal">
                  Sessões individuais de psicoterapia clínica, avaliação neuropsicológica e
                  orientação parental. O endereço exato do consultório presencial é disponibilizado
                  no momento da confirmação do agendamento.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-sage-700 bg-sage-50 px-4 py-2 rounded-full border border-sage-200">
                  <ShieldCheck className="w-4 h-4" />
                  Teleatendimento seguro com alcance nacional
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
