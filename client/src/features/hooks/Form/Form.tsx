import { useForm } from "@features/hooks";
import {useEffect, useRef} from "react";
import { contactFormValidators } from "@features/ContactForm/ui/validator.ts";
import { UseStepSelect } from "@features/hooks/StepSelect/StepSelect.tsx";

export const UseForm = (onSubmitSuccess?: () => void) => {
    const refreshParams = UseStepSelect()

    const submitTimeoutRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        }
    }, []);

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

            // Сброс состояния квиза
            refreshParams.setCurrentStep(0);
            refreshParams.setAnswer('');
            refreshParams.setIsFinished(false);
            onSubmitSuccess?.()
        }
    });

    return {
        form
    }
}