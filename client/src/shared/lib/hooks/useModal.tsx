import { useContext } from "react";
import { ModalContext, ModalContextType } from "@shared/providers/modalProvider/ModalProvider.tsx";

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal должен использоваться внутри ModalProvider')
    }
    return context
}