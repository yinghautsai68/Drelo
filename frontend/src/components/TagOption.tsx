import React from 'react'
import { colorMap } from './colorMap'
import type { TagType } from '../types/types'

type TagOption = {
    tag: TagType,
    isChecked: boolean,
    handleToggleTag: (tag: TagType) => void,
    handleEditTag: (tag: TagType) => void
}
const TagOption = ({ tag, isChecked, handleToggleTag, handleEditTag }: TagOption) => {
    return (
        <div className='flex flex-row justify-between items-center gap-2 w-full'>
            <input checked={isChecked} type='checkbox' onClick={() => handleToggleTag(tag)} className={`w-5 h-5 border bg-white`}></input>
            <div className={`${colorMap[tag.color]} flex flex-row justify-center items-center w-full h-[40px] rounded-lg text-lg font-semibold text-white/80`} >
                {tag.label}
            </div>
            <div onClick={() => handleEditTag(tag)} className='w-5 aspect-square bg-white'></div>
        </div >
    )
}

export default TagOption