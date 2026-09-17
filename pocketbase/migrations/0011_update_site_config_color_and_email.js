migrate(
  (app) => {
    // Atualizar site_config com admin_email da cliente e accent_color #BC849D
    const configRec = app.findFirstRecordByData('site_content', 'key', 'site_config')
    const rawContent = configRec.getString('content')
    let contentObj = {}
    if (rawContent) {
      try {
        contentObj = JSON.parse(rawContent)
      } catch (_) {}
    }
    contentObj.admin_email = 'neuropsicologa.andreaarmoa@gmail.com'
    contentObj.accent_color = '#BC849D'
    contentObj.updated_at = new Date().toISOString()

    configRec.set('content', JSON.stringify(contentObj))
    app.save(configRec)
  },
  (app) => {
    // down migration
  },
)
