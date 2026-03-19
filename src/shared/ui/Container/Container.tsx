import { ReactNode, FC } from "react";
import style from "./container.module.scss";

interface IContainer {
    children: ReactNode;
}

export const Container: FC<IContainer> = ({children}) => {
    return (
        <div className={style.container}>
            { children }
        </div>
    )
}