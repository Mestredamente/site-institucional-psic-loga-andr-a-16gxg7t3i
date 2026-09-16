import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateSiteContent } from '@/services/content'
import { toast } from '@/hooks/use-toast'
import { Save, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react'

interface EditTextsTabProps {
  contentMap: Record<string, any>
  onRefresh: () => void
}

export default function EditTextsTab({ contentMap, onRefresh }: EditTextsTabProps) {
  const [activeSection, setActiveSection] = useState('hero')
  const [isSaving, setIsSaving] = useState(false)

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
      lead: 'A parentalidade é uma das jornadas mais desafiadoras e enriquecedoras da vida.',
      description:
        'A orientação parental é um serviço direcionado a mães, pais e cuidadores que buscam compreender os desafios de desenvolvimento de seus filhos, estabelecer limites saudáveis sem violência e fortalecer vínculos.',
      points: [
        'Compreensão do desenvolvimento infantil e neurobiologia das emoções',
        'Manejo de birras, oposição e limites amorosos e consistentes',
        'Alinhamento da comunicação e rotina entre o casal parental',
        'Fortalecimento do vínculo afetivo e segurança emocional da criança',
        'Mediação de momentos de transição escolar ou dinâmica familiar',
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
      subtitle: 'Tire suas principais dúvidas sobre o processo de psicoterapia',
      questions: [
        {
          q: 'Como funciona a primeira consulta?',
          a: 'A primeira sessão é um momento de acolhimento e conhecimento mútuo.',
        },
        {
          q: 'Qual é a duração das sessões?',
          a: 'As sessões têm duração de 50 minutos semanais.',
        },
      ],
    },
  )

  const [contato, setContato] = useState(
    contentMap['contato'] || {
      title: 'Contato & Localização',
      subtitle: 'Dê o primeiro passo em direção ao seu bem-estar emocional',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      address_complement: 'Edifício Prime Office, Sala 804',
      whatsapp: '5511999998888',
      whatsapp_formatted: '(11) 99999-8888',
      whatsapp_message:
        'Olá, Andréa! Gostaria de obter mais informações e agendar um horário para atendimento.',
      instagram: '@andreaarnoapsi',
      instagram_url: 'https://instagram.com/andreaarnoapsi',
      email: 'contato@andreaarmoa.com.br',
      maps_iframe_url:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.654!3d-23.564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUxLjEiUyA0NsKwMzknMTQuNCJX!5e0!3m2!1spt-BR!2sbr!4v1600000000000',
    },
  )

  const handleSave = async (key: string, data: any) => {
    setIsSaving(true)
    try {
      await updateSiteContent(key, data)
      toast({
        title: 'Sucesso!',
        description: `Seção "${key}" atualizada com sucesso.`,
      })
      onRefresh()
    } catch (err: any) {
      console.error('Erro ao salvar seção:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: err.message || 'Ocorreu um erro ao atualizar os dados.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-warm-700">Editar Textos do Site</h2>
          <p className="text-sm text-warm-500">
            Altere os títulos, descrições, itens e dados de contato que aparecem na página pública.
          </p>
        </div>
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

              <Button
                onClick={() => handleSave('hero', hero)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Seção Hero
              </Button>
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

              <Button
                onClick={() => handleSave('sobre', sobre)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Sobre Mim
              </Button>
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

              <Button
                onClick={() => handleSave('psicoterapia', psicoterapia)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Psicoterapia
              </Button>
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
              <div className="space-y-1.5">
                <Label>Frase de Destaque Exata (Citação)</Label>
                <Input
                  value={orientacao.quote || ''}
                  onChange={(e) => setOrientacao({ ...orientacao, quote: e.target.value })}
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

              <Button
                onClick={() => handleSave('orientacao_parental', orientacao)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Orientação Parental
              </Button>
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

              <Button
                onClick={() => handleSave('para_quem', paraQuem)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Para Quem
              </Button>
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

              <Button
                onClick={() => handleSave('beneficios', beneficios)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Benefícios
              </Button>
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

              <Button
                onClick={() => handleSave('como_funciona', comoFunciona)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Modalidades
              </Button>
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

              <Button
                onClick={() => handleSave('faq', faq)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar FAQ
              </Button>
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
                    placeholder="5511999998888"
                    onChange={(e) => setContato({ ...contato, whatsapp: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp Formatado</Label>
                  <Input
                    value={contato.whatsapp_formatted || ''}
                    placeholder="(11) 99999-8888"
                    onChange={(e) => setContato({ ...contato, whatsapp_formatted: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Instagram (@)</Label>
                  <Input
                    value={contato.instagram || ''}
                    placeholder="@andreaarnoapsi"
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

              <Button
                onClick={() => handleSave('contato', contato)}
                disabled={isSaving}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Contato & Mapa
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
