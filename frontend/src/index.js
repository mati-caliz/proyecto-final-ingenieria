import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/redux/store';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.GOOGLE_CLIENT_ID;
const rootElement = document.getElementById('root');


if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <GoogleOAuthProvider clientId={clientId}>
                <Provider store={store}>
                    <AppWrapper />
                </Provider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
} else {
    console.error("No se encontró el elemento raíz con id 'root'");
}
