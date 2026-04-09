import { FC } from 'react';

import { ProcessStep, ICON_MAP } from '@shared/constants';
import { CardItem } from '@widgets/Process/ui/CardItem.tsx';

interface IProcessList {
  items: ProcessStep[]
}

export const ProcessList: FC<IProcessList> = ({items}) => {
  return items && items.map((step) => {
    const iconStep = ICON_MAP[step.icon]

    return (
      <CardItem step={step} IconComponent={iconStep}/>
    )
  })
}