import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import AdminLogin from '@/components/admin/AdminLogin'
import EditTextsTab from '@/components/admin/EditTextsTab'
import IdentityTab from '@/components/admin/IdentityTab'
import MediaTab from '@/components/admin/MediaTab'
import BlogTab from '@/components/admin/BlogTab'
import DocumentsTab from '@/components/admin/DocumentsTab'
import PrivateNotesTab from '@/components/admin/PrivateNotesTab'
import SettingsTab from '@/components/admin/SettingsTab'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  FileText,
  Image,
  BookOpen,
  FolderOpen,
  Lock,
  ExternalLink,
  LogOut,
  Loader2,
  Palette,
  Settings,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  fetchSiteContent,
  fetchSiteMedia,
  fetchBlogPosts,
  fetchDocuments,
  fetchPrivateNotes,
  restoreDefaultContent,
  exportContentBackup,
  importContentBackup,
} from '@/services/content'
import { applyAccentColor, applyFavicon } from '@/lib/theme'
import { toast } from '@/hooks/use-toast'
import type { BlogPostRecord, DocumentRecord, PrivateNoteRecord } from '@/types/content'
import { Download, Upload as UploadIcon } from 'lucide-react'

export default function Admin() {
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState('texts')

  const [contentMap, setContentMap] = useState<Record<string, any>>({})
  const [mediaMap, setMediaMap] = useState<Record<string, string>>({})
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [privateNotes, setPrivateNotes] = useState<PrivateNoteRecord[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSyncingBackground, setIsSyncingBackground] = useState(false)

  // Modal para Restaurar Conteúdo Padrão
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  // Exportar / Importar Backup JSON
  const [isExporting, setIsExporting] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importJsonText, setImportJsonText] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleExportBackup = async () => {
    setIsExporting(true)
    try {
      const json = await exportContentBackup()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateStr = new Date().toISOString().split('T')[0]
      a.href = url
      a.download = `backup-site-andrea-armoa-${dateStr}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: 'Backup exportado!',
        description: 'Arquivo .json baixado com sucesso contendo textos, posts e metadados.',
      })
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao exportar backup',
        description: err.message || 'Falha ao gerar arquivo.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setImportJsonText((event.target?.result as string) || '')
      setIsImportModalOpen(true)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleConfirmImport = async () => {
    if (!importJsonText) return
    setIsImporting(true)
    try {
      const res = await importContentBackup(importJsonText)
      toast({
        title: 'Conteúdo importado com sucesso!',
        description: `${res.count} seções foram atualizadas e publicadas no site.`,
      })
      setIsImportModalOpen(false)
      setImportJsonText('')
      await loadAllData()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao importar backup',
        description: err.message || 'O arquivo fornecido não é válido.',
      })
    } finally {
      setIsImporting(false)
    }
  }

  const loadAllData = useCallback(
    async (isInitial = false) => {
      if (!isAuthenticated) return
      if (isInitial) {
        setIsInitialLoading(true)
      } else {
        setIsSyncingBackground(true)
      }

      try {
        // Buscar todas as coleções com tratamento de erro e timeout individual
        const [contentRes, mediaRes, postsRes, docsRes, notesRes] = await Promise.allSettled([
          fetchSiteContent(),
          fetchSiteMedia(),
          fetchBlogPosts(false), // todos, incluindo rascunhos
          fetchDocuments(),
          fetchPrivateNotes(),
        ])

        let hasAnyFailure = false

        if (contentRes.status === 'fulfilled') {
          setContentMap(contentRes.value)
          if (contentRes.value['site_config']?.accent_color) {
            applyAccentColor(contentRes.value['site_config'].accent_color)
          }
        } else {
          hasAnyFailure = true
          console.error('Erro ao sincronizar site_content:', contentRes.reason)
        }

        if (mediaRes.status === 'fulfilled') {
          setMediaMap(mediaRes.value)
          if (mediaRes.value['favicon']) {
            applyFavicon(mediaRes.value['favicon'])
          }
        } else {
          hasAnyFailure = true
          console.error('Erro ao sincronizar site_media:', mediaRes.reason)
        }

        if (postsRes.status === 'fulfilled') {
          setBlogPosts(postsRes.value)
        } else {
          hasAnyFailure = true
          console.error('Erro ao sincronizar blog_posts:', postsRes.reason)
        }

        if (docsRes.status === 'fulfilled') {
          setDocuments(docsRes.value)
        } else {
          hasAnyFailure = true
          console.error('Erro ao sincronizar documents:', docsRes.reason)
        }

        if (notesRes.status === 'fulfilled') {
          setPrivateNotes(notesRes.value)
        } else {
          hasAnyFailure = true
          console.error('Erro ao sincronizar private_notes:', notesRes.reason)
        }

        if (hasAnyFailure && !isInitial) {
          toast({
            variant: 'destructive',
            title: 'Aviso de sincronização',
            description: 'Não foi possível sincronizar — tente novamente',
          })
        }
      } catch (err) {
        console.error('Erro ao buscar dados do admin:', err)
        if (!isInitial) {
          toast({
            variant: 'destructive',
            title: 'Aviso de sincronização',
            description: 'Não foi possível sincronizar — tente novamente',
          })
        }
      } finally {
        if (isInitial) {
          setIsInitialLoading(false)
        }
        setIsSyncingBackground(false)
      }
    },
    [isAuthenticated],
  )

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData(true)
    }
  }, [isAuthenticated, loadAllData])

  const handleConfirmRestore = async () => {
    setIsRestoring(true)
    try {
      await restoreDefaultContent()
      toast({
        title: 'Conteúdo padrão restaurado!',
        description: 'Os textos originais e configurações iniciais foram reinseridos no backend.',
      })
      setIsRestoreModalOpen(false)
      await loadAllData()
    } catch (err: any) {
      console.error('Erro ao restaurar conteúdo padrão:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao restaurar',
        description: err.message || 'Falha ao restaurar dados.',
      })
    } finally {
      setIsRestoring(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
      </div>
    )
  }

  // Se não estiver logado, exibe a tela de login protegida
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  // Verificação de pendências e dados placeholder
  const contatoContent = contentMap['contato'] || {}
  const rawWhatsapp = contatoContent.whatsapp || ''
  const hasPendingWhatsapp =
    !rawWhatsapp || /^5{0,2}1{0,2}9{4,}/.test(rawWhatsapp) || rawWhatsapp.length < 10
  const hasPendingAddress = !contatoContent.address || /p[a]ulista/i.test(contatoContent.address)
  const hasPendingEmail = !contatoContent.email || !contatoContent.email.includes('@')
  const hasAnyPending = hasPendingWhatsapp || hasPendingAddress || hasPendingEmail

  return (
    <div className="min-h-screen bg-warm-100/60 flex flex-col justify-between">
      <div>
        {/* Header Superior do Painel Administrativo */}
        <header className="bg-white border-b border-warm-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sage-200 text-sage-800 flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-warm-700 leading-tight">
                  Painel da Profissional • CMS
                </h1>
                <span className="text-xs text-warm-500">
                  {user?.name || 'Andréa Armôa'} • CRP 14/075954
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Indicador sutil de sincronização em segundo plano */}
              {isSyncingBackground && (
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-50 text-sage-700 text-xs font-medium border border-sage-200 animate-pulse"
                  title="Atualizando dados em segundo plano..."
                >
                  <Loader2 className="w-3 h-3 animate-spin text-sage-600" />
                  <span>Sincronizando...</span>
                </div>
              )}

              {/* Exportar Backup JSON */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportBackup}
                disabled={isExporting}
                title="Baixar backup completo de todos os textos em formato .json"
                className="border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl text-xs"
              >
                {isExporting ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5 text-warm-600" />
                )}
                Exportar JSON
              </Button>

              {/* Importar Backup JSON */}
              <label
                htmlFor="import-backup-file"
                className="inline-flex items-center justify-center px-3 py-1.5 border border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                title="Importar backup .json e restaurar conteúdos"
              >
                <UploadIcon className="w-3.5 h-3.5 mr-1.5 text-warm-600" />
                Importar JSON
              </label>
              <input
                id="import-backup-file"
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileImport}
              />

              {/* Botão Restaurar Conteúdo Padrão */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRestoreModalOpen(true)}
                className="border-warm-300 text-warm-600 hover:bg-warm-100 rounded-xl text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-warm-500" />
                Restaurar Inicial
              </Button>

              {/* Botão Ver Site (Abre em nova aba) */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl text-xs"
              >
                <Link to="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
                  Ver Site Público
                </Link>
              </Button>

              {/* Botão Sair */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal com Abas do CMS */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          {/* Banner de Verificação de Placeholder / Dados Fictícios */}
          {hasAnyPending && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-900">
                    Aviso Ético &amp; Verificação de Dados do Site
                  </p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Para conformidade com o Código de Ética e proteger sua credibilidade
                    profissional, dados de exemplo foram ocultados do site público até que você
                    informe os reais:
                  </p>
                  <ul className="text-[11px] text-amber-700 list-disc list-inside space-y-0.5 pt-1">
                    {hasPendingWhatsapp && (
                      <li>
                        WhatsApp: número real não informado (botões direcionam com segurança para o
                        rodapé).
                      </li>
                    )}
                    {hasPendingAddress && (
                      <li>
                        Endereço presencial: mantido oculto (o site exibe atendimento presencial com
                        agendamento prévio e online nacional).
                      </li>
                    )}
                    {hasPendingEmail && (
                      <li>E-mail: campo mantido oculto até confirmação de e-mail ativo.</li>
                    )}
                  </ul>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveTab('texts')}
                className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl text-xs shrink-0 font-semibold"
              >
                Preencher na Aba Conteúdo
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Barra de Abas Elegante */}
            <div className="bg-white p-1.5 rounded-2xl border border-warm-200 shadow-xs overflow-x-auto">
              <TabsList className="bg-transparent h-auto gap-2 flex-nowrap min-w-max">
                {/* 1. Conteúdo */}
                <TabsTrigger
                  value="texts"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  1. Conteúdo (Textos)
                </TabsTrigger>

                {/* 2. Identidade Visual */}
                <TabsTrigger
                  value="identity"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  2. Identidade & Cores
                </TabsTrigger>

                {/* 3. Fotos */}
                <TabsTrigger
                  value="media"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <Image className="w-4 h-4" />
                  3. Fotos & Recorte
                </TabsTrigger>

                {/* 4. Blog / Vlog */}
                <TabsTrigger
                  value="blog"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  4. Blog & Vlog
                </TabsTrigger>

                {/* 5. Documentos */}
                <TabsTrigger
                  value="documents"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  5. Documentos
                </TabsTrigger>

                {/* 6. Notas Privadas */}
                <TabsTrigger
                  value="notes"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  6. Notas Privadas
                </TabsTrigger>

                {/* 7. Backend & Configuração */}
                <TabsTrigger
                  value="settings"
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  7. Backend & Configuração
                </TabsTrigger>
              </TabsList>
            </div>

            {isInitialLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-warm-500 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
                <p className="text-sm">Carregando painel administrativo...</p>
              </div>
            ) : (
              <>
                {/* Aba 1: Conteúdo */}
                <TabsContent value="texts" className="focus:outline-none">
                  <EditTextsTab contentMap={contentMap} onRefresh={() => loadAllData(false)} />
                </TabsContent>

                {/* Aba 2: Identidade Visual e Cores */}
                <TabsContent value="identity" className="focus:outline-none">
                  <IdentityTab
                    contentMap={contentMap}
                    mediaMap={mediaMap}
                    onRefresh={() => loadAllData(false)}
                  />
                </TabsContent>

                {/* Aba 3: Fotos & Recorte */}
                <TabsContent value="media" className="focus:outline-none">
                  <MediaTab mediaMap={mediaMap} onRefresh={() => loadAllData(false)} />
                </TabsContent>

                {/* Aba 4: Blog/Vlog */}
                <TabsContent value="blog" className="focus:outline-none">
                  <BlogTab posts={blogPosts} onRefresh={() => loadAllData(false)} />
                </TabsContent>

                {/* Aba 5: Documentos */}
                <TabsContent value="documents" className="focus:outline-none">
                  <DocumentsTab documents={documents} onRefresh={() => loadAllData(false)} />
                </TabsContent>

                {/* Aba 6: Notas Privadas */}
                <TabsContent value="notes" className="focus:outline-none">
                  <PrivateNotesTab notes={privateNotes} onRefresh={() => loadAllData(false)} />
                </TabsContent>

                {/* Aba 7: Backend & Configurações */}
                <TabsContent value="settings" className="focus:outline-none">
                  <SettingsTab />
                </TabsContent>
              </>
            )}
          </Tabs>
        </main>
      </div>

      {/* Rodapé Ético e LGPD do Painel */}
      <footer className="mt-12 bg-white border-t border-warm-200 py-6 text-xs text-warm-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
            <span>
              <strong>Proteção de Dados & Sigilo (LGPD):</strong> Painel de uso exclusivo da
              profissional. Nenhum dado ou prontuário de paciente é armazenado neste sistema.
            </span>
          </div>

          <p className="text-center md:text-right text-warm-500 font-medium">
            O conteúdo publicado possui finalidade estritamente educativa e informativa, não
            substituindo atendimento psicológico clínico.
          </p>
        </div>
      </footer>

      {/* Modal de Confirmação para Restaurar Conteúdo Padrão */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent className="max-w-md bg-white border-warm-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg flex items-center gap-2 text-warm-800">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Restaurar Conteúdo Padrão?
            </DialogTitle>
            <DialogDescription className="text-xs text-warm-600 leading-relaxed pt-2">
              Esta ação substituirá os textos de todas as seções (Hero, Sobre Mim, Psicoterapia,
              Orientação Parental, FAQ, Contato) e a cor de destaque pelos valores originais de
              apresentação.
              <br />
              <br />
              <strong className="text-warm-800">Atenção:</strong> Suas edições recentes serão
              sobrescritas no banco de dados. Publicações do blog, documentos e notas privadas não
              serão afetadas.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsRestoreModalOpen(false)}
              disabled={isRestoring}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="rounded-xl"
            >
              {isRestoring ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Restaurando...
                </>
              ) : (
                'Sim, Restaurar Textos'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação para Importar Backup JSON */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-md bg-white border-warm-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg flex items-center gap-2 text-warm-800">
              <UploadIcon className="w-5 h-5 text-sage-600" />
              Restaurar Backup a partir de Arquivo JSON?
            </DialogTitle>
            <DialogDescription className="text-xs text-warm-600 leading-relaxed pt-2">
              Você carregou um arquivo de backup válido. Deseja sobrescrever os textos atuais do
              site com os dados contidos no arquivo?
              <br />
              <br />
              <strong className="text-warm-800">Segurança:</strong> Suas alterações anteriores serão
              armazenadas no Histórico de Versões e você poderá desfazer se necessário.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportModalOpen(false)
                setImportJsonText('')
              }}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                'Sim, Importar e Publicar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
