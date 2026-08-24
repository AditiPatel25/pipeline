import App from './App';
import AuthLayout from './layouts/AuthLayout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';

const routes = [
    {
        element: <AuthLayout />,
        children: [
            {
                path: 'auth/login',
                element: <Auth />,
            },
            {
                path: 'auth/register',
                element: <Auth />,
            },
        ],
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <App />,
                children: [
                    {
                        path: '/',
                        element: <Home />,
                    },
                    {
                        path: '/applications',
                        element: <Applications />,
                    },           
                ],
            },
        ],
    },
];

export default routes;
