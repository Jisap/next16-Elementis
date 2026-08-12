"use client";
import { Dispatch, SetStateAction } from "react";
import Cursor from "@/components/Client/Cursor";
import PlaySVG from "@/components/SVGComponents/PlaySVG";

/**
 * Capa de interacción móvil para el Hero.
 * 
 * Arquitectura: El div padre captura TODOS los clicks (no solo el botón).
 * Esto convierte toda la pantalla en un toggle de play/pause,
 * patrón común en experiencias móviles tipo story/reel.
 */
export default function HeroMobileClient({
  playIntro,
  setPlayIntro,
}: {
  setPlayIntro: Dispatch<SetStateAction<boolean>>;
  playIntro: boolean;
}) {
  return (
    // grid + place-items-center: centra el cursor/botón sin necesidad de flex o absolute manual
    // onClick en el contenedor: área de toque completa = mejor UX en móvil
    <div
      className="absolute inset-0 grid place-items-center"
      onClick={() => setPlayIntro((prev) => !prev)}
    >
      {/*
        VIDEO DE FONDO MÓVIL
        - md:hidden: solo visible en móvil. Desktop usa otro recurso (probablemente video diferente o imagen)
        - autoPlay + muted + loop: requisitos del navegador para autoplay sin interacción
        - poster: fallback visual mientras carga el video y SIEMPRE visible si el video falla
        - ⚠️ NOTA: La ruta del source no tiene "/" inicial ("Hero/...").
          Funciona si es relativa al documento actual, pero puede romperse
          en rutas anidadas. Considerar "/Hero/elementismp4.mp4" para consistencia.
      */}
      <video
        className="size-full object-cover md:hidden"
        autoPlay
        muted
        loop
        poster="/Hero/elementis-cover-mjpg.png"
      >
        <source src="Hero/elementismp4.mp4" type="video/mp4" />
      </video>

      {/*
        CURSOR COMO BOTÓN PLAY/PAUSE
        
        renderCursor={!playIntro}: 
          - Video pausado → cursor visible (invita a hacer click)
          - Video reproduciéndose → cursor oculto (experiencia inmersiva limpia)
        
        isMobile={true}: 
          Activa delay de 1s en la aparición (evita flash en carga/touch accidental)
        
        El Cursor tiene pointer-events-none internamente, por lo que NO intercepta
        el click. El evento pasa al div padre que maneja el toggle.
        Esto es correcto: el cursor es INDICADOR VISUAL, no elemento interactivo real.
      */}
      <Cursor
        renderCursor={!playIntro} // renderiza si playIntro es false
        isMobile={true}
        className="absolute grid aspect-square w-11 place-items-center rounded-full"
      >
        <PlaySVG className="w-1/3" />
      </Cursor>
    </div>
  );
}