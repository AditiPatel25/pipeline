import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">
                Page not found
            </h2>
            <p className="mt-2 text-muted-foreground">
                The page you're looking for doesn't exist.
            </p>

            <Button className="mt-6">
                <Link to="/">Go to Dashboard</Link>
            </Button>
        </div>
    );
}

export default NotFound;