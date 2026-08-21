import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    createApplicationRequest,
    deleteApplicationRequest,
    getApplicationsRequest,
} from '@/api/application';
import ApplicationCard from '@/components/ApplicationCard';
import type { Application, ApplicationData } from '@/types/application';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddApplicationModal from '@/components/AddApplicationModal';
import { getErrorMessage } from '@/utils/getErrorMessage';

function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplicationsRequest();
                setApplications(response.applications);
            } catch (err) {
                getErrorMessage(err)
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleCreateApplication = async (application: ApplicationData) => {
        try {
            const response = await createApplicationRequest(application);

            setApplications((prev) => [...prev, response.application]);

            setError('');
        } catch (err) {
            getErrorMessage(err);
            throw err
        }
    };

    async function handleDelete(applicationId: number) {
        try {
            await deleteApplicationRequest(applicationId);
            setApplications((applications) =>
                applications.filter(
                    (application) => application.id !== applicationId
                )
            );
        } catch (err) {
            getErrorMessage(err);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-20 text-muted">
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">Applications</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger
                        render={
                            <Button>
                                Add Application <Plus />
                            </Button>
                        }
                    />
                    <AddApplicationModal handleSubmit={handleCreateApplication} onSuccess={() => setOpen(false)} />
                </Dialog>
            </div>
            <div className="flex w-full">
                {/* applications */}
                <main className="mt-6">
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
                                handleDelete={handleDelete}
                            />
                        ))
                    )}
                </main>
            </div>
        </>
    );
}

export default Applications;
