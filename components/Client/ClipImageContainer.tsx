"use client";

import {
  motion,
  MotionValue,
  useMotionTemplate,
  useTransform,
} from "motion/react";
import { ReactNode } from "react";

interface CardImageProps {
  index: number;
  scrollYProgress: MotionValue<number>;
  children: ReactNode;
}

/**
 * Controla la animación individual de cada imagen
 * que aparece dentro de ClipImageCard.
 *
 * Todas las imágenes se encuentran superpuestas
 * en la misma posición.
 *
 * El scroll determina:
 *
 * 1. Cuándo empieza a revelarse la imagen.
 * 2. Cuándo termina de revelarse.
 * 3. Cuánto zoom aplica durante la transición.
 *
 * La imagen se revela utilizando clip-path:
 *
 *     inset(0 0 X 0)
 *
 * Cuando X = 0%:
 *     → imagen completamente visible.
 *
 * Cuando X = 100%:
 *     → imagen completamente oculta.
 */

// Scroll
//   │
//   ▼
// scrollYProgress
//   │
//   ├───────────────┐
//   ▼               ▼
// clipPath         scale
//   │               │
//   ▼               ▼
// revelado         zoom
//   │               │
//   └───────┬───────┘
//           ▼
//         IMAGE

export default function ClipImageContainer({
  index,
  scrollYProgress,
  children,
}: CardImageProps) {

  /**
   * Controla la cantidad de imagen que permanece
   * recortada por la parte inferior.
   *
   * Cada imagen tiene un intervalo de 25% del
   * progreso total del scroll.
   *
   * Ejemplo:
   *
   * Imagen 0 → 0.00 - 0.25
   * Imagen 1 → 0.25 - 0.50
   * Imagen 2 → 0.50 - 0.75
   * Imagen 3 → 0.75 - 1.00
   *
   * Durante su intervalo:
   *
   * bottom: 0%   → imagen visible
   * bottom: 100%  → imagen oculta
   */
  const bottom = useTransform(
    scrollYProgress,
    [index * 0.25, index * 0.25 + 0.25],
    ["0%", "100%"],
  );

  /**
   * Aplica un pequeño zoom durante la transición.
   *
   * La imagen comienza con:
   *
   *     scale(1)
   *
   * y termina aproximadamente en:
   *
   *     scale(1.05)
   *
   * El intervalo empieza un 25% antes de la
   * transición de la imagen y termina cuando
   * dicha transición finaliza.
   *
   * Esto permite que la imagen tenga un movimiento
   * ligeramente más natural durante el cambio.
   */
  const scale = useTransform(
    scrollYProgress,
    [(index - 1) * 0.25, index * 0.25 + 0.25],
    [1, 1.05],
  );

  /**
   * Convierte el valor animado `bottom` en un
   * clip-path CSS.
   *
   * Ejemplo:
   *
   * bottom = 0%
   *
   *     inset(0px 0px 0% 0px)
   *
   * → imagen completamente visible.
   *
   * bottom = 100%
   *
   *     inset(0px 0px 100% 0px)
   *
   * → imagen completamente oculta.
   */
  const clipPath = useMotionTemplate`
        inset(0px 0px ${bottom} 0px)
    `;

  return (
    <motion.div
      /**
       * Todas las imágenes ocupan exactamente
       * el mismo espacio y quedan superpuestas.
       */
      className="absolute inset-0"

      /**
       * Las imágenes se colocan unas encima
       * de otras utilizando el índice.
       *
       * La imagen con menor índice queda por
       * encima de las siguientes.
       */
      style={{
        clipPath,
        zIndex: -index,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
}