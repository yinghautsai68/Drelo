import { useState } from 'react'
import type { CardType } from '../types/types'
import Tag from './Tag'


const Card = ({ id, list_id, position, color, label, status, due_date }: CardType) => {
    const [formData, setFormData] = useState<CardType>({
        list_id: 1,
        position: position,
        due_date: due_date,
        label: label,
        status: status,
        color: color,
    })


    const handleChangeStatus = async (id: number) => {
        const newStatus = formData.status === "pending" ? "finished" : "pending";
        setFormData(prev => ({ ...prev, status: newStatus }));

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cards/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            const result = await response.json();
            if (!result.success) {
                return console.log(result.message);
            }
            console.log(result.message);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex flex-col w-full   rounded-xl">

            {color && (
                /*Cover */
                < div className={`w-full h-[50px]  rounded-tl-xl rounded-tr-xl`}>

                </div>
            )
            }


            {/*Details*/}
            <div className='flex flex-col justify-around gap-1 w-full h-full px-2 py-2 rounded-xl rounded-bl-xl rounded-br-xl     bg-neutral-800'>
                <div className="flex flex-col justify-around gap-1">
                    {
                        /*
                            ###Tag
                        <div className="hidden flex flex-row gap-1">
                            <Tag />
                            <Tag />
                            <Tag />
                        </div>
                        */
                    }

                    {/*Goal*/}
                    <div className="flex flex-row items-center gap-1 border">
                        <div onClick={() => handleChangeStatus(Number(id))} className={`w-4 aspect-square border rounded-full ${formData.status === 'finished' ? 'bg-green-300' : 'border-white'} `}></div>
                        <span className="text-gray-300">{label}</span>
                    </div>
                </div>


                {
                    due_date && (
                        /*Goal*/
                        < div className="w-[20%] px-2 py-1 bg-yellow-500 rounded-xl">
                            Due {due_date}
                        </div>
                    )
                }


            </div>
        </div >
    )
}

export default Card