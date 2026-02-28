import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Importamos nuestros componentes y estado
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import TourWrapper from "@/components/TourWrapper"; // <-- NUEVO IMPORT LIMPIO

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos optimizados para SEO y redes sociales
export const metadata: Metadata = {
  title: "Agrotienda La Floresta | Frescura de Fresno",
  description: "Pide frutas y verduras directamente de Fresno, Tolima. Entregas Miércoles y Sábados.",
  openGraph: {
    title: 'Agrotienda La Floresta',
    description: 'Del campo tolimense a tu mesa sin escalas.',
    url: 'https://agrotienda-la-floresta.com', 
    siteName: 'La Floresta',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-gray-900 min-h-screen pb-20`}
      >
        <CartProvider>
          <Navbar />
          <CartDrawer />
          {children}
          <FloatingWhatsApp />
          
          {/* Aquí inyectamos el envoltorio que maneja el Tour de forma segura */}
          <TourWrapper />
        </CartProvider>
      </body>
    </html>
  );
}