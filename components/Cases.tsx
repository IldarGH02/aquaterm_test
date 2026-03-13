
import React from 'react';
import { CASES } from '../constants';
import { Clock, Tag, CheckCircle } from 'lucide-react';

const Cases: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a224f] mb-6 uppercase tracking-tight">
            НАШИ <span className="text-[#d71e1e]">РАБОТЫ</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Мы гордимся качеством исполнения наших систем. Посмотрите примеры 
            реальных объектов с ценами и сроками исполнения.
          </p>
        </div>
        <div className="flex space-x-2">
            <div className="w-12 h-1.5 bg-[#d71e1e] rounded-full"></div>
            <div className="w-6 h-1.5 bg-[#1a224f] rounded-full opacity-20"></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CASES.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-500">
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute top-4 left-4 bg-[#1a224f] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                {item.type}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-4 text-[#1a224f] leading-snug group-hover:text-[#d71e1e] transition-colors">{item.title}</h3>
              
              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-2 text-[#d71e1e]">
                  <Tag size={16} />
                  <span className="font-black text-sm">{item.price}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock size={16} />
                  <span className="text-xs font-bold uppercase">{item.duration}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm flex-grow">
                <p className="text-gray-600 line-clamp-3 italic">"{item.problem}"</p>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold text-[#1a224f] text-xs uppercase block mb-1">Что сделано:</span>
                  <p className="text-gray-500 text-xs">{item.solution}</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-green-50 rounded-xl text-green-700 border border-green-100">
                <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] font-bold leading-tight">{item.result}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cases;
