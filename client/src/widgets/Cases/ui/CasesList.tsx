import { CaseStudy } from 'src/shared/types';
import { FC } from 'react';
import { CasesItem } from '@widgets/Cases/ui/CasesItem.tsx';

interface ICasesListProps {
  items: CaseStudy[];
}

export const CasesList: FC<ICasesListProps> = ({ items }) => {
  return items && items.map((item) => {
    return <CasesItem item={item}/>
  })
}