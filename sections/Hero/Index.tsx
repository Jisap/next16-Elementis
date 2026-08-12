import React from 'react'
import HeroClient from './Client'
import HeroServer from './Server'

const HeroWrapper = () => {
    return (
        <div className='relative bg-[#2b3530]'>
            <HeroClient />
            <HeroServer />
        </div>
    )
}

export default HeroWrapper