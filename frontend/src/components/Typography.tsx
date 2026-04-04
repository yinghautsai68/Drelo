import { Children } from "react"

type LabelProps = {
    className?: string
    children: React.ReactNode
}
export const Title = ({ className, children }: LabelProps) => {
    return (
        <div className={`${className} text-3xl font-bold`}>
            {children}
        </div>
    )
}

export const Label = ({ className, children }: LabelProps) => {
    return (
        <div className={`${className} w-full text-lg font-medium text-white/70`}>
            {children}
        </div>
    );
}