
import React from 'react';
import { REVIEWS } from '../constants';
import { Star, Quote } from 'lucide-react';

const Reviews: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Отзывы клиентов</h2>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
          Честные мнения тех, кто уже доверил нам свой комфорт.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {REVIEWS.map((review) => (
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
        ))}
      </div>
    </div>
  );
};

export default Reviews;
