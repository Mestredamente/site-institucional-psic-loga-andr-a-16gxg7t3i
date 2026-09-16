import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { uploadSiteMedia } from '@/services/content'
import { toast } from '@/hooks/use-toast'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'

interface MediaTabProps {
  mediaMap: Record<string, string>
  onRefresh: () => void
}

export default function MediaTab({ mediaMap, onRefresh }: MediaTabProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  const mediaItems = [
    {
      key: 'hero_foto',
      title: 'Foto Principal (Hero)',
      desc: 'Foto profissional vertical que aparece na tela inicial ao lado do texto de boas-vindas.',
    },
    {
      key: 'sobre_foto',
      title: 'Foto Secundária (Sobre Mim)',
      desc: 'Foto do consultório, ambiente ou retrato que aparece na seção Sobre Mim.',
    },
    {
      key: 'logo',
      title: 'Logo do Consultório',
      desc: 'Logotipo personalizado que substitui o nome no topo do site (formato PNG transparente recomendado).',
    },
    {
      key: 'favicon',
      title: 'Favicon / Ícone da Aba',
      desc: 'Ícone que aparece na aba do navegador do usuário.',
    },
  ]

  const handleFileUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingKey(key)
    try {
      await uploadSiteMedia(key, file)
      toast({
        title: 'Mídia atualizada!',
        description: 'A imagem foi enviada e o site já está com a nova mídia.',
      })
      onRefresh()
    } catch (err: any) {
      console.error('Erro no upload de mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Falha no envio',
        description: err.message || 'Não foi possível carregar a imagem.',
      })
    } finally {
      setUploadingKey(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-warm-700">Gerenciar Mídia e Fotos</h2>
        <p className="text-sm text-warm-500">
          Substitua o logo, favicon e as fotos profissionais do site a qualquer momento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mediaItems.map((item) => {
          const currentUrl = mediaMap[item.key]
          const isUploading = uploadingKey === item.key

          return (
            <Card key={item.key} className="border-warm-200">
              <CardHeader>
                <CardTitle className="text-base font-serif">{item.title}</CardTitle>
                <CardDescription className="text-xs">{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video w-full rounded-2xl bg-warm-100 border border-warm-200 overflow-hidden flex items-center justify-center relative">
                  {currentUrl ? (
                    <img
                      src={currentUrl}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-warm-400">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs font-medium">Usando imagem padrão do sistema</span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-sage-600" />
                    </div>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor={`upload-${item.key}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-warm-300 bg-white hover:bg-warm-50 text-sm font-medium text-warm-700 cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="w-4 h-4 mr-2 text-warm-500" />
                    {currentUrl ? 'Trocar Imagem' : 'Enviar Imagem'}
                  </Label>
                  <input
                    id={`upload-${item.key}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(item.key, e)}
                    disabled={isUploading}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
