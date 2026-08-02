import Link from "next/link";

/**
 * The landing stays a server component on purpose.
 *
 * It was briefly a client component so Framer Motion could stagger the lines
 * in. That cost 44.6KB gzip of framer-motion on the app's front door, and —
 * worse — the h1 is the LCP candidate, so starting it at `opacity: 0` moved
 * LCP from "HTML paints" to "45KB fetched, parsed, hydrated, then a 250ms
 * reveal finishes". On the mid-range Android this quiz is built for, over
 * mobile data, that is seconds.
 *
 * The same stagger in CSS costs nothing, ships no JS, and animates from
 * server-painted markup. `.reveal-line` and its delays live in globals.css and
 * read the same duration tokens as everything else, so the landing stays on
 * the app's tempo.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1
          className="reveal-line text-4xl md:text-6xl font-bold text-gray-900"
          style={{ animationDelay: "0ms" }}
        >
          Não Quero Me Alistar
        </h1>

        <p
          className="reveal-line text-xl md:text-2xl text-gray-700"
          style={{ animationDelay: "40ms" }}
        >
          Descubra se você tem direito legal à dispensa do serviço militar
        </p>

        <div className="reveal-line space-y-4" style={{ animationDelay: "80ms" }}>
          <p className="text-gray-600">
            Responda algumas perguntas e descubra se você se encaixa em alguma das categorias de dispensa previstas na lei brasileira.
          </p>

          <Link
            href="/quiz"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg t-btn"
          >
            Começar Quiz
          </Link>
        </div>

        <div
          className="reveal-line mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-left"
          style={{ animationDelay: "120ms" }}
        >
          <p className="font-semibold text-yellow-900 mb-2">⚠️ Aviso Legal</p>
          <p className="text-yellow-800">
            Este quiz tem fins informativos e não substitui orientação jurídica profissional.
            As informações são baseadas na legislação vigente em Janeiro de 2025.
            Consulte um advogado ou a JSM local para casos específicos.
          </p>
        </div>
      </div>
    </main>
  );
}
