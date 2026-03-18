import Card from "./Card"
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface Card {
    id: string,
    label: string
}
interface ListProps {
    id: string,
    cards: Card[]
}

const List = ({ id, cards }: ListProps) => {


    return (



        <div className="flex flex-row justify-center w-[300px] max-h-[450px]  px-2 ">
            <div className=" relative flex flex-col flex-none gap-2 w-full  px-2 pt-4   bg-green-900 rounded-xl ">
                <div className="flex flex-row justify-between px-4">
                    <h1 className=" text-base font-semibold text-white">To Do List 1</h1>
                    <div className="font-black">...</div>
                </div>
                <Droppable droppableId={id}>
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
                                            <Draggable key={card.id} draggableId={card.id} index={index} >
                                                {
                                                    (provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Card label={card.label} />
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
                    <div className="flex flex-row justify-between items-center gap-1 w-full">
                        <input type="text" className="w-full h-full px-3  rounded-xl  bg-gray-950 text-white focus:outline-none focus:bg-gray-800 focus:text-gray-500" />
                        <div className="w-10 aspect-square bg-gray-950 rounded-xl "></div>
                    </div>
                    <button className="hidden">Add Card</button>
                </div>
            </div>


        </div>
    )
}


export default List;