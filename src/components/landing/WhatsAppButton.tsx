import { useState, useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
  targetFooterSelector?: string
}

const SESSION_TOOLTIP_KEY = 'andrea_armoa_wa_tooltip_shown'

export default function WhatsAppButton({
  phone = '',
  message = 'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.',
  targetFooterSelector = '#rodape',
}: WhatsAppButtonProps) {
  const isMobile = useIsMobile()
  const [bottomOffset, setBottomOffset] = useState<number>(24) // 24px = bottom-6
  const [showTooltip, setShowTooltip] = useState(false)
  const isFooterIntersectingRef = useRef(false)

  const cleanPhone = (phone || '').replace(/\D/g, '')
  // Se não houver telefone válido informado ou for placeholder, link seguro
  const isSuspicious = /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const whatsappUrl =
    cleanPhone && !isSuspicious
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : '#contato'

  // 1. Detecção do rodapé via IntersectionObserver + cálculo de offset para não sobrepor
  useEffect(() => {
    const footerEl =
      document.querySelector(targetFooterSelector) || document.querySelector('footer')
    if (!footerEl) return

    const updateOffset = () => {
      const footerRect = footerEl.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Se o topo do footer estiver dentro da viewport (ou acima da borda inferior)
      if (footerRect.top < windowHeight) {
        const overlapDistance = windowHeight - footerRect.top
        // 24px de margem padrão + sobreposição da altura visível do footer
        const newOffset = Math.max(24, overlapDistance + 20)
        setBottomOffset(newOffset)
      } else {
        setBottomOffset(24)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isFooterIntersectingRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          updateOffset()
        } else {
          setBottomOffset(24)
        }
      },
      {
        root: null,
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    )

    observer.observe(footerEl)

    // Acompanhar o scroll contínuo enquanto o footer estiver visível
    const handleScroll = () => {
      if (isFooterIntersectingRef.current) {
        updateOffset()
      }
    }

    const handleResize = () => {
      if (isFooterIntersectingRef.current) {
        updateOffset()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [targetFooterSelector])

  // 2. Controle de exibição do tooltip:
  // - Apenas 1 vez por sessão (sessionStorage)
  // - Apenas no mobile (evita no desktop para não haver hover cobrindo conteúdo/botão)
  // - Desaparece automaticamente após 6 segundos ou ao clicar
  useEffect(() => {
    if (!isMobile) {
      setShowTooltip(false)
      return
    }

    try {
      const alreadyShown = sessionStorage.getItem(SESSION_TOOLTIP_KEY)
      if (!alreadyShown) {
        sessionStorage.setItem(SESSION_TOOLTIP_KEY, '1')
        // Pequeno atraso para entrada suave na tela inicial
        const showTimer = setTimeout(() => {
          setShowTooltip(true)
        }, 1500)

        // Some sozinho após 6 segundos
        const hideTimer = setTimeout(() => {
          setShowTooltip(false)
        }, 7500)

        return () => {
          clearTimeout(showTimer)
          clearTimeout(hideTimer)
        }
      }
    } catch {
      // Fallback gracioso se sessionStorage não estiver disponível
    }
  }, [isMobile])

  return (
    <aside
      aria-label="Atendimento pelo WhatsApp"
      className="fixed right-6 z-50 flex items-center transition-[bottom] duration-200 ease-out pointer-events-none motion-reduce:transition-none"
      style={{ bottom: `${bottomOffset}px` }}
    >
      {/* Tooltip exibido apenas 1x na sessão (apenas mobile, nunca interceptando clique) */}
      {showTooltip && (
        <span
          className="pointer-events-none select-none mr-2.5 px-3 py-1.5 text-xs font-medium text-warm-800 bg-white/95 backdrop-blur shadow-lg rounded-full border border-warm-200 animate-fade-in-up whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          Converse comigo pelo WhatsApp
        </span>
      )}

      <a
        href={whatsappUrl}
        target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
        rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-label="Conversar no WhatsApp"
        onClick={() => setShowTooltip(false)}
        className="pointer-events-auto relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all transform hover:scale-105 active:scale-95 animate-pulse-subtle focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 motion-reduce:animate-none motion-reduce:transform-none"
      >
        <MessageCircle className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
      </a>
    </aside>
  )
}
