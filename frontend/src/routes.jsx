import App from './App';
// import Home from './pages/Home';
// import Profile from './pages/Profile';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'auth/login', element: <Auth /> },
            { path: 'auth/register', element: <Auth /> },
            {
                element: <ProtectedRoute />,
                children: [
                    // { path: '', element: <Home /> },
                ],
            },
        ],
    },
];

export default routes;
