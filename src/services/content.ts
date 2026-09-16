import pb from '@/lib/pocketbase/client'
import type {
  SiteContentRecord,
  SiteMediaRecord,
  BlogPostRecord,
  DocumentRecord,
  PrivateNoteRecord,
  ContentVersionRecord,
} from '@/types/content'

export async function fetchSiteContent(): Promise<Record<string, any>> {
  try {
    const records = await pb.collection('site_content').getFullList<SiteContentRecord>({
      sort: 'created',
    })
    const map: Record<string, any> = {}
    for (const rec of records) {
      map[rec.key] = rec.content
    }
    return map
  } catch (err) {
    console.error('Erro ao buscar site_content:', err)
    return {}
  }
}

/**
 * Salva uma versão anterior na coleção content_versions antes de atualizar.
 * Isso garante histórico e botão "Desfazer" à prova de erros para a profissional.
 */
export async function saveContentVersion(key: string, content: any, note?: string): Promise<void> {
  try {
    if (!content) return
    await pb.collection('content_versions').create({
      key,
      content,
      note: note || `Backup automático antes de salvar "${key}"`,
    })

    // Manter as últimas 20 versões por seção para evitar crescimento desnecessário
    const versions = await pb.collection('content_versions').getList<ContentVersionRecord>(1, 30, {
      filter: `key="${key}"`,
      sort: '-created',
    })
    if (versions.items.length > 20) {
      const toDelete = versions.items.slice(20)
      for (const item of toDelete) {
        try {
          await pb.collection('content_versions').delete(item.id)
        } catch {
          /* intentionally ignored */
        }
      }
    }
  } catch (err) {
    console.warn('Aviso: Não foi possível registrar versão de backup:', err)
  }
}

export async function fetchContentVersions(key?: string): Promise<ContentVersionRecord[]> {
  try {
    const filter = key ? `key="${key}"` : ''
    return await pb.collection('content_versions').getFullList<ContentVersionRecord>({
      filter,
      sort: '-created',
    })
  } catch (err) {
    console.error('Erro ao buscar content_versions:', err)
    return []
  }
}

/**
 * Restaura uma versão anterior específica da coleção content_versions
 */
export async function restoreContentVersion(versionId: string): Promise<SiteContentRecord> {
  const version = await pb.collection('content_versions').getOne<ContentVersionRecord>(versionId)
  // Atualiza site_content sem criar uma versão idêntica
  return await updateSiteContent(version.key, version.content, false)
}

export async function updateSiteContent(
  key: string,
  content: any,
  trackVersion = true,
): Promise<SiteContentRecord> {
  try {
    const existing = await pb
      .collection('site_content')
      .getFirstListItem<SiteContentRecord>(`key="${key}"`)

    // Salva a versão anterior se estiver habilitado e houver conteúdo existente
    if (trackVersion && existing.content) {
      await saveContentVersion(
        key,
        existing.content,
        `Alteração realizada em ${new Date().toLocaleString('pt-BR')}`,
      )
    }

    return await pb.collection('site_content').update<SiteContentRecord>(existing.id, {
      content,
    })
  } catch (_) {
    // Se ainda não existir por algum motivo, cria
    return await pb.collection('site_content').create<SiteContentRecord>({
      key,
      content,
    })
  }
}

export async function fetchSiteMedia(): Promise<Record<string, string>> {
  try {
    const records = await pb.collection('site_media').getFullList<SiteMediaRecord>()
    const map: Record<string, string> = {}
    for (const rec of records) {
      if (rec.file) {
        map[rec.key] = pb.files.getURL(rec, rec.file)
      }
    }
    return map
  } catch (err) {
    console.error('Erro ao buscar site_media:', err)
    return {}
  }
}

export async function uploadSiteMedia(key: string, file: File): Promise<SiteMediaRecord> {
  const formData = new FormData()
  formData.append('key', key)
  formData.append('file', file)

  try {
    const existing = await pb
      .collection('site_media')
      .getFirstListItem<SiteMediaRecord>(`key="${key}"`)
    return await pb.collection('site_media').update<SiteMediaRecord>(existing.id, formData)
  } catch (_) {
    return await pb.collection('site_media').create<SiteMediaRecord>(formData)
  }
}

export async function deleteSiteMedia(key: string): Promise<boolean> {
  try {
    const existing = await pb
      .collection('site_media')
      .getFirstListItem<SiteMediaRecord>(`key="${key}"`)
    return await pb.collection('site_media').delete(existing.id)
  } catch (_) {
    return false
  }
}

