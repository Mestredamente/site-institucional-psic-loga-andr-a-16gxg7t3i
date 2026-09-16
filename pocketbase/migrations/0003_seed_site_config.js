migrate(
  (app) => {
    // Garantir que a chave 'site_config' existe na coleção site_content
    const siteContentCol = app.findCollectionByNameOrId('site_content')
    try {
      app.findFirstRecordByData('site_content', 'key', 'site_config')
    } catch (_) {
      const rec = new Record(siteContentCol)
      rec.set('key', 'site_config')
      rec.set('content', {
        accent_color: '#B5D8CC',
        site_title: 'Andréa dos Santos Silva Armôa | Psicóloga Clínica & Neuropsicóloga',
        site_description:
          'Psicóloga Clínica e Neuropsicóloga - CRP 14/075954. Atendimento presencial e online em psicoterapia e orientação parental.',
        admin_email: 'mestredamente1@gmail.com',
        updated_at: new Date().toISOString(),
      })
      app.save(rec)
    }
  },
  (app) => {
    try {
      const rec = app.findFirstRecordByData('site_content', 'key', 'site_config')
      app.delete(rec)
    } catch (_) {}
  },
)
