import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  whatsappPhone?: string
  whatsappMessage?: string
  logoUrl?: string | null
  isLoadingMedia?: boolean
}

export default function Header({
  whatsappPhone = '',
  whatsappMessage = '',
  logoUrl,
  isLoadingMedia = false,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  useEffect(() => {
    setLogoLoaded(false)
  }, [logoUrl])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Sobre Mim', href: '#sobre' },
    { label: 'Psicoterapia', href: '#psicoterapia' },
    { label: 'Orientação Parental', href: '#orientacao-parental' },
    { label: 'Para Quem', href: '#para-quem' },
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contato' },
  ]

  const cleanPhone = (whatsappPhone || '').replace(/\D/g, '')
  const isSuspicious = /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const hasValidPhone = Boolean(cleanPhone && !isSuspicious)
  const whatsappUrl = hasValidPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        whatsappMessage || 'Olá, Andréa! Gostaria de agendar um atendimento.',
      )}`
    : '#contato'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-warm-50/90 backdrop-blur-md shadow-sm border-b border-warm-200/60 py-3'
          : 'bg-warm-50/60 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Nome */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          {isLoadingMedia ? (
            /* Skeleton neutro para evitar salto durante o carregamento inicial */
            <div className="h-10 w-44 rounded-lg bg-warm-200/60 animate-pulse" />
          ) : logoUrl ? (
            <div className="relative h-10 flex items-center">
              {!logoLoaded && (
                <div className="absolute inset-0 w-24 h-10 rounded bg-warm-200/50 animate-pulse" />
              )}
              <img
                src={logoUrl}
                alt="Andréa Armôa"
                onLoad={() => setLogoLoaded(true)}
                className={`h-10 w-auto object-contain transition-opacity duration-300 ${
                  logoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          ) : (
            /* Monograma / Tipografia Padrão quando confirmado que não há logo salvo */
            <div className="flex flex-col animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-800 group-hover:text-warm-900 transition-colors">
                  Andréa Armôa
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-warm-500 font-medium">
                Psicóloga & Neuropsicóloga • CRP 14/075954
              </span>
            </div>
          )}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sage-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium px-5 py-2 rounded-full shadow-sm hover:shadow transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-sage-500"
          >
            <a
              href={whatsappUrl}
              target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
              rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label="Agendar atendimento com a psicóloga Andréa Armôa"
            >
              Agendar Atendimento
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </Button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="text-warm-700 hover:bg-warm-100 focus:ring-2 focus:ring-sage-500"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-warm-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-warm-50 shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-warm-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-warm-200">
                <span className="font-serif text-lg font-bold text-warm-700">Andréa Armôa</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu de navegação"
                >
                  <X className="w-5 h-5 text-warm-700" />
                </Button>
              </div>

              <nav className="mt-6 flex flex-col gap-3" aria-label="Navegação móvel">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-base font-medium text-warm-700 hover:bg-warm-100 rounded-lg transition-colors focus:ring-2 focus:ring-sage-500"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-warm-200">
              <Button
                asChild
                className="w-full bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium py-3 rounded-xl shadow-sm"
              >
                <a
                  href={whatsappUrl}
                  target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
                  rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Agendar atendimento com Andréa Armôa"
                >
                  Agendar Atendimento
                </a>
              </Button>
              <p className="mt-3 text-center text-xs text-warm-500">
                CRP 14/075954 • Atendimento Presencial &amp; Online
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
