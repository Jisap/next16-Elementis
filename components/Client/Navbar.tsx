"use client"


import { useIsMobile } from "@/app/providers"
import LogoFull from "@/components/SVGComponents/LogoFull"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import Link from "next/link"
import { useState } from "react"


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
      </motion.div>
    </>
  )
}

export default Navbar