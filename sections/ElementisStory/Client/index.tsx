"use client";

import { useIsMobile } from '@/app/providers';
import ParallaxContainer from '@/components/Client/ParallaxContainer';
import Image from 'next/image';
import Picture1 from "@/public/elementis-stories/picture-1.png";
import Picture2 from "@/public/elementis-stories/picture-2.png";

const ElementisStoryClient = () => {

  const isMobile = useIsMobile();
  if (typeof isMobile !== "boolean") {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <div
          className="-mx-4 flex cursor-grab gap-4 overflow-x-scroll px-4 *:shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          <Image
            src={Picture2}
            alt="picture-2"
            className="h-auto w-[85%] snap-center"
          />
          <Image
            src={Picture1}
            alt="picture-1"
            className="h-auto w-[85%] snap-center"
          />
        </div>
      ) : (
        <>
          <div className="col-span-3 row-span-2">
            <ParallaxContainer parallaxAmount={10}>
              <Image src={Picture1} alt="picture-1" className="h-auto w-full" />
            </ParallaxContainer>
          </div>
          <div className="col-span-6 col-start-6 row-start-2">
            <ParallaxContainer parallaxAmount={25}>
              <Image src={Picture2} alt="picture-2" className="h-auto w-full" />
            </ParallaxContainer>
          </div>
        </>
      )}
    </>
  )
}

export default ElementisStoryClient