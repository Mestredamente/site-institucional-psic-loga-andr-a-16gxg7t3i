import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
}

export default function WhatsAppButton({
  phone = '5511999998888',
  message = 'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.',
}: WhatsAppButtonProps) {
  const cleanPhone = phone.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

  return (
    <aside
      aria-label="Atendimento pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 text-xs font-medium text-warm-700 bg-white/95 backdrop-blur shadow-md rounded-full border border-warm-200 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
        Fale comigo no WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp com Andréa Armôa"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all transform hover:scale-105 animate-pulse-subtle focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
      </a>
    </aside>
  )
}
