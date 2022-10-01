import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { swRegister } from 'utils/functions';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <App />
);

swRegister();