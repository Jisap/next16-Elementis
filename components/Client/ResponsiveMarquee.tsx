"use client";

import { useIsMobile } from "@/app/providers";
import Marquee from "@/components/Client/Marquee";
import { MotionStyle } from "motion/react";
import { PropsWithChildren } from "react";

// ┌─────────────────────────────────┐
// │     ResponsiveMarquee           │
// │                                 │
// │  useIsMobile()                  │
// │       │                         │
// │   ┌───┴───┐                     │
// │   true    false                 │
// │    │        │                   │
// │  mobile  desktop                │
// │  config   config                │
// │    │        │                   │
// │    └───┬────┘                   │
// │        ↓                        │
// │  { max, speed } ← valores      │
// │  adaptados al breakpoint        │
// │        ↓                        │
// │  Se pasan a <Marquee>           │
// └─────────────────────────────────┘

type ResponsiveMarqueeProps = PropsWithChildren & {
  animationConfig: {
    mobile: { max: string; speed: number };   // Config específica móvil
    desktop: { max: string; speed: number };  // Config específica desktop
  };
  className?: string;
  style?: MotionStyle;
};

export default function ResponsiveMarquee({
  children,
  animationConfig,
  ...rest // className, style, y cualquier otra prop de Marquee
}: ResponsiveMarqueeProps) {

  // Hook personalizado que detecta breakpoint (probablemente con matchMedia)
  const isMobile = useIsMobile();

  // ─── PROTECCIÓN SSR / HYDRATION ────────────────────────────
  // Durante SSR e hidratación inicial, isMobile puede ser null/undefined
  // Forzamos false (desktop) para evitar mismatch entre servidor y cliente
  // En el siguiente render post-hidratación, se corrige automáticamente
  const isMobileBool = isMobile ?? false;

  return (
    <Marquee
      // ─── SPREAD DINÁMICO ───────────────────────────────────
      // Selecciona mobile o desktop config según el breakpoint
      // Luego fusiona con ...rest (className, style sobreescriben si existen)
      // Resultado: { max: "-1852px", speed: 50, className: "text-white" }
      {...{ ...animationConfig[isMobileBool ? "mobile" : "desktop"], ...rest }}
    >
      {children}
    </Marquee>
  );
}