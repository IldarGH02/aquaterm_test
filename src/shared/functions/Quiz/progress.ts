import {QUIZ_STEPS} from "../../constants";

export const getProgress = (value: number, bool: boolean) => {
    const progress = ((value + (bool ? 1: 0)) / (QUIZ_STEPS.length)) * 100

    return {
        progress
    }
}