/**
 * Utilitários para Metatags, Open Graph, Twitter Cards e JSON-LD Schema.org
 */

export interface SeoData {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImageUrl?: string
  ogType?: string
  siteName?: string
  locale?: string
  noindex?: boolean
}

export interface PsychologistSchemaData {
  name: string
  legalName?: string
  crp: string
  jobTitle: string
  description: string
  url: string
  imageUrl?: string
  telephone?: string
  email?: string
  instagramUrl?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  areaServed?: string
  availableServices?: string[]
}

/**
 * Atualiza ou insere tags no <head> de forma reativa e idempotente
 */
export function updateMetaTags(seo: SeoData): void {
  if (typeof document === 'undefined') return

  // 1. Title
  if (seo.title) {
    document.title = seo.title
  }

  // 2. Helper de meta tag
  const setMeta = (
    nameOrProperty: 'name' | 'property',
    key: string,
    content: string | undefined,
  ) => {
    if (!content) return
    let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(nameOrProperty, key)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  // 3. Helper de link tag
  const setLink = (rel: string, href: string | undefined, extraAttrs?: Record<string, string>) => {
    if (!href) return
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', rel)
      document.head.appendChild(element)
    }
    element.setAttribute('href', href)
    if (extraAttrs) {
      Object.entries(extraAttrs).forEach(([k, v]) => element?.setAttribute(k, v))
    }
  }

  // Standard Meta
  if (seo.description) {
    setMeta('name', 'description', seo.description)
  }
  setMeta('name', 'author', 'Andréa dos Santos Silva Armôa')
  if (seo.noindex) {
    setMeta('name', 'robots', 'noindex, nofollow')
  } else {
    setMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
  }

  // Canonical
  const canonical =
    seo.canonicalUrl ||
    (typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://andreaarmoa.com.br')
  setLink('canonical', canonical)

  // Open Graph
  setMeta('property', 'og:type', seo.ogType || 'website')
  setMeta('property', 'og:title', seo.title || document.title)
  setMeta('property', 'og:description', seo.description || '')
  setMeta('property', 'og:url', canonical)
  setMeta(
    'property',
    'og:site_name',
    seo.siteName || 'Andréa Armôa | Psicologia Clínica e Neuropsicologia',
  )
  setMeta('property', 'og:locale', seo.locale || 'pt_BR')

  // Absolute HTTPS OG Image
  if (seo.ogImageUrl) {
    const absoluteOgImage = toAbsoluteHttpsUrl(seo.ogImageUrl)
    setMeta('property', 'og:image', absoluteOgImage)
    setMeta('property', 'og:image:secure_url', absoluteOgImage)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta(
      'property',
      'og:image:alt',
      'Andréa dos Santos Silva Armôa - Psicóloga Clínica e Neuropsicóloga',
    )
    setMeta(
      'property',
      'og:image:type',
      absoluteOgImage.endsWith('.png')
        ? 'image/png'
        : absoluteOgImage.endsWith('.svg')
          ? 'image/svg+xml'
          : 'image/jpeg',
    )

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', seo.title || document.title)
    setMeta('name', 'twitter:description', seo.description || '')
    setMeta('name', 'twitter:image', absoluteOgImage)
    setMeta(
      'name',
      'twitter:image:alt',
      'Andréa dos Santos Silva Armôa - Psicóloga Clínica e Neuropsicóloga',
    )
  }
}

/**
 * Converte qualquer caminho relativo para URL absoluta HTTPS
 */
export function toAbsoluteHttpsUrl(urlOrPath: string): string {
  if (!urlOrPath) return ''
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    // Forçar HTTPS se for HTTP
    return urlOrPath.replace(/^http:\/\//, 'https://')
  }
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://andreaarmoa.com.br'
  const normalizedPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`
  return `${base.replace(/^http:\/\//, 'https://')}${normalizedPath}`
}

/**
 * Gera e injeta o schema JSON-LD na página inicial
 * Conforme o requisito:
 * - Se não houver endereço confirmado, usar LocalBusiness/Psychologist sem inventar dados
 * - NÃO inventar dados: se não preenchido, omitir do JSON-LD
 */
export function updateJsonLd(data: PsychologistSchemaData): void {
  if (typeof document === 'undefined') return

  const scriptId = 'jsonld-psychologist'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  // Montagem estrita do schema.org (apenas campos preenchidos)
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': ['Psychologist', 'MedicalBusiness', 'LocalBusiness'],
    '@id': `${data.url}#psychologist`,
    name: data.name,
    legalName: data.legalName || data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: data.url,
    identifier: {
      '@type': 'PropertyValue',
      name: 'CRP',
      value: data.crp,
    },
    founder: {
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      identifier: {
        '@type': 'PropertyValue',
        name: 'CRP',
        value: data.crp,
      },
    },
    employee: {
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      identifier: {
        '@type': 'PropertyValue',
        name: 'CRP',
        value: data.crp,
      },
    },
  }

  if (data.imageUrl) {
    schema.image = toAbsoluteHttpsUrl(data.imageUrl)
  }

  if (data.telephone) {
    schema.telephone = data.telephone
  }

  if (data.email) {
    schema.email = data.email
  }

  if (data.instagramUrl) {
    schema.sameAs = [data.instagramUrl]
  }

  // Endereço real apenas se fornecido
  if (data.address && data.address.streetAddress) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality || 'São Paulo',
      addressRegion: data.address.addressRegion || 'SP',
      addressCountry: data.address.addressCountry || 'BR',
    }
    if (data.address.postalCode) {
      schema.address.postalCode = data.address.postalCode
    }
  }

  if (data.areaServed) {
    schema.areaServed = [
      {
        '@type': 'AdministrativeArea',
        name: data.areaServed,
      },
      {
        '@type': 'Country',
        name: 'Brasil',
      },
    ]
  }

  if (data.availableServices && data.availableServices.length > 0) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Serviços Psicológicos e Neuropsicológicos',
      itemListElement: data.availableServices.map((srv, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: srv,
        },
        position: idx + 1,
      })),
    }
  }

  script.textContent = JSON.stringify(schema, null, 2)
}
