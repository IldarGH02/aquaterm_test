import { Advantages } from '@app/types/advantages.types.ts';
import { ICON_MAP } from '@shared/constants';
import { FC } from 'react';
import { AdvantagesItem } from '@widgets/Advantages/ui/AdvantagesItem.tsx';

interface AdvantagesListProps {
  items: Advantages[]
}

export const AdvantagesList: FC<AdvantagesListProps> = ({ items }) => {
  return items && items.map((advantage, idx) => {
    const advantageItem = ICON_MAP[advantage.icon]

    return (
      <AdvantagesItem advantage={advantage} IconComponent={advantageItem} idx={idx}/>
    )
  })
}