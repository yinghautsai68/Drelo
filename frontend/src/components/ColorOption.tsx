import { colorMap } from "./colorMap"

type ColorOptionProps = {
    color: "red" | "blue" | "yellow" | "violet" | "orange" | "green",
    onClick: () => void
}


const ColorOption = ({ color, onClick }: ColorOptionProps) => {
    return (
        <div onClick={onClick} className={`w-full h-[50px] rounded-lg ${colorMap[color].card} cursor-pointer`}></div>
    )
}

export default ColorOption