import ResponsiveImage from "@/components/Client/ResponsiveImage";
import Image from "next/image";
import { Fragment } from "react/jsx-runtime";
import WellnessSanctuaryImage from "@/public/WellnessSanctuaryImage.png";



const Server = () => {

  const textLines = {
    desktop: [
      <Fragment key="desktop-1">
        <span>Personalized</span> wellness,
      </Fragment>,
      <Fragment key="desktop-2">innovation, and nature</Fragment>,
      <Fragment key="desktop-3">meet in synergy</Fragment>,
    ],
    mobile: [
      <Fragment key="mobile-1">
        <span>Personalized</span> wellness,
      </Fragment>,
      <Fragment key="mobile-2">innovation, and nature meet</Fragment>,
      <Fragment key="mobile-3">in synergy</Fragment>,
    ],
  };

  return (
    <div className="flex flex-col bg-[#30493D] text-[#D1CCBF] md:grid md:grid-cols-2">
      <ResponsiveImage parallaxAmount={20}>
        <Image
          src={WellnessSanctuaryImage}
          alt="wellness-sanctuary-image"
          className="h-auto w-full"
        />
      </ResponsiveImage>
    </div>
  )
}

export default Server