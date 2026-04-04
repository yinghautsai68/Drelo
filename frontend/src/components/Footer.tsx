import { Title } from "./Typography"

const Footer = () => {
    return (
        <div className="relative flex flex-col  gap-2 w-full h-[20%] pl-4 lg:pl-80 xl:pl-100 pt-5 pb-2 border-t border-white/30">
            {/* <div className="absolute left-2 w-[150px] h-[100px] bg-rose-500 rounded-lg">

                </div>*/}
            <Title>蔡英豪</Title>
            <div className="flex flex-col">
                <span className="text-xs font-medium">Drelo: Task Manager</span>
                <span className="text-xs">Inspired by Trello</span>
            </div>



        </div>
    )
}

export default Footer