import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NxtpManager } from './NxtpManager';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <NxtpManager/>
  </React.StrictMode>
);