import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FaqContent } from '@/types/content'

interface FaqProps {
  content?: FaqContent
}

export default function Faq({ content }: FaqProps) {
  const defaultQuestions = [
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
      a: 'O sigilo profissional é um dever ético absoluto assegurado pelo Código de Ética do Psicólogo. Tudo o que é compartilhado nas sessões permanece estritamente confidencial entre paciente e profissional.',
    },
    {
      q: 'Como faço para agendar um primeiro horário?',
      a: 'Basta clicar no botão de WhatsApp aqui no site e enviar uma mensagem. Responderemos informando os horários disponíveis, valores e tirando qualquer dúvida prévia para seu agendamento.',
    },
  ]

  const questions = content?.questions?.length ? content.questions : defaultQuestions

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-t border-warm-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
            Dúvidas Frequentes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-700 tracking-tight">
            {content?.title || 'Perguntas Frequentes'}
          </h2>
          <p className="text-base sm:text-lg text-warm-500 font-normal">
            {content?.subtitle ||
              'Esclareça suas principais dúvidas sobre o processo de psicoterapia e acompanhamento.'}
          </p>
        </div>

        {/* Acordeão com shadcn e animação suave */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {questions.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-warm-200 rounded-2xl px-6 py-1 bg-warm-50/50 hover:bg-warm-50 transition-colors data-[state=open]:bg-white data-[state=open]:border-sage-300 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left font-serif text-lg font-semibold text-warm-700 hover:text-warm-900 hover:no-underline py-4">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-warm-600 leading-relaxed font-normal pt-1 pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
