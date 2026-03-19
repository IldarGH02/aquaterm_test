/**
 * Шаги процесса работы
 */
export type ProcessStep = {
    id: number,
    title: string,
    description: string,
    icon: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 1,
    title: 'Заявка',
    description: 'Вы оставляете заявку или звоните. Мы проводим первичную консультацию.',
    icon: 'phone',
  },
  {
    id: 2,
    title: 'Замер',
    description: 'Инженер выезжает на объект, делает замеры и теплотехнический расчет.',
    icon: 'ruler',
  },
  {
    id: 3,
    title: 'Смета',
    description: 'Подбираем оборудование с пожеланиями заказчика',
    icon: 'file',
  },
  {
    id: 4,
    title: 'Монтаж',
    description: 'Завозим материалы. Выполняем монтаж по СНиП и ГОСТ. Сдаем объект.',
    icon: 'settings',
  },
  {
    id: 5,
    title: 'Запуск',
    description: 'Пуско-наладка, балансировка системы, обучение пользованию.',
    icon: 'home',
  }
] as const
