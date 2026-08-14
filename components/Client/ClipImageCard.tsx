"use client";

import {
  motion,
  MotionValue,
  useMotionValueEvent,
} from "motion/react";
import Image, { StaticImageData } from "next/image";
import {
  CSSProperties,
  ReactNode,
  useState,
} from "react";

import AnimatedMaskText from "@/components/Client/MaskTextClient";
import ClipImageContainer from "@/components/Client/ClipImageContainer";
import SectionTitle from "../Server/SectionTitle";
import cn from "@/utils/cn";

/**
 * Props principales de ClipImageCard.
 *
 * scrollYProgress:
 * Progreso de scroll de toda la sección Innovation.
 *
 * images:
 * Lista de imágenes que forman la secuencia.
 *
 * className / style:
 * Permiten personalizar visualmente el componente
 * desde el componente padre.
 */
interface ClipImageCardProps {
  scrollYProgress: MotionValue<number>;
  images: StaticImageData[];
  className?: string;
  style?: CSSProperties;
}

/**
 * Estructura del contenido asociado a cada imagen.
 *
 * Cada imagen tiene:
 *
 * - Un título dividido en varias líneas.
 * - Una descripción diferente para móvil y desktop.
 */
interface DataItem {
  title: ReactNode[];

  description: {
    mobile: ReactNode[];
    desktop: ReactNode[];
  };
}

/**
 * Tarjeta central de la sección Innovation.
 *
 * Este componente sincroniza:
 *
 * 1. El contenido textual.
 * 2. La imagen visible dentro de la tarjeta.
 * 3. Las animaciones de entrada/salida del texto.
 *
 * Todo está controlado por scrollYProgress.
 *
 * El componente NO controla el scroll directamente.
 * Recibe el MotionValue desde Innovation.
 */

// ┌─────────────────────────────┐
// │                             │
// │        SectionTitle         │
// │                             │
// │       01 - 05               │
// │                             │
// │     Innovation Culture      │
// │                             │
// │     ┌─────────────────┐     │
// │     │                 │     │
// │     │      IMAGE      │     │
// │     │                 │     │
// │     └─────────────────┘     │
// │                             │
// │       Description...        │
// │                             │
// │       ( Keep Scrolling )    │
// │                             │
// └─────────────────────────────┘

