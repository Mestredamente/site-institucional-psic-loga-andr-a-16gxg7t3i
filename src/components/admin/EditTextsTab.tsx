import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { updateSiteContent, fetchContentVersions, restoreContentVersion } from '@/services/content'
import { toast } from '@/hooks/use-toast'
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  History,
  Undo2,
  Eye,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import type { ContentVersionRecord } from '@/types/content'

interface EditTextsTabProps {
  contentMap: Record<string, any>
  onRefresh: () => void
}

export default function EditTextsTab({ contentMap, onRefresh }: EditTextsTabProps) {
  const [activeSection, setActiveSection] = useState('hero')
  const [isSaving, setIsSaving] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  // Histórico de Versões e Desfazer
  const [versions, setVersions] = useState<ContentVersionRecord[]>([])
  const [isVersionsOpen, setIsVersionsOpen] = useState(false)
  const [selectedVersionSection, setSelectedVersionSection] = useState('hero')
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)
  const [isRestoringVersion, setIsRestoringVersion] = useState(false)

  // Modal de Pré-visualização antes de publicar
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState<{ key: string; data: any; label: string } | null>(
    null,
  )

  // Estados locais para cada seção
  const [hero, setHero] = useState(
    contentMap['hero'] || {
      title: 'Andréa dos Santos Silva Armôa',
      subtitle: 'Psicóloga Clínica e Neuropsicóloga',
      crp: 'CRP 14/075954',
      welcoming_phrase:
        'Aqui, você encontra um espaço seguro, acolhedor e ético para se ouvir, se compreender e se cuidar.',
      cta_primary: 'Agendar Atendimento',
      cta_secondary: 'Conhecer Minha Atuação',
      badge: 'Atendimento Presencial & Online',
    },
  )

  const [sobre, setSobre] = useState(
    contentMap['sobre'] || {
      title: 'Sobre Mim',
      lead: 'Acolhimento com base científica, respeito à sua história e compromisso com o desenvolvimento humano em cada fase da vida.',
      paragraphs: [
        'Sou Andréa dos Santos Silva Armôa, psicóloga clínica e neuropsicóloga com registro ativo no Conselho Regional de Psicologia (CRP 14/075954). Minha prática profissional é guiada pelo compromisso ético de oferecer um ambiente de escuta qualificada, livre de julgamentos.',
        'Com ampla experiência no acompanhamento de adultos, adolescentes, crianças e famílias, uno a profundidade da clínica psicológica aos rigorosos instrumentos da neuropsicologia.',
        'Acredito profundamente que a psicoterapia é um processo de transformação mútua, no qual caminhamos juntos em direção ao autoconhecimento, à autonomia e ao alívio do sofrimento psíquico.',
      ],
      highlights: [
        { label: 'Formação', text: 'Psicóloga Clínica & Especialista em Neuropsicologia' },
        { label: 'Registro Profissional', text: 'CRP 14/075954' },
        { label: 'Público Atendido', text: 'Adultos, Adolescentes, Crianças e Famílias' },
        { label: 'Abordagem', text: 'Prática humanizada com rigor científico' },
      ],
    },
  )

  const [psicoterapia, setPsicoterapia] = useState(
    contentMap['psicoterapia'] || {
      title: 'Psicoterapia Clínica',
      subtitle: 'Um espaço seguro para elaboração, crescimento e reconstrução',
      description:
        'A psicoterapia é um investimento indispensável na sua saúde mental e na qualidade dos seus relacionamentos.',
      audiences: [
        {
          title: 'Adultos',
          description:
            'Apoio nas demandas de ansiedade, depressão, estresse, transições de carreira e equilíbrio emocional.',
          icon: 'user',
        },
        {
          title: 'Adolescentes',
          description:
            'Espaço acolhedor para lidar com as transformações da fase, pressões escolares e conflitos emocionais.',
          icon: 'sparkles',
        },
        {
          title: 'Crianças',
          description:
            'Atendimento lúdico e sensível para apoiar questões de comportamento, medos e dinâmicas familiares.',
          icon: 'heart',
        },
      ],
    },
  )

  const [orientacao, setOrientacao] = useState(
    contentMap['orientacao_parental'] || {
      title: 'Orientação Parental',
      quote: 'Fortalecendo pais para fortalecer a relação com os filhos',
      subtitle: 'Estratégias práticas para desafios da parentalidade',
      lead: 'A parentalidade é uma das jornadas mais desafiadoras e enriquecedoras da vida. Não existe manual perfeito, mas existe apoio qualificado e acolhedor.',
      description:
        'A orientação parental é um serviço direcionado a mães, pais e cuidadores que buscam compreender os desafios de desenvolvimento de seus filhos, estabelecer limites saudáveis sem violência e fortalecer vínculos.',
      points: [
        'Birras e Limites: manejo acolhedor com consistência e sem violência',
        'Rotina e Sono: estruturação de horários previsíveis que trazem segurança',
        'Uso Consciente de Telas: equilíbrio digital adaptado a cada fase',
        'Comunicação Afetiva: diálogos claros que conectam e reduzem conflitos',
        'Transições Familiares: apoio na chegada de irmãos, separação ou luto',
        'Autonomia e Segurança Emocional: fortalecendo a autoconfiança da criança',
      ],
      cta_text: 'Quero agendar uma Orientação Parental',
    },
  )

  const [paraQuem, setParaQuem] = useState(
    contentMap['para_quem'] || {
      title: 'Para Quem São os Atendimentos',
      subtitle: 'Cuidado individualizado e respeitoso para cada fase do desenvolvimento humano',
      groups: [
        {
          name: 'Adultos',
          summary:
            'Pessoas que buscam autoconhecimento, superação de crises e equilíbrio emocional.',
          badge: 'Individual',
        },
        {
          name: 'Adolescentes',
          summary: 'Jovens vivenciando pressões escolares, descobertas e conflitos relacionais.',
          badge: 'Especializado',
        },
        {
          name: 'Crianças',
          summary: 'Apoio lúdico no desenvolvimento socioemocional e comportamento.',
          badge: 'Lúdico & Clínico',
        },
        {
          name: 'Pais e Responsáveis',
          summary: 'Famílias que desejam clareza e ferramentas para educar com afeto e firmeza.',
          badge: 'Parentalidade',
        },
      ],
    },
  )

  const [beneficios, setBeneficios] = useState(
    contentMap['beneficios'] || {
      title: 'Principais Benefícios',
      subtitle: 'O impacto transformador do acompanhamento psicológico na sua vida',
      items: [
        {
          title: 'Mais equilíbrio emocional',
          desc: 'Aprenda a reconhecer e regular suas emoções.',
        },
        {
          title: 'Melhora nos relacionamentos',
          desc: 'Comunicação mais clara e limites saudáveis.',
        },
        { title: 'Autoconhecimento profundo', desc: 'Compreensão de suas potências e limites.' },
        {
          title: 'Fortalecimento familiar',
          desc: 'Menos atritos e mais cooperação dentro de casa.',
        },
        { title: 'Gestão da ansiedade e estresse', desc: 'Ferramentas para reduzir a sobrecarga.' },
        { title: 'Apoio em fases de transição', desc: 'Segurança para atravessar mudanças.' },
      ],
    },
  )

  const [comoFunciona, setComoFunciona] = useState(
    contentMap['como_funciona'] || {
      title: 'Como Funciona o Atendimento',
      subtitle: 'Modalidades pensadas para se adaptar à sua realidade com total sigilo e ética',
      etapas: [
        {
          step: '01',
          title: 'Primeiro Contato',
          desc: 'Mensagem inicial via WhatsApp para entender sua busca, tirar dúvidas e checar horários disponíveis.',
        },
        {
          step: '02',
          title: 'Sessão de Acolhimento',
          desc: 'Primeiro encontro dedicado à escuta qualificada da sua queixa e alinhamento do vínculo de confiança.',
        },
        {
          step: '03',
          title: 'Plano de Cuidado',
          desc: 'Definição conjunta de metas terapêuticas, formato (presencial ou online) e frequência das sessões.',
        },
        {
          step: '04',
          title: 'Acompanhamento Contínuo',
          desc: 'Desenvolvimento de recursos emocionais, ressignificação de vivências e autonomia para o dia a dia.',
        },
      ],
      modalities: [
        {
          title: 'Atendimento Presencial',
          desc: 'Sessões em consultório privativo e confortável.',
          tag: 'Consultório',
          duration: '50 minutos',
        },
        {
          title: 'Atendimento Online',
          desc: 'Sessões seguras por videochamada.',
          tag: 'Nacional & Internacional',
          duration: '50 minutos',
        },
        {
          title: 'Orientação Parental',
          desc: 'Encontros focados na dinâmica da rotina e relação familiar.',
          tag: 'Para Cuidadores',
          duration: '50 a 60 minutos',
        },
        {
          title: 'Avaliação Neuropsicológica',
          desc: 'Investigação aprofundada das funções cognitivas.',
          tag: 'Clínica & Cognitiva',
          duration: 'Processo estruturado',
        },
      ],
    },
  )

  const [faq, setFaq] = useState(
    contentMap['faq'] || {
      title: 'Perguntas Frequentes',
      subtitle: 'Tire suas principais dúvidas sobre o processo de psicoterapia e acompanhamento',
      questions: [
        {
          q: 'Como funciona a primeira consulta?',
          a: 'A primeira sessão é um momento de acolhimento e conhecimento mútuo. Nela, conversaremos sobre o que te motivou a buscar ajuda, suas expectativas e dúvidas. Também alinhamos como funcionará o processo, frequência dos encontros e horários.',
        },
        {
          q: 'Qual é a duração e frequência das sessões?',
          a: 'As sessões individuais têm duração de 50 minutos e geralmente ocorrem com frequência semanal, garantindo a continuidade necessária para o processo terapêutico.',
        },
        {
          q: 'O atendimento psicológico online é tão eficaz quanto o presencial?',
          a: 'Sim. Estudos e a regulamentação do Conselho Federal de Psicologia (CFP) comprovam que o atendimento online oferece a mesma eficácia clínica do presencial, com a comodidade de você ser atendido no conforto e segurança do seu ambiente.',
        },
        {
          q: 'Você atende por convênio ou plano de saúde?',
          a: 'Os atendimentos são particulares. No entanto, forneço recibo detalhado com CRP para que você possa solicitar o reembolso integral ou parcial junto ao seu plano de saúde, caso ele ofereça essa modalidade.',
        },
        {
          q: 'Como a Orientação Parental se diferencia da psicoterapia da criança?',
          a: 'A orientação parental foca diretamente nos pais e cuidadores, trabalhando estratégias educativas, comunicação e rotina familiar. Em muitos casos, mudanças orientadas na postura dos adultos resolvem demandas da criança sem que seja necessária uma psicoterapia infantil prolongada.',
        },
        {
          q: 'O que é a Avaliação Neuropsicológica e quando ela é indicada?',
          a: 'É uma avaliação especializada que mapeia o funcionamento do cérebro em relação ao comportamento e cognição (atenção, memória, linguagem, funções executivas). É indicada quando há suspeita de TDAH, dificuldades de aprendizagem, alterações de memória ou para direcionar tratamentos multidisciplinares.',
        },
        {
          q: 'Como é garantido o sigilo das informações?',
          a: 'O sigilo profissional é um dever ético absoluto assegurado pelo Código de Ética do Psicólogo. Tudo o que é compartilhado nas sessões permanece estritamente confidencial.',
        },
        {
          q: 'Como faço para agendar um primeiro horário?',
          a: 'Basta clicar no botão de WhatsApp aqui no site e enviar uma mensagem. Responderemos informando os horários disponíveis, valores e tirando qualquer dúvida prévia para seu agendamento.',
        },
      ],
    },
  )

  const [contato, setContato] = useState(
    contentMap['contato'] || {
      title: 'Contato & Localização',
      subtitle: 'Dê o primeiro passo em direção ao seu bem-estar emocional',
      address: '',
      address_complement: '',
      whatsapp: '',
      whatsapp_formatted: '',
      whatsapp_message:
        'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.',
      instagram: '@andreaarmoapsi',
      instagram_url: 'https://instagram.com/andreaarmoapsi',
      email: '',
      maps_iframe_url: '',
    },
  )

  // Validação de campos obrigatórios antes de abrir pré-visualização ou salvar
  const validateSection = (key: string, data: any): string | null => {
    if (key === 'hero') {
      if (!data.title?.trim()) return 'O Nome Principal é obrigatório.'
      if (!data.subtitle?.trim()) return 'O Subtítulo Profissional é obrigatório.'
      if (!data.crp?.trim()) return 'O Registro CRP é obrigatório.'
    } else if (key === 'sobre') {
      if (!data.title?.trim()) return 'O Título da seção é obrigatório.'
    } else if (key === 'orientacao_parental') {
      if (!data.quote?.trim()) return 'A frase de destaque (quote) é obrigatória.'
    }
    return null
  }

  const handleOpenPreview = (key: string, data: any, label: string) => {
    const error = validateSection(key, data)
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório ausente',
        description: error,
      })
      return
    }
    setPreviewData({ key, data, label })
    setPreviewModalOpen(true)
  }

  const handleExecuteSave = async () => {
    if (!previewData) return
    const { key, data } = previewData
    setIsSaving(true)
    setSavingKey(key)
    try {
      await updateSiteContent(key, data, true)
      toast({
        title: 'Publicado com sucesso!',
        description: `As alterações da seção "${previewData.label}" foram salvas no backend e estão ativas para todos os visitantes.`,
      })
      setPreviewModalOpen(false)
      setPreviewData(null)
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar seção:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar alterações',
        description: err.message || 'Ocorreu uma falha na comunicação com o backend.',
      })
    } finally {
      setIsSaving(false)
      setSavingKey(null)
    }
  }

  // Carregar histórico de versões de uma seção
  const handleOpenVersions = async (sectionKey: string) => {
    setSelectedVersionSection(sectionKey)
    setIsVersionsOpen(true)
    setIsLoadingVersions(true)
    try {
      const v = await fetchContentVersions(sectionKey)
      setVersions(v)
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar versões',
        description: err.message,
      })
    } finally {
      setIsLoadingVersions(false)
    }
  }

  // Desfazer e restaurar versão selecionada em um clique
  const handleRestoreVersion = async (version: ContentVersionRecord) => {
    setIsRestoringVersion(true)
    try {
      await restoreContentVersion(version.id)

      // Atualiza o estado local correspondente
      if (version.key === 'hero') setHero(version.content)
      else if (version.key === 'sobre') setSobre(version.content)
      else if (version.key === 'psicoterapia') setPsicoterapia(version.content)
      else if (version.key === 'orientacao_parental') setOrientacao(version.content)
      else if (version.key === 'para_quem') setParaQuem(version.content)
      else if (version.key === 'beneficios') setBeneficios(version.content)
      else if (version.key === 'como_funciona') setComoFunciona(version.content)
      else if (version.key === 'faq') setFaq(version.content)
      else if (version.key === 'contato') setContato(version.content)

      toast({
        title: 'Versão restaurada com sucesso!',
        description: `O site voltou ao estado gravado em ${new Date(version.created).toLocaleString('pt-BR')}.`,
      })
      setIsVersionsOpen(false)
      onRefresh()
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao desfazer alteração',
        description: err.message || 'Não foi possível restaurar esta versão.',
      })
    } finally {
      setIsRestoringVersion(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-warm-700">Editar Textos do Site</h2>
            <span className="text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              À prova de erro
            </span>
          </div>
          <p className="text-sm text-warm-500">
            Altere os textos com segurança. Toda alteração cria uma versão anterior com botão{' '}
            <strong>"Desfazer"</strong> imediato e pré-visualização antes de publicar.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handleOpenVersions(
              activeSection === 'orientacao' ? 'orientacao_parental' : activeSection,
            )
          }
          className="rounded-xl border-warm-300 text-warm-700 hover:bg-warm-100 text-xs shrink-0"
        >
          <History className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
          Histórico & Desfazer ({activeSection})
        </Button>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="bg-warm-100 p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="rounded-lg text-xs font-medium">
            Hero
          </TabsTrigger>
          <TabsTrigger value="sobre" className="rounded-lg text-xs font-medium">
            Sobre Mim
          </TabsTrigger>
          <TabsTrigger value="psicoterapia" className="rounded-lg text-xs font-medium">
            Psicoterapia
          </TabsTrigger>
          <TabsTrigger value="orientacao" className="rounded-lg text-xs font-medium">
            Orientação Parental
          </TabsTrigger>
          <TabsTrigger value="para_quem" className="rounded-lg text-xs font-medium">
            Para Quem
          </TabsTrigger>
          <TabsTrigger value="beneficios" className="rounded-lg text-xs font-medium">
            Benefícios
          </TabsTrigger>
          <TabsTrigger value="como_funciona" className="rounded-lg text-xs font-medium">
            Como Funciona
          </TabsTrigger>
          <TabsTrigger value="faq" className="rounded-lg text-xs font-medium">
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contato" className="rounded-lg text-xs font-medium">
            Contato & Mapa
          </TabsTrigger>
        </TabsList>

        {/* 1. HERO */}
        <TabsContent value="hero">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Seção Hero (Topo)</CardTitle>
              <CardDescription>Nome, título profissional, CRP e frase acolhedora.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome Principal</Label>
                  <Input
                    value={hero.title || ''}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo Profissional</Label>
                  <Input
                    value={hero.subtitle || ''}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Registro CRP</Label>
                  <Input
                    value={hero.crp || ''}
                    onChange={(e) => setHero({ ...hero, crp: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Selo / Tag Superior</Label>
                  <Input
                    value={hero.badge || ''}
                    onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Frase Acolhedora em Destaque</Label>
                <Textarea
                  rows={3}
                  value={hero.welcoming_phrase || ''}
                  onChange={(e) => setHero({ ...hero, welcoming_phrase: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Texto do Botão Primário</Label>
                  <Input
                    value={hero.cta_primary || ''}
                    onChange={(e) => setHero({ ...hero, cta_primary: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Texto do Botão Secundário</Label>
                  <Input
                    value={hero.cta_secondary || ''}
                    onChange={(e) => setHero({ ...hero, cta_secondary: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('hero', hero, 'Hero (Topo)')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Hero
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('hero')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. SOBRE MIM */}
        <TabsContent value="sobre">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Seção Sobre Mim</CardTitle>
              <CardDescription>Apresentação profissional e trajetória clínica.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título da Seção</Label>
                <Input
                  value={sobre.title || ''}
                  onChange={(e) => setSobre({ ...sobre, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Frase de Introdução (Lead)</Label>
                <Input
                  value={sobre.lead || ''}
                  onChange={(e) => setSobre({ ...sobre, lead: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Parágrafos de Apresentação</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSobre({ ...sobre, paragraphs: [...(sobre.paragraphs || []), ''] })
                    }
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Parágrafo
                  </Button>
                </div>
                {(sobre.paragraphs || []).map((p: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Textarea
                      rows={2}
                      value={p}
                      onChange={(e) => {
                        const newP = [...sobre.paragraphs]
                        newP[idx] = e.target.value
                        setSobre({ ...sobre, paragraphs: newP })
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        const newP = sobre.paragraphs.filter((_: any, i: number) => i !== idx)
                        setSobre({ ...sobre, paragraphs: newP })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('sobre', sobre, 'Sobre Mim')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Sobre Mim
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('sobre')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. PSICOTERAPIA */}
        <TabsContent value="psicoterapia">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Seção Psicoterapia</CardTitle>
              <CardDescription>
                Descrição da atuação clínica para Adultos, Adolescentes e Crianças.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input
                    value={psicoterapia.title || ''}
                    onChange={(e) => setPsicoterapia({ ...psicoterapia, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Input
                    value={psicoterapia.subtitle || ''}
                    onChange={(e) => setPsicoterapia({ ...psicoterapia, subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Descrição Geral</Label>
                <Textarea
                  rows={2}
                  value={psicoterapia.description || ''}
                  onChange={(e) =>
                    setPsicoterapia({ ...psicoterapia, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label>Cards de Atendimento</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(psicoterapia.audiences || []).map((aud: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-warm-200 space-y-2 bg-warm-50/50"
                    >
                      <Label className="text-xs font-semibold">Título do Card {idx + 1}</Label>
                      <Input
                        value={aud.title}
                        onChange={(e) => {
                          const updated = [...psicoterapia.audiences]
                          updated[idx] = { ...updated[idx], title: e.target.value }
                          setPsicoterapia({ ...psicoterapia, audiences: updated })
                        }}
                      />
                      <Label className="text-xs font-semibold">Descrição</Label>
                      <Textarea
                        rows={3}
                        value={aud.description}
                        onChange={(e) => {
                          const updated = [...psicoterapia.audiences]
                          updated[idx] = { ...updated[idx], description: e.target.value }
                          setPsicoterapia({ ...psicoterapia, audiences: updated })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('psicoterapia', psicoterapia, 'Psicoterapia')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Psicoterapia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('psicoterapia')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. ORIENTAÇÃO PARENTAL */}
        <TabsContent value="orientacao">
          <Card className="border-sage-200 bg-sage-50/30">
            <CardHeader>
              <CardTitle className="text-lg text-sage-900">
                Seção Orientação Parental (Destaque Principal)
              </CardTitle>
              <CardDescription>Seção em destaque verde-sálvia no site público.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título da Seção</Label>
                  <Input
                    value={orientacao.title || ''}
                    onChange={(e) => setOrientacao({ ...orientacao, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo de Estratégias</Label>
                  <Input
                    value={orientacao.subtitle || ''}
                    onChange={(e) => setOrientacao({ ...orientacao, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Frase-Âncora em Destaque Exata (Citação)</Label>
                <Input
                  value={orientacao.quote || ''}
                  onChange={(e) => setOrientacao({ ...orientacao, quote: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Texto de Introdução (Lead)</Label>
                <Input
                  value={orientacao.lead || ''}
                  onChange={(e) => setOrientacao({ ...orientacao, lead: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Descrição Completa</Label>
                <Textarea
                  rows={3}
                  value={orientacao.description || ''}
                  onChange={(e) => setOrientacao({ ...orientacao, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pontos / Benefícios da Orientação</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOrientacao({ ...orientacao, points: [...(orientacao.points || []), ''] })
                    }
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Ponto
                  </Button>
                </div>
                {(orientacao.points || []).map((pt: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={pt}
                      onChange={(e) => {
                        const newPts = [...orientacao.points]
                        newPts[idx] = e.target.value
                        setOrientacao({ ...orientacao, points: newPts })
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => {
                        const newPts = orientacao.points.filter((_: any, i: number) => i !== idx)
                        setOrientacao({ ...orientacao, points: newPts })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label>Texto do Botão CTA</Label>
                <Input
                  value={orientacao.cta_text || ''}
                  onChange={(e) => setOrientacao({ ...orientacao, cta_text: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() =>
                    handleOpenPreview('orientacao_parental', orientacao, 'Orientação Parental')
                  }
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Orientação Parental
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('orientacao_parental')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. PARA QUEM */}
        <TabsContent value="para_quem">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Para Quem São os Atendimentos</CardTitle>
              <CardDescription>
                Públicos atendidos (Adultos, Adolescentes, Crianças, Pais).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input
                    value={paraQuem.title || ''}
                    onChange={(e) => setParaQuem({ ...paraQuem, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Input
                    value={paraQuem.subtitle || ''}
                    onChange={(e) => setParaQuem({ ...paraQuem, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(paraQuem.groups || []).map((grp: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-warm-200 space-y-2 bg-warm-50/50"
                  >
                    <Label className="text-xs font-semibold">Nome do Grupo</Label>
                    <Input
                      value={grp.name}
                      onChange={(e) => {
                        const updated = [...paraQuem.groups]
                        updated[idx] = { ...updated[idx], name: e.target.value }
                        setParaQuem({ ...paraQuem, groups: updated })
                      }}
                    />
                    <Label className="text-xs font-semibold">Badge / Etiqueta</Label>
                    <Input
                      value={grp.badge}
                      onChange={(e) => {
                        const updated = [...paraQuem.groups]
                        updated[idx] = { ...updated[idx], badge: e.target.value }
                        setParaQuem({ ...paraQuem, groups: updated })
                      }}
                    />
                    <Label className="text-xs font-semibold">Resumo</Label>
                    <Textarea
                      rows={2}
                      value={grp.summary}
                      onChange={(e) => {
                        const updated = [...paraQuem.groups]
                        updated[idx] = { ...updated[idx], summary: e.target.value }
                        setParaQuem({ ...paraQuem, groups: updated })
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('para_quem', paraQuem, 'Para Quem')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Para Quem
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('para_quem')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. BENEFÍCIOS */}
        <TabsContent value="beneficios">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Principais Benefícios</CardTitle>
              <CardDescription>Cards de transformação e ganhos com a psicoterapia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input
                    value={beneficios.title || ''}
                    onChange={(e) => setBeneficios({ ...beneficios, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Input
                    value={beneficios.subtitle || ''}
                    onChange={(e) => setBeneficios({ ...beneficios, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Lista de Benefícios</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setBeneficios({
                        ...beneficios,
                        items: [...(beneficios.items || []), { title: '', desc: '' }],
                      })
                    }
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Benefício
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(beneficios.items || []).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-warm-200 space-y-2 bg-warm-50/50"
                    >
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-semibold">Benefício {idx + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => {
                            const updated = beneficios.items.filter(
                              (_: any, i: number) => i !== idx,
                            )
                            setBeneficios({ ...beneficios, items: updated })
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Título"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...beneficios.items]
                          updated[idx] = { ...updated[idx], title: e.target.value }
                          setBeneficios({ ...beneficios, items: updated })
                        }}
                      />
                      <Textarea
                        rows={2}
                        placeholder="Descrição"
                        value={item.desc}
                        onChange={(e) => {
                          const updated = [...beneficios.items]
                          updated[idx] = { ...updated[idx], desc: e.target.value }
                          setBeneficios({ ...beneficios, items: updated })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('beneficios', beneficios, 'Benefícios')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Benefícios
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('beneficios')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. COMO FUNCIONA */}
        <TabsContent value="como_funciona">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Como Funciona (Modalidades)</CardTitle>
              <CardDescription>
                Presencial, Online, Orientação Parental e Avaliação Neuropsicológica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input
                    value={comoFunciona.title || ''}
                    onChange={(e) => setComoFunciona({ ...comoFunciona, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Input
                    value={comoFunciona.subtitle || ''}
                    onChange={(e) => setComoFunciona({ ...comoFunciona, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(comoFunciona.modalities || []).map((mod: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-warm-200 space-y-2 bg-warm-50/50"
                  >
                    <Label className="text-xs font-semibold">Modalidade</Label>
                    <Input
                      value={mod.title}
                      onChange={(e) => {
                        const updated = [...comoFunciona.modalities]
                        updated[idx] = { ...updated[idx], title: e.target.value }
                        setComoFunciona({ ...comoFunciona, modalities: updated })
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs font-semibold">Tag</Label>
                        <Input
                          value={mod.tag}
                          onChange={(e) => {
                            const updated = [...comoFunciona.modalities]
                            updated[idx] = { ...updated[idx], tag: e.target.value }
                            setComoFunciona({ ...comoFunciona, modalities: updated })
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold">Duração</Label>
                        <Input
                          value={mod.duration}
                          onChange={(e) => {
                            const updated = [...comoFunciona.modalities]
                            updated[idx] = { ...updated[idx], duration: e.target.value }
                            setComoFunciona({ ...comoFunciona, modalities: updated })
                          }}
                        />
                      </div>
                    </div>
                    <Label className="text-xs font-semibold">Descrição</Label>
                    <Textarea
                      rows={2}
                      value={mod.desc}
                      onChange={(e) => {
                        const updated = [...comoFunciona.modalities]
                        updated[idx] = { ...updated[idx], desc: e.target.value }
                        setComoFunciona({ ...comoFunciona, modalities: updated })
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('como_funciona', comoFunciona, 'Como Funciona')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Como Funciona
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('como_funciona')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. FAQ */}
        <TabsContent value="faq">
          <Card className="border-warm-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Perguntas Frequentes (FAQ)</CardTitle>
                <CardDescription>
                  Gerencie as perguntas e respostas que abrem no acordeão.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFaq({
                    ...faq,
                    questions: [
                      ...(faq.questions || []),
                      { q: 'Nova pergunta', a: 'Nova resposta' },
                    ],
                  })
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Nova Pergunta
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título da Seção</Label>
                  <Input
                    value={faq.title || ''}
                    onChange={(e) => setFaq({ ...faq, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Input
                    value={faq.subtitle || ''}
                    onChange={(e) => setFaq({ ...faq, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {(faq.questions || []).map((qItem: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-warm-200 space-y-2 bg-warm-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-warm-700">
                        Pergunta {idx + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 h-7 w-7"
                        onClick={() => {
                          const updated = faq.questions.filter((_: any, i: number) => i !== idx)
                          setFaq({ ...faq, questions: updated })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={qItem.q}
                      placeholder="Pergunta"
                      onChange={(e) => {
                        const updated = [...faq.questions]
                        updated[idx] = { ...updated[idx], q: e.target.value }
                        setFaq({ ...faq, questions: updated })
                      }}
                    />
                    <Label className="text-xs font-semibold text-warm-700">Resposta</Label>
                    <Textarea
                      rows={3}
                      value={qItem.a}
                      placeholder="Resposta explicativa"
                      onChange={(e) => {
                        const updated = [...faq.questions]
                        updated[idx] = { ...updated[idx], a: e.target.value }
                        setFaq({ ...faq, questions: updated })
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('faq', faq, 'Perguntas Frequentes (FAQ)')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar FAQ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('faq')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. CONTATO & LOCALIZAÇÃO */}
        <TabsContent value="contato">
          <Card className="border-warm-200">
            <CardHeader>
              <CardTitle className="text-lg">Contato & Localização</CardTitle>
              <CardDescription>
                WhatsApp, Instagram, endereço e iframe do mapa Google.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Título da Seção</Label>
                  <Input
                    value={contato.title || ''}
                    onChange={(e) => setContato({ ...contato, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input
                    value={contato.email || ''}
                    onChange={(e) => setContato({ ...contato, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Número WhatsApp (DDI + DDD + Num)</Label>
                  <Input
                    value={contato.whatsapp || ''}
                    placeholder="Ex: 5567981001234"
                    onChange={(e) => setContato({ ...contato, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp Formatado</Label>
                  <Input
                    value={contato.whatsapp_formatted || ''}
                    placeholder="Ex: (67) 98100-1234"
                    onChange={(e) => setContato({ ...contato, whatsapp_formatted: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Instagram (@)</Label>
                  <Input
                    value={contato.instagram || ''}
                    placeholder="@andreaarmoapsi"
                    onChange={(e) => setContato({ ...contato, instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Mensagem Pré-preenchida do WhatsApp</Label>
                <Input
                  value={contato.whatsapp_message || ''}
                  onChange={(e) => setContato({ ...contato, whatsapp_message: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Endereço</Label>
                  <Input
                    value={contato.address || ''}
                    onChange={(e) => setContato({ ...contato, address: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Complemento do Endereço</Label>
                  <Input
                    value={contato.address_complement || ''}
                    onChange={(e) => setContato({ ...contato, address_complement: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>URL do Iframe do Google Maps (Embed)</Label>
                <Textarea
                  rows={2}
                  value={contato.maps_iframe_url || ''}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  onChange={(e) => setContato({ ...contato, maps_iframe_url: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => handleOpenPreview('contato', contato, 'Contato & Localização')}
                  disabled={isSaving}
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Pré-visualizar e Publicar Contato & Mapa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenVersions('contato')}
                  className="rounded-xl text-xs"
                >
                  <History className="w-3.5 h-3.5 mr-1 text-warm-500" />
                  Ver Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG DE PRÉ-VISUALIZAÇÃO ANTES DE PUBLICAR */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-2xl bg-white border-warm-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2 text-warm-800">
              <Eye className="w-5 h-5 text-sage-600" />
              Pré-visualização: {previewData?.label}
            </DialogTitle>
            <DialogDescription className="text-xs text-warm-600 leading-relaxed">
              Confira os dados que serão publicados no site. Se estiver tudo certo, clique em{' '}
              <strong>"Confirmar e Publicar Globalmente"</strong>.
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-warm-50 border border-warm-200 space-y-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-warm-800 uppercase tracking-wider text-[10px]">
                  Resumo dos campos preenchidos:
                </span>
                <div className="bg-white p-3 rounded-lg border border-warm-200 space-y-1.5">
                  {Object.entries(previewData.data).map(([k, val]) => {
                    if (Array.isArray(val)) {
                      return (
                        <div key={k} className="text-warm-700">
                          <strong className="text-warm-900">{k}:</strong> {val.length} itens na
                          lista
                        </div>
                      )
                    }
                    if (typeof val === 'string' && val.length > 120) {
                      return (
                        <div key={k} className="text-warm-700">
                          <strong className="text-warm-900">{k}:</strong> {val.substring(0, 120)}...
                        </div>
                      )
                    }
                    return (
                      <div key={k} className="text-warm-700">
                        <strong className="text-warm-900">{k}:</strong> {String(val || '—')}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Todos os campos obrigatórios validados com sucesso. Uma versão de backup anterior
                  será gravada automaticamente no histórico.
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setPreviewModalOpen(false)}
              disabled={isSaving}
            >
              Voltar e Editar
            </Button>
            <Button
              onClick={handleExecuteSave}
              disabled={isSaving}
              className="bg-sage-600 hover:bg-sage-700 text-white rounded-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publicando no Servidor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Confirmar e Publicar Globalmente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG DE HISTÓRICO DE VERSÕES COM BOTÃO DESFAZER */}
      <Dialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
        <DialogContent className="max-w-2xl bg-white border-warm-200">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2 text-warm-800">
              <History className="w-5 h-5 text-sage-600" />
              Histórico de Versões & Desfazer: "{selectedVersionSection}"
            </DialogTitle>
            <DialogDescription className="text-xs text-warm-600 leading-relaxed">
              Cada vez que você salva uma seção, uma versão anterior é arquivada. Se cometer algum
              engano, clique em <strong>"Desfazer (Restaurar)"</strong> para recuperar o texto
              anterior sem risco de quebrar o site.
            </DialogDescription>
          </DialogHeader>

          {isLoadingVersions ? (
            <div className="py-12 flex flex-col items-center justify-center text-warm-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sage-600" />
              <p className="text-xs">Carregando histórico do servidor...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="py-8 text-center text-warm-500 text-xs bg-warm-50 rounded-xl p-4 border border-warm-200">
              Nenhuma versão anterior gravada para esta seção ainda. Quando você editar e salvar, o
              histórico aparecerá aqui.
            </div>
          ) : (
            <div className="max-h-[55vh] overflow-y-auto space-y-3 pt-2">
              {versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  className="p-4 rounded-xl border border-warm-200 bg-warm-50/70 hover:bg-white transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sage-700" />
                      <span className="font-semibold text-xs text-warm-800">
                        {new Date(ver.created).toLocaleString('pt-BR')}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-sage-200 text-sage-900 px-2 py-0.5 rounded-full font-medium">
                          Mais Recente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-warm-500">{ver.note || 'Backup automático'}</p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(ver)}
                    disabled={isRestoringVersion}
                    className="border-sage-400 text-sage-800 hover:bg-sage-100 rounded-xl text-xs shrink-0"
                  >
                    {isRestoringVersion ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Undo2 className="w-3.5 h-3.5 mr-1.5 text-sage-700" />
                    )}
                    Desfazer para esta Versão
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsVersionsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
