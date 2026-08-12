// Importa solo la versión cliente de motion para hidratación en Server Components
import * as motion from "motion/react-client";
import { MotionProps, Variants } from "motion/react";
import React, { CSSProperties, ReactNode } from "react";
import cn from "@/utils/cn";

interface MaskTextProps extends MotionProps {
  lines: ReactNode[];       // Array de elementos a revelar uno por uno
  className?: string;
  style?: CSSProperties;
}

export default function MaskText({
  lines,
  className,
  style,
  ...animationProps // Captura transition, delayChildren, etc. pasados desde el padre
}: MaskTextProps) {

  // ─── VARIANTE DEL CONTENEDOR (Padre) ───────────────────────
  const containerVariants: Variants = {
    inView: {
      transition: {
        staggerChildren: 0.1,             // Cada hijo (.lines[]) se anima 0.1s después del anterior
        ...animationProps.transition,     // Fusiona con las props externas (ej: delayChildren: 0.4)
      },                                  // Esto permite controlar CUÁNDO empieza la cascada completa
    },
  };

  // ─── VARIANTE DE CADA LÍNEA (Hijo) ─────────────────────────
  const variants: Variants = {
    initial: {                            // Estado inicial: invisible y desplazado hacia abajo
      y: "100%",                          // Desplaza el elemento 100% de su propia altura hacia abajo
      clipPath: "inset(0% 0% 100% 0%)",   // Recorta: top=0, right=0, bottom=100%, left=0
      // bottom=100% significa "oculta todo desde abajo"
    },

    inView: {                             // Estado final: visible y en posición original
      y: "0%",                            // Vuelve a su posición natural
      clipPath: "inset(0% 0% 0% 0%)",     // bottom=0% = sin recorte, totalmente visible
      transition: {
        // Curva cubic-bezier personalizada tipo "ease-out orgánico"
        // [x1, y1, x2, y2] → salida rápida, llegada muy suave
        ease: [0.24, 0.43, 0.15, 0.97] as const,
        duration: 0.8,                    // 800ms por línea (lento y elegante)
      },
    },
  };

  return (
    <motion.div
      initial="initial"                   // Aplica variante "initial" al montar
      whileInView="inView"                // Cambia a "inView" cuando entra en viewport
      variants={containerVariants}        // staggerChildren se ejecuta aquí.
      viewport={{ once: true }}           // Solo anima UNA VEZ (no re-anima al hacer scroll up)
      style={{ ...style }}
      className={cn("", className)}
    >
      {lines.map((eachLine, index) => (
        // Cada línea es un motion.div independiente que hereda
        // el stagger del contenedor + su propio delayChildren
        <motion.div key={index + 1} variants={variants}>
          {eachLine}
        </motion.div>
      ))}
    </motion.div>
  );
}