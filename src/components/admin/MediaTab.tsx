import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { uploadSiteMedia, deleteSiteMedia } from '@/services/content'
import { toast } from '@/hooks/use-toast'
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  Crop,
  Trash2,
  ZoomIn,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react'

interface MediaTabProps {
  mediaMap: Record<string, string>
  onRefresh: () => void
}

interface MediaSlot {
  key: string
  title: string
  desc: string
  recommendedSize: string
  aspectRatioClass: string
  aspectRatioNumber: number // width / height
  defaultPlaceholder: string
}

const MEDIA_SLOTS: MediaSlot[] = [
  {
    key: 'hero_foto',
    title: 'Foto Principal (Hero / Boas-Vindas)',
    desc: 'Retrato profissional acolhedor vertical exibido no topo da página ao lado das frases principais.',
    recommendedSize: '800 x 1000 px (Proporção 4:5 vertical)',
    aspectRatioClass: 'aspect-[4/5]',
    aspectRatioNumber: 4 / 5,
    defaultPlaceholder: 'https://img.usecurling.com/p/800/1000?q=psychologist%20woman%20smiling',
  },
  {
    key: 'sobre_foto',
    title: 'Foto Secundária (Sobre Mim / Consultório)',
    desc: 'Foto da profissional em atendimento ou ambiente acolhedor do consultório privativo.',
    recommendedSize: '1200 x 900 px (Proporção 4:3 horizontal)',
    aspectRatioClass: 'aspect-[4/3]',
    aspectRatioNumber: 4 / 3,
    defaultPlaceholder:
      'https://img.usecurling.com/p/1200/900?q=modern%20therapy%20office%20psychology',
  },
  {
    key: 'orientacao_foto',
    title: 'Foto da Seção Orientação Parental',
    desc: 'Imagem conceitual de acolhimento familiar e relação pais e filhos.',
    recommendedSize: '1200 x 800 px (Proporção 3:2)',
    aspectRatioClass: 'aspect-[3/2]',
    aspectRatioNumber: 3 / 2,
    defaultPlaceholder:
      'https://img.usecurling.com/p/1200/800?q=mother%20child%20reading%20together',
  },
]

