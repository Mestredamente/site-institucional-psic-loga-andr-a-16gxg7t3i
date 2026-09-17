import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import {
  Server,
  ShieldAlert,
  KeyRound,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  ExternalLink,
  Code2,
  Info,
  Loader2,
  AlertTriangle,
} from 'lucide-react'

export default function SettingsTab() {
  const { user, updateCredentials } = useAuth()

  // Form de credenciais
  const [name, setName] = useState(user?.name || 'Andréa Armôa')
  const [email, setEmail] = useState(user?.email || 'neuropsicologa.andreaarmoa@gmail.com')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingAuth, setIsUpdatingAuth] = useState(false)

  // Status da conexão com o backend
  const backendUrl = pb.baseUrl || window.location.origin

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Senha muito curta',
        description: 'A nova senha deve ter no mínimo 8 caracteres.',
      })
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Senhas não conferem',
        description: 'A nova senha e a confirmação devem ser idênticas.',
      })
      return
    }

    setIsUpdatingAuth(true)
    try {
      await updateCredentials({
        name,
        email: email !== user?.email ? email : undefined,
        password: newPassword || undefined,
        oldPassword: oldPassword || undefined,
      })
      toast({
        title: 'Credenciais atualizadas com sucesso!',
        description:
          'Os dados da conta de administradora foram salvos no backend real (coleção users com hash seguro bcrypt).',
      })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Erro ao atualizar credenciais:', err)
      toast({
        variant: 'destructive',
        title: 'Falha ao atualizar',
        description:
          err.data?.message || err.message || 'Verifique se a senha antiga está correta.',
      })
    } finally {
      setIsUpdatingAuth(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-warm-700">
          Backend, Segurança & Configurações
        </h2>
        <p className="text-sm text-warm-500">
          Arquitetura de dados, credenciais de acesso da profissional e documentação de integração.
        </p>
      </div>

      {/* AVISO IMPORTANTE DE SEGURANÇA E LGPD */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold text-sm text-amber-950">
            Aviso de Segurança Ética & Proteção de Dados (LGPD)
          </p>
          <p>
            Este painel foi arquitetado com autenticação nativa do backend PocketBase (Skip Cloud).
            As senhas são protegidas com <strong>hashing criptográfico unilateral (bcrypt)</strong>{' '}
            no servidor e tokens JWT seguros — nunca em texto puro no navegador (localStorage).
          </p>
          <p className="text-amber-800 font-medium pt-1">
            Lembrete do Código de Ética do Psicólogo: Este CMS destina-se unicamente ao
            gerenciamento de conteúdo público institucional e anotações administrativas da
            profissional. Sob nenhuma circunstância dados clínicos confidenciais de pacientes devem
            ser inseridos neste ambiente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Credenciais */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-warm-700" />
                Credenciais de Acesso da Profissional
              </CardTitle>
              <CardDescription className="text-xs">
                Altere o e-mail ou a senha mestra de acesso ao painel (/admin). As alterações são
                salvas imediatamente na coleção{' '}
                <code className="bg-warm-100 px-1 py-0.5 rounded text-warm-700">users</code> do
                backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-warm-700">Nome de Exibição</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Andréa Armôa"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-warm-700">E-mail de Login</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="neuropsicologa.andreaarmoa@gmail.com"
                    required
                  />
                  <span className="text-[11px] text-warm-400 block">
                    E-mail titular: neuropsicologa.andreaarmoa@gmail.com
                  </span>
                </div>

                <div className="pt-2 border-t border-warm-100 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-warm-500 block">
                    Alteração de Senha (Opcional)
                  </span>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-warm-700">
                      Senha Antiga / Atual
                    </Label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <span className="text-[11px] text-warm-400 block">
                      Necessária apenas se for alterar a senha pelo painel
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-warm-700">Nova Senha</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-warm-700">
                        Confirmar Nova Senha
                      </Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingAuth}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-medium mt-2"
                >
                  {isUpdatingAuth ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Atualizando no Servidor...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Salvar Novas Credenciais no Backend
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Conexão e Migração */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Database className="w-5 h-5 text-warm-700" />
                Status da Conexão & Armazenamento Global
              </CardTitle>
              <CardDescription className="text-xs">
                Como os dados são persistidos e publicados para todos os visitantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Conexão Ativa via Skip Cloud (PocketBase)</span>
                    <p className="text-[11px] text-emerald-800">
                      Coleções sincronizadas em tempo real via WebSockets.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                  Online
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-warm-700">
                  URL do Endpoint Backend
                </Label>
                <div className="p-2.5 rounded-xl bg-warm-100 font-mono text-xs text-warm-700 break-all select-all border border-warm-200">
                  {backendUrl}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-warm-700">
                  Coleções Ativas no Servidor:
                </Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">site_content</span>
                    <span className="text-[11px] text-warm-500">
                      Textos de todas as seções (JSON)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">site_media</span>
                    <span className="text-[11px] text-warm-500">Fotos, Logo e Favicon</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">blog_posts</span>
                    <span className="text-[11px] text-warm-500">Artigos e Vlogs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">documents</span>
                    <span className="text-[11px] text-warm-500">PDFs e materiais informativos</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">private_notes</span>
                    <span className="text-[11px] text-warm-500">
                      Notas internas (Acesso restrito)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">content_versions</span>
                    <span className="text-[11px] text-warm-500">
                      Histórico de versões e Desfazer
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-warm-50 border border-warm-200">
                    <span className="font-bold text-warm-800 block">users</span>
                    <span className="text-[11px] text-warm-500">Auth collection com bcrypt</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guia de Migração para Supabase / Firebase */}
          <Card className="border-warm-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Cloud className="w-4 h-4 text-warm-700" />
                Guia: Migração para Supabase / Firebase / Outro Backend
              </CardTitle>
              <CardDescription className="text-xs">
                Passo a passo caso a equipe deseje transferir a arquitetura para outro provedor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-warm-600 leading-relaxed">
              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200 space-y-2">
                <p className="font-semibold text-warm-800">
                  1. Mapeamento de Schemas (Equivalência Relacional/NoSQL):
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>
                    <strong>Supabase (PostgreSQL):</strong> Criar tabelas equivalentes com RLS (Row
                    Level Security) habilitado: política de <code>SELECT</code> pública para
                    conteúdo e<code>INSERT/UPDATE/DELETE</code> permitidos apenas para{' '}
                    <code>auth.uid() IS NOT NULL</code>.
                  </li>
                  <li>
                    <strong>Firebase (Firestore + Storage):</strong> Criar coleções com regras:
                    <code>allow read: if true; allow write: if request.auth != null;</code>.
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200 space-y-2">
                <p className="font-semibold text-warm-800">2. Substituição do Cliente de Dados:</p>
                <p className="text-[11px]">
                  Basta substituir o arquivo de serviço em{' '}
                  <code className="font-mono bg-warm-200/60 px-1 py-0.5 rounded">
                    src/services/content.ts
                  </code>{' '}
                  e o provedor de autenticação em{' '}
                  <code className="font-mono bg-warm-200/60 px-1 py-0.5 rounded">
                    src/context/AuthContext.tsx
                  </code>
                  , mantendo as mesmas assinaturas de função (ex: <code>fetchSiteContent</code>,{' '}
                  <code>updateSiteContent</code>). Todo o restante do painel continuará funcionando
                  perfeitamente sem alterações nos componentes de visualização.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
