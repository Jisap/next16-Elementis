"use client";

import Image, { StaticImageData } from "next/image";
import Image1 from "@/public/group/discover-elementis.png";
import Image2 from "@/public/group/our-vision-and-mission.png";
import Image3 from "@/public/group/our-commitment.png";
import Image4 from "@/public/group/our-pillars.png";
import Image5 from "@/public/group/sustainability.png";
import { useImageReveal } from "@/hooks/useImageReveal";
import { motion } from "motion/react";
import StyledLInkClient from "./StyledLInkClient";

/**
 * Estructura de datos utilizada para relacionar cada enlace
 * con su imagen correspondiente.
 */
interface LinkType {
  title: string;
  href: string;
  img: StaticImageData;
}

const SustainableRetreatClient = () => {
  /**
   * useImageReveal controla el sistema de imágenes.
   *
   * imgContainerRef → referencia al contenedor donde están apiladas
   *                    todas las imágenes.
   *
   * handleFocus → función que los enlaces utilizarán para indicar
   *               qué imagen debe revelarse.
   */
  const { imgContainerRef, handleFocus } = useImageReveal();

  /**
   * Cada elemento contiene:
   *
   * - title → texto que aparecerá en el enlace.
   * - href  → destino del enlace.
   * - img   → imagen asociada al enlace.
   *
   * El índice del elemento dentro de este array es también el
   * data-index utilizado para relacionar enlaces e imágenes.
   */
  const links: LinkType[] = [
    {
      title: "ELEMENTIS Story",
      href: "https://elementis.co/the-story",
      img: Image1,
    },
    {
      title: "Our Vision & Mission",
      href: "https://elementis.co/sustainability#mission-vision",
      img: Image2,
    },
    {
      title: "Our Commitment",
      href: "https://elementis.co/sustainability#our-comitment",
      img: Image3,
    },
    {
      title: "Our Pillars",
      href: "https://elementis.co/sustainability#our-pillars",
      img: Image4,
    },
    {
      title: "Sustainability",
      href: "https://elementis.co/sustainability",
      img: Image5,
    },
  ];

  return (
    <>
      {/*
       * ============================================================
       * CONTENEDOR DE IMÁGENES
       * ============================================================
       *
       * Todas las imágenes están dentro del mismo contenedor.
       *
       * imgContainerRef permite que useImageReveal pueda localizar
       * posteriormente una imagen concreta mediante data-index.
       */}
      <div
        ref={imgContainerRef}
        className="relative overflow-hidden md:w-fit"
      >
        {/*
         * Imagen invisible utilizada como placeholder.
         *
         * Aunque visualmente no se muestra, mantiene las dimensiones
         * del contenedor antes de que las imágenes absolutas entren
         * en funcionamiento.
         *
         * Se utiliza la última imagen únicamente como referencia
         * para establecer las dimensiones correctas.
         */}
        <Image
          src={links[links.length - 1].img}
          alt="placeholder"
          aria-hidden={true}
          className="invisible w-full max-md:aspect-[0.82] md:h-full md:w-auto"
        />

        {/*
         * Generamos todas las imágenes dentro del mismo espacio.
         *
         * position: absolute + inset-0 hace que todas ocupen
         * exactamente la misma posición.
         *
         * data-index permite que useImageReveal encuentre una
         * imagen concreta.
         *
         * El z-index inicial crea una pila:
         *
         * Imagen 0 →  0
         * Imagen 1 → -1
         * Imagen 2 → -2
         * Imagen 3 → -3
         * Imagen 4 → -4
         *
         * Posteriormente useImageReveal modifica este z-index
         * cuando una imagen es revelada.
         */}
        {links.map((eachLink, i) => (
          <motion.div
            key={`image-${i + 1}`}
            data-index={i}
            className="absolute inset-0"
            style={{ zIndex: -i }}
          >
            <Image
              src={eachLink.img}
              alt={eachLink.title}
              className="size-full object-cover md:w-auto"
            />
          </motion.div>
        ))}
      </div>

      {/*
       * ============================================================
       * LISTA DE ENLACES
       * ============================================================
       *
       * Cada enlace está asociado por índice a una de las imágenes.
       *
       * Cuando el usuario entra con el ratón sobre un StyledLink,
       * este llama a:
       *
       * handleFocus(index, true)
       *
       * El hook recibe el índice y revela la imagen correspondiente.
       */}
      <div className="-mx-8-25 grid grid-rows-5 divide-y divide-[#D1CCBF] border-y border-[#D1CCBF] md:col-span-2 md:col-start-2 md:row-start-2 md:mx-0">
        {links.map((eachLink, index) => (
          <StyledLInkClient
            handleFocus={handleFocus}
            sNo={index + 1}
            href={eachLink.href}
            key={`link-${index + 1}`}
          >
            {eachLink.title}
          </StyledLInkClient>
        ))}
      </div>
    </>
  );
};

export default SustainableRetreatClient;