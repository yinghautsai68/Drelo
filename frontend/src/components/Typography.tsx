
type LabelProps = {
    className?: string
    children: React.ReactNode
}
export const Label = ({ className, children }: LabelProps) => {
    return (
        <div className={`${className} w-full text-lg text-white/70`}>
            {children}
        </div>
    );
}