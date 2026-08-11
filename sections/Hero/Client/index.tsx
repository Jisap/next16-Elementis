"use client"

import { useIsMobile } from "@/app/providers"
import { useState } from "react"
import HeroMobileClient from "./Mobile";



const HeroClient = () => {

  const isMobile = useIsMobile();
  const [playIntro, setPlayIntro] = useState(false);

  return (
    <>
      {isMobile ? (
        <HeroMobileClient playIntro={playIntro} setPlayIntro={setPlayIntro} />
      ) : (
        // <HeroDesktopClient setPlayIntro={setPlayIntro} />
        <>
          heroDesktopclient
        </>
      )}
    </>
  )
}

export default HeroClient