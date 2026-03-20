import React from 'react';
import { REVIEWS } from '@shared/constants';

import { ReviewsList } from '@widgets/Reviews/ui/ReviewsList.tsx';
import { Section } from '@shared/ui/Section'

export const Reviews = () => {
  return (
    <Section
        id="reviews"
        className="reveal scroll-mt-28 bg-gray-50 py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
    >
        <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Отзывы клиентов</h2>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
                    Честные мнения тех, кто уже доверил нам свой комфорт.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <ReviewsList items={ REVIEWS }/>
            </div>
        </div>
    </Section>
  );
};
