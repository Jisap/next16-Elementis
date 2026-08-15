import React from 'react'
import ElementisStoryServer from './Server'
import ElementisStoryClient from './Client'

const ElementisStory = () => {
    return (
        <div className="overflow-x-hidden bg-[#2B3530] px-3-75 py-40 text-[#D1CCBF] md:grid md:grid-cols-11 md:grid-rows-[repeat(2,auto)] md:gap-x-5 md:gap-y-24 md:px-16 md:py-50">
            <ElementisStoryServer />
            <ElementisStoryClient />
        </div>
    )
}

export default ElementisStory