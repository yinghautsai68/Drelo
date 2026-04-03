import React from 'react'

type ButtonProps = {
    onClick?: () => void,
    className?: string,
    type?: 'button' | 'submit',
    children: React.ReactNode
}


const Button = ({ onClick, className, type, children }: ButtonProps) => {
    return (
        <button type={type} onClick={onClick} className={`${className} flex flex-row justify-center items-center  h-10 px-3 bg-gray-500 hover:bg-gray-800 rounded-lg text-white cursor-pointer transition-all  `}>
            {children}
        </button>
    )
}
export default Button