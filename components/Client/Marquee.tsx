"use client";

import cn from "@/utils/cn";
import {
  motion,
  MotionStyle,
  useAnimationFrame,  // Loop sincronizado con requestAnimationFrame
  useMotionValue,     // Valor reactivo mutable (sin re-render)
  useScroll,          // Lectura de scroll global
  useSpring,          // Suavizado físico de valores
  useTransform,       // Transformación reactiva de valores
  useVelocity,        // Derivada temporal (velocidad) de un MotionValue
  wrap,               // Función matemática de envoltorio modular
} from "motion/react";
import { PropsWithChildren, useRef } from "react";

// copies = 4 → wrapRange = 100 / 4 = 25%
//
// Contenedor inline-flex (ancho total = 400%):
// ┌──────────┬──────────┬──────────┬──────────┐
// │  Copia 0 │  Copia 1 │  Copia 2 │  Copia 3 │
// │   25%    │   25%    │   25%    │   25%    │
// └──────────┴──────────┴──────────┴──────────┘
//
// baseX va de 0% a -25% continuamente:
//   0%   → muestra [Copia0][Copia1][Copia2]... 
//  -25%  → muestra [Copia1][Copia2][Copia3]... 
//  wrap(-25, 0, -25.001%) → salta a -0.001% ≈ 0%
//        → vuelve a mostrar [Copia0][Copia1][Copia2]...
//
// ✅ Transición PERFECTAMENTE seamless porque Copia0 ≡ Copia1

// Piensa en wrap(-25, 0, v) como una cinta transportadora circular:
// La cinta tiene 25cm de largo
// Hay una ventana de 25cm por donde miras
// La cinta gira continuamente hacia la izquierda
// Cuando un segmento sale por la izquierda, reaparece instantáneamente por la derecha
// Como todos los segmentos son idénticos (las 4 copias), nunca notas la costura
// baseX es el motor que gira la cinta. wrap() es el mecanismo circular. 
// El % es la unidad de medida de la cinta. 
// Y useTransform es el engranaje que conecta el motor al mecanismo.


type MarqueeProps = PropsWithChildren & {
  className?: string;
  style?: MotionStyle;
  max: string;   // Distancia máxima del loop (ej: "-1852px" o "-185.25%")
  speed: number; // Velocidad base en unidades/segundo
};

export default function Marquee({ children, max, speed, className, style }: MarqueeProps) {

  // N copias renderizadas en fila → loop sin costuras
  const copies = 4;

  // Valor absoluto de `max` (ej: "-185.25%" → 185.25, "-1852px" → 1852).
  // Se usa para normalizar la velocidad: speed=5 con max="-185.25%"
  // mantiene el mismo ritmo que en la implementación original.
  const absValue = Math.abs(parseFloat(max)) || 100;

  // ─── VALORES REACTIVOS BASE ────────────────────────────────
  const baseX = useMotionValue(0);

  // ─── SISTEMA DE VELOCIDAD REACTIVA AL SCROLL ───────────────
  const { scrollY } = useScroll();             // MotionValue del scroll vertical global
  const scrollVelocity = useVelocity(scrollY); // Velocidad en función del scroll
  const velocityFactor = useTransform(         // Factor de multiplicación de velocidad
    useSpring(scrollVelocity, { mass: 1, damping: 50, stiffness: 600 }), // Suavizado físico del scroll
    [0, 1000],                                                           // Rango de velocidad del scroll (0 a 1000)
    [0, 4],                                                              // Rango de multiplicación de velocidad (0 a 4)
    { clamp: false }                                                     // Sin clamp (puede ser negativo)
  );

  // ─── TRANSFORMACIÓN CON LOOP ───────────────────────────────
  // wrapRange = ancho de una copia expresado en % del wrapper total.
  // Con 4 copias → wrapRange = 25%. El wrap reinicia sin salto visible.
  // baseX (valor real, crece negativamente sin parar):
  // 0 → -5 → -10 → -15 → -20 → -25 → -30 → -35 → -40 → -45 → -50 → ...
  //
  // x (valor después de wrap, lo que realmente se renderiza):
  // 0 → -5 → -10 → -15 → -20 →  0  → -5  → -10 → -15 → -20 →  0  → ...
  //                                 ↑               ↑               ↑
  //                              SALTO           SALTO           SALTO
  //                           (invisible)     (invisible)     (invisible)
  // 
  // El ojo ve: movimiento suave y continuo hacia la izquierda ∞
  // La matemática hace: dientes de sierra que saltan cada 25 unidades

  // Implementación simplificada de wrap():
  // function wrap(min, max, v) {
  //   const range = max - min;           // 0 - (-25) = 25
  //   return v - range * Math.floor((v - min) / range);
  // }
  const wrapRange = 100 / copies;
  const x = useTransform(baseX, (v) => `${wrap(-wrapRange, 0, v)}%`);

  // Ref para persistir la dirección entre frames (no necesita ser reactivo)
  const directionFactor = useRef<number>(1);

  // ─── LOOP DE ANIMACIÓN FRAME A FRAME ───────────────────────
  // Se ejecuta en cada requestAnimationFrame (~60fps)
  // delta = ms transcurridos desde el frame anterior
  useAnimationFrame((_, delta) => {
    // Normalizamos speed al espacio del wrapRange:
    //   speed en el sistema original = unidades/s relativas a absValue
    //   En el nuevo sistema, una copia = wrapRange unidades de %
    //   Factor = wrapRange / absValue convierte la escala correctamente.
    //   Ej: speed=5, absValue=185.25, wrapRange=25
    //       → moveBy = 5 * (16/1000) * (25/185.25) ≈ 0.011% /frame
    //       → ciclo ≈ 37s  (idéntico al comportamiento original)
    let moveBy = speed * (delta / 1000) * (wrapRange / absValue);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += moveBy * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() - directionFactor.current * moveBy);
  });



  return (
    // overflow-hidden recorta el contenido fuera del viewport
    <div className="overflow-hidden">
      {/*
        Contenedor inline-flex: su ancho total = ancho(1 copia) × N copias.
        Al trasladar -1/N del ancho total obtenemos exactamente
        el ancho de UNA copia, creando así el loop sin costuras.
      */}
      <motion.div
        className="inline-flex"
        style={{ x, ...style }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "inline-block text-[100px] leading-none font-light tracking-tight whitespace-nowrap md:text-144",
              className,
            )}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}