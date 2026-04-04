import React from 'react'

type FormInputProps = {
    label: string,
    type: string,
    name: string,
    value: string,
    placeholder: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const FormInput = ({ label, type, name, value, placeholder, handleChange }: FormInputProps) => {
    return (
        <div className='flex flex-col gap-1 w-full'>
            <label htmlFor={name} className='text-sm text-zinc-400'>{label}</label>
            <input type={type} name={name} value={value} placeholder={placeholder} onChange={(e) => handleChange(e)} className='px-2 py-1 border border-zinc-600 rounded-sm text-white ' />
        </div>
    )
}

export default FormInput