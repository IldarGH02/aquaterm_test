import { useForm } from '@shared/lib/hooks/useForm.ts'
import { contactFormValidators } from '@features/ContactForm/ui/validator.ts'
import { UseStepSelect } from '@shared/lib/hooks/StepSelect/useStepSelect.tsx'
import { ChangeEvent, FC, useRef } from 'react'
import { Button, Input } from '@shared/ui'
import { ArrowRight } from 'lucide-react'
import { sanitizeInput, sanitizePhone } from '@shared/lib'

interface IQuizFormProps {
    onSubmitSuccess?: () => void
    className: string
}

const ShieldCheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export const QuizForm: FC<IQuizFormProps> = ({ onSubmitSuccess }) => {
    const stepTimeoutRef = useRef<number | null>(null);
    const submitTimeoutRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);
    const {
        setAnswers,
        setCurrentStep,
        setIsFinished
    } = UseStepSelect()

    const form = useForm({
        initialValues: { name: '', phone: '' },
        validators: contactFormValidators,
        autoSanitize: false,
        sanitizableFields: ['name', 'phone'],
        onSubmit: async () => {
            // Имитация API вызова (задержка 1.5 сек)
            await new Promise<void>((resolve) => {
                submitTimeoutRef.current = window.setTimeout(resolve, 1500);
            });
            if (!isMountedRef.current) return;

            // Сброс
            setCurrentStep(0);
            setAnswers({});
            setIsFinished(false);

            onSubmitSuccess?.();
        }
    });

    const changeNumberFunction = (e: ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        rawValue = rawValue.replace(/[^\d\s\-+()]/g, '')
        const sanitized = sanitizePhone(rawValue);

        return sanitized.length <= 20 ? form.handleChange('phone', sanitized) : null;
    }

    const changeNameFunction = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const sanitized = sanitizeInput(rawValue);

        return sanitized.length <= 100 ? form.handleChange('name', sanitized) : null;
    }

    return (
        <form onSubmit={form.handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6 bg-gray-50 p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-100">
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <Input
                    id="quiz-name"
                    label="Ваше имя"
                    type="text"
                    placeholder="Иван"
                    value={form.values.name}
                    onChange={changeNameFunction}
                    maxLength={100}
                    required
                    error={form.errors.name}
                    showRequired
                    fullWidth
                />

                <Input
                    id="quiz-phone"
                    label="Номер телефона"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={form.values.phone}
                    onChange={changeNumberFunction}
                    maxLength={20}
                    required
                    error={form.errors.phone}
                    showRequired
                    fullWidth
                />
            </div>

            <Button
                type="submit"
                variant="danger"
                isLoading={form.isSubmitting}
                fullWidth
                rightIcon={<ArrowRight size={18} />}
            >
                Получить расчет и скидку
            </Button>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 uppercase font-bold tracking-widest">
                <ShieldCheckIcon /> <span>Ваши данные под защитой</span>
            </div>
        </form>
    )
}