export default function ClipImageCard({
  scrollYProgress,
  images,
  className,
  style,
}: ClipImageCardProps) {

  /**
   * Estado de la información que actualmente
   * se muestra en la tarjeta.
   *
   * Se utiliza una numeración de 1 a 5
   * porque el valor también se muestra visualmente:
   *
   *     01 - 05
   *
   * IMPORTANTE:
   *
   * El array `data` utiliza índices desde 0,
   * por eso posteriormente usamos:
   *
   *     data[currentState - 1]
   */
  const [currentState, setCurrentState] =
    useState(1);

  /**
   * Contenido asociado a cada imagen.
   *
   * La posición del elemento dentro del array
   * corresponde a la imagen:
   *
   * data[0] → Image1
   * data[1] → Image2
   * data[2] → Image3
   * data[3] → Image4
   * data[4] → Image5
   */
  const data: DataItem[] = [
    {
      title: [
        <>ELEMENTIS</>,
        <>Innovation Culture</>,
      ],

      description: {
        mobile: [
          <>We foster a culture of Innovation that </>,
          <>enriches lives through transformative</>,
          <>solutions and innovative ideas that</>,
          <>resonate with our global Community.</>,
        ],

        desktop: [
          <>We foster a culture of Innovation that enriches</>,
          <>lives through transformative solutions and</>,
          <>innovative ideas that resonate with our global</>,
          <>Community.</>,
        ],
      },
    },

    {
      title: [
        <>Exceptional Wood</>,
        <>Construction</>,
      ],

      description: {
        mobile: [
          <>Our high-quality glue laminated timber</>,
          <>revolutionizes tropical climate</>,
          <>construction byseamlessly combining</>,
          <>natural elegance, unparalleled durability,</>,
          <>and environmental responsibility.</>,
        ],

        desktop: [
          <>Our high-quality glue laminated timber</>,
          <>revolutionizes tropical climate construction by</>,
          <>seamlessly combining natural elegance,</>,
          <>unparalleled durability, and environmental</>,
          <>responsibility.</>,
        ],
      },
    },

    {
      title: [
        <>Innovative Glass</>,
        <>Solutions</>,
      ],

      description: {
        mobile: [
          <>The innovative Low-E solar control glass</>,
          <>stands out for its unparalleled ability to</>,
          <>blend energy efficiency, enhanced</>,
          <>comfort, and breathtaking aesthetic</>,
          <>appeal.</>,
        ],

        desktop: [
          <>The innovative Low-E solar control glass stands</>,
          <>out for its unparalleled ability to blend energy</>,
          <>efficiency, enhanced comfort, and breathtaking</>,
          <>aesthetic appeal.</>,
        ],
      },
    },

    {
      title: [
        <>World First Climate</>,
        <>Control</>,
      ],

      description: {
        mobile: [
          <>We pioneer an innovative climate</>,
          <>control system that outperforms any</>,
          <>other option, ending the battle with</>,
          <>moid for an infinitely healthier</>,
          <>experience. When combined with our</>,
          <>solar energy system it provides a</>,
          <>world-first sustainable solution.</>,
        ],

        desktop: [
          <>We pioneer an innovative climate control</>,
          <>system that outperforms any other option,</>,
          <>ending the battle with moid for an infinitely </>,
          <>healthier experience. When combined with our</>,
          <>solar energy system it provides a world-first</>,
          <>sustainable solution.</>,
        ],
      },
    },

    {
      title: [
        <>State-of-the-Art</>,
        <>Design</>,
      ],

      description: {
        mobile: [
          <>By blending natural elements,panoramic</>,
          <>views, tactile textures, luxury touches,</>,
          <>and sustainable design principles, we</>,
          <>create a memorable and inviting hotel</>,
          <>interior that reflects ELEMENTIS</>,
          <>modern, wooden eco concept.</>,
        ],

        desktop: [
          <>By blending natural elements,panoramic views,</>,
          <>tactile textures, luxury touches, and sustainable</>,
          <>design principles, we create a memorable and</>,
          <>inviting hotel interior that reflects ELEMENTIS</>,
          <>modern, wooden eco concept.</>,
        ],
      },
    },
  ];

  /**
   * Convierte el progreso global del scroll
   * en uno de los cinco estados de la tarjeta.
   *
   * El recorrido se divide aproximadamente así:
   *
   * 0% - 12.5%  → estado 1
   * 12.5 - 37.5 → estado 2
   * 37.5 - 62.5 → estado 3
   * 62.5 - 87.5 → estado 4
   * 87.5 - 100% → estado 5
   *
   * Cada cambio actualiza:
   *
   * - número
   * - título
   * - descripción
   *
   * Las imágenes tienen su propia animación
   * basada directamente en scrollYProgress.
   */
  useMotionValueEvent(
    scrollYProgress,
    "change",
    (latest) => {
      if (latest < 0.125) {
        setCurrentState(1);
      } else if (latest <= 0.375) {
        setCurrentState(2);
      } else if (latest <= 0.625) {
        setCurrentState(3);
      } else if (latest <= 0.875) {
        setCurrentState(4);
      } else {
        setCurrentState(5);
      }
    },
  );

  /**
   * Convierte un número en formato de dos dígitos.
   *
   * Ejemplo:
   *
   * 1 → "01"
   * 2 → "02"
   * 10 → "10"
   */
  const prependZero = (num: number) =>
    num < 10 ? `0${num}` : `${num}`;

  return (
    <motion.div
      /**
       * Animación inicial de entrada de la tarjeta.
       *
       * Las variantes concretas de los hijos
       * se controlan más abajo.
       */
      initial="initial"
      whileInView="inView"

      /**
       * La animación se activa cuando aproximadamente
       * el 50% del componente entra en pantalla.
       *
       * `once: true` evita repetir esta animación.
       */
      viewport={{
        amount: 0.5,
        once: true,
      }}

      style={{ ...style }}

      className={cn(
        /**
         * La tarjeta ocupa toda la altura disponible.
         *
         * En móvil:
         * - disposición vertical
         * - padding vertical
         *
         * En desktop:
         * - disposición horizontal
         * - mayor padding
         */
        "relative z-10 flex h-full flex-col items-center justify-between py-[8vh] text-[#d1ccbf] backdrop-brightness-[60%] md:flex-row md:px-16 md:py-[15vh]",
        className,
      )}
    >

      {/* Título general de la sección */}
      <SectionTitle>
        Innovation
      </SectionTitle>

      <motion.div
        /**
         * La tarjeta entra desde abajo.
         */
        variants={{
          initial: {
            y: "50%",
          },

          inView: {
            y: "0%",
          },
        }}

        /**
         * Curva y duración de la entrada.
         */
        transition={{
          ease: [
            0.24,
            0.43,
            0.15,
            0.97,
          ],
          duration: 0.8,
        }}

        className="relative z-20 my-[5vh] flex h-[70vh] min-h-fit w-[90%] flex-col items-center gap-8 bg-[#D1CCBF] p-5-75 text-[#2B3530] md:h-full md:max-h-172 md:w-full md:max-w-118 md:px-8 md:py-4"
      >

        {/* 
                 * CONTADOR
                 *
                 * Muestra:
                 *
                 *     01 - 05
                 *
                 * El número actual se anima con
                 * AnimatedMaskText.
                 */}
        <div className="flex items-center gap-1 text-2xs md:text-sm">

          <AnimatedMaskText
            state={currentState}

            /**
             * AnimatedMaskText espera un array
             * de líneas. En este caso solo tenemos
             * una línea: el número actual.
             */
            lines={[
              <>
                {prependZero(
                  currentState,
                )}
              </>,
            ]}

            className="[line-height:1]"
          />

          <span className="opacity-60">
            -
          </span>

          {/* Número total de imágenes */}
          <span className="opacity-60">
            {prependZero(images.length)}
          </span>
        </div>

        {/*
                 * TÍTULO
                 *
                 * Obtiene el título asociado al estado actual.
                 *
                 * Ejemplo:
                 *
                 * currentState = 3
                 *        ↓
                 * data[2]
                 *        ↓
                 * Innovative Glass
                 * Solutions
                 */}
        <AnimatedMaskText
          state={currentState}
          lines={
            data[currentState - 1]
              .title
          }
          className="-space-y-1 text-center text-lg [line-height:1] font-light md:text-28"
        />

        {/*
                 * CONTENEDOR DE IMÁGENES
                 *
                 * Todas las imágenes se renderizan
                 * superpuestas en el mismo espacio.
                 *
                 * ClipImageContainer controla qué imagen
                 * está visible en cada momento.
                 */}
        <div className="relative aspect-[1.62] w-full overflow-hidden md:aspect-[1.85]">

          {images.map(
            (
              eachImage: StaticImageData,
              index,
            ) => (
              <ClipImageContainer
                key={
                  "card-image-container-" +
                  (index + 1)
                }

                /**
                 * Índice de la imagen.
                 *
                 * Se utiliza para determinar
                 * cuándo debe comenzar y terminar
                 * su transición.
                 */
                index={index}

                /**
                 * Todas las imágenes reciben
                 * el mismo progreso global.
                 */
                scrollYProgress={
                  scrollYProgress
                }
              >
                <Image
                  src={eachImage}
                  alt={
                    "card-image-" +
                    (index + 1)
                  }
                  className="size-full object-cover"
                />
              </ClipImageContainer>
            ),
          )}
        </div>

        {/*
                 * DESCRIPCIÓN
                 *
                 * Obtiene la descripción asociada
                 * al estado actual.
                 *
                 * Actualmente se utiliza la versión desktop.
                 *
                 * IMPORTANTE:
                 * El objeto `data` también contiene
                 * una versión `mobile`, pero aquí todavía
                 * no se está seleccionando.
                 */}
        <AnimatedMaskText
          state={currentState}
          lines={
            data[currentState - 1]
              .description.desktop
          }
          className="text-center text-sm [line-height:1.25] md:text-base"
        />
      </motion.div>

      {/*
             * INDICADOR PARA EL USUARIO
             *
             * Indica que debe continuar haciendo scroll
             * para avanzar por las diferentes imágenes.
             */}
      <span className="text-base [line-height:1] md:text-xl">
        ( Keep Scrolling )
      </span>
    </motion.div>
  );
}