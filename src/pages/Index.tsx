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
import type { BlogPostRecord, DocumentRecord } from '@/types/content'

export default function Index() {
  const [contentMap, setContentMap] = useState<Record<string, any>>({})
  const [mediaMap, setMediaMap] = useState<Record<string, string>>({})
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [contentData, mediaData, postsData, docsData] = await Promise.all([
        fetchSiteContent(),
        fetchSiteMedia(),
        fetchBlogPosts(true),
        fetchDocuments(),
      ])
      setContentMap(contentData)
      setMediaMap(mediaData)
      setBlogPosts(postsData)
      setDocuments(docsData)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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

  const heroPhoto = mediaMap['hero_foto']
  const sobrePhoto = mediaMap['sobre_foto']
  const logoUrl = mediaMap['logo']
  const whatsappPhone = contatoContent?.whatsapp || '5511999998888'
  const whatsappMessage = contatoContent?.whatsapp_message

  return (
    <div className="min-h-screen bg-warm-50 text-warm-700 selection:bg-sage-200 selection:text-sage-900">
      {/* Header com Navegação e Âncoras */}
      <Header whatsappPhone={whatsappPhone} whatsappMessage={whatsappMessage} logoUrl={logoUrl} />

      <main>
        {/* 1. Hero */}
        <Hero
          content={heroContent}
          photoUrl={heroPhoto}
          whatsappPhone={whatsappPhone}
          whatsappMessage={whatsappMessage}
        />

        {/* 2. Sobre Mim */}
        <Sobre content={sobreContent} photoUrl={sobrePhoto} />

        {/* 3. Psicoterapia */}
        <Psicoterapia content={psicoterapiaContent} />

        {/* 4. Orientação Parental (Destaque Principal) */}
        <OrientacaoParental
          content={orientacaoContent}
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
