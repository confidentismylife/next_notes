'use client'

import { memo, useCallback } from 'react'
import { groupIcons } from '../data/icons'
import { IconPair } from './TagsGroupBar'

export default memo(function TagsIcons() {
    const renderIconGroup = useCallback((groupIndex: number) => (
        groupIcons.map((icon, index) => (
            <IconPair 
                key={`${groupIndex}-${index}`}
                icon={icon}
                groupIndex={groupIndex}
                index={index}
            />
        ))
    ), [])

    return (
        <div className='tags-group-wrapper flex flex-nowrap animate-scroll'>
            {[...Array(2)].map((_, groupIndex) => renderIconGroup(groupIndex))}
        </div>
    )
}) 