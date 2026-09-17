import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { uploadSiteMedia, deleteSiteMedia, updateSiteContent } from '@/services/content'
import { applyAccentColor, applyFavicon } from '@/lib/theme'
import { toast } from '@/hooks/use-toast'
import {
  Palette,
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Globe,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'

interface IdentityTabProps {
  contentMap: Record<string, any>
  mediaMap: Record<string, string>
  onRefresh: () => void
}

const PRESET_COLORS = [
  { name: 'Malva da Marca (Logo)', hex: '#BC849D', description: 'Cor oficial da cliente' },
  { name: 'Verde Sálvia Original', hex: '#B5D8CC', description: 'Sálvia institucional' },
  { name: 'Sálvia Herbal', hex: '#A3CBBE', description: 'Tom botânico suave' },
  { name: 'Verde Eucalipto', hex: '#87BBA2', description: 'Serenidade e frescor' },
  { name: 'Verde Floresta Suave', hex: '#6FA287', description: 'Tom natural acolhedor' },
  { name: 'Argila Rosada', hex: '#D4A373', description: 'Aconchego terroso' },
  { name: 'Terracota Acolhedor', hex: '#C2847A', description: 'Calor e humanização' },
  { name: 'Azul Serenidade', hex: '#9BB8CD', description: 'Tranquilidade e foco' },
  { name: 'Lavanda Suave', hex: '#B8AFD0', description: 'Paz e reflexão' },
]

function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim())
}

function normalizeHexColor(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return '#B5D8CC'
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return withHash.toUpperCase()
}

