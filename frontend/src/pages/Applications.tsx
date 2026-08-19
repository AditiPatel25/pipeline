import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getApplicationsRequest } from '@/api/application';
import axios from 'axios';
import ApplicationCard from '@/components/ApplicationCard';
import type { Application } from '@/types/application';

function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplicationsRequest();
                setApplications(response.applications);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message ||
                            'Something went wrong. Please try again.'
                    );
                } else {
                    setError('Something went wrong. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    return (
        <>
            <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">Applications</h1>
                <Button>
                    New Application <Plus />
                </Button>
            </div>
            <div className="flex w-full">
                {/* applications */}
                <main className='mt-6'>
                    {loading ? (
                        <div>Loading applications...</div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h2 className="text-xl font-bold">
                                You have no applications!
                            </h2>
                        </div>
                    ) : (
                        applications.map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                            />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default Applications;
