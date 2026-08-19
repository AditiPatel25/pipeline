import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router';
function App() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />
            <div className="flex-1 min-h-0">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
