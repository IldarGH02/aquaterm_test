import { useCallback, useState } from "react";
import { crmApi } from "@shared/api/crm-api/crmApi.ts";
import { CrmUser } from "@features/crm-auth/types";

export const useUsers = () => {
    const [users, setUsers] = useState<CrmUser[]>([])

    const loadUsers = useCallback(async () => {
        try {
            const response = await crmApi.listUsers();
            setUsers(response.users);
        } catch {
            setUsers([]);
        }
    }, []);

    return {
        users, loadUsers
    }
}