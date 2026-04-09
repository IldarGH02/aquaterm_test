import { Brands } from '@shared/types/brands.types.ts';
import { FC } from 'react';
import { BrandsItem, BrandItemHidden } from '@widgets/Brands/ui/BrandsItem.tsx';
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

export const BrandsHiddenList: FC<IBrandsList> = ({ items }) => {
    return (
        <>
            {[...items, ...items].map((brand, idx) => (
                <BrandItemHidden brand={brand} key={idx}/>
            ))}
        </>
    )
}