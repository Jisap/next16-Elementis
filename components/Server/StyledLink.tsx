import Link, { LinkProps } from "next/link";
import * as motion from "motion/react-client";
import { CSSProperties } from "react";
import NavigateSVG from "@/components/SVGComponents/NavigateSVG";
import { MotionConfig } from "motion/react";
import cn from "@/utils/cn";

/**
 * Props extendidas para StyledLink.
 * Hereda todas las funcionalidades de navegación de Next.js (href, prefetch, etc.)
 * y añade control visual sobre la animación y los estados del enlace.
 */
interface StyledLinkProps extends LinkProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  underlineColor?: string;                       // Color de la línea animada y base. Permite adaptar el enlace a fondos oscuros/claros 
  arrowFill?: "#2B3530" | "#D1CCBF" | "#FFFFFF"; // Tipo literal restringido para garantizar consistencia con la paleta de diseño
  active?: boolean;                              // Indica si el enlace corresponde a la ruta actual (modifica opacidad base)
  href: string;
}

/**
 * Enlace de navegación con efecto de subrayado animado tipo "wipe".
 * Combina next/link para routing SPA con Framer Motion para micro-interacciones.
 */
export default function StyledLink({
  children,
  arrowFill = "#D1CCBF",
  underlineColor = "#d0cbbe",
  active = false,
  href,
  className,
  style,
}: StyledLinkProps) {
  return (
    // Link maneja la navegación; motion.div es el contenedor interactivo
    <Link href={href}>
      <motion.div
        initial="initial"
        whileHover="whileHover"
        className={cn(
          // overflow-hidden es CRÍTICO: recorta la línea animada fuera de los límites
          // relative establece el contexto de posicionamiento para las líneas absolutas
          "relative flex w-full cursor-pointer items-center justify-between overflow-hidden py-4 pr-4 text-lg leading-[1.1] md:py-2-5 md:text-xl",
          className,
        )}
        style={style}
      >
        <span>{children}</span>

        {/* Ícono decorativo con color tipado para evitar inconsistencias */}
        <NavigateSVG fill={arrowFill} />

        {/* Config centralizada para sincronizar timing de todos los hijos animados */}
        <MotionConfig transition={{ duration: 0.4, ease: "circInOut" }}>
          {/* LÍNEA BASE: Siempre visible, actúa como referencia visual.
              Su opacidad indica sutilmente el estado activo sin necesidad de hover */}
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              backgroundColor: underlineColor,
              opacity: active ? 1 : 0.5,
            }}
          />

          {/* LÍNEA ANIMADA: Efecto "wipe" de izquierda a derecha.
              - initial (x: 100%): Oculta a la derecha por overflow-hidden
              - whileHover (x: [-100%, 0%]): Entra desde la izquierda y se detiene en posición
              El array en whileHover define keyframes explícitos para dirección controlada */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ backgroundColor: underlineColor }}
            variants={{
              initial: { x: "100%" },
              whileHover: { x: ["-100%", "0%"] },
            }}
          />
        </MotionConfig>
      </motion.div>
    </Link>
  );
}