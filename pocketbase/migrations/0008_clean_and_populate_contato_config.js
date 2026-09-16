migrate(
  (app) => {
    // 1. Atualizar registro 'contato' garantindo objeto limpo sem placeholders
    try {
      const contatoRec = app.findFirstRecordByData('site_content', 'key', 'contato')
      contatoRec.set('content', {
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
      })
      app.save(contatoRec)
    } catch (_) {}

    // 2. Atualizar 'site_config' garantindo SEO e identidade limpa
    try {
      const configRec = app.findFirstRecordByData('site_content', 'key', 'site_config')
      configRec.set('content', {
        accent_color: '#B5D8CC',
        site_title: 'Andréa Armôa | Psicóloga Clínica e Neuropsicóloga',
        site_description:
          'Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento humanizado presencial e online em psicoterapia e orientação parental.',
        canonical_url: 'https://andreaarmoa.com.br',
        og_image_key: 'hero_foto',
        area_served: 'Mato Grosso do Sul e atendimento online nacional',
        admin_email: 'mestredamente1@gmail.com',
      })
      app.save(configRec)
    } catch (_) {}
  },
  (app) => {
    // down migration
  },
)
