import ResponsiveImage from "@/components/Client/ResponsiveImage";
import SectionTitle from "@/components/Server/SectionTitle";
import IntroductionImage from "@/public/Introduction.png";
import * as motion from "motion/react-client";
import Image from "next/image";

const IntroductionServer = () => {
  return (
    <div className="grid grid-rows-[auto_auto_auto] gap-y-12 bg-[#2B3530] px-3-75 pt-42-5 pb-35 text-[#D1CCBF] md:grid-cols-[1fr_1.9fr] md:grid-rows-[auto_auto] md:gap-y-32 md:px-15 md:pt-56-25 md:pb-50">
      <motion.div className="mb-2 md:col-span-2 md:col-start-2 md:mb-0">
        <ResponsiveImage parallaxAmount={8}>
          <Image
            src={IntroductionImage}
            alt="introduction-image"
            className="w-full object-cover max-md:aspect-[1.18] md:h-auto"
          />
        </ResponsiveImage>
      </motion.div>

      <SectionTitle className="md:col-start-1 md:row-start-2">
        Introduction
      </SectionTitle>

      <div className="flex flex-col gap-12 md:col-span-2 md:col-start-2 md:gap-20">

      </div>
    </div>
  )
}

export default IntroductionServer