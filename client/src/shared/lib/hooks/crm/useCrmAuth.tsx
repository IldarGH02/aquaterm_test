import { useContext } from 'react';

import { CrmAuthContext, CrmAuthContextValue } from '@app/crm/CrmAuthContext.tsx';

export function useCrmAuth(): CrmAuthContextValue {
  const context = useContext(CrmAuthContext);
  if (!context) {
    throw new Error('useCrmAuth must be used inside CrmAuthProvider');
  }

  return context;
}