import { ChangeEvent } from "react";
import { sanitizeInput } from '@shared/lib';
import { UseForm } from "@features/hooks/Form/Form.tsx";

export const changeNameFunction = (e: ChangeEvent<HTMLInputElement>) => {
    const { form } = UseForm()
    const rawValue = e.target.value;
    const sanitized = sanitizeInput(rawValue);

    return sanitized.length <= 100 ? form.handleChange('name', sanitized) : null;
}