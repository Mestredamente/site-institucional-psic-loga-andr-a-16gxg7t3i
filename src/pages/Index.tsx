import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Sobre from '@/components/landing/Sobre'
import Psicoterapia from '@/components/landing/Psicoterapia'
import OrientacaoParental from '@/components/landing/OrientacaoParental'
import ParaQuem from '@/components/landing/ParaQuem'
import Beneficios from '@/components/landing/Beneficios'
import ComoFunciona from '@/components/landing/ComoFunciona'
import Faq from '@/components/landing/Faq'
import Contato from '@/components/landing/Contato'
import BlogSection from '@/components/landing/BlogSection'
import DocumentsSection from '@/components/landing/DocumentsSection'
import Footer from '@/components/landing/Footer'
import WhatsAppButton from '@/components/landing/WhatsAppButton'

import {
  fetchSiteContent,
  fetchSiteMedia,
  fetchBlogPosts,
  fetchDocuments,
} from '@/services/content'
import { useRealtime } from '@/hooks/use-realtime'
import { applyAccentColor, applyFavicon } from '@/lib/theme'
import type { BlogPostRecord, DocumentRecord } from '@/types/content'

export default function Index() {
  const [contentMap, setContentMap] = useState<Record<string, any>>({})
  // mediaMap inicia como null para representar busca em andamento e evitar qualquer FOUC
  const [mediaMap, setMediaMap] = useState<Record<string, string> | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [loadingMedia, setLoadingMedia] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoadingMedia(true)
      const [contentData, mediaData, postsData, docsData] = await Promise.all([
        fetchSiteContent(),
        fetchSiteMedia(),
        fetchBlogPosts(true),
        fetchDocuments(),
      ])
      setContentMap(contentData)
      setMediaMap(mediaData || {})
      setBlogPosts(postsData)
      setDocuments(docsData)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setMediaMap({})
    } finally {
      setLoadingMedia(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Aplicar cor de destaque global e favicon
  useEffect(() => {
    const siteConfig = contentMap['site_config']
    if (siteConfig?.accent_color) {
      applyAccentColor(siteConfig.accent_color)
    }
    if (mediaMap && mediaMap['favicon']) {
      applyFavicon(mediaMap['favicon'])
    }
  }, [contentMap, mediaMap])

  // Aplicar SEO, Metatags, Canonical, Open Graph e Schema.org JSON-LD
  useEffect(() => {
    const siteConfig = contentMap['site_config'] || {}
    const hero = contentMap['hero'] || {}
    const contato = contentMap['contato'] || {}

    // 1. OG Image Selection
    let ogImageUrl = '/og-default.svg'
    const chosenKey = siteConfig.og_image_key || 'hero_foto'
    if (siteConfig.og_image_custom_url) {
      ogImageUrl = siteConfig.og_image_custom_url
    } else if (mediaMap && mediaMap[chosenKey]) {
      ogImageUrl = mediaMap[chosenKey]
    } else if (mediaMap && mediaMap['hero_foto']) {
      ogImageUrl = mediaMap['hero_foto']
    }

    const pageTitle = siteConfig.site_title || 'Andréa Armôa | Psicóloga Clínica e Neuropsicóloga'
    const pageDesc =
      siteConfig.site_description ||
      'Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento presencial e online em psicoterapia e orientação parental.'

    import('@/lib/seo').then(({ updateMetaTags, updateJsonLd }) => {
      updateMetaTags({
        title: pageTitle.length > 60 ? pageTitle.slice(0, 60) : pageTitle,
        description: pageDesc.length > 155 ? pageDesc.slice(0, 155) : pageDesc,
        canonicalUrl: siteConfig.canonical_url || 'https://andreaarmoa.com.br/',
        ogImageUrl,
        ogType: 'website',
        siteName: 'Andréa Armôa | Psicologia Clínica & Neuropsicologia',
        locale: 'pt_BR',
      })

      // Injetar JSON-LD Psychologist apenas com dados confirmados
      const cleanPhone = (contato.whatsapp || '').replace(/\D/g, '')
      const telephone = cleanPhone ? `+${cleanPhone}` : undefined
      const email = contato.email && contato.email.includes('@') ? contato.email : undefined
      const instagramUrl =
        contato.instagram_url ||
        (contato.instagram
          ? `https://instagram.com/${contato.instagram.replace('@', '')}`
          : undefined)

      updateJsonLd({
        name: 'Andréa dos Santos Silva Armôa',
        legalName: 'Andréa dos Santos Silva Armôa',
        crp: hero.crp || 'CRP 14/075954',
        jobTitle: 'Psicóloga Clínica e Neuropsicóloga',
        description: pageDesc,
        url: siteConfig.canonical_url || 'https://andreaarmoa.com.br/',
        imageUrl: ogImageUrl,
        telephone,
        email,
        instagramUrl,
        address: contato.address
          ? {
              streetAddress: contato.address,
            }
          : undefined,
        areaServed: siteConfig.area_served || 'Atendimento online nacional e presencial',
        availableServices: [
          'Psicoterapia Clínica Individual (Adultos, Adolescentes e Crianças)',
          'Orientação Parental',
          'Avaliação Neuropsicológica',
        ],
      })
    })
  }, [contentMap, mediaMap])

  // Subscrições realtime para atualizar a landing page imediatamente após edições no admin
  useRealtime('site_content', () => {
    fetchSiteContent().then((data) => setContentMap(data))
  })

  useRealtime('site_media', () => {
    fetchSiteMedia().then((data) => setMediaMap(data))
  })

  useRealtime('blog_posts', () => {
    fetchBlogPosts(true).then((data) => setBlogPosts(data))
  })

  useRealtime('documents', () => {
    fetchDocuments().then((data) => setDocuments(data))
  })

  const heroContent = contentMap['hero']
  const sobreContent = contentMap['sobre']
  const psicoterapiaContent = contentMap['psicoterapia']
  const orientacaoContent = contentMap['orientacao_parental']
  const paraQuemContent = contentMap['para_quem']
  const beneficiosContent = contentMap['beneficios']
  const comoFuncionaContent = contentMap['como_funciona']
  const faqContent = contentMap['faq']
  const contatoContent = contentMap['contato']

  const heroPhoto = mediaMap ? mediaMap['hero_foto'] || null : undefined
  const sobrePhoto = mediaMap ? mediaMap['sobre_foto'] || null : undefined
  const orientacaoPhoto = mediaMap ? mediaMap['orientacao_foto'] || null : undefined
  const logoUrl = mediaMap ? mediaMap['logo'] || null : undefined

  const whatsappPhone = contatoContent?.whatsapp || ''
  const whatsappMessage = contatoContent?.whatsapp_message

  return (
    <div className="min-h-screen bg-warm-50 text-warm-700 selection:bg-sage-200 selection:text-sage-900">
      {/* Header com Navegação e Âncoras */}
      <Header
        whatsappPhone={whatsappPhone}
        whatsappMessage={whatsappMessage}
        logoUrl={logoUrl}
        isLoadingMedia={loadingMedia}
      />

      <main>
        {/* 1. Hero */}
        <Hero
          content={heroContent}
          photoUrl={heroPhoto}
          isLoadingMedia={loadingMedia}
          whatsappPhone={whatsappPhone}
          whatsappMessage={whatsappMessage}
        />

        {/* 2. Sobre Mim */}
        <Sobre content={sobreContent} photoUrl={sobrePhoto} isLoadingMedia={loadingMedia} />

        {/* 3. Psicoterapia */}
        <Psicoterapia content={psicoterapiaContent} />

        {/* 4. Orientação Parental (Destaque Principal) */}
        <OrientacaoParental
          content={orientacaoContent}
          photoUrl={orientacaoPhoto}
          isLoadingMedia={loadingMedia}
          whatsappPhone={whatsappPhone}
          whatsappMessage={whatsappMessage}
        />

        {/* 5. Para Quem São os Atendimentos */}
        <ParaQuem content={paraQuemContent} />

        {/* 6. Principais Benefícios */}
        <Beneficios content={beneficiosContent} />

        {/* 7. Como Funciona (Modalidades) */}
        <ComoFunciona content={comoFuncionaContent} />

        {/* Blog / Conteúdos (se houver posts publicados) */}
        <BlogSection posts={blogPosts} />

        {/* Documentos informativos (se houver) */}
        <DocumentsSection documents={documents} />

        {/* 8. Perguntas Frequentes (FAQ) */}
        <Faq content={faqContent} />

        {/* 9. Contato e Localização */}
        <Contato content={contatoContent} />
      </main>

      {/* 10. Rodapé com Aviso Ético e Acesso Restrito */}
      <Footer crp={heroContent?.crp || 'CRP 14/075954'} />

      {/* 11. Botão Flutuante de WhatsApp Fixo */}
      <WhatsAppButton phone={whatsappPhone} message={whatsappMessage} />
    </div>
  )
}
