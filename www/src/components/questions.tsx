import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'

const QUESTIONS = [
  {
    id: 'files',
    question: 'Which files can Miru open?',
    answer: (
      <>
        Comic archives: <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">.cbz</code> (ZIP)
        and <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">.cbr</code> (RAR). Miru decides
        by reading the archive header rather than trusting the extension, so a comic named{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">.zip</code> still opens. A ZIP that is
        not a comic is refused with a clear message instead of a broken reader.
      </>
    ),
  },
  {
    id: 'account',
    question: 'Do I need an account?',
    answer: (
      <>
        No. There is no sign-up, no subscription and no telemetry. Miru never opens a network connection.
        The files you open are the only files it reads.
      </>
    ),
  },
  {
    id: 'library',
    question: 'Where does Miru keep my library?',
    answer: (
      <>
        In <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">history.json</code>, inside{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">~/.miru</code> on your machine, or
        wherever <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">MIRU_HOME</code> points. It
        records the file, the page you stopped on, how far you got, and the layout and direction you were
        reading in, so the next chapter opens where you left it.
      </>
    ),
  },
  {
    id: 'manga',
    question: 'Can I read manga right to left?',
    answer: (
      <>
        Yes. Miru reads right to left for manga and left to right for western comics. One setting flips
        the whole book, and the arrow keys follow the direction you chose rather than fighting it.
      </>
    ),
  },
  {
    id: 'platforms',
    question: 'Which platforms does it run on?',
    answer: (
      <>
        Windows, macOS and Linux, since Miru is built on GPUIX and GPUI. The custom titlebar drag and Aero
        Snap are Windows-only for now; on the other platforms the reader itself is unchanged.
      </>
    ),
  },
  {
    id: 'offline',
    question: 'Does it need an internet connection?',
    answer: (
      <>
        Never. Miru is a local reader, not a service. Everything happens on your machine, including the
        archive extraction and the rendering.
      </>
    ),
  },
]

export function Questions() {
  return (
    <section className="border-t border-border px-5 py-16 md:px-10 md:py-24">
      <p className="eyebrow">Questions</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">Things people ask</h2>

      <Reveal className="mt-6">
        <Accordion className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
          {QUESTIONS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  )
}
