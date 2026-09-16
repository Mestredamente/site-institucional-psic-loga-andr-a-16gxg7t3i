import { useState } from 'react'
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
import { Plus, Trash2, Edit, Video, BookOpen, Loader2 } from 'lucide-react'
import { createBlogPost, updateBlogPost, deleteBlogPost, getFileUrl } from '@/services/content'
import type { BlogPostRecord } from '@/types/content'
import { toast } from '@/hooks/use-toast'

interface BlogTabProps {
  posts: BlogPostRecord[]
  onRefresh: () => void
}

export default function BlogTab({ posts, onRefresh }: BlogTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<'blog' | 'vlog'>('blog')
  const [published, setPublished] = useState(true)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaUrl, setMediaUrl] = useState('')

  const handleOpenCreate = () => {
    setEditingPost(null)
    setTitle('')
    setContent('')
    setType('blog')
    setPublished(true)
    setMediaFile(null)
    setMediaUrl('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (post: BlogPostRecord) => {
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content)
    setType(post.type)
    setPublished(post.published)
    setMediaFile(null)
    setMediaUrl(post.media_url || '')
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('type', type)
    formData.append('published', String(published))
    if (mediaFile) {
      formData.append('media_file', mediaFile)
    }
    if (mediaUrl) {
      formData.append('media_url', mediaUrl)
    }

    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, formData)
        toast({
          title: 'Publicado com sucesso!',
          description: published
            ? 'A publicação já está visível para os visitantes do site.'
            : 'Salvo como rascunho.',
        })
      } else {
        await createBlogPost(formData)
        toast({
          title: 'Publicação criada e salva no backend!',
          description: published
            ? 'O artigo já está disponível no site público.'
            : 'Salvo como rascunho no painel.',
        })
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar publicação:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: err.message,
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

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingPost ? 'Editar Publicação' : 'Criar Nova Publicação'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como o acolhimento transforma a infância"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Tipo de Conteúdo</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Artigo de Blog</SelectItem>
                      <SelectItem value="vlog">Vídeo / Vlog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-warm-200 mt-auto">
                  <Label className="cursor-pointer text-xs font-semibold">Publicado no site?</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Imagem de Capa ou Arquivo</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
              </div>

              {type === 'vlog' && (
                <div className="space-y-1.5">
                  <Label>URL do Vídeo (YouTube, Vimeo, etc.)</Label>
                  <Input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Conteúdo do Texto (aceita parágrafos)</Label>
                <Textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva seu artigo aqui..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-sage-600 hover:bg-sage-700 text-white"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Salvar Publicação
                </Button>
              </div>
            </form>
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
                    <CardDescription className="text-xs line-clamp-3">
                      {post.content.replace(/<[^>]+>/g, '')}
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
