import { useAnimate } from "motion/react";
import { useCallback, useRef } from "react";

/**
 * Hook para revelar imágenes apiladas con efecto de cortina direccional.
 * Usa clip-path en lugar de opacity para evitar parpadeos entre capas superpuestas.
 * 
 * @returns imgContainerRef - Ref a asignar al contenedor padre de las imágenes
 * @returns handleFocus - Función para activar una imagen por su data-index
 */
export function useImageReveal() {
  // useAnimate proporciona ref + función animate imperativa (sin JSX declarativo)
  const [imgContainerRef, animate] = useAnimate();

  // Refs mutables para rastrear estado SIN provocar re-renders.
  // Crítico: estas animaciones son fire-and-forget; React no necesita saber del estado intermedio
  const focus = useRef(0);       // Índice actualmente visible
  const zIndex = useRef(1);      // Contador incremental para apilamiento correcto

  /**
   * Activa una nueva imagen con dirección de revelado contextual.
   * @param newFocus - Índice del elemento a revelar (debe tener data-index={n})
   * @param directionalSensitive - Si true, la dirección depende de si sube o baja en la lista
   */
  const handleFocus = useCallback(
    (newFocus: number, directionalSensitive: boolean) => {

      if (newFocus !== focus.current) {                           // Guardia: evita animar si ya estamos en el target
        const target = imgContainerRef.current?.querySelector(    // Si estamos en una imagen nueva buscamos en el dom la que vamos a revelar
          `[data-index="${newFocus}"]`
        );
        if (!target) return;

        // Determina dirección de la cortina según navegación relativa
        // Si el nuevo índice es menor que el actual → el usuario está navegando hacia arriba en la lista
        // Y si ademas directionalSensitive es true entonces se revela desde arriba
        // directionalSensitive se estable en <CustomLinks />
        const isUpward = newFocus < focus.current && directionalSensitive;

        animate(
          target,
          {
            zIndex: zIndex.current,                               // zIndex dinámico garantiza que la nueva capa siempre esté encima de las anteriores

            // Keyframes de clip-path: de completamente oculto 
            // a completamente visible
            // inset(top right bottom left): 100% en un eje = invisible
            clipPath: isUpward
              ? ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]    // ↓ Cortina baja-arriba
              : ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],   // ↑ Cortina sube-abajo

            scale: [1.15, 1],                                     // Scale sutil (1.15→1) añade sensación de profundidad durante la transición
          },
          {
            // Duraciones DESACOPLADAS por propiedad:
            // clip-path termina antes que scale → la imagen se "asienta" después de revelarse
            scale: {
              duration: 0.6,
              ease: [0.24, 0.43, 0.15, 0.97], // Curva custom tipo expo-out
            },
            clipPath: {
              duration: 0.45,
              ease: [0.24, 0.43, 0.15, 0.97],
            },
          },
        );


        focus.current = newFocus;     // Actualiza refs DESPUÉS de lanzar la animación (no dispara re-render)           
        zIndex.current += 1;
      }
    },
    [], // Deps vacío seguro: solo usa refs mutables que nunca cambian de identidad
  );

  return { imgContainerRef, handleFocus };
}