"use client";
import { useIsMobile } from "@/app/providers";
import MaskText from "../Server/MaskText";
import cn from "@/utils/cn";
import { CSSProperties, ReactNode } from "react";

interface ResponsiveMaskTextVariantProps {
    mobile: ReactNode[];   // Líneas de contenido que se utilizarán en dispositivos móviles.
    desktop: ReactNode[];  // Líneas de contenido que se utilizarán en computadoras de escritorio.
    className?: string;
    style?: CSSProperties;
}

/**
 * ResponsiveMaskTextVariant
 *
 * Selecciona un conjunto diferente de líneas dependiendo
 * de si el dispositivo es móvil o escritorio.
 *
 * La animación no se realiza en este componente.
 * Una vez seleccionado el contenido, se lo pasa a MaskText,
 * que se encarga de realizar la animación de revelado.
 */

export default function ResponsiveMaskTextVariant({
    desktop,
    mobile,
    className,
    style,
}: ResponsiveMaskTextVariantProps) {
    const isMobile = useIsMobile();             // Verifica si el usuario está utilizando un dispositivo móvil.
    if (typeof isMobile !== "boolean") {
        return null;
    }
    const lines = isMobile ? mobile : desktop;  // Determina el contenido de las líneas basado en el dispositivo.

    return (
        /**
       * Pasamos a MaskText las líneas seleccionadas.
       * MaskText se encargará de animarlas una por una.
       */
        <MaskText
            lines={lines}
            className={cn(
                "font-light text-nowrap text-[#D1CCBF] [&_span]:text-[#ca7d57]",
                className,
            )}
            style={{ ...style }}
        />
    );
}