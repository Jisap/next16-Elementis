"use client";
import cn from "@/utils/cn";
import { AnimatePresence, motion, MotionStyle } from "motion/react";
import { PropsWithChildren } from "react";

interface CursorProps extends PropsWithChildren {
  renderCursor: boolean;  // Control externo de visibilidad. Permite ocultar el cursor en inputs, enlaces, etc. 
  style?: MotionStyle;
  isMobile?: boolean;    // En móvil, retrasa la aparición 1s para evitar flash al cargar/tocar
  className?: string;
}

export default function Cursor({
  renderCursor,
  children,
  className,
  isMobile = false,
  ...rest
}: CursorProps) {
  const variants = {
    initial: { scale: 0 },
    animate: (custom: boolean) => ({  // custom recibe isMobile: si true, delay=1s; si false, aparece inmediatamente
      scale: 1,
      transition: {
        delay: custom ? 1 : 0,
        duration: 0.25,
      },
    }),
    exit: {
      scale: 0,
      // ⚠️ BUG POTENCIAL: falta envolver en { transition: {...} }
      // Tal como está, Framer Motion puede ignorar esta duración
      duration: 0.25,
    },
  };

  return (
    // AnimatePresence detecta cuando renderCursor cambia a false
    // y ejecuta la variante "exit" ANTES de desmontar el elemento
    <AnimatePresence>
      {renderCursor && (
        <motion.div
          {...rest}
          initial="initial"
          animate="animate"
          exit="exit"
          // isMobile se pasa como custom prop → disponible en variantes como parámetro
          custom={isMobile}
          variants={variants}
          className={cn(
            // pointer-events-none: CRÍTICO. El cursor personalizado NUNCA debe
            // interceptar clicks/hovers. Solo es visual; la interacción real
            // sigue siendo del cursor nativo del sistema
            // fixed + z-20: siempre encima del contenido, fuera del flujo normal
            // backdrop-filter:blur: efecto glassmorphism que requiere fondo semitransparente
            "pointer-events-none fixed z-20 bg-white/30 text-lg [backdrop-filter:blur(10px)]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}