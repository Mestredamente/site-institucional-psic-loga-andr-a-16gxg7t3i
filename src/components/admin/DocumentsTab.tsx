import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, FileText, Download, Loader2 } from 'lucide-react'
import { createDocument, deleteDocument, getFileUrl } from '@/services/content'
import type { DocumentRecord } from '@/types/content'
import { toast } from '@/hooks/use-toast'

interface DocumentsTabProps {
  documents: DocumentRecord[]
  onRefresh: () => void
}

export default function DocumentsTab({ documents, onRefresh }: DocumentsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !file) {
      toast({
        variant: 'destructive',
        title: 'Campos incompletos',
        description: 'Informe o título e selecione um arquivo.',
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('file', file)

    try {
      await createDocument(formData)
      toast({
        title: 'Documento publicado com sucesso!',
        description:
          'O arquivo foi salvo na coleção do backend e já pode ser baixado no site público.',
      })
      setTitle('')
      setDescription('')
      setFile(null)
      setIsDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao subir documento:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao anexar',
        description: err.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este documento?')) return
    try {
      await deleteDocument(id)
      toast({ title: 'Documento removido.' })
      onRefresh()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover',
        description: err.message,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-warm-700">Anexar Documentos</h2>
          <p className="text-sm text-warm-500">
            Disponibilize PDFs, termos e informativos públicos para download no site.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Anexar Documento
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Novo Documento Público</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Título do Documento</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Guia Informativo de Orientação Parental"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Descrição Curta (Opcional)</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Orientações práticas para o dia a dia em família"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Arquivo (PDF, Documento)</Label>
                <Input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                  Anexar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <Card className="border-dashed border-warm-300 p-8 text-center bg-warm-50/50">
          <FileText className="w-10 h-10 text-warm-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-warm-700">Nenhum documento anexado</h3>
          <p className="text-sm text-warm-500 max-w-sm mx-auto mt-1 mb-4">
            Anexe materiais complementares ou guias para que seus pacientes possam baixá-los.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const url = getFileUrl(doc, doc.file)
            return (
              <Card key={doc.id} className="border-warm-200">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-sage-700" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-warm-700">{doc.title}</h4>
                      {doc.description && (
                        <p className="text-xs text-warm-500 mt-0.5">{doc.description}</p>
                      )}
                      <span className="text-[11px] text-warm-400 mt-1 block">
                        Adicionado em {new Date(doc.created).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-warm-100 hover:bg-sage-100 text-warm-700 hover:text-sage-800 transition-colors"
                      title="Baixar arquivo"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
