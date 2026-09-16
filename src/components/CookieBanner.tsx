import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'andrea_armoa_cookie_consent'

export type CookieConsentChoice = 'accepted' | 'essential_only' | null

export default function CookieBanner() {
  const [consent, setConsent] = useState<CookieConsentChoice>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (!stored) {
        // Exibir banner após 800ms para suavidade
        const timer = setTimeout(() => setIsVisible(true), 800)
        return () => clearTimeout(timer)
      } else {
        setConsent(stored as CookieConsentChoice)
        if (stored === 'accepted') {
          dispatchAnalyticsConsent(true)
        }
      }
    } catch {
      // Ignora erro de localStorage desabilitado em modo anônimo extremo
    }
  }, [])

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    } catch {
      /* intentionally ignored */
    }
    setConsent('accepted')
    setIsVisible(false)
    dispatchAnalyticsConsent(true)
  }

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential_only')
    } catch {
      /* intentionally ignored */
    }
    setConsent('essential_only')
    setIsVisible(false)
    dispatchAnalyticsConsent(false)
  }

  /**
   * Dispara evento para integração com pixels futuros (ex: Google Analytics, Meta Pixel).
   * Enquanto não houver scripts terceiros instalados, serve de barreira e conformidade total com a LGPD.
   */
  const dispatchAnalyticsConsent = (granted: boolean) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie_consent_update', {
          detail: { analytics: granted, marketing: granted, essential: true },
        }),
      )
    }
  }

  if (!isVisible || consent !== null) {
    return null
  }

  return (
    <aside
      role="region"
      aria-label="Consentimento de Cookies e Privacidade LGPD"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-fade-in-up"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-warm-200 shadow-xl space-y-3.5 text-warm-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sage-100 border border-sage-200 flex items-center justify-center shrink-0 text-sage-800">
              <Cookie className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="font-serif font-bold text-base text-warm-800">
              Sua Privacidade e Cookies (LGPD)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleEssentialOnly}
            aria-label="Fechar aviso de cookies e manter apenas essenciais"
            className="text-warm-400 hover:text-warm-700 transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-warm-600 leading-relaxed font-normal">
          Utilizamos cookies essenciais para garantir o funcionamento seguro deste site
          institucional. Nenhum dado clínico ou prontuário é coletado. Scripts analíticos de
          terceiros só são carregados com seu consentimento expresso. Consulte nossa{' '}
          <Link
            to="/politica-de-privacidade"
            className="text-sage-800 font-medium underline underline-offset-2 hover:text-sage-900"
          >
            Política de Privacidade
          </Link>{' '}
          e{' '}
          <Link
            to="/aviso-de-cookies"
            className="text-sage-800 font-medium underline underline-offset-2 hover:text-sage-900"
          >
            Aviso de Cookies
          </Link>
          .
        </p>

        <div className="flex items-center gap-2 pt-1 text-[11px] text-warm-500">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600 shrink-0" aria-hidden="true" />
          <span>Atuação ética em conformidade com o CFP e a LGPD (Lei 13.709/2018).</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={handleAcceptAll}
            className="w-full sm:w-auto flex-1 bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium rounded-xl text-xs py-2 shadow-xs focus-visible:ring-2 focus-visible:ring-sage-600"
          >
            Aceitar Todos
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleEssentialOnly}
            className="w-full sm:w-auto border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl text-xs py-2"
          >
            Apenas Essenciais
          </Button>
        </div>
      </div>
    </aside>
  )
}
