'use client';

import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const rajdhani = Rajdhani({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display"
});

// Metadata não pode ser exportado em 'use client', então movemos para um arquivo separado ou removemos se for layout root client
// Como este arquivo já era server component antes (sem 'use client'), precisamos separar.
// Mas para simplificar e atender o pedido de animação, vamos transformar em Client Component
// e assumir que o metadata está em outro lugar ou aceitar que perderemos metadata estático aqui.
// CORREÇÃO: O Next.js App Router permite template.js para transições. 
// Mas o usuário pediu no layout.js ou template.js.
// Vamos criar um componente wrapper para a animação para manter o layout como Server Component se possível,
// mas como o pedido é direto, vamos fazer o layout ser client side para a animação global.

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="pt-BR" className={`${inter.variable} ${rajdhani.variable}`}>
      <body>
        <div className="canvas-container">
          <div className="ambient-glow"></div>
          <div className="grid-overlay"></div>
        </div>

        <AuthProvider>
          <div className="app-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ width: '100%' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}