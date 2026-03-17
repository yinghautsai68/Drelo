import { use, useEffect, useState } from "react"

import List from "../components/List"
import { DragDropContext, } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
const Home = () => {


    const [index, setIndex] = useState<number>(0);
    const width: number = 300;
    const [translate, setTranslate] = useState<number>(index * width + width / 2);
    const handleNext = () => {
        setIndex((prev) => {
            const newIndex = Math.min(prev + 1, Object.keys(lists).length - 1);
            setTranslate(newIndex * width + width / 2);
            return newIndex;
        });
    };

    const handlePrev = () => {
        setIndex((prev) => {
            const newIndex = Math.max(prev - 1, 0);
            setTranslate(newIndex * width + width / 2);
            return newIndex
        });
    };

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (diff > 50) {
            handleNext(); // swipe left
        }

        if (diff < -50) {
            handlePrev(); // swipe right
        }
        setTouchStart(null)
    }

    const [mouseStart, setMouseStart] = useState<number | null>(null);
    const handleMouseStart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isMobile) {
            return;
        }
        setMouseStart(e.clientX);

    }
    const handleMouseEnd = (e: React.MouseEvent) => {
        if (mouseStart === null) {
            return;
        }
        const diff = mouseStart - e.clientX;
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
        setMouseStart(null);
    }

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const checkScreenSize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }
    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        }
    }, []);

    useEffect(() => { console.log(index, translate) }, [index, translate])

    const [lists, setLists] = useState<{ [key: string]: { id: string, label: string }[] }>({
        "list-1": [
            { id: "1", label: "apple" },
            { id: "2", label: "orange" },
            { id: "3", label: "mango" }
        ],
        "list-2": [
            { id: "4", label: "banana" }
        ],
        "list-3": [
            { id: "5", label: "banana" }
        ],
        "list-4": [
            { id: "6", label: "banana" }
        ]
    })
    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const newLists = { ...lists };

        const sourceList = [...newLists[source.droppableId]];
        const destinationList = [...newLists[destination.droppableId]];

        const [movedItem] = sourceList.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceList.splice(destination.index, 0, movedItem);
            newLists[source.droppableId] = sourceList;
        }
        if (source.droppableId != destination.droppableId) {
            destinationList.splice(destination.index, 0, movedItem);

            newLists[destination.droppableId] = destinationList;
            newLists[source.droppableId] = sourceList;
        }


        setLists(newLists);
    };



    return (
        <div className="flex flex-col  w-full h-screen bg-gray-950">
            {/*Navbar*/}
            <div className="flex flex-row justify-start items-center gap-2 w-full h-[10%]  pl-3 pt-4 py-3 bg-blue-500">
                <div className="w-10 aspect-square bg-white"></div>
                <span className="text-white font-semibold">Drelo</span>
                <input type="text" className="w-[30%] border rounded-xl bg-white " />

            </div>


            {/*Main*/}
            <div className="flex flex-row items-start w-full h-[90%]  lg:px-10 lg:py-5  ">
                {/*Inbox*/}
                <div>

                </div>

                {/*Calendar*/}
                <div>

                </div>

                {/*Board*/}
                <div className="flex flex-col w-full h-[95%] rounded-xl  ">
                    <div className="flex flex-row items-center w-full h-[10%] px-5 gap-2 bg-blue-600 lg:rounded-tl-xl lg:rounded-tr-xl">
                        <span className="text-xl text-white">My Board</span>
                        <div className=" flex flex-row gap-2 lg:hidden">
                            <button onClick={() => handlePrev()}>prev</button>
                            <button onClick={() => handleNext()}>next</button>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/*View Container*/}
                        <div className="relative  flex flex-row items-start w-full h-[90%] px-5 pt-5 pb-5  bg-gray-800  overflow-y-hidden overflow-x-hidden md:overflow-x-auto ">
                            {/*Item Container*/}
                            {/*List*/}

                            <div
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseStart}
                                onMouseUp={handleMouseEnd}
                                style={{ left: `calc(50% - ${translate}px)`, }}
                                className={`absolute     flex flex-row items-center h-full   transition-all duration-400`}
                            >
                                {
                                    Object.entries(lists).map(([id, cards]) => {
                                        return (
                                            <List key={id} id={id} cards={cards} />
                                        );
                                    })
                                }
                            </div>


                        </div>
                    </DragDropContext>
                </div>
            </div >
        </div >
    )
}

export default Home