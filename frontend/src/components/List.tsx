import Card from "./Card"


const List = () => {
    return (
        <Droppable droppableId="list">
            <div className="flex flex-row justify-center w-[300px] h-full px-2 ">
                <div className=" relative flex flex-col flex-none gap-2 w-full  h-[95%] lg:h-[90%]  px-3 pt-8   bg-green-900 rounded-xl ">
                    <h1 className="text-base font-bold text-white">To Do List 1</h1>
                    <div className="flex flex-col gap-2 pb-15 overflow-y-auto">
                        <Card />
                        <Card />
                        <Card />
                    </div>
                    <div className="absolute left-0 bottom-0 flex flex-row items-center gap-2 w-full h-13 px-2 py-2 bg-blue-500 rounded-bl-xl rounded-br-xl">
                        <div className="w-10 aspect-square bg-white rounded-full"></div>
                        <input type="text" className="w-full h-full bg-white rounded-xl" />
                    </div>
                </div>
            </div>
        </Droppable>
    )
}

export default List