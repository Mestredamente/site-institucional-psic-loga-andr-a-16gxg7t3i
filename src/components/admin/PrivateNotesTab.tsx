import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Edit, Lock, ShieldCheck, Loader2 } from 'lucide-react'
import { createPrivateNote, updatePrivateNote, deletePrivateNote } from '@/services/content'
import type { PrivateNoteRecord } from '@/types/content'
import { toast } from '@/hooks/use-toast'

interface PrivateNotesTabProps {
  notes: PrivateNoteRecord[]
  onRefresh: () => void
}

export default function PrivateNotesTab({ notes, onRefresh }: PrivateNotesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<PrivateNoteRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleOpenCreate = () => {
    setEditingNote(null)
    setTitle('')
    setContent('')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (note: PrivateNoteRecord) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      if (editingNote) {
        await updatePrivateNote(editingNote.id, { title, content })
        toast({ title: 'Nota privada atualizada!' })
      } else {
        await createPrivateNote({ title, content })
        toast({ title: 'Nota privada salva com segurança!' })
      }
      setIsDialogOpen(false)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar nota:', err)
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
    if (!confirm('Deseja realmente excluir esta anotação privada?')) return
    try {
      await deletePrivateNote(id)
      toast({ title: 'Nota privada excluída.' })
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
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-warm-700">Notas Privadas</h2>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
              <Lock className="w-3 h-3" /> Apenas você tem acesso
            </span>
          </div>
          <p className="text-sm text-warm-500">
            Anotações clínicas internas, ideias de artigos, lembretes e planos de atendimento. NUNCA
            visíveis ao público.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenCreate}
              className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Nota Privada
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                {editingNote ? 'Editar Nota Privada' : 'Criar Nova Anotação Privada'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Título do Registro / Lembrete</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Planejamento do workshop sobre birras"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Conteúdo da Nota (Totalmente confidencial)</Label>
                <Textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva suas anotações e reflexões aqui..."
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
                  Salvar Nota
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="border-dashed border-warm-300 p-8 text-center bg-warm-50/50">
          <ShieldCheck className="w-10 h-10 text-warm-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-warm-700">Nenhuma nota privada</h3>
          <p className="text-sm text-warm-500 max-w-sm mx-auto mt-1 mb-4">
            Utilize este espaço como um bloco de notas seguro para o seu dia a dia clínico.
          </p>
          <Button onClick={handleOpenCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Criar Primeira Anotação
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="border-warm-200 bg-amber-50/20 flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between text-xs text-warm-400 mb-1">
                  <span>{new Date(note.created).toLocaleDateString('pt-BR')}</span>
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <Lock className="w-3 h-3" /> Confidencial
                  </span>
                </div>
                <CardTitle className="font-serif text-lg text-warm-700">{note.title}</CardTitle>
                <CardDescription className="text-xs text-warm-600 whitespace-pre-wrap leading-relaxed pt-2">
                  {note.content}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 flex items-center justify-end gap-2 border-t border-warm-100 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(note)}
                  className="text-warm-600"
                >
                  <Edit className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
