import { createContext } from "react";

interface UtilContextType {
    formatDate: (date: string | null) => string | null;
    formatFormDate: (date: string | null) => string | null;
}
export const UtilContext = createContext<UtilContextType>({
    formatDate: (date: string | null) => {
        if (date) {
            return date
        } else {
            return null
        }
    },
    formatFormDate: (date: string | null) => {
        if (date) {
            return date;
        } else {
            return null;
        }
    }
});

interface UtilProviderProps {
    children: React.ReactNode;
}
export const UtilProvider = ({ children }: UtilProviderProps) => {
    const formatDate = (date: string | null) => {
        if (!date) {
            return null;
        }
        return date.slice(0, 11).replace("T", " ");
    }
    const formatFormDate = (date: string | null) => {
        if (!date) {
            return null
        }
        return date.slice(0, 19);
    }
    return (
        <UtilContext.Provider value={{ formatDate, formatFormDate }} >
            {children}
        </UtilContext.Provider >
    )
}