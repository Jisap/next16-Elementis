"use client";

import { motion, MotionConfig, useAnimate } from "motion/react";
import Link from "next/link";
import React, { CSSProperties } from "react";
import NavigateSVG from "@/components/SVGComponents/NavigateSVG";
import cn from "@/utils/cn";

/**
 * Props del enlace animado.
 */
interface StyledLinkClientProps {
  className?: string;
  style?: CSSProperties;

  /**
   * Texto mostrado dentro del enlace.
   */
  children: string;

  /**
   * Número visual del enlace.
   *
   * Se muestra como 01, 02, 03...
   */
  sNo: number;

  /**
   * Destino del enlace.
   */
  href: string;

  /**
   * Función proporcionada por useImageReveal.
   *
   * El componente no controla directamente las imágenes.
   * Solamente comunica qué imagen debe revelarse.
   */
  handleFocus: (
    newFocus: number,
    directionalSensitive: boolean,
  ) => void;
}

const StyledLInkClient = ({
  className,
  style,
  children,
  sNo,
  href,
  handleFocus,
}: StyledLinkClientProps) => {
  /**
   * scope:
   *
   * Referencia al elemento que funciona como fondo animado
   * del enlace.
   *
   * animate:
   *
   * Permite controlar imperativamente la expansión y contracción
   * de dicho fondo.
   */
  const [scope, animate] = useAnimate();

  /**
   * Formateamos el número para mostrar siempre dos dígitos:
   *
   * 1 → 01
   * 2 → 02
   * 10 → 10
   */
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  /**
   * Se ejecuta cuando el ratón entra en el enlace.
   *
   * Además de animar el fondo del enlace, comunica al hook
   * useImageReveal qué imagen debe mostrarse.
   *
   * La dirección de entrada del ratón determina desde qué extremo
   * crecerá el fondo del enlace.
   */
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    index: number,
  ): void => {
    /**
     * Obtenemos las dimensiones y posición del enlace.
     *
     * Estos valores permiten determinar si el ratón ha entrado
     * por la mitad superior o inferior del elemento.
     */
    const { height, top } = e.currentTarget.getBoundingClientRect();

    /**
     * Si el ratón entra por la mitad superior:
     *
     * inset superior = 0
     * height = 100%
     *
     * El fondo crece desde arriba hacia abajo.
     */
    if (e.clientY - top <= height / 2) {
      animate(
        scope.current,
        {
          height: "100%",
          inset: "0px 0px auto 0px",
        },
        {
          height: {
            ease: [0.24, 0.43, 0.15, 0.97],
            duration: 0.4,
            times: [0, 1],
            delay: 0.05,
          },
          inset: {
            duration: 0,
            delay: 0.05,
          },
        },
      );
    } else {
      /**
       * Si el ratón entra por la mitad inferior:
       *
       * inset inferior = 0
       * height = 100%
       *
       * El fondo crece desde abajo hacia arriba.
       */
      animate(
        scope.current,
        {
          height: "100%",
          inset: "auto 0px 0px 0px",
        },
        {
          height: {
            ease: [0.24, 0.43, 0.15, 0.97],
            duration: 0.4,
            times: [0, 1],
            delay: 0.05,
          },
          inset: {
            duration: 0,
            delay: 0.05,
          },
        },
      );
    }

    /**
     * Comunicamos al sistema de imágenes qué imagen debe revelarse.
     *
     * index corresponde directamente al data-index de las imágenes.
     *
     * El segundo argumento true indica que useImageReveal debe
     * tener en cuenta la dirección de navegación para determinar
     * la dirección del clip-path.
     */
    handleFocus(index, true);
  };

  /**
   * Se ejecuta cuando el ratón abandona el enlace.
   *
   * El fondo vuelve a altura 0%.
   *
   * La dirección de salida también depende de la posición del ratón.
   */
  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement>,
  ): void => {
    const { height, top } = e.currentTarget.getBoundingClientRect();

    /**
     * El ratón abandona por la mitad superior:
     * el fondo se contrae hacia arriba.
     */
    if (e.clientY - top <= height / 2) {
      animate(
        scope.current,
        {
          inset: "0px 0px auto 0px",
          height: "0%",
        },
        {
          ease: [0.24, 0.43, 0.15, 0.97],
          duration: 0.6,
          delay: 0.05,
        },
      );
    } else {
      /**
       * El ratón abandona por la mitad inferior:
       * el fondo se contrae hacia abajo.
       */
      animate(
        scope.current,
        {
          inset: "auto 0px 0px 0px",
          height: "0%",
        },
        {
          ease: [0.24, 0.43, 0.15, 0.97],
          duration: 0.6,
          delay: 0.05,
        },
      );
    }
  };

  /**
   * Variantes utilizadas para cambiar el color del contenido
   * cuando el enlace entra en estado hover.
   */
  const childVariants = {
    initial: {
      color: "#D1CCBF",
    },
    whileHover: {
      color: "#2b3530",
    },
  };

  return (
    <Link href={href}>
      {/*
       * whileHover controla el estado visual del enlace completo.
       *
       * El evento onMouseEnter es el encargado de iniciar
       * tanto la animación del fondo como la transición de imagen.
       */}
      <motion.div
        initial="initial"
        whileHover="whileHover"
        onMouseEnter={(e) =>
          handleMouseEnter(e, sNo - 1)
        }
        onMouseLeave={handleMouseLeave}
        style={{ ...style }}
        className={cn(
          "relative flex h-full items-center justify-between overflow-hidden p-5 leading-none font-normal [&_*]:pointer-events-none",
          className,
        )}
      >
        <MotionConfig
          transition={{
            ease: [0.24, 0.43, 0.15, 0.97],
            duration: 0.6,
          }}
        >
          {/*
           * ========================================================
           * FONDO ANIMADO
           * ========================================================
           *
           * Este elemento ocupa inicialmente 0% de altura.
           *
           * useAnimate modifica:
           *
           * - height
           * - inset
           *
           * para crear el efecto de expansión desde arriba o abajo.
           *
           * z-10 lo coloca detrás del contenido del enlace.
           */}
          <motion.div
            variants={{
              initial: {
                height: "0%",
              },
            }}
            ref={scope}
            className="absolute inset-x-0 z-10 bg-[#D1CCBF]"
          />

          {/*
           * ========================================================
           * CONTENIDO DEL ENLACE
           * ========================================================
           *
           * z-20 coloca el contenido por encima del fondo animado.
           *
           * El color cambia mediante childVariants.
           */}
          <motion.div
            className="z-20 flex gap-6 md:gap-28"
            variants={childVariants}
          >
            {/*
             * Número del enlace.
             *
             * Durante hover se desplaza horizontalmente.
             */}
            <motion.div
              variants={{
                initial: {
                  x: 0,
                },
                whileHover: {
                  x: "var(--spacing-10)",
                },
              }}
              className="text-2xs leading-none font-normal md:text-sm"
            >
              {leadingZeroFormatter.format(sNo)}
            </motion.div>

            {/*
             * Título del enlace.
             */}
            <div className="text-lg leading-none md:text-26">
              {children}
            </div>
          </motion.div>
        </MotionConfig>
      </motion.div>
    </Link>
  );
};

export default StyledLInkClient;

// Diagrama de flujo del cambio de imagen:
// StyledLInkClient
//       │
//       │ onMouseEnter
//       ▼
// handleMouseEnter()
//       │
//       │ handleFocus(index, true)
//       ▼
// useImageReveal
//       │
//       ├── busca [data-index="index"]
//       │
//       ├── aumenta z-index
//       │
//       ├── calcula dirección
//       │
//       ├── anima clipPath
//       │
//       └── anima scale
//       │
//       ▼
// Imagen correspondiente

// Diagrama de flujo de los links:
// StyledLInkClient
//       │
//       ├── mouse entra
//       │
//       ▼
// handleMouseEnter()
//       │
//       ▼
// animate(scope.current)
//       │
//       ├── height: 0% → 100%
//       └── inset: arriba / abajo