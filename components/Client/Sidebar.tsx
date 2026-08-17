"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import Image, { StaticImageData } from "next/image";
import CustomLink from "@/components/Server/CustomLink";
import DashedLink from "@/components/Server/DashedLink";
import CloseIcon from "@/components/SVGComponents/CloseIcon";
import Home from "@/public/Sidebar/home.png";
import Destinations from "@/public/Sidebar/destination.png";
import Wellness from "@/public/Sidebar/wellness.png";
import Innovation from "@/public/Sidebar/innovation.png";
import Nature from "@/public/Sidebar/nature.png";
import Community from "@/public/Sidebar/community.png";
import TheStory from "@/public/Sidebar/the-story.png";
import NewDevelopments from "@/public/Sidebar/new-developments.png";
import PressRoom from "@/public/Sidebar/press-room.png";
import Careers from "@/public/Sidebar/careers.png";
import { useImageReveal } from "@/hooks/useImageReveal";
import StayConnected from "@/components/Server/StayConnected";
import Link from "next/link";

interface LinkItem {
  href: string;
  link: string;
  src: StaticImageData;
}

/*
  * La barra lateral no gestiona su estado de abierto/cerrado por sí misma.
  * El componente padre es el propietario de dicho estado y pasa su función modificadora (setter) aquí.
*/

