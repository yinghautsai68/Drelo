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



        <div className="flex flex-row justify-center w-[300px] h-full px-2 ">
            <div className=" relative flex flex-col flex-none gap-2 w-full  h-[95%] lg:h-[90%]  px-2 pt-4   bg-green-900 rounded-xl ">
                <h1 className="px-4 text-base font-bold text-white">To Do List 1</h1>
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

                <div className="absolute left-0 bottom-0 flex flex-row items-center gap-2 w-full h-13 px-2 py-2 bg-blue-500 rounded-bl-xl rounded-br-xl">
                    <div className="w-10 aspect-square bg-white rounded-full"></div>
                    <input type="text" className="w-full h-full bg-white rounded-xl" />
                </div>
            </div>


        </div>
    )
}


export default List;