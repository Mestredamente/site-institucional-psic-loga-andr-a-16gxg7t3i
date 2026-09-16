import { FileText, Download, ExternalLink } from 'lucide-react'
import type { DocumentRecord } from '@/types/content'
import { getFileUrl } from '@/services/content'

interface DocumentsSectionProps {
  documents: DocumentRecord[]
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
  if (!documents || documents.length === 0) return null

  return (
    <section id="documentos" className="py-16 bg-warm-50 border-t border-warm-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Materiais & Informações
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warm-700">
            Documentos Informativos
          </h2>
          <p className="text-sm text-warm-500">
            Arquivos e informativos disponibilizados pela profissional para consulta e download.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const fileUrl = getFileUrl(doc, doc.file)
            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-warm-200 shadow-xs hover:shadow-sm transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-sage-700" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-warm-700 leading-snug">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-xs text-warm-500 mt-1">{doc.description}</p>
                    )}
                  </div>
                </div>

                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Baixar ${doc.title}`}
                  className="p-2.5 rounded-xl bg-warm-50 hover:bg-sage-100 text-warm-700 hover:text-sage-800 transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
