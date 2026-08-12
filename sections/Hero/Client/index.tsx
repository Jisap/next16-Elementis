"use client"

import { useIsMobile } from "@/app/providers"
import { useState } from "react"
import HeroMobileClient from "./Mobile";
import HeroDesktopClient from "./Desktop";
import VideoPlayer from "@/components/VideoPlayer";



const HeroClient = () => {

  const isMobile = useIsMobile();
  const [playIntro, setPlayIntro] = useState(false);

  return (
    <>
      {isMobile ? (
        <HeroMobileClient playIntro={playIntro} setPlayIntro={setPlayIntro} />
      ) : (
        <HeroDesktopClient setPlayIntro={setPlayIntro} />
      )}

      <VideoPlayer
        isMobile={isMobile}
        playIntro={playIntro}
        setPlayIntro={setPlayIntro}
      />
    </>
  )
}

export default HeroClient