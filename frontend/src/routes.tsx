import App from './App';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Applications from './pages/Applications';
// import Interviews from './pages/Interviews';
// import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';

const routes = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <App />,
                children: [
                    { index: true, element: <Home /> },
                    { path: 'applications', element: <Applications /> },
                    // { path: 'interviews', element: <Interviews /> },
                    // { path: 'analytics', element: <Analytics /> },
                ],
            },
        ],
    },

    {
        path: 'auth',
        children: [
            { path: 'login', element: <Auth /> },
            { path: 'register', element: <Auth /> },
        ],
    },
];

export default routes;