export async function restoreDefaultContent(): Promise<void> {
  const defaultContents: Record<string, any> = {
    hero: {
      title: 'Andréa dos Santos Silva Armôa',
      subtitle: 'Psicóloga Clínica e Neuropsicóloga',
      crp: 'CRP 14/075954',
      welcoming_phrase:
        'Aqui, você encontra um espaço seguro, acolhedor e ético para se ouvir, se compreender e se cuidar.',
      cta_primary: 'Agendar Atendimento',
      cta_secondary: 'Conhecer Minha Atuação',
      badge: 'Atendimento Presencial & Online',
    },
    sobre: {
      title: 'Sobre Mim',
      lead: 'Acolhimento com base científica, respeito à sua história e compromisso com o desenvolvimento humano em cada fase da vida.',
      paragraphs: [
        'Sou Andréa dos Santos Silva Armôa, psicóloga clínica e neuropsicóloga com registro ativo no Conselho Regional de Psicologia (CRP 14/075954). Minha prática profissional é guiada pelo compromisso ético de oferecer um ambiente de escuta qualificada, livre de julgamentos, onde cada indivíduo possa expressar suas angústias e construir novas possibilidades de vida.',
        'Com ampla experiência no acompanhamento de adultos, adolescentes, crianças e famílias, uno a profundidade da clínica psicológica aos rigorosos instrumentos da neuropsicologia, permitindo um entendimento amplo e integrado das funções cognitivas, emocionais e comportamentais.',
        'Acredito profundamente que a psicoterapia é um processo de transformação mútua, no qual caminhamos juntos em direção ao autoconhecimento, à autonomia e ao alívio do sofrimento psíquico.',
      ],
      highlights: [
        { label: 'Formação', text: 'Psicóloga Clínica & Especialista em Neuropsicologia' },
        { label: 'Registro Profissional', text: 'CRP 14/075954' },
        { label: 'Público Atendido', text: 'Adultos, Adolescentes, Crianças e Famílias' },
        { label: 'Abordagem', text: 'Prática humanizada com rigor científico' },
      ],
    },
    psicoterapia: {
      title: 'Psicoterapia Clínica',
      subtitle: 'Um espaço seguro para elaboração, crescimento e reconstrução',
      description:
        'A psicoterapia é um investimento indispensável na sua saúde mental e na qualidade dos seus relacionamentos. O processo terapêutico possibilita compreender padrões repetitivos, ressignificar vivências dolorosas e desenvolver recursos emocionais para lidar com os desafios cotidianos.',
      audiences: [
        {
          title: 'Adultos',
          description:
            'Apoio nas demandas de ansiedade, depressão, estresse, transições de carreira, luto e desenvolvimento de equilíbrio emocional e autoconhecimento.',
          icon: 'user',
        },
        {
          title: 'Adolescentes',
          description:
            'Espaço acolhedor para lidar com as transformações da fase, pressões escolares, identidade, relações sociais e conflitos emocionais.',
          icon: 'sparkles',
        },
        {
          title: 'Crianças',
          description:
            'Atendimento lúdico e sensível para apoiar questões de comportamento, regulação emocional, medos, dificuldades escolares e dinâmicas familiares.',
          icon: 'heart',
        },
      ],
    },
    orientacao_parental: {
      title: 'Orientação Parental',
      quote: 'Fortalecendo pais para fortalecer a relação com os filhos',
      subtitle: 'Estratégias práticas para desafios da parentalidade',
      lead: 'A parentalidade é uma das jornadas mais desafiadoras e enriquecedoras da vida. Não existe manual perfeito, mas existe apoio qualificado e acolhedor.',
      description:
        'A orientação parental é um serviço direcionado a mães, pais e cuidadores que buscam compreender os desafios de desenvolvimento de seus filhos, estabelecer limites saudáveis sem violência, promover uma comunicação afetiva e resolver impasses comportamentais e emocionais na rotina familiar.',
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
    para_quem: {
      title: 'Para Quem São os Atendimentos',
      subtitle: 'Cuidado individualizado e respeitoso para cada fase do desenvolvimento humano',
      groups: [
        {
          name: 'Adultos',
          summary:
            'Pessoas que buscam autoconhecimento, superação de crises, manejo de ansiedade, estresse ou reorganização de vida pessoal e profissional.',
          badge: 'Individual',
        },
        {
          name: 'Adolescentes',
          summary:
            'Jovens vivenciando pressões escolares, descobertas, inseguranças, conflitos relacionais e necessidade de um espaço de escuta sem julgamentos.',
          badge: 'Especializado',
        },
        {
          name: 'Crianças',
          summary:
            'Apoio lúdico no desenvolvimento socioemocional, medos, dificuldades comportamentais, perdas e adaptações escolares.',
          badge: 'Lúdico e Clínico',
        },
        {
          name: 'Pais e Responsáveis',
          summary:
            'Famílias que desejam clareza e ferramentas práticas para educar com afeto, firmeza e presença consciente.',
          badge: 'Parentalidade',
        },
        {
          name: 'Famílias',
          summary:
            'Acolhimento de impasses relacionais, transições de ciclo familiar, alinhamento de convivência e fortalecimento de vínculos afetivos coletivos.',
          badge: 'Sistêmico & Vínculos',
        },
      ],
    },
    beneficios: {
      title: 'Principais Benefícios',
      subtitle: 'O impacto transformador do acompanhamento psicológico na sua vida',
      items: [
        {
          title: 'Mais equilíbrio emocional',
          desc: 'Aprenda a reconhecer, nomear e regular suas emoções frente às adversidades.',
        },
        {
          title: 'Melhora nos relacionamentos',
          desc: 'Comunicação mais clara, limites saudáveis e vínculos mais verdadeiros e seguros.',
        },
        {
          title: 'Autoconhecimento profundo',
          desc: 'Compreensão de suas potências, limites, necessidades e história pessoal.',
        },
        {
          title: 'Fortalecimento familiar',
          desc: 'Menos atritos e mais cooperação, acolhimento e compreensão dentro de casa.',
        },
        {
          title: 'Gestão da ansiedade e estresse',
          desc: 'Ferramentas práticas para reduzir a sobrecarga e recuperar a tranquilidade.',
        },
        {
          title: 'Apoio em fases de transição',
          desc: 'Segurança para atravessar mudanças profissionais, perdas, divórcios ou novas fases.',
        },
      ],
    },
    como_funciona: {
      title: 'Como Funciona o Atendimento',
      subtitle: 'Modalidades pensadas para se adaptar à sua realidade com total sigilo e ética',
      etapas: [
        {
          step: '01',
          title: 'Primeiro Contato',
          desc: 'Contato inicial rápido via WhatsApp para entender sua busca, tirar dúvidas pontuais e verificar disponibilidade de agenda.',
        },
        {
          step: '02',
          title: 'Sessão de Acolhimento',
          desc: 'Primeiro encontro dedicado a ouvir sua história com calma, entender as queixas e estabelecer um vínculo de confiança mútuo.',
        },
        {
          step: '03',
          title: 'Plano de Cuidado',
          desc: 'Definição conjunta de objetivos terapêuticos personalizados, alinhamento de frequência e estratégias clínicas ou avaliativas.',
        },
        {
          step: '04',
          title: 'Acompanhamento Contínuo',
          desc: 'Sessões periódicas com foco no desenvolvimento de autonomia, ressignificação de vivências e consolidação do bem-estar.',
        },
      ],
      modalities: [
        {
          title: 'Atendimento Presencial',
          desc: 'Sessões individuais em consultório privativo, silencioso e preparado para garantir total conforto, acolhimento e sigilo profissional.',
          tag: 'Consultório',
          duration: '50 minutos',
        },
        {
          title: 'Atendimento Online (Teleatendimento)',
          desc: 'Sessões por videochamada criptografada e segura, permitindo o acompanhamento de qualquer lugar do Brasil e do mundo com mesma eficácia clínica.',
          tag: 'Nacional & Internacional',
          duration: '50 minutos',
        },
        {
          title: 'Orientação Parental',
          desc: 'Encontros focados nas demandas práticas da rotina familiar e na relação pais-filhos, com intervenções direcionadas e personalizadas.',
          tag: 'Para Cuidadores',
          duration: '50 a 60 minutos',
        },
        {
          title: 'Avaliação Neuropsicológica',
          desc: 'Investigação aprofundada das funções cognitivas (atenção, memória, raciocínio, funções executivas), auxiliando em diagnósticos e condutas terapêuticas.',
          tag: 'Clínica & Cognitiva',
          duration: 'Processo estruturado em sessões',
        },
      ],
    },
    faq: {
      title: 'Perguntas Frequentes',
      subtitle: 'Tire suas principais dúvidas sobre o processo de psicoterapia',
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
    contato: {
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
    site_config: {
      accent_color: '#B5D8CC',
      site_title: 'Andréa dos Santos Silva Armôa | Psicóloga Clínica & Neuropsicóloga',
      site_description:
        'Psicóloga Clínica e Neuropsicóloga - CRP 14/075954. Atendimento presencial e online em psicoterapia e orientação parental.',
      admin_email: 'mestredamente1@gmail.com',
      updated_at: new Date().toISOString(),
    },
  }

  for (const [key, content] of Object.entries(defaultContents)) {
    await updateSiteContent(key, content)
  }
}

export async function fetchBlogPosts(onlyPublished = false): Promise<BlogPostRecord[]> {
  try {
    const filter = onlyPublished ? 'published=true' : ''
    return await pb.collection('blog_posts').getFullList<BlogPostRecord>({
      filter,
      sort: '-created',
    })
  } catch (err) {
    console.error('Erro ao buscar blog_posts:', err)
    return []
  }
}

export async function createBlogPost(
  data: FormData | Partial<BlogPostRecord>,
): Promise<BlogPostRecord> {
  return await pb.collection('blog_posts').create<BlogPostRecord>(data)
}

export async function updateBlogPost(
  id: string,
  data: FormData | Partial<BlogPostRecord>,
): Promise<BlogPostRecord> {
  return await pb.collection('blog_posts').update<BlogPostRecord>(id, data)
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  return await pb.collection('blog_posts').delete(id)
}

export async function fetchDocuments(): Promise<DocumentRecord[]> {
  try {
    return await pb.collection('documents').getFullList<DocumentRecord>({
      sort: '-created',
    })
  } catch (err) {
    console.error('Erro ao buscar documents:', err)
    return []
  }
}

export async function createDocument(formData: FormData): Promise<DocumentRecord> {
  return await pb.collection('documents').create<DocumentRecord>(formData)
}

export async function deleteDocument(id: string): Promise<boolean> {
  return await pb.collection('documents').delete(id)
}

export async function fetchPrivateNotes(): Promise<PrivateNoteRecord[]> {
  try {
    return await pb.collection('private_notes').getFullList<PrivateNoteRecord>({
      sort: '-created',
    })
  } catch (err) {
    console.error('Erro ao buscar private_notes:', err)
    return []
  }
}

export async function createPrivateNote(data: {
  title: string
  content: string
}): Promise<PrivateNoteRecord> {
  return await pb.collection('private_notes').create<PrivateNoteRecord>(data)
}

export async function updatePrivateNote(
  id: string,
  data: { title: string; content: string },
): Promise<PrivateNoteRecord> {
  return await pb.collection('private_notes').update<PrivateNoteRecord>(id, data)
}

export async function deletePrivateNote(id: string): Promise<boolean> {
  return await pb.collection('private_notes').delete(id)
}

export function getFileUrl(
  record: { id: string; collectionId?: string; collectionName?: string },
  filename: string,
): string {
  if (!filename) return ''
  return pb.files.getURL(record as any, filename)
}

/**
 * Exporta todo o conteúdo do site (site_content, blog_posts, documents metadata) em formato JSON.
 * Não inclui dados clínicos (inexistentes no sistema por ética) nem notas confidenciais por padrão.
 */
export async function exportContentBackup(): Promise<string> {
  const [contentRecords, blogPosts, documents] = await Promise.all([
    pb.collection('site_content').getFullList<SiteContentRecord>(),
    pb.collection('blog_posts').getFullList<BlogPostRecord>(),
    pb.collection('documents').getFullList<DocumentRecord>(),
  ])

  const contentMap: Record<string, any> = {}
  for (const rec of contentRecords) {
    contentMap[rec.key] = rec.content
  }

  const backupData = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    site_name: 'Andréa dos Santos Silva Armôa - Psicóloga Clínica & Neuropsicóloga',
    site_content: contentMap,
    blog_posts: blogPosts.map((p) => ({
      title: p.title,
      type: p.type,
      content: p.content,
      published: p.published,
      media_url: p.media_url,
    })),
    documents: documents.map((d) => ({
      title: d.title,
      description: d.description,
    })),
  }

  return JSON.stringify(backupData, null, 2)
}

/**
 * Importa um backup JSON e restaura os conteúdos em site_content
 */
export async function importContentBackup(
  jsonData: string,
): Promise<{ success: boolean; count: number }> {
  const parsed = JSON.parse(jsonData)
  if (!parsed || typeof parsed !== 'object' || !parsed.site_content) {
    throw new Error('Arquivo de backup inválido: chave "site_content" ausente.')
  }

  let count = 0
  for (const [key, content] of Object.entries(parsed.site_content)) {
    await updateSiteContent(key, content, true)
    count++
  }

  return { success: true, count }
}

/**
 * Pipeline de compressão e redimensionamento automático de imagens no navegador.
 * Garante que fotos enviadas pela profissional sejam leves, rápidas e não sobrecarreguem o servidor.
 */
export async function compressAndResizeImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82,
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Se não for imagem, devolve o arquivo original
    if (!file.type.startsWith('image/')) {
      return resolve(file)
    }

    const img = document.createElement('img')
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = (err) => reject(err)

    img.onload = () => {
      let { width, height } = img

      // Redimensionamento proporcional se exceder maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return resolve(file)
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve(file)
          }
          const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
          const compressedFile = new File([blob], cleanName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
