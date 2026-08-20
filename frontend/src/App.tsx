import { Outlet } from 'react-router';
import {
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';

function App() {
    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="flex min-h-screen flex-1 flex-col">
                <header className="flex h-14 items-center border-b px-4">
                    <SidebarTrigger />

                    <span className="ml-3 text-xl font-bold text-primary">
                        pipeline
                    </span>
                </header>

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
}

export default App;