"use client";


import React, { CSSProperties, ReactNode, useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import cn from "@/utils/cn";



export default function ParallaxContainer({
  style,
  children, // Cualquier componente que quieras que tenga efecto parallax. Puede ser texto, imagen, video, etc.
  className,
  parallaxAmount, // Cuanto más alto el número, más intenso el efecto. 20-50 suele ser un buen rango.
}: {
  style?: CSSProperties;
  children: ReactNode;
  className?: string;
  parallaxAmount: number;
}) {
  const imageContainer = useRef<HTMLDivElement>(null);  // Referencia al elemento DOM que contiene la imagen.

  const { scrollYProgress } = useScroll({               // Observa cuánto ha avanzado el scroll en el elemento. Su valor va de 0 a 1.
    target: imageContainer,
    offset: ["start end", "end start"],                 // Indica desde dónde hasta dónde se considera que el elemento está "en viewport". 
  });                                                   // El rango va desde que el borde inferior del contenedor está por entrar a la vista hasta que el borde superior sale de ella.

  const scrollY = useTransform(                         // Mapea el progreso del scroll a un valor continuo de desplazamiento en pixeles.
    scrollYProgress,
    (latest) =>                                         // La formula es: progress × (altura viewport + altura elemento)  
      latest *
      ((globalThis.window?.innerHeight as number) +
        (imageContainer.current?.getBoundingClientRect().height as number)),
  );

  /**
   * Calcula la transformación CSS final que se aplicará
   * al contenido interno.
   *
   * Dependiendo de la relación entre la altura del contenedor
   * y la altura del viewport utilizamos dos estrategias
   * diferentes.
   */
  const transform = useTransform(scrollY, (latest) => {
    const containerHeight = imageContainer.current?.getBoundingClientRect() // Obtiene la altura del contenedor en pixeles.
      .height as number;

    /**
     * CASO 1
     *
     * El contenedor es igual o más alto que el viewport.
     *
     * En este caso desplazamos el contenido desde
     * -parallaxAmount hasta +parallaxAmount.
     *
     * El resultado es un movimiento vertical continuo
     * durante el recorrido del elemento.
     *
     * No aplicamos scale() en este caso.
     */
    return containerHeight >= (globalThis.window?.innerHeight as number)
      ? `translateY(${scrollYProgress.get() * parallaxAmount * 2 - parallaxAmount}%) scale(1)`
      /**
       * CASO 2
       *
       * El contenedor es más pequeño que el viewport.
       *
       * En este caso el desplazamiento se calcula teniendo
       * en cuenta la diferencia entre:
       *
       * viewport - altura del contenedor
       *
       * También aplicamos un pequeño zoom mediante scale()
       * para evitar que aparezcan espacios vacíos alrededor
       * del contenido durante el movimiento.
       */
      : `translateY(${(parallaxAmount / ((globalThis.window?.innerHeight as number) - containerHeight)) * (latest - containerHeight)}%) scale(${1 + 0.01 * parallaxAmount})`;
  });

  return (
    <motion.div className="overflow-hidden" ref={imageContainer}>
      {/**
       * Contenedor interior.
       *
       * Este es el elemento que realmente recibe
       * la transformación calculada por Motion.
       */}
      <motion.div
        style={{
          transform,
          ...style,
        }}
        className={cn(className, "origin-bottom")}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}