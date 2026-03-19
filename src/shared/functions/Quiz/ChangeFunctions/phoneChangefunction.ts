import { ChangeEvent } from "react";
import { sanitizePhone } from '@shared/lib';
import { UseForm } from "@features/hooks/Form/Form.tsx";

export const changeNumberFunction = (e: ChangeEvent<HTMLInputElement>) => {
    const { form } = UseForm()
    let rawValue = e.target.value;
    rawValue = rawValue.replace(/[^\d\s\-+()]/g, '')
    const sanitized = sanitizePhone(rawValue);

    return sanitized.length <= 20 ? form.handleChange('phone', sanitized) : null;
}