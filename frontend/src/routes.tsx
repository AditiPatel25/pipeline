import App from './App';
import AuthLayout from './layouts/AuthLayout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';
import FollowUps from './pages/FollowUps';
import Resume from './pages/Resume';
import NotFound from './components/NotFound';
// import Analytics from './pages/Analytics';

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
                    {
                        path: '/followUps',
                        element: <FollowUps />,
                    },
                    {
                        path: '/resume',
                        element: <Resume />,
                    },
                    {
                        path: '*',
                        element: <NotFound />,
                    },
                ],
            },
        ],
    },
];

export default routes;
