import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGA } from './utils/analytics';

// Inisialisasi Google Analytics 4 secara dinamis jika VITE_GA_MEASUREMENT_ID terpasang
initGA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

