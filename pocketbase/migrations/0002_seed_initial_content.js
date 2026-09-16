migrate(
  (app) => {
    // 1. Criar usuário administrador
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'mestredamente1@gmail.com')
    } catch (_) {
      const adminUser = new Record(users)
      adminUser.setEmail('mestredamente1@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Andréa Armôa')
      app.save(adminUser)
    }

    // 2. Popular site_content
    const siteContentCol = app.findCollectionByNameOrId('site_content')

    const initialContents = [
      {
        key: 'hero',
        content: {
          title: 'Andréa dos Santos Silva Armôa',
          subtitle: 'Psicóloga Clínica e Neuropsicóloga',
          crp: 'CRP 14/075954',
          welcoming_phrase:
            'Aqui, você encontra um espaço seguro, acolhedor e ético para se ouvir, se compreender e se cuidar.',
          cta_primary: 'Agendar Atendimento',
          cta_secondary: 'Conhecer Minha Atuação',
          badge: 'Atendimento Presencial & Online',
        },
      },
      {
        key: 'sobre',
        content: {
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
      },
      {
        key: 'psicoterapia',
        content: {
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
      },
      {
        key: 'orientacao_parental',
        content: {
          title: 'Orientação Parental',
          quote: 'Fortalecendo pais para fortalecer a relação com os filhos.',
          lead: 'A parentalidade é uma das jornadas mais desafiadoras e enriquecedoras da vida. Não existe manual perfeito, mas existe apoio qualificado e acolhedor.',
          description:
            'A orientação parental é um serviço direcionado a mães, pais e cuidadores que buscam compreender os desafios de desenvolvimento de seus filhos, estabelecer limites saudáveis sem violência, promover uma comunicação afetiva e resolver impasses comportamentais e emocionais na rotina familiar.',
          points: [
            'Compreensão do desenvolvimento infantil e neurobiologia das emoções',
            'Manejo de birras, oposição e limites amorosos e consistentes',
            'Alinhamento da comunicação e rotina entre o casal parental',
            'Fortalecimento do vínculo afetivo e segurança emocional da criança',
            'Mediação de momentos de transição escolar ou dinâmica familiar',
          ],
          cta_text: 'Quero agendar uma Orientação Parental',
        },
      },
      {
        key: 'para_quem',
        content: {
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
          ],
        },
      },
      {
        key: 'beneficios',
        content: {
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
      },
      {
        key: 'como_funciona',
        content: {
          title: 'Como Funciona o Atendimento',
          subtitle: 'Modalidades pensadas para se adaptar à sua realidade com total sigilo e ética',
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
      },
      {
        key: 'faq',
        content: {
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
          ],
        },
      },
      {
        key: 'contato',
        content: {
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
      },
    ]

    for (const item of initialContents) {
      try {
        app.findFirstRecordByData('site_content', 'key', item.key)
      } catch (_) {
        const rec = new Record(siteContentCol)
        rec.set('key', item.key)
        rec.set('content', item.content)
        app.save(rec)
      }
    }

    // 3. Popular um post inicial no blog_posts
    const blogCol = app.findCollectionByNameOrId('blog_posts')
    try {
      app.findFirstRecordByData(
        'blog_posts',
        'title',
        'O papel do afeto e dos limites no desenvolvimento infantil',
      )
    } catch (_) {
      const post = new Record(blogCol)
      post.set('title', 'O papel do afeto e dos limites no desenvolvimento infantil')
      post.set('type', 'blog')
      post.set('published', true)
      post.set(
        'content',
        "<p>Educar não se resume a dizer 'sim' ou 'não'. Trata-se de construir uma ponte de segurança onde a criança sabe exatamente até onde pode ir, sentindo-se amada em todos os momentos.</p><p>Quando combinamos empatia e firmeza, permitimos que os pequenos desenvolvam autorregulação, respeito mútuo e resiliência emocional para a vida adulta.</p>",
      )
      app.save(post)
    }
  },
  (app) => {
    // down: rollback seed
  },
)
