import React, { FC } from 'react';
import { Brands } from '@shared/types/brands.types.ts';

interface IBrandsItem {
    brand: Brands
}

export const BrandsItem: FC<IBrandsItem> = ({ brand }) => {
  return (
    <li key={brand.name}>{brand.name}</li>
  )
}

export const BrandItemHidden: FC<IBrandsItem> = ({ brand }) => {
    return (
        <span
                className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-200 uppercase tracking-tighter hover:text-[#1a224f] transition-colors duration-300 cursor-default select-none flex-shrink-0"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                aria-hidden="true"
            >
            {brand.name}
      </span>
    )
}