import { ServiceWithImage } from '@app/types';
import { FC } from 'react';
import { ServicesItem } from '@widgets/Services/ui/ServicesItem.tsx';

interface IServicesListProps {
  items: ServiceWithImage[];
  activeTab: number | string;
  handleTabChange: (value: string) => void;
}

export const ServicesList: FC<IServicesListProps> = ({items, handleTabChange, activeTab}) => {
  return items && items.map((service) => {
    return <ServicesItem service={service} handleTabChange={handleTabChange} activeTab={activeTab}/>
  })
}