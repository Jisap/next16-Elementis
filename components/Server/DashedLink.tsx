import cn from "@/utils/cn";
import * as motion from "motion/react-client";
import { HTMLMotionProps } from "motion/react";
import React from "react";

type DashedLinkProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
};

// export default function DashedLink({
//   children,
//   className,
//   style,
//   ...animationProps
// }: DashedLinkProps) {
//   return (
//     <motion.div className="" {...animationProps}>
//       <motion.div
//         initial="initial"
//         whileHover="hover"
//         className={cn("relative leading-[1.2]", className)}
//         style={{ ...style }}
//       >
//         {children}
//         <motion.div
//           className="animated-underline absolute bottom-0 h-px bg-black"
//           variants={{
//             initial: { width: "0%", right: "0px", left: "auto" },
//             hover: { width: "100%", left: "0px", right: "auto" },
//           }}
//           transition={{
//             left: {
//               duration: 0,
//             },
//             right: {
//               duration: 0,
//             },
//             default: {
//               ease: [0.24, 0.43, 0.15, 0.97],
//               duration: 0.8,
//             },
//           }}
//         />
//       </motion.div>
//     </motion.div>
//   );
// }

export default function DashedLink({
  children,
  className,
  ...props
}: DashedLinkProps) {
  return (
    // Contenedor del link. "initial"/"whileHover" definen los dos estados
    // que activan las variantes del subrayado interior (ver más abajo).
    <motion.div
      initial="initial"
      whileHover="hover"
      className={cn("relative leading-[1.2] w-fit", className)}
      {...props} // permite pasar props de motion (animate, variants, etc.) desde el padre
    >
      {children}

      {/* Línea del subrayado animado.
          - "animated-underline": clase usada desde fuera (p.ej. Navbar) para
            cambiar su color con selectores tipo [&>.animated-underline]:bg-*
          - origin-right: el punto de anclaje del scaleX por defecto (estado initial) */}
      <motion.div
        className="animated-underline absolute bottom-0 left-0 h-px w-full bg-black"
        variants={{
          initial: { scaleX: 0, originX: 1 }, // linea comprimida en el extremo derecho -> el subrayado crece desde la izquierda hacia la derecha.
          hover: { scaleX: 1, originX: 0 },   // crece desde el extremo izquierdo -> el subrayado decrece desde la derecha hacia la izquierda.
        }}
        transition={{
          originX: { duration: 0 }, // el cambio de anclaje es instantáneo, sin interpolar
          default: { duration: 0.8, ease: [0.24, 0.43, 0.15, 0.97] }, // scaleX sí se anima
        }}
      />
    </motion.div>
  );
}