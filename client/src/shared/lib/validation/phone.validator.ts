/**
 * Валидатор для российских телефонных номеров
 * Поддерживает форматы: +7, 8, с пробелами, дефисами, скобками
 */

export class PhoneValidator {
  /**
   * Регулярное выражение для валидации российских номеров
   * Примеры валидных номеров:
   *   +7 (999) 123-45-67
   *   8 999 123 45 67
   *   89991234567
   *   +7-999-123-45-67
   */
  private static readonly REGEX = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/

  /**
   * Валидирует номер телефона
   * @param phone - номер телефона (с пробелами, скобками или без)
   * @returns true если номер валиден
   */
  static validate(phone: string): boolean {
    const cleaned = phone.replace(/\s/g, '')
    return this.REGEX.test(cleaned)
  }

  /**
   * Форматирует номер телефона в стандартный вид: +7 (XXX) XXX-XX-XX
   * @param phone - номер телефона (любой формат)
   * @returns отформатированный номер или оригинальный если не может отформатировать
   */
  static format(phone: string): string {
    const digits = phone.replace(/\D/g, '')

    if (digits.length !== 11) {
      return phone
    }

    const country = digits[0] === '7' ? '+7' : '+7' // Russians numbers start with 7 or 8
    const area = digits.slice(1, 4)
    const part1 = digits.slice(4, 7)
    const part2 = digits.slice(7, 9)
    const part3 = digits.slice(9, 11)

    return `${country} (${area}) ${part1}-${part2}-${part3}`
  }

  /**
   * Проверяет, заполнено ли поле телефонного номера (11 цифр после очистки)
   * @param phone - номер телефона
   */
  static isComplete(phone: string): boolean {
    const digits = phone.replace(/\D/g, '')
    return digits.length === 11
  }

  /**
   * Преобразует номер в удобочитаемый вид для отображения
   * @param phone - оригинальный номер
   * @returns отformatted номер или оригинальный если невалиден
   */
  static pretty(phone: string): string {
    if (!this.validate(phone)) {
      return phone
    }
    return this.format(phone)
  }

  /**
   * Очищает номер от всего кроме цифр (для отправки на сервер)
   * @param phone - номер телефона
   * @returns только цифры (11 символов)
   */
  static normalize(phone: string): string {
    return phone.replace(/\D/g, '').slice(0, 11)
  }
}

export default PhoneValidator
