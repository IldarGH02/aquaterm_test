import { Brands } from '@app/types/brands.types.ts';
import { FC } from 'react';
import { BrandsItem } from '@widgets/Brands/ui/BrandsItem.tsx';

interface IBrandsList {
  items: Brands[]
}

export const BrandsList: FC<IBrandsList> = ({ items }) => {
  return (
    <ul className="sr-only">
      {
        items && items.map((brand) => (
          <BrandsItem brand={brand}/>
        ))
      }
    </ul>
  )

}