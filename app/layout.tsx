import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eu Não Quero Me Alistar",
  description: "Descubra se você tem direito legal à dispensa do serviço militar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
