import { BookOpen, Video, Calendar, ArrowRight } from 'lucide-react'
import type { BlogPostRecord } from '@/types/content'
import { getFileUrl } from '@/services/content'
import SmartImage from '@/components/ui/SmartImage'

interface BlogSectionProps {
  posts: BlogPostRecord[]
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="py-20 lg:py-28 bg-white border-t border-warm-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Artigos & Reflexões
          </span>
          <h2
            id="blog-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight"
          >
            Conteúdos da Profissional
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            Leituras e orientações sobre saúde mental, neuropsicologia e convivência familiar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const mediaUrl = post.media_file
              ? getFileUrl(post, post.media_file)
              : post.media_url || null

            return (
              <article
                key={post.id}
                className="bg-warm-50/60 rounded-3xl overflow-hidden border border-warm-200 hover:border-sage-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {mediaUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-warm-200 relative">
                      {post.type === 'vlog' ? (
                        <div className="w-full h-full flex items-center justify-center bg-warm-800 text-white">
                          <Video className="w-12 h-12 text-sage-300 opacity-80" />
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-warm-700 flex items-center gap-1.5 shadow-xs z-10">
                            <Video className="w-3.5 h-3.5 text-sage-600" />
                            Vlog
                          </span>
                        </div>
                      ) : (
                        <SmartImage
                          src={mediaUrl}
                          alt={post.title}
                          width={640}
                          height={360}
                          priority={false}
                          fetchPriority="low"
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                        >
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-warm-700 flex items-center gap-1.5 shadow-xs z-10">
                            <BookOpen className="w-3.5 h-3.5 text-sage-600" />
                            Blog
                          </span>
                        </SmartImage>
                      )}
                    </div>
                  )}

                  <div className="p-6 sm:p-7 space-y-3">
                    {!mediaUrl && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sage-100 text-sage-800">
                        {post.type === 'vlog' ? 'Vlog' : 'Artigo'}
                      </span>
                    )}

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-warm-700 leading-snug hover:text-warm-900">
                      {post.title}
                    </h3>

                    {/* Conteúdo HTML sutil */}
                    <div
                      className="text-xs sm:text-sm text-warm-600 leading-relaxed font-normal line-clamp-4 prose prose-stone"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between text-xs text-warm-400 border-t border-warm-100/60 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-warm-400" />
                    <span>{new Date(post.created).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="font-medium text-sage-700">Andréa Armôa</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