export default function IdentityTab({ contentMap, mediaMap, onRefresh }: IdentityTabProps) {
  const currentConfig = contentMap['site_config'] || {}
  const [accentColor, setAccentColor] = useState(currentConfig.accent_color || '#B5D8CC')
  const [hexInputText, setHexInputText] = useState(currentConfig.accent_color || '#B5D8CC')
  const [hexError, setHexError] = useState<string | null>(null)

  const [siteTitle, setSiteTitle] = useState(
    currentConfig.site_title || 'Andréa Armôa | Psicóloga Clínica e Neuropsicóloga',
  )
  const [siteDesc, setSiteDesc] = useState(
    currentConfig.site_description ||
      'Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento humanizado presencial e online em psicoterapia e orientação parental.',
  )
  const [canonicalUrl, setCanonicalUrl] = useState(
    currentConfig.canonical_url || 'https://andreaarmoa.com.br',
  )
  const [ogImageKey, setOgImageKey] = useState(currentConfig.og_image_key || 'hero_foto')

  const [isSavingColor, setIsSavingColor] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  // Atualizar quando props mudarem
  useEffect(() => {
    if (currentConfig.accent_color) {
      setAccentColor(currentConfig.accent_color)
      setHexInputText(currentConfig.accent_color)
      setHexError(null)
    }
    if (currentConfig.site_title) {
      setSiteTitle(currentConfig.site_title)
    }
    if (currentConfig.site_description) {
      setSiteDesc(currentConfig.site_description)
    }
    if (currentConfig.canonical_url) {
      setCanonicalUrl(currentConfig.canonical_url)
    }
    if (currentConfig.og_image_key) {
      setOgImageKey(currentConfig.og_image_key)
    }
  }, [currentConfig])

  // Atualizar cor tanto pelo picker nativo quanto pelo input manual
  const handleColorChange = (newHex: string) => {
    setHexInputText(newHex)
    const formatted = normalizeHexColor(newHex)
    if (isValidHexColor(formatted)) {
      setHexError(null)
      setAccentColor(formatted)
      applyAccentColor(formatted)
    } else {
      setHexError('Formato hexadecimal inválido (ex: #BC849D ou #B5D8CC)')
    }
  }

  // Ao selecionar das paletas
  const handleSelectPreset = (presetHex: string) => {
    setAccentColor(presetHex)
    setHexInputText(presetHex)
    setHexError(null)
    applyAccentColor(presetHex)
  }

  // Salvar Cor de Destaque e Metadados
  const handleSaveConfig = async () => {
    // Validar cor antes de salvar, com fallback seguro caso o texto digitado seja inválido
    let safeColor = accentColor
    const normalizedInput = normalizeHexColor(hexInputText)
    if (isValidHexColor(normalizedInput)) {
      safeColor = normalizedInput
    } else if (!isValidHexColor(safeColor)) {
      safeColor = '#BC849D' // Fallback para a cor solicitada pela cliente se tudo falhar
    }

    setIsSavingColor(true)
    try {
      const updated = {
        ...currentConfig,
        accent_color: safeColor,
        site_title: siteTitle,
        site_description: siteDesc,
        canonical_url: canonicalUrl,
        og_image_key: ogImageKey,
        updated_at: new Date().toISOString(),
      }
      await updateSiteContent('site_config', updated)
      setAccentColor(safeColor)
      setHexInputText(safeColor)
      setHexError(null)
      applyAccentColor(safeColor)
      toast({
        title: 'Identidade atualizada!',
        description: `A nova cor de destaque (${safeColor}) e títulos foram aplicados globalmente no site.`,
      })
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar configuração:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: err.message,
      })
    } finally {
      setIsSavingColor(false)
    }
  }

  // Upload Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      await uploadSiteMedia('logo', file)
      toast({
        title: 'Logo atualizado com sucesso!',
        description: 'O logotipo já está ativo no cabeçalho do site.',
      })
      onRefresh()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no envio do logo',
        description: err.message,
      })
    } finally {
      setUploadingLogo(false)
    }
  }

  // Remover Logo
  const handleRemoveLogo = async () => {
    if (!confirm('Deseja remover o logo customizado e voltar ao nome em texto?')) return
    setUploadingLogo(true)
    try {
      await deleteSiteMedia('logo')
      toast({ title: 'Logo removido. O site usará o título em texto.' })
      onRefresh()
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao remover', description: err.message })
    } finally {
      setUploadingLogo(false)
    }
  }

  // Upload Favicon
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFavicon(true)
    try {
      await uploadSiteMedia('favicon', file)
      toast({
        title: 'Favicon atualizado!',
        description: 'O ícone da aba do navegador foi atualizado.',
      })
      onRefresh()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no envio do favicon',
        description: err.message,
      })
    } finally {
      setUploadingFavicon(false)
    }
  }

  // Remover Favicon
  const handleRemoveFavicon = async () => {
    if (!confirm('Deseja remover o favicon personalizado?')) return
    setUploadingFavicon(true)
    try {
      await deleteSiteMedia('favicon')
      toast({ title: 'Favicon removido.' })
      onRefresh()
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao remover', description: err.message })
    } finally {
      setUploadingFavicon(false)
    }
  }

  const logoUrl = mediaMap['logo']
  const faviconUrl = mediaMap['favicon']

  // Resolução da Imagem OG ativa
  const resolvedOgImageUrl =
    ogImageKey === 'default' ? '/og-default.svg' : mediaMap[ogImageKey] || '/og-default.svg'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-warm-700">Identidade Visual & Cores</h2>
        <p className="text-sm text-warm-500">
          Personalize a cor de destaque, o logotipo e o favicon da profissional com pré-visualização
          imediata e publicação global para todos os visitantes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Cores */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-warm-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <Palette className="w-5 h-5 text-warm-700" />
                    Cor de Destaque Global (Accent Color)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define a tonalidade dos botões principais, tags de destaque, bordas e detalhes
                    em todo o site público.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seletor Customizado e Hex Livre */}
              <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <input
                      type="color"
                      aria-label="Seletor de cor visual"
                      value={isValidHexColor(accentColor) ? accentColor : '#BC849D'}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white shadow-md bg-transparent p-0 transition-transform group-hover:scale-105"
                    />
                    <span className="text-[10px] text-warm-500 block text-center mt-1">Paleta</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label
                      htmlFor="custom-hex-input"
                      className="text-xs font-semibold text-warm-700 flex items-center justify-between"
                    >
                      <span>Código Hexadecimal Livre (ex: #BC849D)</span>
                      <span className="text-[11px] font-normal text-warm-500">
                        {isValidHexColor(accentColor)
                          ? 'Cor válida e ativa'
                          : 'Aguardando código válido'}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 max-w-[180px]">
                        <Input
                          id="custom-hex-input"
                          value={hexInputText}
                          placeholder="#BC849D"
                          maxLength={7}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className={`font-mono uppercase text-sm border-warm-300 ${
                            hexError ? 'border-red-400 focus-visible:ring-red-400' : ''
                          }`}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelectPreset('#BC849D')}
                        className={`text-xs border-warm-300 transition-colors ${
                          accentColor.toUpperCase() === '#BC849D'
                            ? 'bg-[#BC849D] text-white hover:bg-[#BC849D]/90 border-transparent font-semibold shadow-xs'
                            : 'hover:bg-warm-100'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full mr-1.5 border border-black/10 shrink-0"
                          style={{ backgroundColor: '#BC849D' }}
                        />
                        Aplicar Malva da Logo (#BC849D)
                      </Button>
                    </div>
                    {hexError ? (
                      <p className="text-[11px] text-red-600 font-medium">{hexError}</p>
                    ) : (
                      <p className="text-[11px] text-warm-400">
                        Altera em tempo real em todos os elementos da página para visualização antes
                        de salvar.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Paletas recomendadas */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-warm-700">
                    Paletas Harmoniosas Recomendadas para Psicologia & Identidade
                  </Label>
                  <span className="text-[11px] text-warm-400">Clique para selecionar</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = accentColor.toLowerCase() === preset.hex.toLowerCase()
                    const isClientSpecial = preset.hex.toUpperCase() === '#BC849D'
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleSelectPreset(preset.hex)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all relative ${
                          isSelected
                            ? 'border-warm-700 bg-white ring-2 ring-warm-700/25 font-bold shadow-xs'
                            : 'border-warm-200 bg-white/70 hover:bg-white hover:border-warm-300'
                        } ${isClientSpecial && !isSelected ? 'border-[#BC849D]/50 bg-[#BC849D]/5' : ''}`}
                      >
                        <span
                          className="w-6 h-6 rounded-lg border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-warm-800 font-medium">
                              {preset.name}
                            </span>
                            {isClientSpecial && (
                              <span className="text-[9px] bg-[#BC849D]/20 text-[#8b4f6b] px-1.5 py-0.2 rounded-full font-bold uppercase">
                                Logo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-warm-400 font-mono block">
                            {preset.hex}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Títulos do Site e SEO */}
              <div className="space-y-4 pt-4 border-t border-warm-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-warm-500">
                    SEO Técnico & Metatags Sociais
                  </h4>
                  <span className="text-[11px] text-warm-400">
                    Otimizado para Google, WhatsApp e Redes
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold text-warm-700">
                      Título da Página (Meta Title — máx 60 caracteres)
                    </Label>
                    <span
                      className={`text-[11px] font-mono ${siteTitle.length > 60 ? 'text-red-500 font-bold' : 'text-warm-400'}`}
                    >
                      {siteTitle.length}/60
                    </span>
                  </div>
                  <Input
                    value={siteTitle}
                    maxLength={70}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="Andréa Armôa | Psicóloga Clínica e Neuropsicóloga"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold text-warm-700">
                      Descrição do Site (Meta Description — máx 155 caracteres)
                    </Label>
                    <span
                      className={`text-[11px] font-mono ${siteDesc.length > 155 ? 'text-red-500 font-bold' : 'text-warm-400'}`}
                    >
                      {siteDesc.length}/155
                    </span>
                  </div>
                  <Input
                    value={siteDesc}
                    maxLength={170}
                    onChange={(e) => setSiteDesc(e.target.value)}
                    placeholder="Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento presencial e online."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-warm-700">
                    URL Canônica Absoluta (HTTPS)
                  </Label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://andreaarmoa.com.br"
                  />
                </div>

                {/* Seleção da Imagem de Compartilhamento Social (og:image) */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold text-warm-700">
                    Escolha qual foto do site vira a Imagem de Compartilhamento (og:image):
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setOgImageKey('hero_foto')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        ogImageKey === 'hero_foto'
                          ? 'border-warm-700 bg-white ring-2 ring-warm-700/20 font-bold'
                          : 'border-warm-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-warm-800">Foto Principal do Hero</p>
                        <p className="text-[11px] text-warm-500">
                          Foto profissional de apresentação
                        </p>
                      </div>
                      {mediaMap['hero_foto'] && (
                        <img
                          src={mediaMap['hero_foto']}
                          alt="Hero"
                          className="w-9 h-9 rounded-lg object-cover border"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOgImageKey('sobre_foto')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        ogImageKey === 'sobre_foto'
                          ? 'border-warm-700 bg-white ring-2 ring-warm-700/20 font-bold'
                          : 'border-warm-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-warm-800">Foto da Seção Sobre</p>
                        <p className="text-[11px] text-warm-500">Consultório / Atendimento</p>
                      </div>
                      {mediaMap['sobre_foto'] && (
                        <img
                          src={mediaMap['sobre_foto']}
                          alt="Sobre"
                          className="w-9 h-9 rounded-lg object-cover border"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOgImageKey('orientacao_foto')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        ogImageKey === 'orientacao_foto'
                          ? 'border-warm-700 bg-white ring-2 ring-warm-700/20 font-bold'
                          : 'border-warm-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-warm-800">Foto Orientação Parental</p>
                        <p className="text-[11px] text-warm-500">Família / Crianças</p>
                      </div>
                      {mediaMap['orientacao_foto'] && (
                        <img
                          src={mediaMap['orientacao_foto']}
                          alt="Orientação"
                          className="w-9 h-9 rounded-lg object-cover border"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setOgImageKey('default')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        ogImageKey === 'default'
                          ? 'border-warm-700 bg-white ring-2 ring-warm-700/20 font-bold'
                          : 'border-warm-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-warm-800">Composição Oficial (1200x630)</p>
                        <p className="text-[11px] text-warm-500">Monograma + CRP + Fundo neutro</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-warm-200 border flex items-center justify-center font-serif font-bold text-xs">
                        AA
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectPreset('#BC849D')}
                    className="text-xs text-[#8b4f6b] border-[#BC849D]/40 hover:bg-[#BC849D]/10 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-[#BC849D]" />
                    Usar Malva da Logo (#BC849D)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectPreset('#B5D8CC')}
                    className="text-xs text-warm-600"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Restaurar Sálvia Padrão
                  </Button>
                </div>
                <Button
                  onClick={handleSaveConfig}
                  disabled={isSavingColor}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  {isSavingColor ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Publicar Identidade Global
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pré-visualização e Mídia (Logo e Favicon) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card de Preview dos Elementos */}
          <Card className="border-warm-200 overflow-hidden">
            <CardHeader className="bg-warm-50/70 border-b border-warm-200 py-3.5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-warm-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sage-600" />
                Pré-visualização do Design System
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-warm-400 font-semibold">
                  Exemplo de Botão Principal:
                </span>
                <div>
                  <button
                    type="button"
                    style={{ backgroundColor: accentColor }}
                    className="text-warm-900 font-medium px-5 py-2.5 rounded-full shadow-sm text-sm transition-all"
                  >
                    Agendar Atendimento
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-warm-400 font-semibold">
                  Exemplo de Selo / Badge:
                </span>
                <div>
                  <span
                    style={{ borderColor: accentColor }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border text-warm-800"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    Atendimento Presencial & Online
                  </span>
                </div>
              </div>

              {/* Pré-visualização do Card de Compartilhamento Social (WhatsApp / Facebook / Twitter) */}
              <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-warm-600 font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sage-600" />
                    Preview do Card Social (WhatsApp / X / FB):
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    1200 × 630 px
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-warm-300 bg-white shadow-sm">
                  <div className="aspect-[1.91/1] w-full bg-warm-200 relative overflow-hidden">
                    <img
                      src={resolvedOgImageUrl}
                      alt="Preview Open Graph"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-1 border-t border-warm-100 bg-[#f9f8f6]">
                    <p className="text-[10px] uppercase tracking-wider text-warm-400 font-mono">
                      andreaarmoa.com.br
                    </p>
                    <p className="text-xs font-bold text-warm-800 line-clamp-1">
                      {siteTitle || 'Andréa Armôa | Psicóloga Clínica e Neuropsicóloga'}
                    </p>
                    <p className="text-[11px] text-warm-500 line-clamp-2 leading-relaxed">
                      {siteDesc ||
                        'Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento presencial e online.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Logo */}
          <Card className="border-warm-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center justify-between">
                <span>Logotipo Personalizado</span>
                {logoUrl && (
                  <span className="text-[11px] font-sans font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ativo no site
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Substitui o nome em texto no cabeçalho do site público (PNG com fundo transparente
                recomendado, aprox. 200x60px).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-20 w-full rounded-xl bg-warm-100 border border-dashed border-warm-300 flex items-center justify-center p-2 relative overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-warm-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    Nenhum logo enviado (usando texto)
                  </span>
                )}
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Label
                  htmlFor="upload-logo-identity"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-warm-300 bg-white hover:bg-warm-50 text-xs font-semibold text-warm-700 cursor-pointer transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-warm-500" />
                  {logoUrl ? 'Substituir Logo' : 'Enviar Logo'}
                </Label>
                <input
                  id="upload-logo-identity"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />

                {logoUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={uploadingLogo}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload de Favicon */}
          <Card className="border-warm-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center justify-between">
                <span>Favicon (Ícone da Aba)</span>
                {faviconUrl && (
                  <span className="text-[11px] font-sans font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ativo
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                Ícone quadrado exibido na aba do navegador (formato .png ou .ico, recomendado
                64x64px).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-16 w-full rounded-xl bg-warm-100 border border-dashed border-warm-300 flex items-center justify-center p-2 relative overflow-hidden">
                {faviconUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={faviconUrl}
                      alt="Favicon"
                      className="w-8 h-8 rounded-md object-contain border bg-white p-0.5 shadow-xs"
                    />
                    <span className="text-xs text-warm-600 font-medium">Favicon ativo</span>
                  </div>
                ) : (
                  <span className="text-xs text-warm-400 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Favicon padrão do navegador
                  </span>
                )}
                {uploadingFavicon && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Label
                  htmlFor="upload-favicon-identity"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-warm-300 bg-white hover:bg-warm-50 text-xs font-semibold text-warm-700 cursor-pointer transition-colors shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-warm-500" />
                  {faviconUrl ? 'Substituir Favicon' : 'Enviar Favicon'}
                </Label>
                <input
                  id="upload-favicon-identity"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFaviconUpload}
                  disabled={uploadingFavicon}
                />

                {faviconUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFavicon}
                    disabled={uploadingFavicon}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs rounded-xl"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remover
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
