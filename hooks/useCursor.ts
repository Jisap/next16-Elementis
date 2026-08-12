import {
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useState } from "react";

/**
 * Hook para cursor personalizado con física de spring y deformación por velocidad.
 * 
 * Arquitectura: separa handlers (para el overlay invisible) de cursorProps
 * (para el elemento visual). Esto permite que el área de captura y el
 * renderizado sean elementos DOM distintos.
 */
export function useCursor() {
  // Estado React SOLO para visibilidad. La posición NO usa state
  // para evitar re-renders en cada mousemove (60fps+)
  const [renderCursor, setRenderCursor] = useState(false);

  // SPRING DE POSICIÓN: crea el delay orgánico entre mouse real y cursor visual
  // damping:110 + stiffness:550 = respuesta rápida pero con inercia sutil
  // Valores altos → menos oscilación, seguimiento más ajustado
  const top = useSpring(0, { damping: 110, stiffness: 550 });  // top es la posición del cursor en el eje Y. damping es el tiempo que tarda en llegar al destino, stiffness es la fuerza con la que llega
  const left = useSpring(0, { damping: 110, stiffness: 550 }); // left es la posición del cursor en el eje X. 

  // VELOCIDAD → ESCALA: el cursor se aplasta horizontalmente al moverse rápido
  // displacement es la distancia euclidiana desde el origen (0,0) del viewport
  const displacement = useMotionValue(0);
  const velocity = useVelocity(displacement);

  // Mapeo: velocidad alta (±5000 px/s) → scale 0.8 | reposo → scale 1
  // El rango simétrico [-5000, 0, 5000] maneja ambas direcciones
  const scale = useTransform(velocity, [-5000, 0, 5000], [0.8, 1, 0.8]);

  /**
   * ENTER: jump() posiciona INSTANTÁNEAMENTE sin animación spring.
   * Evita que el cursor "vuele" desde (0,0) hasta la primera posición del mouse.
   */
  const onMouseEnter = (e: any) => {
    left.jump(e.clientX);
    top.jump(e.clientY);
    setRenderCursor(true);
  };

  /**
   * LEAVE: oculta el cursor. El spring sigue calculando internamente
   * pero no importa porque AnimatePresence ejecutará exit.
   */
  const onMouseLeave = () => setRenderCursor(false);

  /**
   * MOVE: actualiza posición vía spring (set, no jump) + calcula desplazamiento.
   * Guardia interna: si por alguna razón entra un move sin enter previo,
   * fuerza la inicialización para evitar cursor invisible moviéndose.
   */
  const onMouseMove = (e: any) => {
    if (!renderCursor) {
      onMouseEnter(e);
    }
    // set() alimenta el spring → produce interpolación suave frame a frame
    left.set(e.clientX);
    top.set(e.clientY);

    // Distancia euclidiana desde (0,0). No es velocidad real sino posición absoluta.
    // ⚠️ LIMITACIÓN: esto mide distancia al origen, no delta entre frames.
    // Un mouse quieto en (800,600) da displacement=1000 constante,
    // y velocity derivada será ~0 (correcto). Pero movimiento circular
    // alrededor del origen produciría velocity artificial aunque el mouse
    // no se acerque/aleje del centro. Para este caso de uso es suficiente.
    displacement.set(
      Math.sqrt(Math.pow(e.clientX, 2) + Math.pow(e.clientY, 2)),
    );
  };

  // Separación explícita: handlers van al overlay de captura,
  // cursorProps van al <Cursor> visual. Son elementos DOM diferentes.
  const handlers = { onMouseEnter, onMouseLeave, onMouseMove };

  const cursorProps = {
    renderCursor,
    style: {
      scaleX: scale,   // Deformación por velocidad
      scaleY: scale,
      top,            // Posición spring (NO usar con translate; usa top/left directo)
      left,
    },
  };

  return { handlers, cursorProps };
}