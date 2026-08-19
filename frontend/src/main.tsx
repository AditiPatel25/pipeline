import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthProvider from './context/AuthContext.js';
import routes from './routes.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
