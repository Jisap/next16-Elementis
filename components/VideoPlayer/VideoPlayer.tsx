"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import FullScreenIcon from "@/components/SVGComponents/FullScreenIcon";

interface VideoPlayerProps {
  setPlayIntro: Dispatch<SetStateAction<boolean>>;
  playIntro: boolean;
  // Handlers opcionales para inyectar comportamiento externo (ej: cursor personalizado).
  // Si no se proveen, el video funciona de forma autónoma (caso móvil).
  handlers?: {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  };
}

export default function VideoPlayer({
  setPlayIntro,
  playIntro,
  handlers,
}: VideoPlayerProps) {

  // Progress condiciona SetProgress quien asu vez condiciona width

  const videoRef = useRef<HTMLVideoElement>(null);

  // Spring para la barra de progreso: suaviza los saltos al hacer seek/click.
  // Durante la reproducción normal se actualiza vía onTimeUpdate; 
  // durante interacción del usuario, el spring interpola el movimiento.
  const videoProgress = useSpring(0, { mass: 1, damping: 30, stiffness: 100 });

  // Transforma el valor numérico del spring (segundos) a porcentaje CSS.
  // Se recalcula solo cuando videoProgress cambia, no en cada frame.
  const width = useTransform(videoProgress, (latest) => {
    if (videoRef.current) {
      return `${(latest / videoRef.current.duration) * 100}%`;
    }
  });

  // Convierte un click en la barra de tiempo a segundos de video.
  // Usa getBoundingClientRect para calcular posición relativa precisa,
  // independiente del padding/margin del contenedor.
  const handleTimeLineClick = (e: React.MouseEvent<HTMLElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const progress =
        ((e.clientX - rect.x) / rect.width) *
        (videoRef.current.duration as number);

      // Actualizar spring (no state) para animación suave hacia nueva posición
      videoProgress.set(progress);
      videoRef.current.currentTime = progress;
    }
  };

  // Cierra el video y notifica al sistema de cursor que salga del área.
  // stopPropagation evita que el click burbujee al contenedor padre.
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayIntro(false);
    handlers?.onMouseLeave();
  };

  return (
    <>
      {/* AnimatePresence gestiona la animación de salida cuando playIntro cambia a false.
          Sin este wrapper, la animación exit no se ejecutaría. */}
      <AnimatePresence>
        {playIntro && (
          <motion.div
            key="video-container"
            onClick={handleClick}
            // Inyección de handlers externos (cursor desktop). 
            // En móvil estos serán undefined y se ignoran silenciosamente.
            {...handlers}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              // clipPath en lugar de opacity/scale: 
              // Evita reflows pesados y permite revelado cinematográfico desde abajo.
              initial: { clipPath: "inset(100% 0% 0% 0%)" },
              animate: {
                clipPath: "inset(0% 0% 0% 0%)",
                transition: {
                  ease: [0.24, 0.43, 0.15, 0.97], // Curva personalizada tipo "ease-out-expo"
                  duration: 0.8,
                },
              },
              exit: {
                // Salida hacia abajo con delay para que el contenido interno termine primero
                clipPath: "inset(0% 0% 100% 0%)",
                transition: {
                  ease: [0.24, 0.43, 0.15, 0.97],
                  duration: 0.8,
                  delay: 0.25,
                },
              },
            }}
            className="fixed top-0 z-100 grid h-screen w-full cursor-pointer place-items-center bg-[#1a1a1a] px-3-75"
          >
            <div className="flex h-auto w-full flex-col md:w-[140vh]">
              <div className="flex-1">
                {/* autoPlay seguro aquí porque la activación requiere interacción previa del usuario.
                    Los navegadores bloquean autoplay solo si no hay gesto del usuario. */}
                <video
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  autoPlay={true}
                  loop={true}
                  // Sincroniza spring con tiempo real del video.
                  // ⚠️ Este evento se dispara ~4-6 veces/segundo, no en cada frame.
                  onTimeUpdate={() => {
                    videoProgress.set(videoRef.current?.currentTime as number);
                  }}
                >
                  <source src="/Hero/elementis-fullmp4.mp4" type="Video/mp4" />
                </video>
              </div>

              {/* Controles: detienen propagación para evitar cerrar el video al interactuar.
                  El mouseEnter/Leave invertido sincroniza el cursor personalizado:
                  al entrar en controles → cursor sale del modo "video", 
                  al salir de controles → cursor vuelve al modo "video". */}
              <div
                className="flex items-center gap-5 px-1 py-2"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  handlers?.onMouseLeave();
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  handlers?.onMouseEnter(e);
                }}
                onMouseMove={(e) => e.stopPropagation()}
              >
                {/* Barra de progreso clickeable con overflow-hidden para recortar la animación interna */}
                <div
                  className="flex-1 cursor-pointer overflow-hidden py-2.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTimeLineClick(e);
                  }}
                >
                  {/* Animación de entrada/salida de la línea base (blanca semitransparente) */}
                  <motion.div
                    className="pointer-events-none h-px bg-white/30"
                    variants={{
                      initial: { x: "-100%" },
                      animate: {
                        x: "0%",
                        transition: {
                          ease: [0.24, 0.43, 0.15, 0.97],
                          duration: 0.5,
                          delay: 0.25, // Espera a que el contenedor principal empiece a revelarse
                        },
                      },
                      exit: {
                        x: "100%",
                        transition: {
                          ease: [0.24, 0.43, 0.15, 0.97],
                          duration: 0.3,
                        },
                      },
                    }}
                  >
                    {/* Línea de progreso activa: ancho controlado por MotionValue (no state).
                        pointer-events-none evita que interfiera con clicks en la barra padre. */}
                    <motion.div
                      className="h-full w-0 rounded-tr-full rounded-br-full bg-white"
                      style={{ width }}
                    />
                  </motion.div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    videoRef.current?.requestFullscreen();
                  }}
                >
                  <FullScreenIcon className="cursor-pointer" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}