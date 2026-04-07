import {useCallback, useState} from "react";
import type { TaskComment, TaskEvent } from "@features/crm-auth/types";
import {crmApi} from "@shared/api/crm-api/crmApi.ts";

export const UseTaskDetails = () => {
    const [history, setHistory] = useState<TaskEvent[]>([]);
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const loadTaskDetails = useCallback(async (taskId: number) => {
        setIsDetailLoading(true);

        try {
            const [historyResponse, commentsResponse] = await Promise.all([
                crmApi.getTaskHistory(taskId),
                crmApi.listTaskComments(taskId),
            ]);
            setHistory(historyResponse.events);
            setComments(commentsResponse.comments);
        } catch {
            setHistory([]);
            setComments([]);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    return {
        history,
        setHistory,
        comments,
        setComments,
        loadTaskDetails,
        isDetailLoading,
        setIsDetailLoading,
    }
}