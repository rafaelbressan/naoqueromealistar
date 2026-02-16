import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Não Quero Me Alistar
        </h1>

        <p className="text-xl md:text-2xl text-gray-700">
          Descubra se você tem direito legal à dispensa do serviço militar
        </p>

        <div className="space-y-4">
          <p className="text-gray-600">
            Responda algumas perguntas e descubra se você se encaixa em alguma das categorias de dispensa previstas na lei brasileira.
          </p>

          <Link
            href="/quiz"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            Começar Quiz
          </Link>
        </div>

        <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-left">
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
