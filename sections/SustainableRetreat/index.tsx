import ResponsiveMarquee from '@/components/Client/ResponsiveMarquee'
import React from 'react'

const SustainableRetreat = () => {
  return (
    <div className="bg-[#30493D] py-36 text-[#D1CCBF] md:py-60">
      <ResponsiveMarquee
        animationConfig={{
          mobile: {
            max: "-887px",
            speed: 50,
          },
          desktop: {
            max: "-88.7%",
            speed: 5,
          },
        }}
      >
        {"Sustainable Retreat • Sustainable Retreat • Sustainable Retreat • "}
      </ResponsiveMarquee>
    </div>
  )
}

export default SustainableRetreat