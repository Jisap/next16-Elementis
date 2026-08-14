"use client";

import { useIsMobile } from "@/app/providers";
import { ReactNode } from "react";
import ParallaxContainer from "@/components/Client/ParallaxContainer";

// ResponsiveImage
//       │
//       ├── ¿Es móvil?
//       │      │
//       │      ├── SÍ ──► Renderiza children directamente
//       │      │
//       │      └── NO ──► ParallaxContainer
//       │                         │
//       │                         ├── observa el scroll
//       │                         ├── calcula el progreso
//       │                         ├── calcula desplazamiento
//       │                         └── aplica translateY + scale
//       │
//       └── Resultado visual

interface ResponsiveImageProps {
  children: ReactNode;    // Cualquier componente que quieras que tenga efecto parallax. Puede ser texto, imagen, video, etc.
  parallaxAmount: number; // Cuanto más alto el número, más intenso el efecto. 20-50 suele ser un buen rango.
}
export default function ResponsiveImage({
  children,
  parallaxAmount,
}: ResponsiveImageProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        children
      ) : (
        <ParallaxContainer parallaxAmount={parallaxAmount}>
          {children}
        </ParallaxContainer>
      )}
    </>
  );
}