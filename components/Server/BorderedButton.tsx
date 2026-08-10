import React, { PropsWithChildren } from "react";
import * as motion from "motion/react-client";
import cn from "@/utils/cn";
import { MotionProps } from "motion/react";
type BorderedButtonProps = PropsWithChildren &
  MotionProps & {
    className?: string;
  };


export default function BorderedButton({
  children,
  className,
  ...props
}: BorderedButtonProps) {
  return (
    // Contenedor del botón. "initial"/"whileHover" activan las variantes
    // del trazo animado del SVG (ver más abajo).
    <motion.div
      initial="initial"
      whileHover="whileHover"
      className={cn("relative", className)}
      {...props} // permite pasar props de motion (animate, variants, etc.) desde el padre
    >
      {children}

      <div className="absolute inset-0">
        {/* preserveAspectRatio="none": el SVG se estira para ocupar el
            tamaño real del botón, ignorando la proporción del viewBox */}
        <svg
          viewBox="0 0 250 100"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Borde base estático, siempre visible como referencia sutil */}
          <path
            d="M1 99 H249 V1 H1 Z" // rectángulo con 1px de margen para no recortar el stroke
            opacity="0.5"
            strokeWidth="2px"
            fill="none"
          />

          {/* Borde animado: usa pathLength para simular un trazo dibujándose
              progresivamente alrededor del perímetro al hacer hover */}
          <motion.path
            d="M1 99 H249 V1 H1 Z"
            strokeWidth="3px" // más grueso que el borde base, para destacar el trazo
            fill="none"
            variants={{
              initial: { pathLength: 0 }, // trazo oculto (0% del recorrido dibujado)
              whileHover: {
                pathLength: 1, // trazo completo (100%)
                transition: {
                  duration: 0.8,
                  delay: 0.3, // pequeña pausa antes de empezar a dibujar
                  ease: [0.24, 0.43, 0.15, 0.97],
                },
              },
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
}