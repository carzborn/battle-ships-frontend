import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GameContextProvider from './contexts/GameContextProvider';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GameContextProvider>
                <App />
            </GameContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);

