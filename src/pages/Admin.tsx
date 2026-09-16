import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import AdminLogin from '@/components/admin/AdminLogin'
import EditTextsTab from '@/components/admin/EditTextsTab'
import MediaTab from '@/components/admin/MediaTab'
import BlogTab from '@/components/admin/BlogTab'
import DocumentsTab from '@/components/admin/DocumentsTab'
import PrivateNotesTab from '@/components/admin/PrivateNotesTab'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Image,
  BookOpen,
  FolderOpen,
  Lock,
  ExternalLink,
  LogOut,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  fetchSiteContent,
  fetchSiteMedia,
  fetchBlogPosts,
  fetchDocuments,
  fetchPrivateNotes,
} from '@/services/content'
import type { BlogPostRecord, DocumentRecord, PrivateNoteRecord } from '@/types/content'

export default function Admin() {
  const { isAuthenticated, isLoading: authLoading, logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState('texts')

  const [contentMap, setContentMap] = useState<Record<string, any>>({})
  const [mediaMap, setMediaMap] = useState<Record<string, string>>({})
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([])
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [privateNotes, setPrivateNotes] = useState<PrivateNoteRecord[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  const loadAllData = useCallback(async () => {
    if (!isAuthenticated) return
    setIsDataLoading(true)
    try {
      const [contentData, mediaData, postsData, docsData, notesData] = await Promise.all([
        fetchSiteContent(),
        fetchSiteMedia(),
        fetchBlogPosts(false), // todos, incluindo rascunhos
        fetchDocuments(),
        fetchPrivateNotes(),
      ])
      setContentMap(contentData)
      setMediaMap(mediaData)
      setBlogPosts(postsData)
      setDocuments(docsData)
      setPrivateNotes(notesData)
    } catch (err) {
      console.error('Erro ao buscar dados do admin:', err)
    } finally {
      setIsDataLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated, loadAllData])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
      </div>
    )
  }

  // Se não estiver logado, exibe a tela de login
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-warm-100/60 flex flex-col">
      {/* Header do Admin */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-200 text-sage-800 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-warm-700 leading-tight">
                Painel da Profissional
              </h1>
              <span className="text-xs text-warm-500">Andréa Armôa • CRP 14/075954</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-warm-300 text-warm-700 hover:bg-warm-100 rounded-xl"
            >
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Ver Site
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal com Abas */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-1.5 rounded-2xl border border-warm-200 shadow-xs overflow-x-auto">
            <TabsList className="bg-transparent h-auto gap-2 flex-nowrap min-w-max">
              <TabsTrigger
                value="texts"
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Editar Textos
              </TabsTrigger>

              <TabsTrigger
                value="media"
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Gerenciar Mídia
              </TabsTrigger>

              <TabsTrigger
                value="blog"
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Blog & Vlog
              </TabsTrigger>

              <TabsTrigger
                value="documents"
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Documentos
              </TabsTrigger>

              <TabsTrigger
                value="notes"
                className="rounded-xl px-4 py-2.5 text-xs font-semibold data-[state=active]:bg-sage-200 data-[state=active]:text-sage-900 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Notas Privadas
              </TabsTrigger>
            </TabsList>
          </div>

          {isDataLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-warm-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
              <p className="text-sm">Carregando painel...</p>
            </div>
          ) : (
            <>
              {/* Aba 1: Textos */}
              <TabsContent value="texts" className="focus:outline-none">
                <EditTextsTab contentMap={contentMap} onRefresh={loadAllData} />
              </TabsContent>

              {/* Aba 2: Mídia */}
              <TabsContent value="media" className="focus:outline-none">
                <MediaTab mediaMap={mediaMap} onRefresh={loadAllData} />
              </TabsContent>

              {/* Aba 3: Blog/Vlog */}
              <TabsContent value="blog" className="focus:outline-none">
                <BlogTab posts={blogPosts} onRefresh={loadAllData} />
              </TabsContent>

              {/* Aba 4: Documentos */}
              <TabsContent value="documents" className="focus:outline-none">
                <DocumentsTab documents={documents} onRefresh={loadAllData} />
              </TabsContent>

              {/* Aba 5: Notas Privadas */}
              <TabsContent value="notes" className="focus:outline-none">
                <PrivateNotesTab notes={privateNotes} onRefresh={loadAllData} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}
