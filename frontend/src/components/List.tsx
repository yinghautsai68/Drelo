import { useEffect, useRef, useState } from "react";
import type { CardType, createTagType, ListType, TagType } from "../types/types";
import Card from "./Card"
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { colorMap } from "./colorMap";


type ListProps = ListType & {
    list: ListType,
    index: number,
    cards: CardType,
    tagOptions: TagType[],
    addingCardListId: number | null,
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
const List = ({ id, list, index, cards, tagOptions, updateList, deleteList, createCard, updateCard, deleteCard, createTagOption, updateTagOption, deleteTagOption, addTagToCard, addingCardListId }: ListProps) => {
    const [formData, setFormData] = useState<ListType>({
        id: list.id,
        user_id: list.user_id,
        position: list.position,
        label: list.label,
        color: list.color
    });

    const [isCollapse, setIsCollapse] = useState(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [showCoverOptions, setShowCoverOptions] = useState<boolean>(false);




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
                        className="relative select-none flex flex-row justify-center w-[300px] max-h-[450px]  px-2 ">
                        <div className={`${colorMap[list.color]} relative flex flex-col flex-none gap-2 w-full  px-2 pt-4    rounded-xl `}>


                            <div {...provided.dragHandleProps} className="flex flex-row justify-between px-4" >
                                <form onSubmit={hanldeEditListLabel}><input type="text" name="label" onChange={(e) => setFormData({ ...formData, label: e.target.value })} value={formData.label} className=" text-base font-semibold text-white " /></form>
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
                                            className="flex flex-col gap-2 pb-15 overflow-y-auto"
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

                            <div className="absolute left-0 bottom-0 flex flex-col items-center  w-full h-13 px-2 py-2 bg-green-900 rounded-bl-xl rounded-br-xl z-20 ">
                                {
                                    addingCardListId === id ? (
                                        <form ref={formRef} onSubmit={(e) => { e.preventDefault(); createCard(list.id, newCardLabel) }} className="flex flex-row justify-between items-center gap-1 w-full">
                                            <input autoFocus type="text" value={newCardLabel} onChange={(e) => setNewCardLabel(e.target.value)} className="w-full h-full px-3  rounded-xl  bg-gray-950 text-white focus:outline-3 focus:outline-blue-500 hover:focus:outline-none focus:bg-gray-800 focus:text-gray-500 " />
                                            <div className="w-10 aspect-square bg-gray-950 rounded-xl "></div>

                                        </form>
                                    ) : (
                                        <button onClick={() => setAddingCardListId(id)} className="flex flex-row items-center gap-2  w-full h-full px-2  rounded-xl hover:bg-black/20  text-base font-semibold text-white/60 hover:text-white transition-all">
                                            <span>+</span>
                                            <span>Add Card</span>
                                        </button>
                                    )
                                }

                            </div>
                        </div >

                        {
                            showOptions &&
                            <div className="absolute left-[100%]   flex flex-col gap-2 w-[300px] py-3 bg-gray-700 rounded-xl text-white/70 z-50">
                                <div className="flex flex-row justify-between items-center px-5">
                                    <span>Lists Actions</span>
                                    <span onClick={() => setShowOptions(false)}>x</span>
                                </div>
                                <ul className="flex flex-col">

                                    <li onClick={() => setShowCoverOptions(true)} className="px-2 py-2 hover:bg-gray-900">Edit Color</li>
                                    <li onClick={() => deleteList(list.id)} className="px-2 py-2 hover:bg-gray-900">Delete List</li>
                                </ul>
                                {
                                    showCoverOptions &&
                                    <div className="flex flex-col gap-2 rounded-lg z-60">
                                        <div className="flex flex-row justify-between items-center">
                                            <span>Change color</span>
                                            <span onClick={() => setShowCoverOptions(false)}>x</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            {
                                                Object.entries(colorMap).map(([key, values]) => {
                                                    return (
                                                        <div onClick={() => updateList(list.id, { color: key })} className={`${values}  h-[30px] rounded-lg`}>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                }


                            </div>
                        }

                    </div >
                )
            }
        </Draggable>
    )
}


export default List;