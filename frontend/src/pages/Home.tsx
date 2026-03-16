import { useEffect, useState } from "react"

import List from "../components/List"

const Home = () => {
    const [index, setIndex] = useState<number>(0);
    const width: number = 300;
    const [translate, setTranslate] = useState<number>(index * width + width / 2);
    const handleNext = () => {
        setIndex((prev) => {
            const newIndex = Math.min(prev + 1, 5);
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

    useEffect(() => { console.log(index, translate) }, [index, translate])

    return (
        <div className="flex flex-col  w-full h-screen bg-gray-950">
            {/*Navbar*/}
            <div className="flex flex-row justify-start items-center gap-2 w-full h-[10%]  pl-3 pt-4 py-3 bg-blue-500">
                <div className="w-10 aspect-square bg-white"></div>
                <span className="text-white font-bold">Drelo Task App</span>
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
                <div className="flex flex-col w-full h-[95%] rounded-xl ">
                    <div className="flex flex-row items-center w-full h-[10%] px-5 gap-2 bg-blue-600 lg:rounded-tl-xl lg:rounded-tr-xl">
                        <span className="text-xl text-white">My Board</span>
                        <div className=" flex flex-row gap-2 lg:hidden">
                            <button onClick={() => handlePrev()}>prev</button>
                            <button onClick={() => handleNext()}>next</button>
                        </div>
                    </div>
                    {/*View Container*/}
                    <div

                        className="relative  flex flex-row items-start w-full h-[90%] px-5 pt-5 pb-5  bg-gray-800  overflow-y-auto overflow-x-hidden ">
                        {/*Item Container*/}
                        {/*List*/}
                        <div
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            style={{ transform: `translateX(${-translate}px)` }}
                            className={`absolute left-1/2    flex flex-row items-center h-full   transition-all duration-400`}
                        >
                            <List></List>
                            <List></List>
                            <List></List>
                            <List></List>
                            <List></List>
                            <List></List>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home