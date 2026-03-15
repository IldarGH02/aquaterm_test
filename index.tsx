import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { ModalProvider } from '@/contexts/ModalContext';
import { CrmAuthProvider } from '@/crm/contexts/CrmAuthContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <CrmAuthProvider>
          <App />
        </CrmAuthProvider>
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
);
