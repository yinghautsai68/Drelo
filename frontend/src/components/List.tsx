import { useEffect, useState } from "react";
import type { CardType, ListType } from "../types/types";
import Card from "./Card"
import { Droppable, Draggable } from "@hello-pangea/dnd";


type ListProps = ListType & {
    handleAddCardToList: (listId: number, card: CardType) => void;
};
const List = ({ id, label, cards, color, position, isEditing, handleAddCardToList }: ListProps) => {
    const [newCardLabel, setNewCardLabel] = useState<string>("");
    const [isAddingCard, setIsAddingCard] = useState<boolean>(false);
    const handleCreateCard = async (e: React.FormEvent<HTMLFormElement>, list_id: number) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cards`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ list_id: list_id, label: newCardLabel })
            })
            const result = await response.json();
            if (!result.success) {
                return console.log(result.message);
            }
            console.log(result.message)
            handleAddCardToList(list_id, result.data);
            setNewCardLabel("");
            setIsAddingCard(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (



        <div className="flex flex-row justify-center w-[300px] max-h-[450px]  px-2 ">
            <div className={` relative flex flex-col flex-none gap-2 w-full  px-2 pt-4   bg-black rounded-xl `}>


                <div className="flex flex-row justify-between px-4" >
                    <h1 className=" text-base font-semibold text-white" >{label}</h1>
                    <div className="font-black">...</div>
                </div>


                <Droppable droppableId={id.toString()}>
                    {
                        (provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex flex-col gap-2 pb-15 overflow-y-auto"
                            >
                                {
                                    cards.map((card, index) => {
                                        return (
                                            <Draggable key={card.id} draggableId={String(card.id)} index={index} >
                                                {
                                                    (provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Card id={card.id} list_id={id} position={card.position} color={card.color} status={card.status} label={card.label} due_date={card.due_date} />
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

                <div className="absolute left-0 bottom-0 flex flex-col items-center  w-full h-13 px-2 py-2 bg-green-900 rounded-bl-xl rounded-br-xl z-20">
                    {
                        isAddingCard ? (
                            <form onSubmit={(e) => handleCreateCard(e, Number(id))} className="flex flex-row justify-between items-center gap-1 w-full">
                                <input type="text" value={newCardLabel} onChange={(e) => setNewCardLabel(e.target.value)} autoFocus className="w-full h-full px-3  rounded-xl  bg-gray-950 text-white focus:outline-none focus:bg-gray-800 focus:text-gray-500" />
                                <div className="w-10 aspect-square bg-gray-950 rounded-xl "></div>

                            </form>
                        ) : (
                            <button onClick={() => setIsAddingCard(true)} className="flex flex-row items-center gap-2  w-full h-full px-2 hover:bg-black/20 hover:text-white rounded-xl text-base font-semibold text-black/40 transition-all">
                                <span>+</span>
                                <span>Add Card</span>
                            </button>
                        )
                    }

                </div>
            </div >


        </div >
    )
}


export default List;