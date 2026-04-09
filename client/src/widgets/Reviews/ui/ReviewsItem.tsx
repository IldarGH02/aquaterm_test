import { Quote, Star } from 'lucide-react';
import React, { FC } from 'react';
import { Review } from 'src/shared/types';

interface IReviewsItemProps {
  review: Review
}

export const ReviewsItem: FC<IReviewsItemProps> = ({review}) => {
  return (
    <div key={review.id} className="bg-gray-50 p-4 sm:p-6 md:p-8 rounded-3xl relative">
      <Quote className="absolute top-4 sm:top-6 right-6 sm:right-8 text-blue-100 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16" />
      <div className="flex items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <img src={review.image} alt={review.name} className="w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 rounded-full object-cover flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="font-bold text-sm sm:text-base md:text-lg truncate">{review.name}</h4>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{review.location}</p>
        </div>
      </div>
      <div className="flex mb-3 sm:mb-4 gap-1">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="text-yellow-400 fill-current w-4 sm:w-5 h-4 sm:h-5" />
        ))}
      </div>
      <p className="text-gray-700 italic text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4">"{review.text}"</p>
      <span className="text-xs sm:text-sm text-gray-400">{review.date}</span>
    </div>
  )
}