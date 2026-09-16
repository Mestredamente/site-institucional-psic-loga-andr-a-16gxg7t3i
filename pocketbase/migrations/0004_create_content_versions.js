migrate(
  (app) => {
    // Coleção para armazenar histórico de versões de cada alteração de site_content
    // Permite "Desfazer" e restaurar versões anteriores em um clique
    const contentVersions = new Collection({
      name: 'content_versions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'content', type: 'json' },
        { name: 'note', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_content_versions_key ON content_versions (key)',
        'CREATE INDEX idx_content_versions_created ON content_versions (created)',
      ],
    })
    app.save(contentVersions)

    // Atualizar dados de semente no site_content para alinhar com os tópicos exatos solicitados pelo usuário
    const siteContentCol = app.findCollectionByNameOrId('site_content')

    // 1. Orientação Parental com frase exata e os 6 tópicos reais
    try {
      const orientacaoRec = app.findFirstRecordByData('site_content', 'key', 'orientacao_parental')
      const currentContent = orientacaoRec.get('content') || {}
      orientacaoRec.set('content', {
        ...currentContent,
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
      })
      app.save(orientacaoRec)
    } catch (_) {}

    // 2. Para Quem com 5 cards: Adultos, Adolescentes, Crianças, Pais e Responsáveis, Famílias
    try {
      const paraQuemRec = app.findFirstRecordByData('site_content', 'key', 'para_quem')
      const currentContent = paraQuemRec.get('content') || {}
      paraQuemRec.set('content', {
        ...currentContent,
        title: 'Para Quem São os Atendimentos',
        subtitle: 'Cuidado individualizado e respeitoso para cada fase do desenvolvimento humano',
        groups: [
          {
            name: 'Adultos',
            summary:
              'Pessoas que buscam autoconhecimento, superação de crises emocionais, manejo de ansiedade, estresse ou reorganização da vida profissional e afetiva.',
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
              'Apoio lúdico no desenvolvimento socioemocional, regulação de emoções, medos, dificuldades de comportamento e adaptações escolares.',
            badge: 'Lúdico e Clínico',
          },
          {
            name: 'Pais e Responsáveis',
            summary:
              'Mães, pais e cuidadores que desejam clareza e ferramentas práticas para educar com afeto, firmeza e presença consciente no dia a dia.',
            badge: 'Parentalidade',
          },
          {
            name: 'Famílias',
            summary:
              'Acolhimento de impasses relacionais, transições de ciclo familiar, alinhamento de convivência e fortalecimento de vínculos afetivos coletivos.',
            badge: 'Sistêmico & Vínculos',
          },
        ],
      })
      app.save(paraQuemRec)
    } catch (_) {}

    // 3. Como Funciona com 4 etapas + modalidades
    try {
      const comoFuncionaRec = app.findFirstRecordByData('site_content', 'key', 'como_funciona')
      const currentContent = comoFuncionaRec.get('content') || {}
      comoFuncionaRec.set('content', {
        ...currentContent,
        title: 'Como Funciona o Atendimento',
        subtitle:
          'Etapas estruturadas e modalidades flexíveis para sua comodidade com total sigilo e ética',
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
      })
      app.save(comoFuncionaRec)
    } catch (_) {}

    // 4. FAQ com 8 perguntas completas
    try {
      const faqRec = app.findFirstRecordByData('site_content', 'key', 'faq')
      const currentContent = faqRec.get('content') || {}
      faqRec.set('content', {
        ...currentContent,
        title: 'Perguntas Frequentes',
        subtitle: 'Tire suas principais dúvidas sobre o processo de psicoterapia e acompanhamento',
        questions: [
          {
            q: 'Como funciona a primeira consulta?',
            a: 'A primeira sessão é um momento de acolhimento e conhecimento mútuo. Nela, conversaremos sobre o que te motivou a buscar ajuda, suas expectativas e dúvidas. Também alinhamos como funcionará o processo, frequência dos encontros e horários.',
          },
          {
            q: 'Qual é a duração e frequência das sessões?',
            a: 'As sessões individuais têm duração de 50 minutos e geralmente ocorrem com frequência semanal, garantindo a continuidade e a consistência necessárias para o processo terapêutico.',
          },
          {
            q: 'O atendimento psicológico online é tão eficaz quanto o presencial?',
            a: 'Sim. Estudos científicos e a regulamentação do Conselho Federal de Psicologia (CFP) comprovam que o atendimento online oferece a mesma eficácia clínica do presencial, com a comodidade de você ser atendido no conforto e segurança do seu ambiente.',
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
            a: 'O sigilo profissional é um dever ético absoluto assegurado pelo Código de Ética do Psicólogo. Tudo o que é compartilhado nas sessões permanece estritamente confidencial entre paciente e profissional.',
          },
          {
            q: 'Como faço para agendar um primeiro horário?',
            a: 'Basta clicar no botão de WhatsApp aqui no site e enviar uma mensagem. Responderemos informando os horários disponíveis, valores e tirando qualquer dúvida prévia para seu agendamento.',
          },
        ],
      })
      app.save(faqRec)
    } catch (_) {}
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('content_versions')
      app.delete(col)
    } catch (_) {}
  },
)
