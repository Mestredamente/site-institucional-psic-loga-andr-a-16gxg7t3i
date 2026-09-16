import pb from '@/lib/pocketbase/client'
import type {
  SiteContentRecord,
  SiteMediaRecord,
  BlogPostRecord,
  DocumentRecord,
  PrivateNoteRecord,
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

export async function updateSiteContent(key: string, content: any): Promise<SiteContentRecord> {
  const existing = await pb
    .collection('site_content')
    .getFirstListItem<SiteContentRecord>(`key="${key}"`)
  return await pb.collection('site_content').update<SiteContentRecord>(existing.id, {
    content,
  })
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
