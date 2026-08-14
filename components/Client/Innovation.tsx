"use client";

import React, { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";

import Image1 from "@/public/ImageContainer/image-1.png";
import Image2 from "@/public/ImageContainer/image-2.png";
import Image3 from "@/public/ImageContainer/image-3.png";
import Image4 from "@/public/ImageContainer/image-4.png";
import Image5 from "@/public/ImageContainer/image-5.png";

import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import ClipImageCard from "./ClipImageCard";
import useMaskImage from "@/hooks/useMaskImage";
import CustomCursor from "./Cursor";
import { useCursor } from "@/hooks/useCursor";
import NavigateSVG from "@/components/SVGComponents/NavigateSVG";
import { useRouter } from "next/navigation";
import { cubicBezier } from "motion";
import { useIsMobile } from "@/app/providers";

/**
 * Innovation
 *
 * Sección interactiva basada en scroll que muestra una secuencia
 * de imágenes mientras el usuario avanza por una sección de 500vh.
 *
 * La sección utiliza:
 *
 * - useScroll() para obtener el progreso global del scroll.
 * - state para determinar qué imágenes están activas.
 * - ClipImageCard para la transición principal.
 * - Innovation.Container para controlar individualmente
 *   la máscara y el escalado de cada imagen.
 * - CustomCursor para mostrar un cursor personalizado en desktop.
 */

//                        SCROLL
//                          │
//                          ▼
//                   parentProgress
//                          │
//         ┌────────────────┴────────────────┐
//         │                                 │
//         ▼                                 ▼
//  ClipImageCard                    Innovation.Container
//         │                                 │
//         │                                 │
//   currentState                    localProgress
//         │                                 │
//         ▼                                 ▼
//   AnimatedMaskText                  useMaskImage
//         │                                 │
//         │                                 ▼
//         │                             mask-image
//         │                                 │
//         ▼                                 ▼
//      TEXT                              BACKGROUND
//         │
//         │
//         ▼
//  ClipImageContainer
//         │
//         ├── clipPath
//         └── scale
//         │
//         ▼
//      CARD IMAGE

function Innovation() {
  /**
   * Determina si el dispositivo es móvil.
   *
   * El cursor personalizado solamente se muestra en desktop.
   */
  const isMobile = useIsMobile();

  /**
   * Router utilizado para navegar cuando el usuario
   * hace click sobre la sección.
   */
  const router = useRouter();

  /**
   * Representa el tramo actual del scroll.
   *
   * La sección se divide en cuatro tramos:
   *
   * 0 → 0% - 25%
   * 1 → 25% - 50%
   * 2 → 50% - 75%
   * 3 → 75% - 100%
   */
  const [state, setState] = useState(0);

  /**
   * Referencia a toda la sección de 500vh.
   */
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Hook encargado de controlar el cursor personalizado.
   *
   * handlers:
   * Eventos necesarios para controlar el cursor.
   *
   * cursorProps:
   * Propiedades visuales que recibe CustomCursor.
   */
  const { handlers, cursorProps } = useCursor();

  /**
   * Progreso global del scroll de toda la sección.
   *
   * parentProgress va aproximadamente de 0 a 1.
   *
   * Este valor actúa como el "reloj" de toda la animación.
   */
  const { scrollYProgress: parentProgress } = useScroll({
    target: ref,
    offset: ["15vh 0", "485vh end"],
  });

  /**
   * Actualiza el estado cuando cambia el progreso del scroll.
   *
   * Dividimos el recorrido en cuatro bloques de 25%.
   */
  useMotionValueEvent(parentProgress, "change", (latest) => {
    if (latest <= 0.25) {
      setState(0);
    } else if (latest <= 0.5) {
      setState(1);
    } else if (latest <= 0.75) {
      setState(2);
    } else if (latest <= 1) {
      setState(3);
    }
  });

  /**
   * Todas las imágenes que forman parte de la secuencia.
   *
   * El índice del array se utiliza posteriormente para
   * determinar el momento en el que cada imagen participa
   * en la animación.
   */
  const imgs = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
  ];

  return (
    /**
     * Contenedor principal.
     *
     * 500vh proporciona suficiente recorrido vertical
     * para controlar toda la secuencia mediante scroll.
     */
    <div
      className="relative h-[500vh] cursor-pointer overflow-clip bg-[#2b3530]"
      ref={ref}
    >
      {/**
       * Contenedor sticky.
       *
       * Permanece visible mientras el usuario recorre
       * la sección de 500vh.
       *
       * Los handlers del cursor se aplican sobre este elemento.
       */}
      <motion.div
        {...handlers}
        onClick={() =>
          router.replace("https://elementis.co/innovation")
        }
        className="sticky -top-[5vh] h-[110vh] md:-top-[15vh] md:h-[130vh]"
      >
        {/**
         * Componente encargado de gestionar la transición
         * principal de las imágenes.
         *
         * Recibe el progreso global y todas las imágenes.
         */}
        <ClipImageCard
          scrollYProgress={parentProgress}
          images={imgs}
          className="relative z-10"
        />

        {/**
         * Mantenemos como máximo dos imágenes activas:
         *
         * - La imagen actual.
         * - La siguiente imagen.
         *
         * Esto permite preparar la transición entre ambas.
         */}
        {Array.from({ length: 2 }, (_, i) => state + i)
          /**
           * Evita utilizar índices que no existen
           * en el array de imágenes.
           */
          .filter(
            (elementIndex) =>
              elementIndex < imgs.length,
          )
          .map((validElementIndex, i) => (
            /**
             * Cada imagen activa recibe su propio Container.
             *
             * Innovation.Container se encarga de calcular
             * su máscara y escala en función del scroll.
             */
            <Innovation.Container
              key={
                "Innovation.Container-" + (i + 1)
              }
              isMobile={isMobile}
              scrollYProgress={parentProgress}
              index={validElementIndex}
            >
              {imgs[validElementIndex]}
            </Innovation.Container>
          ))}
      </motion.div>

      {/**
       * En dispositivos móviles no mostramos
       * el cursor personalizado.
       */}
      {!isMobile && (
        <CustomCursor
          {...cursorProps}
          className="flex -translate-x-1/2 translate-y-1/4 items-center justify-center gap-2 rounded-full px-5 py-2 text-white"
        >
          Discover More

          <NavigateSVG
            style={{ fill: "white" }}
            className="size-2.5"
          />
        </CustomCursor>
      )}
    </div>
  );
}

