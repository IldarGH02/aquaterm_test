import { compose, minLength, PhoneValidator, required } from '@shared/lib';

export const contactFormValidators = {
    name: compose(
        required('Пожалуйста, введите ваше имя'),
        minLength(2, 'Имя должно содержать минимум 2 символа')
    ),
    phone: compose(
        required('Пожалуйста, введите номер телефона'),
        (phone: string) => PhoneValidator.validate(phone)
            ? null
            : 'Пожалуйста, введите корректный номер (8-920-123-45-67)'
    )
};