export default function MediaTab({ mediaMap, onRefresh }: MediaTabProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  // Estados do Modal de Corte / Enquadramento
  const [cropSlot, setCropSlot] = useState<MediaSlot | null>(null)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isProcessingCrop, setIsProcessingCrop] = useState(false)

  const imageRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Abrir o diálogo de corte quando seleciona arquivo
  const handleSelectFile = (slot: MediaSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCropImageSrc(reader.result as string)
      setCropSlot(slot)
      setZoom(1)
      setPan({ x: 0, y: 0 })
    }
    reader.readAsDataURL(file)
    // reset input
    e.target.value = ''
  }

  // Manipulação de Pan (arrastar a imagem dentro do enquadramento)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Confirmar corte e enviar ao PocketBase site_media
  const handleConfirmCrop = async () => {
    if (!cropSlot || !cropImageSrc || !imageRef.current || !containerRef.current) return

    setIsProcessingCrop(true)
    try {
      const canvas = document.createElement('canvas')
      const targetWidth = 1000
      const targetHeight = Math.round(targetWidth / cropSlot.aspectRatioNumber)
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Não foi possível obter contexto de renderização.')

      const img = imageRef.current
      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()

      // Calcular proporções entre o preview na tela e o canvas real
      const scaleToCanvas = targetWidth / containerRect.width

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Preenchimento de fundo neutro se houver borda
      ctx.fillStyle = '#FFFCF9'
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      // Desenhar com a transformação aplicada
      ctx.save()
      ctx.translate(
        targetWidth / 2 + pan.x * scaleToCanvas,
        targetHeight / 2 + pan.y * scaleToCanvas,
      )
      ctx.scale(zoom, zoom)

      // Tamanho que a imagem tinha no container
      const imgNaturalRatio = img.naturalWidth / img.naturalHeight
      let renderW = containerRect.width
      let renderH = containerRect.width / imgNaturalRatio
      if (renderH < containerRect.height) {
        renderH = containerRect.height
        renderW = containerRect.height * imgNaturalRatio
      }

      ctx.drawImage(
        img,
        (-renderW * scaleToCanvas) / 2,
        (-renderH * scaleToCanvas) / 2,
        renderW * scaleToCanvas,
        renderH * scaleToCanvas,
      )
      ctx.restore()

      // Converter canvas para Blob/File
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
      )

      if (!blob) throw new Error('Falha ao processar arquivo recortado.')

      const finalFile = new File([blob], `${cropSlot.key}.jpg`, { type: 'image/jpeg' })

      setUploadingKey(cropSlot.key)
      await uploadSiteMedia(cropSlot.key, finalFile)

      toast({
        title: 'Foto salva com sucesso!',
        description: `A foto "${cropSlot.title}" foi enquadrada e já está ativa no site público.`,
      })

      setCropSlot(null)
      setCropImageSrc(null)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao recortar e enviar foto:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao processar',
        description: err.message || 'Falha ao salvar imagem.',
      })
    } finally {
      setIsProcessingCrop(false)
      setUploadingKey(null)
    }
  }

  // Excluir foto e voltar ao padrão
  const handleRemovePhoto = async (key: string) => {
    if (!confirm('Deseja remover esta foto personalizada e restaurar a imagem padrão?')) return
    setUploadingKey(key)
    try {
      await deleteSiteMedia(key)
      toast({ title: 'Foto removida. O site agora exibe a foto padrão de apresentação.' })
      onRefresh()
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro ao remover', description: err.message })
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-warm-700">Fotos & Enquadramento</h2>
          <p className="text-sm text-warm-500">
            Envie novas fotos da profissional e do consultório com ferramenta de recorte, zoom e
            enquadramento perfeito para cada seção do site.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEDIA_SLOTS.map((slot) => {
          const currentUrl = mediaMap[slot.key]
          const isUploading = uploadingKey === slot.key

          return (
            <Card key={slot.key} className="border-warm-200 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-serif">{slot.title}</CardTitle>
                  {currentUrl ? (
                    <span className="text-[10px] font-sans font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Personalizada
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans font-semibold text-warm-600 bg-warm-200 px-2 py-0.5 rounded-full">
                      Padrão
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs">{slot.desc}</CardDescription>
                <span className="text-[11px] text-warm-400 font-mono mt-1 block">
                  {slot.recommendedSize}
                </span>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Visualizador da Imagem com proporção correta */}
                <div
                  className={`${slot.aspectRatioClass} w-full rounded-2xl bg-warm-100 border border-warm-200 overflow-hidden relative shadow-xs`}
                >
                  <img
                    src={currentUrl || slot.defaultPlaceholder}
                    alt={slot.title}
                    className="w-full h-full object-cover"
                  />

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-sage-600" />
                    </div>
                  )}

                  {!currentUrl && (
                    <div className="absolute bottom-2 left-2 right-2 bg-warm-900/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-lg text-center font-medium">
                      Exibindo foto ilustrativa padrão
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`upload-slot-${slot.key}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-warm-300 bg-white hover:bg-warm-50 text-xs font-semibold text-warm-700 cursor-pointer transition-colors shadow-xs"
                  >
                    <Crop className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
                    {currentUrl ? 'Trocar e Enquadrar' : 'Enviar e Enquadrar'}
                  </Label>
                  <input
                    id={`upload-slot-${slot.key}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSelectFile(slot, e)}
                    disabled={isUploading}
                  />

                  {currentUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemovePhoto(slot.key)}
                      disabled={isUploading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl shrink-0"
                      title="Restaurar foto padrão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal Interativo de Corte e Enquadramento */}
      <Dialog open={!!cropSlot} onOpenChange={(open) => !open && setCropSlot(null)}>
        <DialogContent className="max-w-2xl bg-white border-warm-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <Crop className="w-5 h-5 text-sage-600" />
              Ajustar Enquadramento: {cropSlot?.title}
            </DialogTitle>
          </DialogHeader>

          {cropSlot && cropImageSrc && (
            <div className="space-y-5 pt-2">
              <p className="text-xs text-warm-500">
                Arraste a foto com o mouse para posicionar e use a barra de zoom para aproximar. A
                área em destaque é exatamente como a foto aparecerá no site.
              </p>

              {/* Moldura de Recorte com Aspect Ratio Fixo */}
              <div className="flex justify-center bg-warm-900/5 p-4 rounded-2xl border border-warm-200">
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    aspectRatio: `${cropSlot.aspectRatioNumber}`,
                    maxHeight: '380px',
                    width: '100%',
                    maxWidth: '420px',
                  }}
                  className="relative overflow-hidden rounded-2xl border-2 border-sage-600 cursor-grab active:cursor-grabbing bg-warm-100 select-none shadow-md"
                >
                  <img
                    ref={imageRef}
                    src={cropImageSrc}
                    alt="Pré-visualização para corte"
                    draggable={false}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: 'center center',
                      maxWidth: 'none',
                      maxHeight: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-50%',
                      marginLeft: '-50%',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                    className="pointer-events-none"
                  />

                  {/* Guia sutil de terços (regra dos terços) */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>
                </div>
              </div>

              {/* Controles de Zoom e Reset */}
              <div className="space-y-3 bg-warm-50 p-4 rounded-xl border border-warm-200">
                <div className="flex items-center justify-between text-xs font-semibold text-warm-700">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-warm-500" />
                    Zoom da Foto ({Math.round(zoom * 100)}%)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setZoom(1)
                      setPan({ x: 0, y: 0 })
                    }}
                    className="h-7 text-xs text-warm-600"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Centralizar
                  </Button>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.05}
                  onValueChange={([val]) => setZoom(val)}
                  className="w-full"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCropSlot(null)}
                  disabled={isProcessingCrop}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmCrop}
                  disabled={isProcessingCrop}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  {isProcessingCrop ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando e Publicando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar Foto Recortada
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