/**
 * Innovation.Container
 *
 * Controla una imagen individual dentro de la secuencia.
 *
 * Recibe el progreso global del scroll y crea dos valores
 * independientes:
 *
 * 1. localScrollYProgress → controla la máscara.
 * 2. scaleProgress → controla el zoom de la imagen.
 */
Innovation.Container = function Container({
  scrollYProgress,
  index,
  children,
  isMobile,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  children: StaticImageData;
  isMobile: boolean | null;
}) {
  /**
   * Convierte el progreso global en un progreso local
   * específico para esta imagen.
   *
   * Cada imagen tiene un intervalo de 25%.
   *
   * Ejemplo para index = 2:
   *
   * 0.50 → 0
   * 0.75 → 1
   */
  const localScrollYProgress = useTransform(
    scrollYProgress,
    [index * 0.25, (index + 1) * 0.25],
    [0, 1],
    {
      ease: cubicBezier(0, 0, 1, 1),
    },
  );

  /**
   * Convierte el progreso local en una máscara CSS.
   *
   * La implementación concreta de la máscara se encuentra
   * dentro de useMaskImage().
   */
  const maskImage = useMaskImage(
    localScrollYProgress,
    isMobile,
  );

  /**
   * Controla el zoom de la imagen.
   *
   * La imagen comienza ligeramente ampliada (1.075)
   * y termina en su escala normal (1).
   *
   * El rango de escala es más amplio que el de la máscara,
   * por lo que el zoom acompaña la transición durante
   * un período mayor.
   */
  const scaleProgress = useTransform(
    scrollYProgress,
    [(index - 1) * 0.25, (index + 1) * 0.25],
    [1.075, 1],
  );

  return (
    /**
     * Cada Container ocupa toda el área disponible.
     *
     * absolute + inset-0 permite colocar las imágenes
     * unas encima de otras.
     */
    <motion.div
      className="absolute inset-0 grid place-items-center text-white"
      style={{
        /**
         * Controla la profundidad de la imagen dentro
         * de la pila de imágenes.
         */
        zIndex: -index,

        /**
         * Máscara calculada dinámicamente.
         */
        maskImage,

        /**
         * Escala calculada dinámicamente.
         */
        scale: scaleProgress,
      }}
    >
      <Image
        src={children}
        alt={`image-${index + 1}`}
        className="h-full w-full origin-bottom object-cover"
      />
    </motion.div>
  );
};

export default Innovation;