migrate(
  (app) => {
    // 1. site_content
    const siteContent = new Collection({
      name: 'site_content',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'content', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_site_content_key ON site_content (key)'],
    })
    app.save(siteContent)

    // 2. site_media
    const siteMedia = new Collection({
      name: 'site_media',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_site_media_key ON site_media (key)'],
    })
    app.save(siteMedia)

    // 3. blog_posts
    const blogPosts = new Collection({
      name: 'blog_posts',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'editor' },
        { name: 'type', type: 'select', values: ['blog', 'vlog'], maxSelect: 1, required: true },
        { name: 'media_file', type: 'file', maxSelect: 1, maxSize: 52428800 },
        { name: 'media_url', type: 'url' },
        { name: 'published', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_blog_posts_published ON blog_posts (published)',
        'CREATE INDEX idx_blog_posts_created ON blog_posts (created)',
      ],
    })
    app.save(blogPosts)

    // 4. documents
    const documents = new Collection({
      name: 'documents',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 20971520, required: true },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(documents)

    // 5. private_notes (visíveis SOMENTE para o admin autenticado)
    const privateNotes = new Collection({
      name: 'private_notes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'editor', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(privateNotes)
  },
  (app) => {
    const toDelete = ['private_notes', 'documents', 'blog_posts', 'site_media', 'site_content']
    for (const name of toDelete) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
