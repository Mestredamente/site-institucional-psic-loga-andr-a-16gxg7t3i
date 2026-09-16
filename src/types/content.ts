export interface HeroContent {
  title: string
  subtitle: string
  crp: string
  welcoming_phrase: string
  cta_primary: string
  cta_secondary: string
  badge?: string
}

export interface SobreContent {
  title: string
  lead: string
  paragraphs: string[]
  highlights: Array<{ label: string; text: string }>
}

export interface PsicoterapiaContent {
  title: string
  subtitle: string
  description: string
  audiences: Array<{
    title: string
    description: string
    icon: string
  }>
}

export interface OrientacaoParentalContent {
  title: string
  quote: string
  lead: string
  description: string
  points: string[]
  cta_text: string
}

export interface ParaQuemContent {
  title: string
  subtitle: string
  groups: Array<{
    name: string
    summary: string
    badge: string
  }>
}

export interface BeneficiosContent {
  title: string
  subtitle: string
  items: Array<{
    title: string
    desc: string
  }>
}

export interface ComoFuncionaContent {
  title: string
  subtitle: string
  modalities: Array<{
    title: string
    desc: string
    tag: string
    duration: string
  }>
}

export interface FaqQuestion {
  q: string
  a: string
}

export interface FaqContent {
  title: string
  subtitle: string
  questions: FaqQuestion[]
}

export interface ContatoContent {
  title: string
  subtitle: string
  address: string
  address_complement: string
  whatsapp: string
  whatsapp_formatted: string
  whatsapp_message: string
  instagram: string
  instagram_url: string
  email: string
  maps_iframe_url: string
}

export interface SiteConfigContent {
  accent_color: string
  site_title?: string
  site_description?: string
  admin_email?: string
  updated_at?: string
}

export interface SiteContentRecord {
  id: string
  key: string
  content: any
  created: string
  updated: string
}

export interface SiteMediaRecord {
  id: string
  key: string
  file: string
  created: string
  updated: string
}

export interface BlogPostRecord {
  id: string
  title: string
  content: string
  type: 'blog' | 'vlog'
  media_file?: string
  media_url?: string
  published: boolean
  created: string
  updated: string
}

export interface DocumentRecord {
  id: string
  title: string
  file: string
  description?: string
  created: string
  updated: string
}

export interface PrivateNoteRecord {
  id: string
  title: string
  content: string
  created: string
  updated: string
}
