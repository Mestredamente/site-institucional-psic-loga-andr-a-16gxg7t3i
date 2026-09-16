import React, { useState, Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Trash2,
  Edit,
  Video,
  BookOpen,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { createBlogPost, updateBlogPost, deleteBlogPost, getFileUrl } from '@/services/content'
import type { BlogPostRecord } from '@/types/content'
import { toast } from '@/hooks/use-toast'

interface BlogTabProps {
  posts: BlogPostRecord[]
  onRefresh: () => void
}

// Error Boundary para isolar falhas de renderização no formulário do modal
interface FormErrorBoundaryProps {
  children: ReactNode
  onReset?: () => void
}

interface FormErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class FormErrorBoundary extends Component<FormErrorBoundaryProps, FormErrorBoundaryState> {
  constructor(props: FormErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): FormErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[BlogTab FormErrorBoundary] Erro capturado no formulário:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3 my-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-red-900 text-sm">
              Ocorreu um erro ao carregar o formulário
            </h4>
            <p className="text-xs text-red-700">
              {this.state.error?.message || 'Falha inesperada na interface do formulário.'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              this.props.onReset?.()
            }}
            className="border-red-300 text-red-800 hover:bg-red-100 rounded-xl text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Recuperar Formulário
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

// Interface completa do estado do formulário para garantir inicialização segura
interface PostFormData {
  title: string
  resumo: string
  content: string
  type: 'blog' | 'vlog'
  published: boolean
  mediaFile: File | null
  mediaUrl: string
}

const INITIAL_FORM_DATA: PostFormData = {
  title: '',
  resumo: '',
  content: '',
  type: 'blog',
  published: true,
  mediaFile: null,
  mediaUrl: '',
}

export default function BlogTab({ posts, onRefresh }: BlogTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Estado unificado inicializado de forma segura com todos os campos existentes desde o início
  const [formData, setFormData] = useState<PostFormData>(INITIAL_FORM_DATA)

  const handleOpenCreate = () => {
    setEditingPost(null)
    setFormData({ ...INITIAL_FORM_DATA })
    setFormError(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (post: BlogPostRecord) => {
    setEditingPost(post)
    // Inicialização segura: todos os campos possuem fallback de tipo para evitar null/undefined
    const safeResumo =
      typeof post.resumo === 'string'
        ? post.resumo
        : (post.content || '')
            .replace(/<[^>]+>/g, '')
            .trim()
            .slice(0, 160)

    setFormData({
      title: post.title || '',
      resumo: safeResumo || '',
      content: post.content || '',
      type: post.type === 'vlog' ? 'vlog' : 'blog',
      published: Boolean(post.published),
      mediaFile: null,
      mediaUrl: post.media_url || '',
    })
    setFormError(null)
    setIsDialogOpen(true)
  }

  // Alternância segura entre Blog e Vlog: preserva dados comuns e específicos sem quebras de estado
  const handleTypeChange = (newType: string) => {
    try {
      const safeType: 'blog' | 'vlog' = newType === 'vlog' ? 'vlog' : 'blog'
      setFormData((prev) => ({
        ...prev,
        type: safeType,
        // Garante que mediaUrl seja sempre string para evitar null pointer
        mediaUrl: typeof prev.mediaUrl === 'string' ? prev.mediaUrl : '',
      }))
    } catch (err: any) {
      console.error('[BlogTab] Erro ao alternar tipo:', err)
      setFormError('Não foi possível alternar o tipo de conteúdo. Tente novamente.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const cleanTitle = (formData.title || '').trim()
    const cleanResumo = (formData.resumo || '').trim()
    const cleanContent = (formData.content || '').trim()

    if (!cleanTitle) {
      setFormError('Por favor, informe o título da publicação.')
      return
    }

    if (!cleanResumo) {
      setFormError('O campo Resumo é obrigatório (limite de 160 caracteres).')
      return
    }

    if (cleanResumo.length > 160) {
      setFormError('O Resumo não pode ultrapassar 160 caracteres.')
      return
    }

    if (!cleanContent) {
      setFormError('Por favor, insira o conteúdo do texto da publicação.')
      return
    }

    setIsSubmitting(true)
    const payload = new FormData()
    payload.append('title', cleanTitle)
    payload.append('resumo', cleanResumo)
    payload.append('content', cleanContent)
    payload.append('type', formData.type)
    payload.append('published', String(formData.published))

    if (formData.mediaFile) {
      payload.append('media_file', formData.mediaFile)
    }
    if (formData.type === 'vlog' && formData.mediaUrl.trim()) {
      payload.append('media_url', formData.mediaUrl.trim())
    }

    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, payload)
        toast({
          title: 'Publicado com sucesso!',
          description: formData.published
            ? 'A publicação já está visível para os visitantes do site.'
            : 'Salvo como rascunho.',
        })
      } else {
        await createBlogPost(payload)
        toast({
          title: 'Publicação criada e salva no backend!',
          description: formData.published
            ? 'O artigo já está disponível no site público.'
            : 'Salvo como rascunho no painel.',
        })
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar publicação:', err)
      const errorMsg = err.message || 'Falha ao salvar publicação.'
      setFormError(errorMsg)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: errorMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta publicação?')) return
    try {
      await deleteBlogPost(id)
      toast({ title: 'Publicação excluída.' })
      onRefresh()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: err.message,
      })
    }
  }

  const charsLeft = 160 - (formData.resumo || '').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-warm-700">Publicações (Blog / Vlog)</h2>
          <p className="text-sm text-warm-500">
            Compartilhe artigos, reflexões ou vídeos com seus pacientes e visitantes.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenCreate}
              className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Publicação
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingPost ? 'Editar Publicação' : 'Criar Nova Publicação'}
              </DialogTitle>
            </DialogHeader>

            <FormErrorBoundary onReset={() => setFormData({ ...INITIAL_FORM_DATA })}>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Campo 1: Título */}
                <div className="space-y-1.5">
                  <Label htmlFor="post-title" className="font-medium">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="post-title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Como o acolhimento transforma a infância"
                  />
                </div>

                {/* Campo NOVO 2: Resumo posicionado entre Título e Conteúdo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="post-resumo" className="font-medium">
                      Resumo da Publicação <span className="text-red-500">*</span>
                    </Label>
                    <span
                      className={`text-xs tabular-nums font-medium ${
                        charsLeft < 0
                          ? 'text-red-600 font-bold'
                          : charsLeft < 20
                            ? 'text-amber-600'
                            : 'text-warm-400'
                      }`}
                    >
                      {charsLeft} caracteres restantes
                    </span>
                  </div>
                  <Textarea
                    id="post-resumo"
                    rows={2}
                    required
                    maxLength={160}
                    value={formData.resumo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resumo: e.target.value }))}
                    placeholder="Texto curto e atrativo para o card e meta description dos buscadores (máximo 160 caracteres)."
                    className="resize-none"
                  />
                  <p className="text-[11px] text-warm-500">
                    Exibido no card de listagem do site e nas prévias de compartilhamento (Google,
                    WhatsApp, redes sociais).
                  </p>
                </div>

                {/* Seletor de Tipo e Publicação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="post-type" className="font-medium">
                      Tipo de Conteúdo
                    </Label>
                    <Select value={formData.type} onValueChange={handleTypeChange}>
                      <SelectTrigger id="post-type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Artigo de Blog</SelectItem>
                        <SelectItem value="vlog">Vídeo / Vlog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-warm-200 mt-auto bg-warm-50/50">
                    <div>
                      <Label
                        htmlFor="post-published-switch"
                        className="cursor-pointer text-xs font-semibold block"
                      >
                        Publicado no site?
                      </Label>
                      <span className="text-[11px] text-warm-500">
                        {formData.published ? 'Visível para todos' : 'Salvo como rascunho'}
                      </span>
                    </div>
                    <Switch
                      id="post-published-switch"
                      checked={formData.published}
                      onCheckedChange={(val) =>
                        setFormData((prev) => ({ ...prev, published: val }))
                      }
                    />
                  </div>
                </div>

                {/* Imagem de Capa */}
                <div className="space-y-1.5">
                  <Label htmlFor="post-media-file" className="font-medium">
                    {formData.type === 'vlog'
                      ? 'Capa Personalizada do Vídeo (Opcional)'
                      : 'Imagem de Capa (Opcional)'}
                  </Label>
                  <Input
                    id="post-media-file"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mediaFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                  <p className="text-[11px] text-warm-400">Formatos aceitos: JPG, PNG, WebP.</p>
                </div>

                {/* Campos condicionais de Vídeo (Vlog) - Inicializados de forma segura */}
                {formData.type === 'vlog' && (
                  <div className="space-y-1.5 p-3.5 bg-sage-50/70 border border-sage-200 rounded-xl transition-all">
                    <Label htmlFor="post-media-url" className="font-medium text-sage-900">
                      URL do Vídeo (YouTube, Vimeo, etc.)
                    </Label>
                    <Input
                      id="post-media-url"
                      type="url"
                      value={formData.mediaUrl || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, mediaUrl: e.target.value }))
                      }
                      placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..."
                    />
                    <p className="text-[11px] text-sage-700">
                      Cole o link completo do vídeo para exibição de player integrado.
                    </p>
                  </div>
                )}

                {/* Campo 3: Conteúdo do Texto */}
                <div className="space-y-1.5">
                  <Label htmlFor="post-content" className="font-medium">
                    Conteúdo do Texto (aceita parágrafos) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="post-content"
                    rows={6}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Escreva seu artigo completo aqui..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-warm-100">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || charsLeft < 0}
                    className="bg-sage-600 hover:bg-sage-700 text-white"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar Publicação
                  </Button>
                </div>
              </form>
            </FormErrorBoundary>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card className="border-dashed border-warm-300 p-8 text-center bg-warm-50/50">
          <BookOpen className="w-10 h-10 text-warm-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-warm-700">Nenhuma publicação ainda</h3>
          <p className="text-sm text-warm-500 max-w-sm mx-auto mt-1 mb-4">
            Crie seu primeiro post ou vlog para enriquecer o site com conteúdos informativos.
          </p>
          <Button onClick={handleOpenCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Post
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const mediaUrl = post.media_file ? getFileUrl(post, post.media_file) : post.media_url
            return (
              <Card key={post.id} className="border-warm-200 flex flex-col justify-between">
                <div>
                  {mediaUrl && (
                    <div className="aspect-video w-full bg-warm-100 overflow-hidden rounded-t-xl">
                      {post.type === 'vlog' ? (
                        <div className="w-full h-full flex items-center justify-center bg-warm-800 text-white">
                          <Video className="w-8 h-8 text-sage-300" />
                        </div>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warm-100 text-warm-700 uppercase tracking-wider">
                        {post.type}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          post.published ? 'bg-sage-100 text-sage-800' : 'bg-warm-200 text-warm-600'
                        }`}
                      >
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <CardTitle className="font-serif text-base line-clamp-2">
                      {post.title}
                    </CardTitle>
                    {post.resumo ? (
                      <p className="text-xs text-warm-600 line-clamp-2 font-normal mt-1 bg-warm-50/70 p-2 rounded-lg border border-warm-100">
                        <strong className="text-warm-700">Resumo:</strong> {post.resumo}
                      </p>
                    ) : null}
                    <CardDescription className="text-xs line-clamp-3 mt-1">
                      {post.content ? post.content.replace(/<[^>]+>/g, '') : ''}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-0 flex items-center justify-end gap-2 border-t border-warm-100 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(post)}
                    className="text-warm-600"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Excluir
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
