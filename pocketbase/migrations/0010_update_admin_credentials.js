migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // 1. Atualizar ou criar o usuário admin com o novo email da cliente e nova senha
    let newAdminRecord
    try {
      newAdminRecord = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'neuropsicologa.andreaarmoa@gmail.com',
      )
    } catch (_) {
      newAdminRecord = null
    }

    if (newAdminRecord) {
      newAdminRecord.setPassword('Andrea%0311')
      newAdminRecord.setVerified(true)
      newAdminRecord.set('name', 'Andréa Armôa')
      app.save(newAdminRecord)
    } else {
      // Verificar se o usuário antigo mestredamente1@gmail.com existe
      let oldAdminRecord
      try {
        oldAdminRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'mestredamente1@gmail.com')
      } catch (_) {
        oldAdminRecord = null
      }

      if (oldAdminRecord) {
        // Atualiza a conta existente para o novo email e nova senha
        oldAdminRecord.setEmail('neuropsicologa.andreaarmoa@gmail.com')
        oldAdminRecord.setPassword('Andrea%0311')
        oldAdminRecord.setVerified(true)
        oldAdminRecord.set('name', 'Andréa Armôa')
        app.save(oldAdminRecord)
      } else {
        // Cria nova conta com as credenciais da cliente
        const createdUser = new Record(users)
        createdUser.setEmail('neuropsicologa.andreaarmoa@gmail.com')
        createdUser.setPassword('Andrea%0311')
        createdUser.setVerified(true)
        createdUser.set('name', 'Andréa Armôa')
        app.save(createdUser)
      }
    }

    // 2. Garantir que mestredamente1@gmail.com não exista mais no banco
    try {
      const oldCheck = app.findAuthRecordByEmail('_pb_users_auth_', 'mestredamente1@gmail.com')
      if (oldCheck) {
        app.delete(oldCheck)
      }
    } catch (_) {}

    // 3. Atualizar admin_email em site_config se existir
    try {
      const configRec = app.findFirstRecordByData('site_content', 'key', 'site_config')
      const currentContent = configRec.get('content') || {}
      currentContent.admin_email = 'neuropsicologa.andreaarmoa@gmail.com'
      configRec.set('content', currentContent)
      app.save(configRec)
    } catch (_) {}
  },
  (app) => {
    // down migration
  },
)
