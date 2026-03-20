import { use, useEffect, useState } from "react"

import List from "../components/List"
import { DragDropContext, Droppable, } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../types/types";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [lists, setLists] = useState<ListType[]>([]);

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
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT') {
            return; // Don't prevent default, let the input focus!
        }

        console.log(e.clientX)
        if (!isMobile) {
            return;
        }
        e.preventDefault();
        setMouseStart(e.clientX);
    }
    const handleMouseEnd = (e: React.MouseEvent) => {
        if (mouseStart === null) {
            return;
        }
        const diff = mouseStart - e.clientX;
        console.log("diff", diff);
        if (diff > 50) handleNext();
        if (diff < -50) handlePrev();
        setMouseStart(null);
    }

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
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

    const handleDragEnd = async (result: DropResult) => {
        console.log(result);
        const { type, source, destination, } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (type === 'COLUMN') {
            const newLists = [...lists];
            const [movedList] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, movedList);
            setLists(newLists)

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lists`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        lists: newLists.map((list, index) => ({
                            id: list.id,
                            position: index
                        }))
                    })
                })
                const result = await response.json();
                if (!result.success) {
                    return console.log(result.message);
                }
                console.log(result.message);
            } catch (error) {
                console.log(error);
            }
        } else if (type === 'CARD') {
            const newLists = [...lists];
            const sourceList = newLists.find((list) => list.id === Number(source.droppableId.replace("list-", "")));
            const destinationList = newLists.find((list) => list.id === Number(destination.droppableId.replace("list-", "")));
            if (!sourceList || !destinationList) {
                return;
            }

            const [movedCard] = sourceList.cards.splice(source.index, 1);
            movedCard.list_id = destinationList.id;

            destinationList.cards.splice(destination.index, 0, movedCard);

            sourceList.cards.forEach((card, index) => { card.position = index; });
            destinationList.cards.forEach((card, index) => { card.position = index; });
            setLists(newLists);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cards/move`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ lists: newLists })
                });
                const result = await response.json();
                if (!result.success) {
                    return console.log(result.message);
                }


            } catch (error) {
                console.log(error);
            }

        }
    };

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newListTitle, setNewListTitle] = useState<string>("");
    const handleAddList = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: newListTitle })
        })
        const result = await response.json();

        setLists([...lists, { ...result.data, cards: [] }]); // result.data contains the real ID from DB
        console.log(lists);
        setIsAdding(false);
        setNewListTitle("");
    }
    /*
        const fetchLists = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lists?user_id=1`, {
                    method: 'GET'
                })
                const result = await response.json();
    
                if (!result.success) {
                    return console.log(result.message);
                }
                console.log(result.data.map((list: ListType) => ({ ...list, cards: [] })))
                setLists(result.data.map((list: ListType) => ({ ...list, cards: [] })));
            } catch (error) {
                console.log(error);
            }
        }
        useEffect(() => { fetchLists() }, []);
    */
    const fetchListsWithCards = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listscards`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const result = await response.json();

            if (!result.success) {
                return console.log(result.message);
            }
            console.log(result.message, result.data)
            setLists(result.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        fetchListsWithCards()
    }, [])
    const handleAddCardToList = (listId: number, newCard: CardType) => {
        setLists((prev) => prev.map((list) => list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list));
    };

    return (
        <div className="flex flex-col  w-full h-screen bg-gray-950">
            {/*Navbar*/}
            <div className="flex flex-row justify-start items-center gap-2 w-full h-[7%]  pl-3  py-4 bg-gray-950">
                <div className="w-5 aspect-square bg-white"></div>
                <span className="text-white font-semibold">Drelo</span>
                <input type="text" className="w-[50%] lg:w-[30%] px-3 py-1  rounded-xl bg-white/20 focus:outline-none  " />

            </div>


            {/*Main*/}
            <div className="flex flex-row items-start w-full h-[93%]    ">
                {/*Inbox*/}
                <div>

                </div>

                {/*Calendar*/}
                <div>

                </div>

                {/*Board*/}
                <div className="flex flex-col w-full h-[100%] rounded-xl  ">
                    <div className="flex flex-row items-center w-full h-[8%] px-5 gap-2 bg-gray-900 lg:rounded-tl-xl lg:rounded-tr-xl">
                        <span className="text-xl text-white">My Board</span>
                        <div className=" flex flex-row gap-2 lg:hidden">
                            <button onClick={() => handlePrev()}>prev</button>
                            <button onClick={() => handleNext()}>next</button>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/*View Container*/}
                        <div className="relative  flex flex-row items-start w-full h-[92%] px-5 pt-5 pb-5  bg-gray-800  overflow-y-hidden overflow-x-hidden md:overflow-x-auto ">
                            {/*Item Container*/}
                            {/*List*/}
                            <Droppable droppableId="board" type="COLUMN" direction="horizontal">
                                {
                                    (provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}


                                            onTouchStart={handleTouchStart}
                                            onTouchEnd={handleTouchEnd}
                                            onMouseDown={handleMouseStart}
                                            onMouseUp={handleMouseEnd}
                                            style={isMobile ? { left: `calc(50% - ${translate}px)` } : {}}
                                            className={`absolute     flex flex-row  items-start h-full pb-25 lg:pb-0   transition-all duration-400`}
                                        >
                                            {

                                                lists.map((list, index) => {
                                                    return (
                                                        <List key={list.id} index={index} id={list.id} label={list.label} cards={(list.cards ?? [])} color={list.color} position={list.position} handleAddCardToList={handleAddCardToList} />
                                                    );
                                                })

                                            }
                                            {provided.placeholder}
                                            {isAdding ? (
                                                <div className="w-[300px] px-2 flex-none">
                                                    <div className="bg-gray-800 p-4 rounded-xl">
                                                        <input
                                                            autoFocus
                                                            className="w-full p-2 bg-gray-950 text-white rounded"
                                                            value={newListTitle}
                                                            onChange={(e) => setNewListTitle(e.target.value)}
                                                            onBlur={handleAddList} // Save on click away
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsAdding(true)}
                                                    className="w-[300px] flex-none h-10 bg-white/10 text-white rounded-xl hover:bg-white/20"
                                                >
                                                    + Add another list
                                                </button>
                                            )}

                                        </div>

                                    )
                                }

                            </Droppable>

                        </div>
                    </DragDropContext>
                </div>
            </div >

            <div className="fixed bottom-0 flex flex-row justify-center items-center  w-full h-[10%] pb-10 ">
                <div className="flex flex-row justify-center gap-5 border w-[90%] py-2 rounded-xl bg-gray-700   ">
                    <button className="border">hotdog</button>
                    <button onClick={() => handleAddList()} className="border">Add new List</button>
                    <button className="border">hotdog</button>
                </div>
            </div>
        </div >
    )
}

export default Home