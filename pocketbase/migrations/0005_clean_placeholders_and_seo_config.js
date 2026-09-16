migrate(
  (app) => {
    // 1. Atualizar registro 'contato' limpando os dados fictícios
    try {
      const contatoRec = app.findFirstRecordByData('site_content', 'key', 'contato')
      const current = contatoRec.get('content') || {}

      // Remover placeholders ficticios
      const cleanAddress =
        current.address && /p[a]ulista/i.test(current.address) ? '' : current.address || ''
      const cleanAddressComp =
        current.address_complement && current.address_complement.includes('Prime Office')
          ? ''
          : current.address_complement || ''
      const cleanWhatsapp =
        current.whatsapp && (/9{4,}/.test(current.whatsapp) || current.whatsapp.length < 10)
          ? ''
          : current.whatsapp || ''
      const cleanWhatsappFormatted =
        current.whatsapp_formatted && /9{4,}/.test(current.whatsapp_formatted)
          ? ''
          : current.whatsapp_formatted || ''
      const cleanInstagram =
        current.instagram && current.instagram.includes('andreaarno')
          ? '@andreaarmoapsi'
          : current.instagram || '@andreaarmoapsi'
      const cleanInstagramUrl =
        current.instagram_url && current.instagram_url.includes('andreaarno')
          ? 'https://instagram.com/andreaarmoapsi'
          : current.instagram_url || 'https://instagram.com/andreaarmoapsi'
      const cleanEmail =
        current.email && current.email === 'contato@andreaarmoa.com.br' ? '' : current.email || ''
      const cleanMapsIframe =
        current.maps_iframe_url && current.maps_iframe_url.includes('1600000000000')
          ? ''
          : current.maps_iframe_url || ''

      contatoRec.set('content', {
        ...current,
        title: current.title || 'Contato & Localização',
        subtitle: current.subtitle || 'Dê o primeiro passo em direção ao seu bem-estar emocional',
        address: cleanAddress,
        address_complement: cleanAddressComp,
        whatsapp: cleanWhatsapp,
        whatsapp_formatted: cleanWhatsappFormatted,
        whatsapp_message:
          current.whatsapp_message ||
          'Olá, Andréa! Gostaria de obter informações sobre atendimentos.',
        instagram: cleanInstagram,
        instagram_url: cleanInstagramUrl,
        email: cleanEmail,
        maps_iframe_url: cleanMapsIframe,
      })
      app.save(contatoRec)
    } catch (_) {}

    // 2. Atualizar 'site_config' com dados de SEO e OG
    try {
      const configRec = app.findFirstRecordByData('site_content', 'key', 'site_config')
      const cfg = configRec.get('content') || {}
      configRec.set('content', {
        ...cfg,
        accent_color: cfg.accent_color || '#B5D8CC',
        site_title: 'Andréa Armôa | Psicóloga Clínica e Neuropsicóloga',
        site_description:
          'Psicóloga clínica e neuropsicóloga (CRP 14/075954). Atendimento humanizado presencial e online em psicoterapia e orientação parental.',
        canonical_url: 'https://andreaarmoa.com.br',
        og_image_key: cfg.og_image_key || 'hero_foto',
        area_served: 'Mato Grosso do Sul e atendimento online nacional',
      })
      app.save(configRec)
    } catch (_) {}
  },
  (app) => {
    // down migration
  },
)
