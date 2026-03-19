import React, { FC } from 'react';
import { Brands } from '@app/types/brands.types.ts';

interface IBrandsItem {
  brand: Brands
}


export const BrandsItem: FC<IBrandsItem> = ({ brand }) => {
  return (
    <li key={brand.name}>{brand.name}</li>
  )
}