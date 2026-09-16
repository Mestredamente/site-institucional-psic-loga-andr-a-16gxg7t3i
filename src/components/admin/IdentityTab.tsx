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
  { name: 'Verde Sálvia Original', hex: '#B5D8CC' },
  { name: 'Sálvia Herbal', hex: '#A3CBBE' },
  { name: 'Verde Eucalipto', hex: '#87BBA2' },
  { name: 'Verde Floresta Suave', hex: '#6FA287' },
  { name: 'Argila Rosada', hex: '#D4A373' },
  { name: 'Terracota Acolhedor', hex: '#C2847A' },
  { name: 'Azul Serenidade', hex: '#9BB8CD' },
  { name: 'Lavanda Suave', hex: '#B8AFD0' },
]

export default function IdentityTab({ contentMap, mediaMap, onRefresh }: IdentityTabProps) {
  const currentConfig = contentMap['site_config'] || {}
  const [accentColor, setAccentColor] = useState(currentConfig.accent_color || '#B5D8CC')
  const [siteTitle, setSiteTitle] = useState(
    currentConfig.site_title ||
      'Andréa dos Santos Silva Armôa | Psicóloga Clínica & Neuropsicóloga',
  )
  const [siteDesc, setSiteDesc] = useState(
    currentConfig.site_description ||
      'Psicóloga Clínica e Neuropsicóloga - CRP 14/075954. Atendimento presencial e online.',
  )

  const [isSavingColor, setIsSavingColor] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  // Atualizar quando props mudarem
  useEffect(() => {
    if (currentConfig.accent_color) {
      setAccentColor(currentConfig.accent_color)
    }
    if (currentConfig.site_title) {
      setSiteTitle(currentConfig.site_title)
    }
    if (currentConfig.site_description) {
      setSiteDesc(currentConfig.site_description)
    }
  }, [currentConfig])

  // Salvar Cor de Destaque e Metadados
  const handleSaveConfig = async () => {
    setIsSavingColor(true)
    try {
      const updated = {
        ...currentConfig,
        accent_color: accentColor,
        site_title: siteTitle,
        site_description: siteDesc,
        updated_at: new Date().toISOString(),
      }
      await updateSiteContent('site_config', updated)
      applyAccentColor(accentColor)
      toast({
        title: 'Identidade atualizada!',
        description: 'A nova cor de destaque e títulos foram aplicados globalmente no site.',
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
              {/* Seletor Customizado e Hex */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-warm-50 border border-warm-200">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => {
                    setAccentColor(e.target.value)
                    applyAccentColor(e.target.value)
                  }}
                  className="w-14 h-14 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs font-semibold text-warm-700">Código Hexadecimal</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value)
                        applyAccentColor(e.target.value)
                      }}
                      className="font-mono uppercase text-sm border-warm-300 max-w-[140px]"
                    />
                    <span className="text-xs text-warm-400">(Altera em tempo real para teste)</span>
                  </div>
                </div>
              </div>

              {/* Paletas recomendadas */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-warm-700">
                  Paletas Harmoniosas Recomendadas para Psicologia
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = accentColor.toLowerCase() === preset.hex.toLowerCase()
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => {
                          setAccentColor(preset.hex)
                          applyAccentColor(preset.hex)
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? 'border-warm-700 bg-white ring-2 ring-warm-700/20 font-bold shadow-xs'
                            : 'border-warm-200 bg-white/70 hover:bg-white hover:border-warm-300'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-lg border border-black/10 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="truncate text-warm-700">{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Títulos do Site e SEO */}
              <div className="space-y-4 pt-4 border-t border-warm-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-warm-500">
                  Metadados do Site & Aba do Navegador
                </h4>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-warm-700">
                    Título da Página (SEO / Aba)
                  </Label>
                  <Input
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="Título exibido na aba"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-warm-700">
                    Descrição do Site (Meta Description)
                  </Label>
                  <Input
                    value={siteDesc}
                    onChange={(e) => setSiteDesc(e.target.value)}
                    placeholder="Descrição para buscadores"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAccentColor('#B5D8CC')
                    applyAccentColor('#B5D8CC')
                  }}
                  className="text-xs text-warm-600"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  Restaurar Sálvia Padrão
                </Button>

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

              <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-warm-500 font-semibold block">
                  Simulação do Cabeçalho Público:
                </span>
                <div className="flex items-center justify-between pt-1">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-8 max-w-[120px] object-contain" />
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-bold text-warm-700">
                        Andréa Armôa
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-warm-400">
                        CRP 14/075954
                      </span>
                    </div>
                  )}
                  <span
                    className="text-xs px-3 py-1 rounded-full text-warm-800 font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    Contato
                  </span>
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
