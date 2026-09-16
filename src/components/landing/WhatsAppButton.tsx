import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
}

export default function WhatsAppButton({
  phone = '',
  message = 'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.',
}: WhatsAppButtonProps) {
  const cleanPhone = (phone || '').replace(/\D/g, '')
  // Se não houver telefone válido informado ou for placeholder, link seguro
  const isSuspicious = /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const whatsappUrl =
    cleanPhone && !isSuspicious
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : '#contato'

  return (
    <aside
      aria-label="Atendimento pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center group motion-reduce:transform-none"
    >
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 text-xs font-medium text-warm-700 bg-white/95 backdrop-blur shadow-md rounded-full border border-warm-200 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
        Conversar no WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
        rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-label="Conversar no WhatsApp"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all transform hover:scale-105 animate-pulse-subtle focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 motion-reduce:animate-none motion-reduce:transform-none"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
      </a>
    </aside>
  )
}
