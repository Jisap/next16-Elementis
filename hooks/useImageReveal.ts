import { useAnimate } from "motion/react";
import { useCallback, useRef } from "react";

/**
 * Hook encargado de controlar el sistema de revelado de imágenes.
 *
 * Las imágenes se encuentran apiladas dentro de un mismo contenedor.
 * Cuando el usuario hace hover sobre uno de los enlaces, el enlace
 * comunica al hook qué imagen debe mostrarse.
 *
 * El hook se encarga de:
 *
 * 1. Localizar la imagen mediante su atributo data-index.
 * 2. Colocarla por encima de las imágenes anteriores mediante z-index.
 * 3. Revelarla mediante una animación de clip-path.
 * 4. Aplicar un pequeño efecto de escala durante la transición.
 * 5. Determinar la dirección de la cortina dependiendo de la navegación.
 *
 * @returns imgContainerRef - Ref que debe asignarse al contenedor de imágenes.
 * @returns handleFocus - Función utilizada por los enlaces para solicitar
 *                        el revelado de una imagen concreta.
 */
export function useImageReveal() {
  /**
   * useAnimate proporciona:
   *
   * - imgContainerRef: referencia al contenedor DOM de las imágenes.
   * - animate: función imperativa de Motion para ejecutar las animaciones.
   *
   * Se utiliza una animación imperativa porque las imágenes se seleccionan
   * dinámicamente mediante data-index.
   */
  const [imgContainerRef, animate] = useAnimate();

  /**
   * Índice de la imagen que actualmente está activa/visible.
   *
   * Se utiliza useRef en lugar de useState porque este valor solamente
   * se utiliza internamente para calcular la dirección de la siguiente
   * transición y no necesitamos provocar un nuevo render de React.
   *
   * Ejemplo:
   *
   * focus.current = 2
   *
   * significa que actualmente estamos mostrando la imagen con:
   *
   * data-index="2"
   */
  const focus = useRef(0);

  /**
   * Contador utilizado para asignar z-index a las imágenes que se revelan.
   *
   * Comienza en 1 porque las imágenes tienen inicialmente z-index negativos
   * o 0:
   *
   * Imagen 0 → z-index:  0
   * Imagen 1 → z-index: -1
   * Imagen 2 → z-index: -2
   *
   * Cuando una imagen se revela, recibe el valor actual de zIndex.current.
   * Después el contador aumenta para que la siguiente imagen tenga una
   * capa superior.
   *
   * Ejemplo:
   *
   * Primera imagen revelada  → z-index: 1
   * Segunda imagen revelada → z-index: 2
   * Tercera imagen revelada → z-index: 3
   *
   * Se utiliza useRef porque modificar este contador no necesita provocar
   * un nuevo render de React.
   */
  const zIndex = useRef(1);

  /**
   * Revela una imagen concreta.
   *
   * @param newFocus
   * Índice de la imagen que queremos mostrar.
   *
   * @param directionalSensitive
   * Determina si la dirección de la cortina debe tener en cuenta
   * si estamos avanzando o retrocediendo entre los elementos.
   *
   * Cuando es true:
   *
   * newFocus < focus.current
   * → estamos retrocediendo → la cortina se revela desde arriba.
   *
   * newFocus > focus.current
   * → estamos avanzando → la cortina se revela desde abajo.
   */
  const handleFocus = useCallback(
    (newFocus: number, directionalSensitive: boolean) => {
      /**
       * Evitamos volver a animar una imagen que ya está activa.
       */
      if (newFocus !== focus.current) {
        /**
         * Buscamos dentro del contenedor la imagen correspondiente
         * al índice recibido.
         *
         * Las imágenes tienen:
         *
         * data-index={i}
         *
         * por lo que podemos localizar directamente la imagen
         * que queremos revelar.
         */
        const target = imgContainerRef.current?.querySelector(
          `[data-index="${newFocus}"]`,
        );

        /**
         * Si la imagen no existe, cancelamos la operación.
         */
        if (!target) return;

        /**
         * Determinamos si estamos navegando hacia un índice menor.
         *
         * Ejemplo:
         *
         * focus.current = 3
         * newFocus = 1
         *
         * Como 1 < 3, estamos retrocediendo.
         *
         * directionalSensitive permite activar o desactivar este
         * comportamiento dependiendo del componente que utilice el hook.
         */
        const isUpward =
          newFocus < focus.current && directionalSensitive;

        /**
         * Ejecutamos la animación directamente sobre el elemento encontrado.
         *
         * zIndex.current:
         *
         * La imagen recibe el siguiente nivel disponible de z-index.
         * De esta manera cada nueva imagen queda por encima de las
         * imágenes reveladas anteriormente.
         *
         * clipPath:
         *
         * Utilizamos inset() para crear el efecto de cortina.
         *
         * Si isUpward es true:
         *
         * inset(0% 0% 100% 0%)
         *              ↓
         * La imagen comienza oculta por abajo.
         *
         * Si isUpward es false:
         *
         * inset(100% 0% 0% 0%)
         *               ↑
         * La imagen comienza oculta por arriba.
         *
         * En ambos casos termina en:
         *
         * inset(0% 0% 0% 0%)
         *
         * que representa la imagen completamente visible.
         *
         * scale:
         *
         * La imagen comienza ligeramente ampliada (1.15)
         * y termina en su tamaño normal (1).
         */
        animate(
          target,
          {
            zIndex: zIndex.current,

            clipPath: isUpward
              ? [
                "inset(0% 0% 100% 0%)",
                "inset(0% 0% 0% 0%)",
              ]
              : [
                "inset(100% 0% 0% 0%)",
                "inset(0% 0% 0% 0%)",
              ],

            scale: [1.15, 1],
          },
          {
            /**
             * Las propiedades tienen duraciones independientes.
             *
             * clipPath termina antes que scale para que la imagen
             * quede completamente revelada y posteriormente termine
             * de asentarse mediante el efecto de escala.
             */
            scale: {
              duration: 0.6,
              ease: [0.24, 0.43, 0.15, 0.97],
            },

            clipPath: {
              duration: 0.45,
              ease: [0.24, 0.43, 0.15, 0.97],
            },
          },
        );

        /**
         * Guardamos el índice de la nueva imagen activa.
         *
         * Se actualiza después de iniciar la animación porque
         * necesitamos que focus.current represente la imagen
         * anterior mientras calculamos isUpward.
         */
        focus.current = newFocus;

        /**
         * Preparamos el siguiente nivel de apilamiento.
         *
         * IMPORTANTE:
         *
         * La imagen que acabamos de animar ya recibió el valor anterior.
         *
         * Ejemplo:
         *
         * zIndex.current = 3
         *
         * La imagen recibe:
         *
         * z-index: 3
         *
         * Después:
         *
         * zIndex.current += 1
         *
         * pasa a valer 4 para la siguiente imagen.
         */
        zIndex.current += 1;
      }
    },

    /**
     * Las dependencias pueden permanecer vacías porque:
     *
     * - imgContainerRef mantiene siempre la misma identidad.
     * - focus es un ref mutable.
     * - zIndex es un ref mutable.
     * - animate proporcionado por useAnimate permanece estable.
     */
    [],
  );

  return {
    imgContainerRef,
    handleFocus,
  };
}