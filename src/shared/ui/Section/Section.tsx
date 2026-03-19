import { ReactNode, FC } from "react";

interface ISection {
  children: ReactNode;
  className?: string;
}

export const Section: FC<ISection> = ({children, className}) => {
  return (
    <div className={className}>
      { children }
    </div>
  )
}