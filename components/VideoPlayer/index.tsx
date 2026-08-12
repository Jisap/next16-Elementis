"use client";
import { Dispatch, SetStateAction } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoPlayerDesktop from "./VideoPlayerDesktop";

// HeroClient (Estado: playIntro)
//     │
//     ├──► VideoPlayerWrapper (Adaptador isMobile)
//     │       │
//     │       ├──► [Mobile] VideoPlayer (Base + handlers vacíos)
//     │       │
//     │       └──► [Desktop] VideoPlayerDesktop (Decorador)
//     │               │
//     │               ├──► useCursor() ──► Cursor (Visual + Física)
//     │               │       │
//     │               │       └──► handlers ──────────────┐
//     │               │                                   │
//     │               └──► VideoPlayer ◄──────────────────┘
//     │                       (Base + handlers inyectados)
//     │
//     └──► VideoPlayer (Renderizado directo - posible redundancia)

interface VideoPlayerWrapperProps {
  isMobile: boolean | null;
  setPlayIntro: Dispatch<SetStateAction<boolean>>;
  playIntro: boolean;
}
export default function VideoPlayerWrapper({
  isMobile,
  ...rest
}: VideoPlayerWrapperProps) {
  if (typeof isMobile != "boolean") {
    return null;
  }
  return (
    <>
      {isMobile ? <VideoPlayer {...rest} /> : <VideoPlayerDesktop {...rest} />}
    </>
  );
}