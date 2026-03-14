import React from 'react';
import { 
  Flame, Droplets, ShieldCheck, Clock, Award, Hammer, 
  Wrench, Filter, PhoneCall, FileText, Settings, Home, HelpCircle 
} from 'lucide-react';

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

/**
 * Карта иконок по их строковым идентификаторам
 * Используется в отображении преимуществ, услуг и т.д.
 */
export const ICON_MAP: Record<string, IconComponent> = {
  flame: Flame,
  droplets: Droplets,
  filter: Filter,
  wrench: Wrench,
  shield: ShieldCheck,
  clock: Clock,
  award: Award,
  hammer: Hammer,
  phone: PhoneCall,
  file: FileText,
  ruler: Settings,
  settings: Wrench,
  home: Home,
  help: HelpCircle
}
