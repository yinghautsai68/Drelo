import Tag from './Tag'

interface CardProps {
    label: string
}
const Card = ({ label }: CardProps) => {
    return (
        <div className="flex flex-col w-full h-30  rounded-xl">
            {/*Cover*/}
            <div className="w-full h-[50px] bg-blue-500 rounded-tl-xl rounded-tr-xl">

            </div>

            {/*Details*/}
            <div className='flex flex-col justify-around gap-1 w-full h-full px-2 py-2 rounded-bl-xl rounded-br-xl     bg-gray-950'>
                <div className="flex flex-col justify-around gap-1">
                    {/*Tag*/}
                    <div className="flex flex-row gap-1">
                        <Tag />
                        <Tag />
                        <Tag />
                    </div>
                    {/*Goal*/}
                    <div className="flex flex-row items-center gap-1">
                        <div className="w-5 h-5 border rounded-full bg-white"></div>
                        <span className="text-gray-300">{label}</span>
                    </div>
                </div>

                <div className="flex flex-row items-center pl">
                    {/*Goal*/}
                    <div className="px-2 py-1 bg-yellow-500 rounded-xl">
                        Due March 17
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card