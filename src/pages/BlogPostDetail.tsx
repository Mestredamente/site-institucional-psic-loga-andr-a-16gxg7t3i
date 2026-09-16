import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  User,
  Video,
  BookOpen,
  MessageCircle,
  Share2,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import SmartImage from '@/components/ui/SmartImage'
import { fetchBlogPostById, fetchSiteContent, fetchBlogPosts, getFileUrl } from '@/services/content'
import type { BlogPostRecord } from '@/types/content'
import { toast } from '@/hooks/use-toast'
import { updateMetaTags } from '@/lib/seo'

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPostRecord | null>(null)
  const [recentPosts, setRecentPosts] = useState<BlogPostRecord[]>([])
  const [whatsappPhone, setWhatsappPhone] = useState<string>('')
  const [whatsappMessage, setWhatsappMessage] = useState<string>(
    'Olá, Andréa! Li seu artigo e gostaria de conversar sobre atendimento.',
  )
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  useEffect(() => {
    let isCancelled = false

    const loadData = async () => {
      if (!id) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setNotFound(false)

      try {
        const [postData, contentData, allPosts] = await Promise.allSettled([
          fetchBlogPostById(id),
          fetchSiteContent(),
          fetchBlogPosts(true),
        ])

        if (isCancelled) return

        if (postData.status === 'fulfilled' && postData.value) {
          const currentPost = postData.value
          setPost(currentPost)

          // Extrai o resumo ou fallback dos primeiros 160 caracteres do corpo
          const postResumo =
            (currentPost.resumo && currentPost.resumo.trim()) ||
            (currentPost.content || '')
              .replace(/<[^>]+>/g, '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 160) ||
            'Artigo informativo sobre psicologia clínica e neuropsicologia por Andréa Armôa.'

          const postMedia = currentPost.media_file
            ? getFileUrl(currentPost, currentPost.media_file)
            : currentPost.media_url || undefined

          // Metatags dinâmicas, Open Graph e Twitter Card específicos do artigo
          updateMetaTags({
            title: `${currentPost.title} | Andréa Armôa`,
            description: postResumo,
            ogImageUrl: postMedia,
            ogType: 'article',
            siteName: 'Andréa Armôa | Psicologia Clínica e Neuropsicologia',
          })

          // Injetar JSON-LD específico do Artigo / BlogPosting
          try {
            const scriptId = 'jsonld-blog-post'
            let script = document.getElementById(scriptId) as HTMLScriptElement | null
            if (!script) {
              script = document.createElement('script')
              script.id = scriptId
              script.type = 'application/ld+json'
              document.head.appendChild(script)
            }
            const postUrl =
              typeof window !== 'undefined'
                ? window.location.href
                : `https://andreaarmoa.com.br/blog/${currentPost.id}`
            const articleSchema = {
              '@context': 'https://schema.org',
              '@type': currentPost.type === 'vlog' ? 'VideoObject' : 'BlogPosting',
              headline: currentPost.title,
              description: postResumo,
              url: postUrl,
              datePublished: currentPost.created,
              dateModified: currentPost.updated || currentPost.created,
              author: {
                '@type': 'Person',
                name: 'Andréa dos Santos Silva Armôa',
                jobTitle: 'Psicóloga Clínica & Neuropsicóloga',
                identifier: 'CRP 14/075954',
              },
              publisher: {
                '@type': 'Person',
                name: 'Andréa dos Santos Silva Armôa',
              },
              image: postMedia || undefined,
            }
            script.textContent = JSON.stringify(articleSchema, null, 2)
          } catch (e) {
            console.warn('Erro ao atualizar JSON-LD do artigo:', e)
          }
        } else {
          setNotFound(true)
          document.title = 'Artigo Não Encontrado (404) | Andréa Armôa'
        }

        if (contentData.status === 'fulfilled' && contentData.value?.['contato']) {
          const contato = contentData.value['contato']
          if (contato.whatsapp) {
            setWhatsappPhone(contato.whatsapp)
          }
          if (contato.whatsapp_message) {
            setWhatsappMessage(contato.whatsapp_message)
          }
        }

        if (allPosts.status === 'fulfilled' && Array.isArray(allPosts.value)) {
          // Filtrar o post atual e pegar os 3 mais recentes
          const others = allPosts.value.filter((p) => p.id !== id).slice(0, 3)
          setRecentPosts(others)
        }
      } catch (err) {
        console.error('Erro ao carregar artigo:', err)
        if (!isCancelled) {
          setNotFound(true)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isCancelled = true
    }
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Artigo de Psicologia • Andréa Armôa',
          url,
        })
        return
      } catch {
        /* fallback para cópia */
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      toast({
        title: 'Link copiado!',
        description: 'O link do artigo foi copiado para sua área de transferência.',
      })
      setTimeout(() => setCopiedLink(false), 2500)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Não foi possível copiar o link',
      })
    }
  }

  const cleanPhone = (whatsappPhone || '').replace(/\D/g, '')
  const isSuspicious = /^5{0,2}1{0,2}9{4,}/.test(cleanPhone) || cleanPhone.length < 10
  const whatsappUrl =
    cleanPhone && !isSuspicious
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          post
            ? `Olá, Andréa! Li seu artigo "${post.title}" e gostaria de mais informações sobre agendamento.`
            : whatsappMessage,
        )}`
      : '/#contato'

  // Estado 404: post não encontrado
  if (!loading && notFound) {
    return (
      <div className="min-h-screen bg-warm-50 text-warm-700 flex flex-col justify-between selection:bg-sage-200 selection:text-sage-900">
        <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-warm-200/60 bg-white/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-sage-400 rounded-lg"
              aria-label="Voltar para a página inicial"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-800">
                Andréa Armôa
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
              <span className="text-xs uppercase tracking-wider text-warm-500 font-medium hidden sm:inline-block">
                CRP 14/075954
              </span>
            </Link>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-warm-300 text-xs"
            >
              <Link to="/">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
                Página Inicial
              </Link>
            </Button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto text-amber-800 shadow-sm">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Artigo Não Encontrado
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight">
              A publicação solicitada não existe ou foi removida.
            </h1>
            <p className="text-base text-warm-600 font-normal leading-relaxed max-w-lg mx-auto">
              O artigo que você tentou acessar pode ter sido arquivado pela profissional ou o link
              está incompleto.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-sage-300 hover:bg-sage-400 text-sage-800 font-medium px-8 py-6 rounded-full shadow-sm text-base focus:ring-2 focus:ring-sage-500"
            >
              <Link to="/#blog">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Outros Artigos
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-warm-300 text-warm-700 hover:bg-warm-100 rounded-full text-base"
            >
              <Link to="/">Página Inicial</Link>
            </Button>
          </div>
        </main>

        <footer className="py-6 border-t border-warm-200 text-center text-xs text-warm-500">
          <p>© {new Date().getFullYear()} Andréa dos Santos Silva Armôa • CRP 14/075954</p>
        </footer>
      </div>
    )
  }

  const mediaUrl = post?.media_file ? getFileUrl(post, post.media_file) : post?.media_url || null

  return (
    <div className="min-h-screen bg-warm-50 text-warm-700 flex flex-col justify-between selection:bg-sage-200 selection:text-sage-900">
      {/* Header institucional simplificado e elegante */}
      <header className="sticky top-0 z-30 py-4 px-4 sm:px-6 lg:px-8 border-b border-warm-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-warm-700 hover:text-warm-900 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg px-2 py-1 -ml-2"
            aria-label="Voltar para a lista de artigos no blog"
          >
            <ArrowLeft className="w-4 h-4 text-sage-600" />
            <span>Voltar aos Conteúdos</span>
          </Link>

          <Link to="/" className="flex items-center gap-2 group text-center">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-warm-800">
              Andréa Armôa
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96A]" />
            <span className="text-[11px] uppercase tracking-wider text-warm-500 font-medium hidden sm:inline-block">
              CRP 14/075954
            </span>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            aria-label="Compartilhar este artigo"
            className="rounded-full border-warm-300 text-xs text-warm-700 hover:bg-warm-100 flex items-center gap-1.5"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-sage-700" />
                <span className="hidden sm:inline">Compartilhar</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Conteúdo do Artigo */}
      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb / Metadados superiores */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sage-100 text-sage-800 border border-sage-200">
                {post?.type === 'vlog' ? (
                  <>
                    <Video className="w-3.5 h-3.5" />
                    Vlog / Vídeo
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    Artigo
                  </>
                )}
              </span>

              <span className="text-warm-400">•</span>

              <div className="flex items-center gap-1 text-warm-500">
                <Calendar className="w-3.5 h-3.5 text-warm-400" />
                {loading ? (
                  <span className="w-20 h-3 bg-warm-200 animate-pulse rounded" />
                ) : (
                  <span>
                    {post
                      ? new Date(post.created).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                )}
              </div>

              <span className="text-warm-400">•</span>

              <div className="flex items-center gap-1 text-warm-500">
                <Clock className="w-3.5 h-3.5 text-warm-400" />
                <span>Leitura rápida</span>
              </div>
            </div>

            {/* Título Principal em Cormorant Garamond */}
            {loading ? (
              <div className="space-y-3 pt-2">
                <div className="w-full h-10 bg-warm-200 animate-pulse rounded-xl" />
                <div className="w-3/4 h-10 bg-warm-200 animate-pulse rounded-xl" />
              </div>
            ) : (
              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-800 tracking-tight leading-tight">
                  {post?.title}
                </h1>
                {post?.resumo && (
                  <p className="text-base sm:text-lg text-warm-600 font-medium leading-relaxed italic border-l-2 border-sage-300 pl-4 py-0.5">
                    {post.resumo}
                  </p>
                )}
              </div>
            )}

            {/* Assinatura da profissional */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 pb-2 border-b border-warm-200/80">
              <div className="w-10 h-10 rounded-full bg-sage-200 text-sage-800 flex items-center justify-center font-bold text-sm shrink-0 border border-sage-300">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-warm-800 leading-none">
                  Andréa dos Santos Silva Armôa
                </p>
                <p className="text-xs text-warm-500 mt-1">
                  Psicóloga Clínica & Neuropsicóloga • CRP 14/075954
                </p>
              </div>
            </div>
          </div>

          {/* Capa com SmartImage (Skeleton + Fade-in suave) ou Player de Vídeo */}
          {loading ? (
            <div className="aspect-[16/9] w-full rounded-3xl bg-warm-200/70 animate-pulse" />
          ) : post?.type === 'vlog' && post?.media_url ? (
            <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-warm-900 border border-warm-200 shadow-md">
              <iframe
                src={post.media_url.replace('watch?v=', 'embed/')}
                title={post.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : mediaUrl ? (
            <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-warm-200 border border-warm-200/80 shadow-md relative">
              <SmartImage
                src={mediaUrl}
                alt={post?.title || 'Capa da publicação'}
                width={1280}
                height={720}
                priority={true}
                fetchPriority="high"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          {/* Corpo do Artigo em Inter legível */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-warm-200/80 shadow-xs">
            {loading ? (
              <div className="space-y-4">
                <div className="w-full h-4 bg-warm-100 animate-pulse rounded" />
                <div className="w-full h-4 bg-warm-100 animate-pulse rounded" />
                <div className="w-5/6 h-4 bg-warm-100 animate-pulse rounded" />
                <div className="w-full h-4 bg-warm-100 animate-pulse rounded pt-4" />
                <div className="w-4/5 h-4 bg-warm-100 animate-pulse rounded" />
              </div>
            ) : post?.content ? (
              <div
                className="prose prose-stone max-w-none text-warm-700 text-base sm:text-lg leading-relaxed sm:leading-8 font-normal space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-warm-500 italic">Sem conteúdo disponível para esta publicação.</p>
            )}

            {/* Aviso Ético LGPD e CFP */}
            <div className="mt-12 pt-6 border-t border-warm-200 text-xs text-warm-500 leading-relaxed space-y-1 bg-warm-50/50 p-4 rounded-2xl">
              <p className="font-semibold text-warm-700">Nota Informativa & Ética Profissional:</p>
              <p>
                Os textos e conteúdos deste blog têm finalidade estritamente psicoeducativa e
                reflexiva, em conformidade com as diretrizes do Conselho Federal de Psicologia
                (CFP). Eles não substituem uma avaliação, diagnóstico ou processo de psicoterapia
                clínica individualizado.
              </p>
            </div>
          </div>

          {/* Chamada para Ação / Botão WhatsApp ao final */}
          <section
            aria-labelledby="cta-artigo-title"
            className="rounded-3xl bg-gradient-to-br from-sage-100 via-warm-100 to-sage-50 border border-sage-200/80 p-6 sm:p-10 text-center space-y-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center mx-auto text-sage-700 border border-sage-200">
              <Sparkles className="w-6 h-6 text-sage-600" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2
                id="cta-artigo-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-warm-800"
              >
                Identificou-se com o tema?
              </h2>
              <p className="text-sm text-warm-600 leading-relaxed">
                Estou à disposição para acolher suas dúvidas e conversar sobre atendimentos em
                psicoterapia individual ou orientação parental.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-8 py-6 rounded-full shadow-md text-base focus:ring-4 focus:ring-[#25D366]/40 transition-all hover:scale-105 active:scale-95 motion-reduce:transform-none"
              >
                <a
                  href={whatsappUrl}
                  target={whatsappUrl.startsWith('http') ? '_blank' : undefined}
                  rel={whatsappUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label="Agendar atendimento com Andréa Armôa pelo WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Conversar pelo WhatsApp
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-warm-300 text-warm-700 hover:bg-white rounded-full text-base"
              >
                <Link to="/#contato">Ver Outras Formas de Contato</Link>
              </Button>
            </div>
          </section>

          {/* Outros Artigos Recentes (se houver) */}
          {recentPosts.length > 0 && (
            <div className="pt-8 space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm-800">
                Continue a Leitura
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPosts.map((other) => (
                  <Link
                    key={other.id}
                    to={`/blog/${other.id}`}
                    className="p-5 rounded-2xl bg-white border border-warm-200 hover:border-sage-400 hover:shadow-sm transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-sage-400"
                    aria-label={`Ler artigo: ${other.title}`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
                        {other.type === 'vlog' ? 'Vlog' : 'Artigo'}
                      </span>
                      <h4 className="font-serif text-base font-bold text-warm-800 group-hover:text-warm-900 line-clamp-2 leading-snug">
                        {other.title}
                      </h4>
                    </div>
                    <span className="text-xs text-sage-700 font-semibold mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform motion-reduce:transform-none">
                      Ler completo →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer simples e acolhedor */}
      <footer className="py-8 border-t border-warm-200 bg-white/60 text-xs text-warm-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-warm-700">
              Andréa dos Santos Silva Armôa • CRP 14/075954
            </p>
            <p className="text-[11px] text-warm-400">
              Psicóloga Clínica e Neuropsicóloga • Atendimento Presencial & Online
            </p>
          </div>
          <div className="flex items-center gap-4 text-warm-600">
            <Link to="/" className="hover:text-warm-900 underline-offset-4 hover:underline">
              Início
            </Link>
            <Link
              to="/politica-de-privacidade"
              className="hover:text-warm-900 underline-offset-4 hover:underline"
            >
              Privacidade
            </Link>
            <Link
              to="/aviso-de-cookies"
              className="hover:text-warm-900 underline-offset-4 hover:underline"
            >
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
