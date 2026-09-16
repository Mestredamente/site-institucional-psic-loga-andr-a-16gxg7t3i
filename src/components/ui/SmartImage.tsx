import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface SmartImageProps {
  /**
   * URL da imagem (se undefined, indica que a busca inicial ainda está em andamento).
   * Se string preenchida, é a foto real salva no backend.
   * Se null ou string vazia (quando isLoaded/ready for true), indica ausência de imagem customizada.
   */
  src?: string | null

  /**
   * URL do mock/padrão que SÓ deve ser exibida após concluir a busca e confirmar que não há imagem real.
   */
  fallbackSrc?: string

  /**
   * Texto alternativo acessível da imagem.
   */
  alt: string

  /**
   * Se true, indica que a busca no backend ainda está em andamento.
   * Se omitido, é inferido como true quando `src === undefined`.
   */
  isLoading?: boolean

  /**
   * Classes extras para o elemento <img>
   */
  className?: string

  /**
   * Classes extras para o container wrapper (com aspect-ratio fixo)
   */
  containerClassName?: string

  /**
   * Classes para o skeleton shimmer de placeholder
   */
  skeletonClassName?: string

  /**
   * Conteúdo renderizado por cima ou dentro do container (ex: gradientes, selos, overlays)
   */
  children?: React.ReactNode

  /**
   * Fallback visual customizado quando não há imagem nem fallbackSrc (ex: monograma)
   */
  emptyFallback?: React.ReactNode

  /**
   * Atributo loading da tag img ('lazy' ou 'eager')
   */
  priority?: boolean

  /**
   * Atributo fetchpriority para LCP
   */
  fetchPriority?: 'high' | 'low' | 'auto'

  /**
   * Dimensões explícitas para evitar Layout Shift (CLS)
   */
  width?: number | string
  height?: number | string

  /**
   * Callback quando a imagem termina de decodificar / carregar
   */
  onLoad?: () => void
}

/**
 * Componente SmartImage:
 * Elimina FOUC (flash de imagem mock) garantindo:
 * 1. Enquanto carrega (loading: true ou src === undefined): renderiza apenas Skeleton neutro com aspect-ratio fixo.
 * 2. Quando há imagem (real ou fallback pós-fetch): inicia com opacidade 0 e faz fade-in suave de ~300ms no onLoad.
 * 3. Fallback/Mock NUNCA é exibido antes do término da requisição assíncrona.
 */
export function SmartImage({
  src,
  fallbackSrc,
  alt,
  isLoading,
  className,
  containerClassName,
  skeletonClassName,
  children,
  emptyFallback,
  priority = false,
  fetchPriority,
  width,
  height,
  onLoad,
}: SmartImageProps) {
  // A requisição assíncrona é considerada pendente se isLoading for explicitamente true
  // ou se src for estritamente undefined (não resolvido ainda)
  const isPending = isLoading ?? src === undefined

  // Determina a URL final a exibir:
  // Se ainda estiver pendente, NUNCA usa fallback (permanece null)
  const resolvedUrl = isPending
    ? null
    : src && src.trim() !== ''
      ? src
      : fallbackSrc && fallbackSrc.trim() !== ''
        ? fallbackSrc
        : null

  // Estado que rastreia se o elemento <img> realmente concluiu o carregamento no browser
  const [imgLoaded, setImgLoaded] = useState(false)

  // Quando o URL resolvido muda, resetamos imgLoaded
  useEffect(() => {
    setImgLoaded(false)
  }, [resolvedUrl])

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* 1. Placeholder neutro (Skeleton com pulsação suave) enquanto busca dados ou carrega a imagem */}
      {(isPending || (!imgLoaded && resolvedUrl)) && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 w-full h-full bg-warm-200/70 animate-pulse pointer-events-none z-0',
            skeletonClassName,
          )}
        />
      )}

      {/* 2. Imagem real ou mock (após fetch) com fade-in suave */}
      {resolvedUrl && (
        <img
          src={resolvedUrl}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={fetchPriority || (priority ? 'high' : 'auto')}
          onLoad={() => {
            setImgLoaded(true)
            onLoad?.()
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none',
            imgLoaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
        />
      )}

      {/* 3. Estado vazio (quando busca terminou mas não há imagem nem fallbackSrc) */}
      {!isPending && !resolvedUrl && emptyFallback && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {emptyFallback}
        </div>
      )}

      {/* 4. Elementos filhos (overlays, legendas, gradientes) */}
      {children}
    </div>
  )
}

export default SmartImage
