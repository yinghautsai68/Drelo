import { useContext, useEffect, useState } from 'react'
import { type TagType, type CardType, type createTagType } from '../types/types'
import Tag from './Tag'
import { UtilContext } from '../context/UtilContext'
import ColorOption from './ColorOption'
import { colorMap } from './colorMap'
import Button from './Button'
import TagOption from './TagOption'
import FormInput from './FormInput'
import { Label } from './Typography'

type CardProps = CardType & {
    card: CardType,
    tagOptions: TagType[],
    list_id: number,
    updateCard: (listId: number, cardId: number, updatedFields: Partial<CardType>) => void,
    deleteCard: (listId: number, cardId: number) => void,
    createTagOption: (tagFormData: createTagType) => void,
    updateTagOption: (tagOptionId: number, updatedField: Partial<TagType>) => void,
    deleteTagOption: (tagOptionId: number) => void,
    addTagToCard: (cardId: number, tagId: number) => void
}
const Card = ({ card, tagOptions, list_id, label, due_date, updateCard, deleteCard, createTagOption, updateTagOption, deleteTagOption, addTagToCard }: CardProps) => {
    const token = localStorage.getItem("token");
    const { formatDate, formatFormDate } = useContext(UtilContext);

    // Card Data
    const [originalData, setOriginalData] = useState<CardType>({
        ...card,
        tags: card.tags || []
    });
    const [formData, setFormData] = useState<CardType>({
        ...card,
        tags: card.tags || []
    });

    const [createTagFormData, setCreateTagFormData] = useState<createTagType>({
        user_id: 1,
        color: "",
        label: ""
    });

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showColorOptions, setShowColorOptions] = useState<boolean>(false);
    const [showTagOptions, setShowTagOptions] = useState<boolean>(false);
    const [showCreateTagOptions, setShowCreateTagOptions] = useState<boolean>(false);
    const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);

    const handleToggleStatus = async (e: React.MouseEvent) => {
        setFormData((prev) => ({ ...prev, status: formData.status === 'finished' ? 'pending' : 'finished' }))
        updateCard(list_id, card.id, { status: formData.status === 'finished' ? 'pending' : 'finished' });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleColorChange = async (newColor: string) => {
        setFormData((prev) => ({ ...prev, color: newColor }));
    }
    const handleToggleTag = (tag: TagType) => {

        setFormData((prev) => {

            const tagExists = prev.tags.some(t => t.id === tag.id);
            let updatedTags;
            if (tagExists) {
                updatedTags = prev.tags.filter(t => t.id !== tag.id);
            } else {
                updatedTags = [...prev.tags, tag];
            }
            return { ...prev, tags: updatedTags };

        }
        )

        addTagToCard(card.id, tag.id);
    }


    // Tag CRUD
    const handleCreateTag = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createTagOption(createTagFormData);
    }

    const handleEditTag = (tag: TagType) => {
        setEditingTag(tag);
        setShowEditTagModal(true);
    }
    const handleEditTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditingTag((prev) => prev ? { ...prev, [name]: value } : prev);
        if (!editingTag?.id) {
            return;
        }
        updateTagOption(editingTag?.id, { [name]: value });
    }
    const handleEditTagColorChange = (color: string) => {
        setEditingTag((prev) => prev ? { ...prev, color: color } : prev)
        if (!editingTag?.id) {
            return;
        }
        updateTagOption(editingTag?.id, { color: color });
    }


    const handleDeleteTag = () => {
        if (!editingTag?.id) return;
        deleteTagOption(editingTag.id);
        setShowEditTagModal(false)
    }

    return (
        <>
            <div onClick={() => setShowOptions(true)} className="flex flex-col w-full  rounded-xl cursor-pointer">
                {formData.color && (
                    /*Color Cover */
                    < div className={`w-full h-[40px]  rounded-tl-xl rounded-tr-xl ${colorMap[formData.color]}`}>

                    </div>
                )
                }


                {/*Details*/}
                <div className={`${formData.color ? 'rounded-bl-xl rounded-br-xl' : 'rounded-xl'} flex flex-col justify-around gap-1 w-full h-full px-2 py-2  bg-neutral-800`}>
                    <div className="flex flex-col justify-around gap-1">
                        {

                            <div className="flex flex-row flex-wrap  w-full   gap-1 ">
                                {formData.tags.map((tag) => {
                                    return (
                                        <Tag key={tag.id} color={tag.color} label={tag.label}></Tag>
                                    )
                                })}
                            </div>

                        }

                        {/*Goal*/}
                        <div className="flex flex-row items-center gap-1 ">
                            <div onClick={(e) => { e.stopPropagation(); handleToggleStatus(e); }} className={`w-4 aspect-square border rounded-full ${formData.status === 'finished' ? 'bg-green-300' : 'border-white'} `}></div>
                            <span className="text-gray-300">{label}</span>
                        </div>
                    </div>


                    {
                        due_date && (
                            /*Due date*/
                            < div className="inline-flex self-start justify-center items-center  px-2 py-1 bg-yellow-500 rounded-xl">
                                Due {formatDate(due_date)}
                            </div>
                        )
                    }
                </div>
            </div >
            {
                showOptions &&
                <div onClick={() => setShowOptions(false)} className='fixed left-0 top-0 flex flex-row justify-center items-start w-full h-screen pt-20 bg-black/50 z-50 cursor-default'>
                    <div onClick={(e) => { e.stopPropagation(); (document.activeElement as HTMLElement)?.blur(); }} className='   flex flex-col w-[90%] lg:w-[50%]  bg-gray-700 rounded-xl '>
                        <div className={`${formData.color ? 'h-[20%]' : 'h-[10%] border-b border-white/50'} relative flex flex-row justify-end items-end w-full    p-2 ${colorMap[formData.color]} rounded-t-xl`}>
                            <button onClick={() => setShowColorOptions(true)} className=' p-2 bg-gray-600 rounded-xl text-white cursor-pointer '>Change</button>
                            {/*Color Options Popup*/
                                showColorOptions &&
                                <div className='absolute top-full left-1/2 -translate-x-1/2 mt-1 flex flex-col gap-2  w-[300px]  p-2 rounded-xl  bg-gray-800 z-60 '>
                                    <div className='flex flex-row justify-between px-2'>
                                        <h1 className='text-center text-white'>Color Picker</h1>
                                        <span onClick={() => setShowColorOptions(false)} className='text-white cursor-pointer'>X</span>
                                    </div>
                                    <div className='flex flex-row justify-around items-center gap-2 w-full  '>
                                        <ColorOption onClick={() => handleColorChange('red')} color='red' />
                                        <ColorOption onClick={() => handleColorChange('blue')} color='blue' />
                                        <ColorOption onClick={() => handleColorChange('yellow')} color='yellow' />
                                    </div>
                                    <div className='flex flex-row justify-around items-center gap-2 w-full  '>
                                        <ColorOption onClick={() => handleColorChange('violet')} color='violet' />
                                        <ColorOption onClick={() => handleColorChange('orange')} color='orange' />
                                        <ColorOption onClick={() => handleColorChange('green')} color='green' />
                                    </div>
                                </div>
                            }
                        </div>
                        <form onSubmit={() => updateCard(list_id, card.id, formData)} className='flex flex-col gap-3 w-full h-[80%] px-5 py-5'>
                            <div className="flex flex-row items-center gap-5 ">
                                <div onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'finished' ? 'pending' : 'finished' }))} className={`w-4 aspect-square border rounded-full ${formData.status === 'finished' ? 'bg-green-300' : 'border-white'} `}></div>
                                <input onClick={(e) => e.stopPropagation()} name='label' value={formData.label} onChange={handleInputChange} className="w-full px-2 text-[32px] font-semibold text-gray-300" />
                            </div>
                            <div>
                                <input onClick={(e) => e.stopPropagation()} type="datetime-local" value={formData.due_date} onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))} className='px-2 py-2 text-gray-300 border border-gray-500 rounded-xl' />
                            </div>
                            <div className='flex flex-row flex-wrap  w-full  gap-2'>
                                <Button type='button' onClick={() => setShowTagOptions(true)} className=''>+ Add Tag</Button>
                                {
                                    formData.tags.map((tag) => {
                                        return (
                                            <Tag className='h-10' key={tag.id} color={tag.color} label={tag.label} />
                                        )
                                    })
                                }
                            </div>
                            {/*<textarea onClick={(e) => e.stopPropagation()} value='' className='w-full h-[50%] p-2 border border-gray-500 rounded-xl text-gray-300 '></textarea>*/}
                            <div className='flex flex-row justify-end items-end gap-2 w-full   '>
                                <button type='submit' className='p-2 bg-green-700 hover:bg-green-800 text-white rounded-xl cursor-pointer transition-all'>Save</button>
                                <button type='button' onClick={() => { setFormData(originalData); setShowOptions(false) }} className='p-2 bg-gray-500 hover:bg-gray-800 text-white rounded-xl cursor-pointer transition-all'>Cancel</button>
                                <button onClick={() => deleteCard(list_id, card.id)} type='button' className='p-2 bg-red-700 hover:bg-red-800 text-white rounded-xl cursor-pointer transition-all'>Delete</button>
                            </div>
                        </form>
                    </div >
                </div >
            }

            {
                showTagOptions &&
                <div className='fixed left-0 top-0 flex flex-row justify-center items-center w-full h-screen z-60 '>
                    <div className='flex flex-col gap-2 w-[300px] h-[400px] p-2 rounded-xl bg-gray-800'>
                        <div className='flex flex-row justify-between items-center px-2'>
                            <span className='w-full text-center text-white/70'>建立標籤</span>
                            <span onClick={() => {
                                setShowTagOptions(false);
                            }} className='text-white'>X</span>
                        </div>
                        <div className='flex flex-col gap-1 overflow-y-auto'>
                            {tagOptions.map((tag) => {
                                return (
                                    <TagOption key={tag.id} tag={tag} isChecked={formData.tags.some((formtag) => formtag.id === tag.id)} handleToggleTag={handleToggleTag} handleEditTag={handleEditTag} />
                                )
                            })
                            }
                        </div>

                        <Button onClick={() => setShowCreateTagOptions(true)}>Create Tag</Button>
                    </div>
                    {
                        showCreateTagOptions &&
                        <form onSubmit={handleCreateTag} className='fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-10 w-[300px] px-5 pt-10 pb-5 bg-gray-600 rounded-xl'>
                            <Button onClick={() => {
                                setShowCreateTagOptions(false); setCreateTagFormData({
                                    user_id: 1,
                                    color: "",
                                    label: ""
                                });
                            }} className='absolute right-3 top-3'>X</Button>
                            <FormInput handleChange={(e) => setCreateTagFormData((prev) => ({ ...prev, label: e.target.value }))} label='標題' type='text' name='label' value={createTagFormData.label} ></FormInput>
                            <div className='flex flex-col w-full gap-1'>
                                <Label>選擇一個顏色</Label>
                                <div className='grid grid-cols-3 gap-1 w-full overflow-y-auto'>
                                    {
                                        Object.entries(colorMap).map(([key, value]) => {
                                            const isSelected = createTagFormData.color === key;
                                            return (
                                                <div key={key} onClick={() => setCreateTagFormData((prev) => ({ ...prev, color: key }))} className={`${isSelected ? 'border-2 border-blue-300' : ''} h-10 ${value} rounded-lg`}></div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <Button className='bg-blue-100 text-black'>新增標籤</Button>

                        </form>
                    }
                    {
                        showEditTagModal &&
                        <div className='absolute flex flex-col w-[300px] h-[600px] bg-zinc-800 rounded-lg'>
                            <div className='flex flex-row justify-around items-center w-full h-[10%] py-4'>
                                <div onClick={() => setShowEditTagModal(false)} className='w-5 aspect-square bg-white'></div>
                                <span className='text-zinc-400'>編輯標籤</span>
                                <div className='w-5 aspect-square bg-white'></div>
                            </div>

                            {/*Tag Preview*/}
                            <div className='flex flex-row justify-center items-center w-full h-[20%] bg-zinc-900 '>
                                <div className={`flex flex-row items-center w-[70%] h-10 pl-3 ${colorMap[editingTag?.color]} rounded-lg text-white`}>
                                    <span>{editingTag?.label}</span>
                                </div>
                            </div>

                            <div className='flex flex-col w-full h-[70%] px-3 py-2 '>
                                <div className='w-full h-full flex flex-col'>
                                    <div>
                                        <FormInput label='Label' type='text' name='label' value={editingTag?.label} placeholder="Tag Name" handleChange={handleEditTagChange} />
                                    </div>
                                    <div>
                                        <span className='text-sm text-zinc-400'>Select Color</span>
                                        <div className='flex flex-col gap-2 w-full h-full overflow-y-auto'>
                                            {Object.entries(colorMap).map(([key, value]) => {
                                                return (
                                                    <div onClick={() => handleEditTagColorChange(key)} className={`w-full h-[30px] ${value} rounded-lg `}></div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row justify-end gap-2 pt-2 border-t border-zinc-600'>
                                    <Button className='bg-blue-500'>save</Button>
                                    <Button onClick={handleDeleteTag}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    }

                </div >
            }
        </>
    )
}

export default Card