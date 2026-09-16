migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('blog_posts')
    if (!col.fields.getByName('resumo')) {
      col.fields.add(
        new TextField({
          name: 'resumo',
          type: 'text',
          required: false,
          max: 160,
        }),
      )
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('blog_posts')
    const field = col.fields.getByName('resumo')
    if (field) {
      col.fields.removeByName('resumo')
      app.save(col)
    }
  },
)
