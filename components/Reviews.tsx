
import React from 'react';
import { REVIEWS } from '../constants';
import { Star, Quote } from 'lucide-react';

const Reviews: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Отзывы клиентов</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Честные мнения тех, кто уже доверил нам свой комфорт.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-gray-50 p-8 rounded-3xl relative">
            <Quote className="absolute top-6 right-8 text-blue-100 w-16 h-16" />
            <div className="flex items-center mb-6">
              <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full mr-4 object-cover" />
              <div>
                <h4 className="font-bold text-lg">{review.name}</h4>
                <p className="text-sm text-gray-500">{review.location}</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current w-5 h-5" />
              ))}
            </div>
            <p className="text-gray-700 italic leading-relaxed mb-4">"{review.text}"</p>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
