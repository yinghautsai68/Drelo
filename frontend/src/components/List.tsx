import { useEffect, useRef, useState } from "react";
import type { CardType, createTagType, ListType, TagType } from "../types/types";
import Card from "./Card"
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { colorMap } from "./colorMap";
import Button from "./Button";


type ListProps = ListType & {
    list: ListType,
    index: number,
    cards: CardType,
    tagOptions: TagType[],

    updateList: (listId: number, updatedFields: Partial<ListType>) => void,
    deleteList: (listId: number) => void,

    createCard: (listId: number, cardLabel: string) => void,
    updateCard: (listId: number, cardId: number, updatedFields: Partial<CardType>) => void,
    deleteCard: (listId: number, cardId: number) => void,

    createTagOption: (tagFormData: createTagType) => void,
    updateTagOption: (tagOptionId: number, updatedField: Partial<TagType>) => void,
    deleteTagOption: (tagOptionId: number) => void,

    addTagToCard: (cardId: number, tagId: number) => void

};
const List = ({ id, list, index, cards, tagOptions, updateList, deleteList, createCard, updateCard, deleteCard, createTagOption, updateTagOption, deleteTagOption, addTagToCard }: ListProps) => {
    const [formData, setFormData] = useState<ListType>({
        id: list.id,
        user_id: list.user_id,
        position: list.position,
        label: list.label,
        color: list.color
    });

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showCoverOptions, setShowCoverOptions] = useState<boolean>(false);

    const [addingCardListId, setAddingCardListId] = useState<number | null>(null)


    //Form
    const formRef = useRef<HTMLFormElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            console.log("placeholder");
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const [newCardLabel, setNewCardLabel] = useState<string>("");

    const handleCreateCard = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCard(list.id, newCardLabel);
        setNewCardLabel("");
        setAddingCardListId(null);
    }



    const hanldeEditListLabel = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input');
        input?.blur();
        updateList(list.id, { label: formData.label });
    }

    const handleCollapseList = () => {
        console.log("button clicked!");
    }



    return (
        <Draggable key={list.id} index={index} draggableId={`list-${list.id}`}>
            {
                (provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative select-none flex flex-row justify-center w-[300px] max-h-[500px]  px-2 ">
                        <div className={`${colorMap[list.color].list} relative flex flex-col flex-none gap-2 w-full  px-2 pt-4 pb-2    rounded-xl `}>


                            <div {...provided.dragHandleProps} className="flex flex-row justify-between gap-1 pl-1 pr-2" >
                                <form onSubmit={hanldeEditListLabel}><input type="text" name="label" onChange={(e) => setFormData({ ...formData, label: e.target.value })} value={formData.label} className="w-full px-2 text-base font-semibold text-white  focus:outline-2 focus:outline-white/80  rounded-md   " /></form>
                                <div className="flex flex-row items-center gap-3">
                                    <div onClick={() => handleCollapseList()} className="text-white font-black">{"<>"}</div>
                                    <div onClick={() => setShowOptions(true)} className="text-white font-black">...</div>
                                </div>
                            </div>


                            <Droppable droppableId={`list-${list.id}`} type="CARD" direction="vertical">
                                {
                                    (provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-col gap-2 overflow-y-auto"
                                        >
                                            {
                                                cards.map((card, cardIndex) => {
                                                    return (
                                                        <Draggable key={card.id} draggableId={`card-${card.id}`} index={cardIndex} >
                                                            {
                                                                (provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <Card id={card.id} card={card} list_id={list.id} position={card.position} color={card.color} status={card.status} label={card.label} due_date={card.due_date} tagOptions={tagOptions} updateCard={updateCard} deleteCard={deleteCard} createTagOption={createTagOption} updateTagOption={updateTagOption} deleteTagOption={deleteTagOption} addTagToCard={addTagToCard} />
                                                                    </div>
                                                                )
                                                            }

                                                        </Draggable>

                                                    )
                                                })
                                            }
                                            {provided.placeholder}

                                        </div>
                                    )
                                }
                            </Droppable>


                            {
                                addingCardListId === id ? (
                                    <form ref={formRef} onSubmit={handleCreateCard} className="flex flex-col items-start gap-2 w-full">
                                        <input autoFocus onBlur={() => setAddingCardListId(null)} type="text" value={newCardLabel} onChange={(e) => setNewCardLabel(e.target.value)} className="w-full  px-3 py-2  rounded-xl   text-white focus:outline-3 focus:outline-blue-500 hover:focus:outline-none focus:bg-neutral-800 focus:text-gray-200 " />
                                        <Button className="px-2 py-2 bg-sky-500 rounded-lg text-center text-zinc-800 ">新增卡片</Button>

                                    </form>
                                ) : (
                                    <button onClick={() => setAddingCardListId(id)} className={`flex flex-row items-center gap-2  w-full px-2 py-2  rounded-xl hover:bg-white/20  text-base font-semibold text-white/60 hover:text-white transition-all`}>
                                        <span>+</span>
                                        <span>Add Card</span>
                                    </button>
                                )
                            }


                        </div >

                        {
                            showOptions &&
                            <div className="absolute top-20 md:left-[100%] md:top-0   flex flex-col gap-2 w-[250px]  pt-5 pb-3 bg-neutral-800  border-2  border-black/10  rounded-xl shadow-md/100  text-white/70 z-50">
                                <div className="flex flex-row justify-between items-center w-full px-5">
                                    <span className="w-full text-center">列表動作</span>
                                    <span onClick={() => setShowOptions(false)}>x</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="px-3 py-2">更換顏色</span>
                                        <div className="grid grid-cols-3 gap-1  h-35  px-3">
                                            {
                                                Object.entries(colorMap).map(([key, values]) => {
                                                    return (
                                                        <div onClick={() => updateList(list.id, { color: key })} className={`${values.list} rounded-lg`}>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-end px-3 pt-2 border-t border-white/20">
                                        <Button onClick={() => deleteList(list.id)} className="w-20 bg-red-500 hover:bg-red-800 text-sm">刪除列表</Button>
                                    </div>
                                </div>



                            </div>
                        }

                    </div >
                )
            }
        </Draggable >
    )
}


export default List;