"use client"


import { useIsMobile } from "@/app/providers"
import LogoFull from "@/components/SVGComponents/LogoFull"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import DashedLink from "../Server/DashedLink"
import cn from "@/utils/cn"
import BorderedButton from "../Server/BorderedButton"
import NavigateSVG from "../SVGComponents/NavigateSVG"
import AnimatedBurger from "../SVGComponents/AnimatedBurger"
import CloseIcon from "../SVGComponents/CloseIcon"
import ResponsiveSideBar from "./ResponsiveSidebar"


const Navbar = () => {

  const isMobile = useIsMobile();                          // Determina si el viewport es de tamaño móvil (< 768px), para ajustar el padding.
  const [openSideBar, setOpenSideBar] = useState(false);   // Estado para abrir/cerrar un sidebar
  const [state, setState] = useState(false);               // Estado "activado" cuando el scroll supera el 50% del alto de la ventana. Controla el variant de Framer Motion (padding y color del logo).
  const [y, setY] = useState("0%");                        // Posición vertical del navbar: "0%" visible, "-100%" oculto arriba de la pantalla.
  const { scrollY } = useScroll();                         // scrollY es un MotionValue de Framer Motion: valor reactivo del scroll vertical

  useMotionValueEvent(scrollY, "change", (latest) => {     // Se ejecuta cada vez que scrollY cambia. (latest es el valor actual del scrollY) 
    const scrollValue = latest / window.innerHeight        // Valor del scroll como porcentaje respecto del alto total de la página 
    setState(scrollValue > 0.5);                           // Este estado será true cuando el scroll supere el 50% del alto de la página
    if (scrollValue > 0.65) {                              // Llegado al 50% de scroll si el scroll sube al 65%,
      if ((scrollY.getPrevious() as number) < latest) {    // Si el valor previo < que el actual el scroll aumento -> el usuario baja en la página -> oculta el navbar
        setY("-100%");
      } else {                                             // // El scroll disminuyó → el usuario sube en la página → mostrar navbar.
        setY("0%")
      }
    }
  });

  const navItems = [
    {
      href: "https://elementis.co/destinations",
      children: "Destinations",
    },
    {
      href: "https://elementis.co/wellness",
      children: "Wellness",
    },
    {
      href: "https://elementis.co/innovation",
      children: "Innovation",
    },
    {
      href: "https://elementis.co/sustainability",
      children: "Nature",
    },
    {
      href: "https://elementis.co/community",
      children: "Comunnity",
    },
    {
      href: "https://elementis.co/the-story",
      children: "The Story"
    }
  ]

  return (
    <>
      <motion.div
        className="fixed top-0 z-50 flex w-full items-center justify-between px-5 py-10 md:px-16"
        initial="initial"
        animate={state ? "animate" : "initial"}
        transition={{
          default: {
            ease: [0.24, 0.43, 0.15, 0.97],
            duration: 0.6
          },
          y: {
            ease: [0.24, 0.43, 0.15, 0.97],
            duration: 0.6
          }
        }}
        variants={{
          initial: {
            paddingBlock: isMobile ? "calc(40 * var(--multiplier))" : "calc(33 * var(--multiplier))",
            backgroundColor: "rgba(206, 209, 191,0)",
            y,
          },
          animate: {
            paddingBlock: isMobile ? "calc(18 * var(--multiplier))" : "calc(8 * var(--multiplier))",
            backgroundColor: "rgba(206, 209, 191,0)",
            y,
          },
        }}
      >
        <LogoFull
          className="h-auto w-full max-w-38 origin-left md:max-w-53"
          variants={{
            initial: { fill: "#FFFFFF" },
            animate: { fill: "#2B3530" },
          }}
        />

        <nav className="hidden gap-5 md:flex" aria-label="navigation">
          {navItems.map((eachItem) => (
            <Link href={eachItem.href} key={eachItem.children}>
              <DashedLink
                animate={state ? "animate" : "initial"}
                className={cn(
                  "text-base font-normal",
                  state
                    ? "[&>.animated-underline]:bg-[#2b3530]"
                    : "[&>.animated-underline]:bg-white",
                )}
                variants={{
                  animate: { color: "#2b3530" },
                  initial: { color: "#ffffff" },
                }}
              >
                {eachItem.children}
              </DashedLink>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-8">
          <BorderedButton
            className={cn(
              "relative hidden w-fit cursor-pointer items-center gap-4 px-5 py-4.5 text-base leading-[0.8] font-normal md:flex",
              state
                ? "text-[#2b3530] [&_svg]:stroke-[#2b3530]"
                : "text-white [&_svg]:stroke-[white]",
            )}
          >
            Join Us
            <NavigateSVG
              style={{ fill: state ? "#ffffff" : "#2b3530" }}
              className="mr-2.5 size-2.5"
            />
          </BorderedButton>

          <motion.button
            initial="initial"
            whileHover="whileHover"
            onClick={() => {
              const isOpen = openSideBar; // 1. Guardo el estado actual (false)
              if (isMobile) {                // Solo se ejecuta en móvil
                if (!isOpen) {               // Si el sidebar está cerrado -> cambia el logo a oscuro (state=true) al hacer click y se abre el sidebar
                  setState(true);
                } else {                                                  // Usuario cierra el sidebar 
                  const scrollValue = scrollY.get() / window.innerHeight; // se calcula el scroll real (0 estamos arriba de la pag. unico sitio donde el navbar muestra el icono de cierre )
                  setState(scrollValue > 0.5);                            // se cambia el estado del navbar segun el scroll real (0 no es mayor a 0.5 -> state=false navbar blanco. 
                }
              }
              setOpenSideBar(!isOpen); // 2. Cambia el estado. Si estaba true se vuelve false y viceversa.
            }}
            className="cursor-pointer p-2"
            disabled={isMobile == null}
          >
            {isMobile && openSideBar ? (
              <CloseIcon className="size-7 [&_path]:stroke-[1px]" />
            ) : (
              <AnimatedBurger
                className={cn(state ? "stroke-[#2b3530]" : "stroke-white")}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      <ResponsiveSideBar
        isMobile={isMobile}
        openSideBar={openSideBar}
        setOpenSideBar={setOpenSideBar}
      />
    </>
  )
}

export default Navbar