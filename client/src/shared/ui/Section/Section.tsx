import { ReactNode, FC } from "react";

interface ISection {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Section: FC<ISection> = ({children, className, id}) => {
  return (
    <section className={className} id={id}>
      { children }
    </section>
  )
}