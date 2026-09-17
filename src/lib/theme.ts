// Utilitário para calcular variações de cor e aplicar a cor de destaque dinamicamente

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim()
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16)
    const g = parseInt(cleanHex[1] + cleanHex[1], 16)
    const b = parseInt(cleanHex[2] + cleanHex[2], 16)
    return { r, g, b }
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return { r, g, b }
  }
  return null
}

function mix(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number },
  weight: number,
) {
  const w = Math.max(0, Math.min(1, weight))
  const r = Math.round(color1.r * (1 - w) + color2.r * w)
  const g = Math.round(color1.g * (1 - w) + color2.g * w)
  const b = Math.round(color1.b * (1 - w) + color2.b * w)
  return `rgb(${r}, ${g}, ${b})`
}

export function applyAccentColor(hexColor: string | undefined) {
  if (!hexColor || typeof document === 'undefined') return

  const rgb = hexToRgb(hexColor)
  if (!rgb) return

  const white = { r: 255, g: 255, b: 255 }
  const dark = { r: 29, g: 39, b: 35 }

  // Calcular luminância relativa (WCAG 2.1) para garantir contraste perfeito
  const luma = 0.2126 * (rgb.r / 255) + 0.7152 * (rgb.g / 255) + 0.0722 * (rgb.b / 255)
  // Texto sobre o acento principal: se cor for clara (como sálvia ou rosa claro), texto escuro; se for escura, texto claro
  const primaryFg = luma > 0.45 ? '#1C1A18' : '#FFFFFF'

  const root = document.documentElement

  // Definir escala para --sage-*
  root.style.setProperty('--sage-50', mix(rgb, white, 0.85))
  root.style.setProperty('--sage-100', mix(rgb, white, 0.65))
  root.style.setProperty('--sage-200', mix(rgb, white, 0.35))
  root.style.setProperty('--sage-300', hexColor)
  root.style.setProperty('--sage-400', mix(rgb, dark, 0.12))
  root.style.setProperty('--sage-500', mix(rgb, dark, 0.28))
  root.style.setProperty('--sage-600', mix(rgb, dark, 0.42))
  root.style.setProperty('--sage-700', mix(rgb, dark, 0.58))
  root.style.setProperty('--sage-800', primaryFg === '#FFFFFF' ? '#FFFFFF' : mix(rgb, dark, 0.78))
  root.style.setProperty('--sage-900', mix(rgb, dark, 0.86))

  // Atualizar variáveis de estilo CSS e componentes do Shadcn
  root.style.setProperty('--primary-dynamic', hexColor)
  root.style.setProperty('--primary-dynamic-foreground', primaryFg)
}

export function applyFavicon(faviconUrl: string | undefined) {
  if (!faviconUrl || typeof document === 'undefined') return

  let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']")
  if (!link) {
    link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    document.getElementsByTagName('head')[0].appendChild(link)
  }
  link.href = faviconUrl
}
