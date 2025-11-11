import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TanstackWrapper } from './TanstackWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackWrapper>
      <App />
    </TanstackWrapper>
  </StrictMode>,
);
