/**
 * Типы для услуг (Services)
 */

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  offer: string;
  pains: string[];
  works: string[];
  guarantee: string;
  icon: string;
}

export interface ServiceWithImage extends Service {
  imageUrl: string;
}
