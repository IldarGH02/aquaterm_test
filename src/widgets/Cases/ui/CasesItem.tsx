import { CaseStudy } from '@app/types';
import { FC } from 'react';
import { CheckCircle, Clock, Tag } from 'lucide-react';

interface ICaseItem {
  item: CaseStudy
}

export const CasesItem: FC<ICaseItem> = ({item}) => {
  return (
    <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500">
      <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-[#1a224f] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest z-10">
          {item.type}
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base md:text-xl font-bold mb-3 sm:mb-4 text-[#1a224f] leading-snug group-hover:text-[#d71e1e] transition-colors">{item.title}</h3>

        <div className="flex justify-between items-center mb-4 sm:mb-6 pt-3 sm:pt-4 border-t border-gray-50 gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 text-[#d71e1e] text-xs sm:text-sm">
            <Tag size={14} />
            <span className="font-black text-xs sm:text-sm">{item.price}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-400 text-xs">
            <Clock size={14} />
            <span className="text-xs sm:text-sm font-bold uppercase">{item.duration}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm flex-grow">
          <p className="text-gray-600 line-clamp-3 italic">"{item.problem}"</p>
          <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
            <span className="font-bold text-[#1a224f] text-xs uppercase block mb-1">Что сделано:</span>
            <p className="text-gray-500 text-xs sm:text-sm leading-tight">{item.solution}</p>
          </div>
        </div>

        <div className="flex items-start p-2 sm:p-3 bg-green-50 rounded-xl text-green-700 border border-green-100 gap-1 sm:gap-2 text-xs sm:text-sm">
          <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span className="font-bold leading-tight">{item.result}</span>
        </div>
      </div>
    </div>
  )
}