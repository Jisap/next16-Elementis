import { MotionValue, useTransform } from "motion/react";

/**
 * Genera la máscara CSS utilizada para revelar progresivamente
 * una imagen durante una transición.
 *
 * El progreso recibido debe estar entre 0 y 1.
 *
 * En móvil:
 *   Se utiliza una única máscara vertical sencilla.
 *
 * En desktop:
 *   La imagen se divide visualmente en varias franjas.
 *   Cada franja se revela progresivamente, creando una
 *   transición segmentada más compleja.
 */
export default function useMaskImage(
  localProgress: MotionValue<number>,
  isMobile: boolean | null,
  config?: {
    divisions: number;
    inset: number;
    gap: number;
    vh: number;
  },
) {
  /**
   * Configuración de la máscara.
   *
   * divisions:
   * Número de franjas en las que se divide la imagen.
   *
   * inset:
   * Margen inicial/final del recorrido de la máscara.
   *
   * gap:
   * Duración relativa de la transición de cada franja.
   *
   * vh:
   * Altura total utilizada para construir el gradiente.
   */
  const {
    divisions = 28,
    inset = 0,
    gap = 0.35,
    vh = 130,
  } = config ?? {};

  /**
   * Calcula cuánto se ha revelado una franja concreta.
   *
   * Resultado:
   *
   * 0 → todavía oculta.
   * 0-1 → en proceso de revelado.
   * 1 → completamente visible.
   */
  const getDivisionProgress = (
    index: number,
    progress: number,
  ) => {
    /**
     * Espacio entre el inicio de cada franja.
     */
    const buffer =
      (1 - 2 * inset - gap) /
      (divisions - 1);

    /**
     * La transición de esta franja todavía
     * no ha comenzado.
     */
    if (
      inset + index * buffer >
      progress
    ) {
      return 0;
    }

    /**
     * La transición de esta franja ya ha terminado.
     */
    if (
      inset +
      gap +
      index * buffer <
      progress
    ) {
      return 1;
    }

    /**
     * La franja está actualmente
     * en proceso de revelado.
     */
    return (
      (progress -
        (inset + index * buffer)) /
      gap
    );
  };

  /**
   * Convierte el progreso de la transición
   * en una cadena CSS para mask-image.
   */
  const maskImage = useTransform(
    localProgress,
    (latest) => {
      /**
       * Mientras no sepamos si estamos en móvil
       * o desktop no generamos ninguna máscara.
       */
      if (typeof isMobile !== "boolean") {
        return "";
      }

      /**
       * MOBILE
       *
       * Utiliza una única máscara vertical.
       */
      if (isMobile) {
        return `linear-gradient(
          to top,
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0) ${latest * 100}%,
          rgba(0,0,0,1) ${latest * 100}%,
          rgba(1,1,1,1) 100%
        )`;
      }

      /**
       * DESKTOP
       *
       * Construimos un único linear-gradient
       * compuesto por varias franjas.
       */
      let gradient = "";

      for (
        let index = 0;
        index < divisions;
        index++
      ) {
        /**
         * Progreso de revelado de la franja actual.
         */
        const divisionProgress =
          getDivisionProgress(
            index,
            latest,
          );

        /**
         * Altura de una franja expresada en vh.
         */
        const divisionHeight =
          vh / divisions;

        /**
         * Posición inicial de esta franja.
         */
        const start =
          index * divisionHeight;

        /**
         * Posición en la que cambia de
         * transparente a visible.
         */
        const revealPoint =
          divisionProgress *
          divisionHeight +
          start;

        /**
         * Cada franja tiene:
         *
         * 1. zona transparente
         * 2. límite de revelado
         * 3. zona visible
         */
        gradient +=
          `rgba(0,0,0,0) ${start}vh,` +
          `rgba(0,0,0,0) ${revealPoint}vh,` +
          `rgba(0,0,0,1) ${revealPoint}vh,` +
          `rgba(0,0,0,1) ${(index + 1) * divisionHeight}vh`;

        /**
         * Añadimos coma entre las diferentes franjas.
         */
        if (index !== divisions - 1) {
          gradient += ",";
        }
      }

      /**
       * Devolvemos la máscara final.
       */
      return `linear-gradient(
        to top,
        ${gradient}
      )`;
    },
  );

  return maskImage;
}