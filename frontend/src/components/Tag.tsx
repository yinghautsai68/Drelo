import React from 'react'
import { colorMap } from './colorMap'

interface TagProps {
    className?: string,
    color: string,
    label?: string,
}
const Tag = ({ className, color, label }: TagProps) => {
    return (
        <div className={`${className} ${colorMap[color]} ${label ? 'px-4 ' : 'w-15 h-4'} flex flex-row justify-center items-center  bg-blue-500 rounded-sm text-xs font-semibold text-white`}>
            {label}
        </div>
    )
}

export default Tag