interface SideBarProps {
  setOpenSideBar: Dispatch<SetStateAction<boolean>>;
}
export default function SideBar({ setOpenSideBar }: SideBarProps) {

  /* 
   * useImageReveal conecta la navegación con la galería de imágenes. 
   * imgContainerRef -> Referencia al contenedor que contiene todas las imágenes. 
   * handleFocus: 
   * * Función que se pasa a los enlaces para indicar qué imagen 
   * * debe revelarse cuando el usuario interactúa con ellos. 
   */

  const { imgContainerRef, handleFocus } = useImageReveal();

  /* 
   * Fuente de datos del Sidebar.
   * 
   * * Cada elemento relaciona tres datos: 
   * * * href → URL a la que navega el enlace. 
   * * * link → texto que aparece en el menú. 
   * * * src → imagen asociada a esa sección. 
   * 
   * El mismo array se utiliza posteriormente para generar: 
   * * 1. Las imágenes del panel visual. 
   * * 2. Los enlaces de navegación. 
   */
  const data: LinkItem[] = [
    { href: "https://elementis.co/", link: "Home", src: Home },
    {
      href: "https://elementis.co/destinations",
      link: "Destinations",
      src: Destinations,
    },
    { href: "https://elementis.co/wellness", link: "Wellness", src: Wellness },
    {
      href: "https://elementis.co/innovation",
      link: "Innovation",
      src: Innovation,
    },
    {
      href: "https://elementis.co/sustainability",
      link: "Nature",
      src: Nature,
    },
    {
      href: "https://elementis.co/community",
      link: "Community",
      src: Community,
    },
    {
      href: "https://elementis.co/the-story",
      link: "The Story",
      src: TheStory,
    },
    {
      href: "https://elementis.co/new-developments",
      link: "New Developments",
      src: NewDevelopments,
    },
    { href: "https://elementis.co/press", link: "Press Room", src: PressRoom },
    { href: "https://elementis.co/careers", link: "Careers", src: Careers },
  ];

  /*
   * Configuración común de animación utilizada por la navegación
   * y los bloques de información secundaria.
   *
   * initialDelay -> retraso antes de que comience el primer elemento.
   * delay        -> retraso entre elementos consecutivos.
   * duration     -> duración de cada animación.
   */

  const temp = {
    initialDelay: 0.8 * 0.4,
    delay: 0.05,
    duration: 0.5,
  };

  /*
   * Animación básica de entrada compartida por varios elementos de la barra lateral.
   *
   * Los elementos comienzan:
   * - Un 60% por debajo de su posición final.
   * - Completamente transparentes.
   *
   * Finalizan:
   * - En su posición normal.
   * - Completamente visibles.
   */

  const variants = {
    initial: {
      y: "60%",
      opacity: 0,
    },
    animate: {
      y: "0%",
      opacity: 1,
    },
  };
  return (
    /*
     * CAPA SUPERPUESTA EXTERNA (OVERLAY)
     *
     * Esta capa cubre toda la ventana gráfica (viewport).
     *
     * Apertura:
     * transparente -> negro semitransparente
     *
     * Cierre:
     * clip-path remueve el overlay desde el área inferior/superior.
     */
    <motion.div
      key="Side-bar"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        backgroundColor: "rgba(0,0,0,0.35)",
        transition: {
          duration: 0.8,
          ease: [0.24, 0.43, 0.15, 0.97],
        },
      }}
      exit={{
        clipPath: "inset(0% 0% 100% 0%)",
        transition: {
          delay: 0.1,
          duration: 0.8,
          ease: [0.24, 0.43, 0.15, 0.97],
        },
      }}
      className="fixed top-0 z-200 w-full"
    >
      {/*
        * PANEL PRINCIPAL DE LA BARRA LATERAL
        *
        * La barra lateral en sí se revela usando clip-path.
        *
        * Inicial:
        * inset(100% 0% 0% 0%)
        *
        * El recorte superior está al 100%, por lo que todo el panel
        * queda recortado/oculto visualmente.
        *
        * Animación:
        * inset(0% 0% 0% 0%)
        *
        * El recorte desaparece y toda la barra lateral se vuelve visible.
        */}
      <motion.div
        className="flex h-screen bg-[#CED1BF]"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{
          duration: 0.8,
          ease: [0.24, 0.43, 0.15, 0.97],
        }}
      >
        {/*
          * CONTENEDOR DE IMÁGENES
          *
          * imgContainerRef se asigna al hook para que pueda acceder a
          * los elementos de imagen y controlar cuál se revela.
          *
          * El contenedor ocupa el área visual/de imagen de la barra lateral.
          */}
        <motion.div
          initial={{
            clipPath: "inset(100% 0% 0% 0%)",
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              delay: 0.1,
              ease: [0.24, 0.43, 0.15, 0.97],
              duration: 0.8,
            },
          }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: {
              ease: [0.24, 0.43, 0.15, 0.97],
              duration: 0.8,
            },
          }}
          className="relative flex-[0.9]"
          ref={imgContainerRef}
        >
          {/*
            * PILA DE IMÁGENES
            *
            * Cada elemento en data crea una capa de imagen a tamaño completo.
            *
            * Todas las imágenes:
            * - Tienen posición absoluta
            * - Ocupan la misma área
            * - Están apiladas una sobre otra
            *
            * data-index identifica la imagen mediante el mismo índice
            * utilizado por los elementos de navegación.
            *
            * El índice es importante porque useImageReveal puede
            * usarlo para determinar qué imagen debe revelarse.
            * 
            * [data-index={i}] (Identificador)
                      │
                      ▼
            [Hover / Focus en Enlace]
                      │
                      ▼
            [Ejecuta handleFocus(i)] ──► Recibe `newFocus`
                      │
                      ▼
            [querySelector(`[data-index="${newFocus}"]`)] ──► Encuentra el <div> de la imagen
¡                     │
                      ▼
            [Trae al Frente] ──► Le asigna `zIndex` incremental (mayor al actual)
                      │
                      ▼
            [Anima clipPath + scale] ──► La imagen "se destapa" y hace zoom out
            */}
          {data.map(({ src, link }, i) => (
            <motion.div
              key={link}
              data-index={i}
              style={{ zIndex: -i }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={link}
                fill
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex-1 pt-7000svh pr-16 pb-3500svh pl-48">
          <span className="text-1800svh text-[#2b3530]/80">Discover pages</span>
          <nav
            aria-label="pages"
            className="mt-6400svh mb-8000svh grid grid-flow-col-dense grid-cols-2 grid-rows-5"
          >
            {/*
          * NAVEGACIÓN
          *
          * El mismo array data se mapea nuevamente, esta vez para
          * crear la navegación de la barra lateral.
          *
          * Home se gestiona por separado porque se muestra
          * como el elemento actual/estático en lugar de un CustomLink.
          *
          * Los elementos restantes utilizan CustomLink.
          *
          * handleFocus conecta la interacción de navegación con
          * useImageReveal, permitiendo revelar la imagen correspondiente.
          */}
            {data.map((eachColData, i) =>
              i === 0 ? (
                /*
                 * HOME
                 *
                 * El primer elemento no se renderiza como CustomLink.
                 * Se muestra como un elemento animado normal.
                 */
                <motion.div
                  initial="initial"
                  animate="animate"
                  variants={variants}
                  transition={{
                    duration: temp.duration,
                    delay: temp.initialDelay + (i % 5) * temp.delay,
                    ease: [0.24, 0.43, 0.15, 0.97],
                  }}
                  key={"link-" + (i + 1)}
                  className="cursor-default py-2 text-3000svh leading-[120%] font-light text-[#2b3530] underline"
                >
                  {eachColData.link}
                </motion.div>
              ) : (
                /*
                 * OTROS ELEMENTOS DE NAVEGACIÓN
                 *
                 * CustomLink recibe:
                 *
                 * href        -> URL de destino
                 * sNo         -> número de orden/índice del elemento
                 * handleFocus -> manejador para revelar la imagen
                 *
                 * El texto mostrado proviene de eachColData.link.
                 */
                <CustomLink
                  {...temp}
                  key={"link-" + (i + 1)}
                  href={eachColData.href}
                  sNo={i + 1}
                  handleFocus={handleFocus}
                >
                  {eachColData.link}
                </CustomLink>
              ),
            )}
          </nav>

          {/*
          * INFORMACIÓN SECUNDARIA
          *
          * Esta sección contiene:
          * - Información de contacto
          * - Enlaces a redes sociales
          * - Políticas y Términos
          *
          * staggerChildren hace que estos elementos aparezcan uno tras
          * otro en lugar de simultáneamente.
          *
          * delayChildren inicia esta animación después de que la
          * navegación principal haya comenzado a aparecer.
          */}
          <motion.div
            className="space-y-5600svh"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  delayChildren: temp.initialDelay + 5 * temp.delay,
                  staggerChildren: temp.delay,
                  duration: temp.duration,
                },
              },
            }}
          >
            {/* INFORMACIÓN DE CONTACTO */}
            <motion.div
              variants={variants}
              transition={{
                duration: temp.duration,
                ease: [0.24, 0.43, 0.15, 0.97],
              }}
              id="contact-us"
              className="space-y-2400svh text-1800svh text-[#2b3530]"
            >
              <div className="text-[#2b3530]/80">Contact Us</div>
              <div className="flex items-center [&_.animated-underline]:h-0.5 [&_.animated-underline]:bg-[#2b3530]">
                <DashedLink>info@ELEMENTIS.co</DashedLink>
                <div className="mx-5">|</div>
                <DashedLink>+62 823 4078 1817</DashedLink>
              </div>
            </motion.div>

            {/*
            * REDES SOCIALES
            *
            * StayConnected es un componente reutilizable independiente.
            * Hereda la misma animación de entrada utilizada por
            * los demás elementos secundarios.
            */}
            <motion.div
              variants={variants}
              transition={{
                duration: temp.duration,
                ease: [0.24, 0.43, 0.15, 0.97],
              }}
            >
              <StayConnected
                style={{
                  fontSize: "var(--text-1800svh)",
                }}
                className="gap-y-2400svh text-1800svh text-[#2b3530]/80 [&_div]:gap-x-10 [&_svg]:h-2400svh [&_svg]:w-auto *:first:text-[#2b3530]/80"
              />
            </motion.div>

            {/*
            * POLÍTICAS Y TÉRMINOS
            *
            * DashedLink proporciona el subrayado animado.
            * La navegación real es gestionada por el Link de Next.js.
            */}
            <motion.div
              variants={variants}
              transition={{
                duration: temp.duration,
                ease: [0.24, 0.43, 0.15, 0.97],
              }}
              className="text-1600svh"
            >
              <Link href="https://elementis.co/privacy-terms">
                <DashedLink className="w-fit text-[#2b3530] [&_.animated-underline]:h-[2px] [&_.animated-underline]:bg-[#2b3530]">
                  Policy and Terms
                </DashedLink>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/*
        * BOTÓN DE CIERRE
        *
        * El estado de la barra lateral es controlado por el componente padre.
        *
        * setOpenSideBar recibe el estado anterior y lo alterna:
        *
        * true  -> false
        * false -> true
        *
        * Esto provoca que el padre monte o desmonte la barra lateral,
        * lo que a su vez activa las animaciones de entrada/salida de Framer Motion.
        */}
        <motion.button
          initial="initial"
          whileHover="whileHover"
          className="absolute top-8 right-16 cursor-pointer"
          // p-2000svh
          onClick={() => setOpenSideBar((prev) => !prev)}
        >
          <CloseIcon className="size-4 [&_path]:[stroke-width:1px]" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}